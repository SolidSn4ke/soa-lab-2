package war.model.dto.labworks;

import java.time.ZonedDateTime;

import lombok.Getter;
import lombok.Setter;
import war.model.dto.coordinates.CoordinatesDto;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.enums.Difficulty;

@Getter
@Setter
public class LabworkDto {
    private Integer id;
    private String name;
    private CoordinatesDto coordiantes;
    private ZonedDateTime creationDate;
    private Long minimalPoint;
    private Long averagePoint;
    private Difficulty difficulty;
    private DisciplineDto discipline;
}
