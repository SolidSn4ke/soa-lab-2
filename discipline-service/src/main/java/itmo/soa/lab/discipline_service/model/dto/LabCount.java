package itmo.soa.lab.discipline_service.model.dto;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName("Discipline")
public record LabCount(long labsCount) {
}
