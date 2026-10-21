package war.model.dto.labworks;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import war.model.dto.coordinates.CreateCoordinatesRequest;
import war.model.dto.enums.Difficulty;

@Getter
@Setter
@XmlRootElement(name = "LabWork")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
@ToString
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
