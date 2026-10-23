package war.exception;

import java.util.List;

import jakarta.ejb.ApplicationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response.Status;
import lombok.Getter;

@ApplicationException(rollback = true)
@Getter
public class HttpStatusException extends WebApplicationException {
    private final List<String> details;

    public HttpStatusException(Status status, List<String> details) {
        super(details.stream().reduce("", (acc, x) -> String.format("%s; %s", acc, x)), status);
        this.details = details;
    }
}
