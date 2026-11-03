package itmo.soa.lab.discipline_service.model.dto.labwork;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BatchAssignRequestBody {
    private String disciplineId;
    private List<Integer> labworkIds;
}
