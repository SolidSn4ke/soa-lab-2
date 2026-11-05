<?php
declare(strict_types=1);

// Only these applications' HTTP listeners are exposed by the gateway.
const LABWORK_BACKEND = 'http://127.0.0.1:41999/labwork-service';
const DISCIPLINE_BACKEND = 'http://127.0.0.1:42792/discipline-service';
const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

function fail(int $status, string $message): never
{
    http_response_code($status);
    header('Content-Type: text/plain; charset=UTF-8');
    header('Cache-Control: no-store');
    echo $message;
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
// Helios blocks PUT/PATCH/DELETE before PHP runs. The frontend sends POST
// with this header; only the gateway restores the backend HTTP method.
$override = $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null;
if ($override !== null) {
    if ($method !== 'POST' || !in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
        fail(400, 'Invalid HTTP method override');
    }
    $method = $override;
}
if (!in_array($method, ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], true)) {
    header('Allow: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    fail(405, 'Method not allowed');
}

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$scriptPath = $_SERVER['SCRIPT_NAME'];
if (!is_string($requestPath) || !str_starts_with($requestPath, $scriptPath . '/')) {
    fail(404, 'Append an API path, for example /labworks');
}
$path = substr($requestPath, strlen($scriptPath));
$decodedPath = rawurldecode($path);
if (preg_match('/[\x00-\x20\x7f\\\\?#]/', $decodedPath)
    || preg_match('~(?:^|/)\.{1,2}(?:/|$)~', $decodedPath)) {
    fail(400, 'Invalid API path');
}
if (preg_match('~^/(?:labworks|disciplines)(?:/|$)~', $decodedPath)) {
    $backend = LABWORK_BACKEND;
    $service = 'labwork-service';
} elseif (str_starts_with($decodedPath, '/bars/discipline/')) {
    $backend = DISCIPLINE_BACKEND;
    $service = 'discipline-service';
} else {
    fail(404, 'Unknown API resource');
}

$body = file_get_contents('php://input', false, null, 0, MAX_REQUEST_BYTES + 1);
if ($body === false) {
    fail(400, 'Cannot read request body');
}
if (strlen($body) > MAX_REQUEST_BYTES) {
    fail(413, 'Request body is too large');
}

$requestHeaders = ['Connection: close'];
foreach (['CONTENT_TYPE' => 'Content-Type', 'HTTP_ACCEPT' => 'Accept',
    'HTTP_AUTHORIZATION' => 'Authorization'] as $variable => $name) {
    $value = $_SERVER[$variable] ?? '';
    if ($value !== '' && !preg_match('/[\r\n]/', $value)) {
        $requestHeaders[] = $name . ': ' . $value;
    }
}
if ($body !== '' || in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $requestHeaders[] = 'Content-Length: ' . strlen($body);
}

$query = $_SERVER['QUERY_STRING'] ?? '';
$url = $backend . $path . ($query === '' ? '' : '?' . $query);
$context = stream_context_create(['http' => [
    'method' => $method,
    'header' => $requestHeaders,
    'content' => $body,
    'protocol_version' => 1.1,
    'ignore_errors' => true,
    'follow_location' => 0,
    'timeout' => 15,
]]);

$upstream = @fopen($url, 'rb', false, $context);
if ($upstream === false) {
    error_log('API gateway (' . $service . '): ' . (error_get_last()['message'] ?? 'connection failed'));
    fail(502, 'Cannot connect to ' . $service);
}
$responseBody = stream_get_contents($upstream, MAX_RESPONSE_BYTES + 1);
$metadata = stream_get_meta_data($upstream);
fclose($upstream);
if ($metadata['timed_out'] ?? false) {
    fail(504, $service . ' timed out');
}
if ($responseBody === false || strlen($responseBody) > MAX_RESPONSE_BYTES) {
    fail(502, 'Cannot read ' . $service . ' response or response is too large');
}

$status = 0;
$responseHeaders = [];
foreach ($metadata['wrapper_data'] ?? [] as $line) {
    if (preg_match('~^HTTP/\S+ (\d{3})~', $line, $match)) {
        $status = (int) $match[1];
        $responseHeaders = [];
    } elseif (str_contains($line, ':')) {
        [$name, $value] = explode(':', $line, 2);
        if (in_array(strtolower($name), ['content-type', 'cache-control', 'etag',
            'last-modified', 'allow', 'retry-after', 'www-authenticate'], true)) {
            $responseHeaders[] = $name . ': ' . trim($value);
        }
    }
}
if ($status < 200 || $status > 599) {
    fail(502, 'Invalid HTTP response from ' . $service);
}
http_response_code($status);
foreach ($responseHeaders as $line) {
    header($line, false);
}
if ($method !== 'HEAD' && $status !== 204 && $status !== 304) {
    echo $responseBody;
}
