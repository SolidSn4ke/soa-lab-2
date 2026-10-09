package war.model.dto.disciplines;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@XmlRootElement(name = "Discipline")
@XmlAccessorType(XmlAccessType.FIELD)
public class DisciplineDto {
    private String name;
    private long labsCount;
}
