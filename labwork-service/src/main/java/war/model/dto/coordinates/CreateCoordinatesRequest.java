package war.model.dto.coordinates;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCoordinatesRequest {
    @NotNull
    @Min(value = -718)
    private Long x;

    @NotNull
    private Float y;

}
