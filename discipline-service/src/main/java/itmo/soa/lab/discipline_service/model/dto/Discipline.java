package itmo.soa.lab.discipline_service.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonRootName;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonRootName("Dicipline")
public record Discipline(String name, long labsCount) {
}
