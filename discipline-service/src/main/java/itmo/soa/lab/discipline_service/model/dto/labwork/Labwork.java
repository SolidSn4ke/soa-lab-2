package itmo.soa.lab.discipline_service.model.dto.labwork;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import itmo.soa.lab.discipline_service.model.dto.discipline.Discipline;
import itmo.soa.lab.discipline_service.model.dto.enums.Difficulty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Labwork(int id, Difficulty difficulty, Discipline discipline) {
}
