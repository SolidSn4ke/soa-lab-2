package itmo.soa.lab.discipline_service.model.dto;

import com.fasterxml.jackson.annotation.JsonRootName;

@JsonRootName("LabWork")
public record Assignment(String disciplineId) {
}
