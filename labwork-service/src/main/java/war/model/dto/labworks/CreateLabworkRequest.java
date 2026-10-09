package war.model.dto.labworks;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import war.model.dto.coordinates.CreateCoordinatesRequest;
import war.model.dto.enums.Difficulty;

@Getter
@Setter
public class CreateLabworkRequest {
    @NotBlank
    private String name;

    @Valid
    @NotNull
    private CreateCoordinatesRequest coordinates;

    @NotNull
    @Min(value = 1)
    private Long minimalPoint;

    @Min(value = 1)
    private Long averagePoint;

    private Difficulty difficulty;

    @NotBlank
    private String disciplineId;

}
