package war.model.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PageInfo<T> {
    List<T> items;
    Long page;
    Long size;
    Long totalPages;
    Long totalElements;
}
