package war.model.dto.labworks;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import war.model.dto.coordinates.PatchCoordinatesRequest;
import war.model.dto.enums.Difficulty;

@Getter
@Setter
public class PatchLabworkRequest {
    private String name;

    @Valid
    private PatchCoordinatesRequest coordinates;

    @Min(value = 1)
    private Long minimalPoint;

    @Min(value = 1)
    private Long averagePoint;

    private Difficulty difficulty;

    private String disciplineId;
}
