package war.model.dto.disciplines;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatchDisciplineRequest {
    private String name;
    private Long labsCount;
}
