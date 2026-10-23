package war.model.dto;

import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.QueryParam;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetResourceRequestParams {
    @QueryParam("page")
    @DefaultValue("0")
    @Min(0)
    Integer page;

    @QueryParam("size")
    @DefaultValue("20")
    @Min(1)
    Integer size;

    @QueryParam("sort")
    List<String> sort;

    @QueryParam("search")
    List<String> search;
}
