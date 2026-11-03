package itmo.soa.lab.discipline_service.model.dto.labwork;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonRootName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import tools.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@Getter
@Setter
@JsonRootName("Assign")
@AllArgsConstructor
public class BatchAssignRequestBody {
    private String disciplineId;
    @JacksonXmlElementWrapper(localName = "labworkIds")
    @JacksonXmlProperty(localName = "labworkId")
    private List<Integer> labworkIds;
}
