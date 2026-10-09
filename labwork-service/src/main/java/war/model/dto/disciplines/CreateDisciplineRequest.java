package war.model.dto.disciplines;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDisciplineRequest {
    @NotBlank
    private String name;

    private Long labsCount;

}
