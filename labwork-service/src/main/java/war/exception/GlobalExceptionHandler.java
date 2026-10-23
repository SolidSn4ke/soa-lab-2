package war.exception;

import java.time.Instant;
import java.util.List;
import jakarta.data.exceptions.OptimisticLockingFailureException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Feature;
import jakarta.ws.rs.core.FeatureContext;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import jakarta.xml.bind.UnmarshalException;
import war.model.dto.ErrorMsg;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception>, Feature {
    private static final List<String> INTERNAL_ERROR_DETAILS = List.of(
            "An internal server error occurred while processing the request");

    @Override
    public boolean configure(FeatureContext context) {
        context.register(new ExceptionMapper<ValidationException>() {
            @Override
            public Response toResponse(ValidationException exception) {
                return GlobalExceptionHandler.this.toResponse(exception);
            }
        });
        return true;
    }

    @Override
    public Response toResponse(Exception ex) {
        System.out.println(ex);

        if (ex instanceof WebApplicationException httpException) {
            Response original = httpException.getResponse();
            List<String> details;
            if (original.getStatus() >= 500)
                details = INTERNAL_ERROR_DETAILS;
            else {
                details = httpException instanceof HttpStatusException httpStatusException
                        ? httpStatusException.getDetails()
                        : List.of(httpException.getMessage() == null
                                ? original.getStatusInfo().getReasonPhrase()
                                : httpException.getMessage());
            }
            return response(Status.fromStatusCode(original.getStatus()), details);
        }

        if (ex instanceof ConstraintViolationException violations) {
            List<String> details = violations.getConstraintViolations().stream()
                    .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                    .toList();
            return response(Status.BAD_REQUEST, details);
        }

        if (ex instanceof UnmarshalException e) {
            Throwable cause = e.getLinkedException();
            return response(Status.BAD_REQUEST, List.of(cause.getMessage()));
        }

        if (ex instanceof OptimisticLockingFailureException) {
            return response(Status.CONFLICT, List.of("The resource was changed or deleted by another request"));
        }
        return internalServerError(ex);
    }

    private static Response internalServerError(Exception exception) {
        return response(Status.INTERNAL_SERVER_ERROR, INTERNAL_ERROR_DETAILS);
    }

    private static Response response(Status status, List<String> details) {
        return Response
                .status(status)
                .type(MediaType.APPLICATION_XML_TYPE)
                .entity(new ErrorMsg(status.getReasonPhrase(), Instant.now().toString(), details))
                .build();
    }
}
