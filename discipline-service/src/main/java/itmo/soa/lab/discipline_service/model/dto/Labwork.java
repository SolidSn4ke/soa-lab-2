package itmo.soa.lab.discipline_service.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Labwork(int id, Difficulty difficulty, Discipline discipline) {
}
