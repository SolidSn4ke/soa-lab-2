package war.model.dto.labworks;

import java.time.ZonedDateTime;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import war.model.dto.coordinates.CoordinatesDto;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.enums.Difficulty;
import war.model.xml.adapter.ZonedDateTimeAdapter;

@Getter
@Setter
@XmlRootElement(name = "LabWork")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
public class LabworkDto {

    private Integer id;
    private String name;
    private CoordinatesDto coordinates;

    @XmlJavaTypeAdapter(ZonedDateTimeAdapter.class)
    private ZonedDateTime creationDate;
    private Long minimalPoint;
    private Long averagePoint;
    private Difficulty difficulty;
    private DisciplineDto discipline;
}
