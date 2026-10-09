package war.model.dto.disciplines;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@XmlRootElement(name = "Discipline")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
public class PatchDisciplineRequest {
    private String name;
    private Long labsCount;
}
