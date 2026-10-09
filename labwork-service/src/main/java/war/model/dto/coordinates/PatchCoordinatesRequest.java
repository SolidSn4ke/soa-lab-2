package war.model.dto.coordinates;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatchCoordinatesRequest {

    @Min(value = -718)
    private Long x;

    private Float y;

}
