package war.model.dto.labworks;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlElementWrapper;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@XmlRootElement(name = "Assign")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
@AllArgsConstructor
public class BatchAssignRequestBody {
    @NotBlank
    private String disciplineId;
    @NonNull
    @XmlElementWrapper(name = "labworkIds")
    @XmlElement(name = "labworkId")
    private List<Integer> labworkIds;
}
