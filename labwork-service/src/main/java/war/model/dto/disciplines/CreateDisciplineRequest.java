package war.model.dto.disciplines;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateDisciplineRequest {
    @NotBlank
    private String name;

    @NotNull
    private Long labsCount;
}
