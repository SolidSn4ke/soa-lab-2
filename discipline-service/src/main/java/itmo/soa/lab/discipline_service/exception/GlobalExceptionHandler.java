package itmo.soa.lab.discipline_service.exception;

import java.time.Instant;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.fasterxml.jackson.annotation.JsonRootName;

import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import tools.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorMsg> handleApi(ApiException exception) {
        return error(exception.getStatus(), exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorMsg> handleInvalidId(MethodArgumentTypeMismatchException exception) {
        return error(400, "Invalid identifier: " + exception.getName());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMsg> handleUnexpected(Exception exception) {
        return error(500, "An internal server error occurred while processing the request");
    }

    private ResponseEntity<ErrorMsg> error(int status, String detail) {
        String message = switch (status) {
            case 400 -> "Bad Request";
            case 404 -> "Not Found";
            case 503 -> "Service Unavailable";
            default -> "Internal Error";
        };
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_XML)
                .body(new ErrorMsg(message, Instant.now().toString(), List.of(detail)));
    }

    @JsonRootName("ErrorMsg")
    public record ErrorMsg(String msg, String timestamp,
            @JacksonXmlElementWrapper(localName = "details") @JacksonXmlProperty(localName = "detail") List<String> details) {
    }
}
