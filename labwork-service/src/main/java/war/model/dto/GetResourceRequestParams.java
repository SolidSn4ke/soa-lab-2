package war.model.dto;

import java.util.List;

import jakarta.data.Sort;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetResourceRequestParams<E> {
    @Min(value = 0)
    @NotNull
    Integer page;

    @NotNull
    @Min(value = 1)
    Integer size;

    List<Sort<E>> sort;

    List<String> search;
}
