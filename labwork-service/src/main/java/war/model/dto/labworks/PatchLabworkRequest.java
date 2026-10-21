package war.model.dto.labworks;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import war.model.dto.coordinates.PatchCoordinatesRequest;
import war.model.dto.enums.Difficulty;

@Getter
@Setter
@XmlRootElement(name = "LabWork")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
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
