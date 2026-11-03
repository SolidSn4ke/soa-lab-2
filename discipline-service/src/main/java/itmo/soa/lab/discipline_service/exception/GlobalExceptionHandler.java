package itmo.soa.lab.discipline_service.exception;

import java.time.Instant;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import itmo.soa.lab.discipline_service.model.dto.ErrorMsg;

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

    private ResponseEntity<ErrorMsg> error(Integer status, String detail) {
        String message = switch (status) {
            case 400 -> "Bad Request";
            case 404 -> "Not Found";
            case 503 -> "Service Unavailable";
            default -> "Internal Error";
        };
        return ResponseEntity.status(status).contentType(MediaType.APPLICATION_XML)
                .body(new ErrorMsg(message, Instant.now().toString(), List.of(detail)));
    }
}
