package war.model.dto;

import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlElementWrapper;
import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlSeeAlso;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.labworks.LabworkDto;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@XmlRootElement(name = "PageInfo")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlSeeAlso({ DisciplineDto.class, LabworkDto.class })
public class PageInfo<T> {
    @XmlElementWrapper(name = "items")
    @XmlElement(name = "item")
    List<T> items;
    Integer page;
    Integer size;
    Long totalPages;
    Long totalElements;
}
