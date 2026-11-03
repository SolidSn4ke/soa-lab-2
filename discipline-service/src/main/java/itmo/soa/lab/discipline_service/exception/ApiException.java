package itmo.soa.lab.discipline_service.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final Integer status;

    public ApiException(Integer status, String message) {
        super(message);
        this.status = status;
    }
}
