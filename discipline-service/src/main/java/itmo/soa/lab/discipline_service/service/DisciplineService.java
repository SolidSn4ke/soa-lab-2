package itmo.soa.lab.discipline_service.service;

import java.util.Comparator;
import org.springframework.stereotype.Service;

import itmo.soa.lab.discipline_service.LabworkClient;
import itmo.soa.lab.discipline_service.model.dto.Labwork;
import itmo.soa.lab.discipline_service.exception.ApiException;
import itmo.soa.lab.discipline_service.model.dto.Discipline;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class DisciplineService {
    private final LabworkClient client;

    public void remove(String disciplineId, int labworkId) {
        validateDisciplineId(disciplineId);
        client.getDiscipline(disciplineId);
        Labwork labwork = client.getLabwork(labworkId);
        if (labwork.discipline() == null || !disciplineId.equals(labwork.discipline().name())) {
            throw new ApiException(404, "Labwork does not belong to discipline '" + disciplineId + "'");
        }
        client.deleteLabwork(labworkId);
    }

    public Discipline makeHardcore(String disciplineId) {
        validateDisciplineId(disciplineId);
        Discipline discipline = client.getDiscipline(disciplineId);
        var candidates = client.getLabworks().stream()
                .filter(lab -> lab.discipline() != null && !disciplineId.equals(lab.discipline().name()))
                .sorted(Comparator.<Labwork>comparingInt(lab -> lab.difficulty() == null
                        ? -1 : lab.difficulty().ordinal()).reversed().thenComparingInt(Labwork::id))
                .limit(10).toList();
        if (candidates.isEmpty()) {
            return discipline;
        }
        for (Labwork labwork : candidates) {
            client.assignDiscipline(labwork.id(), disciplineId);
        }
        return client.getDiscipline(disciplineId);
    }

    private void validateDisciplineId(String id) {
        if (id.isBlank()) {
            throw new ApiException(400, "Discipline identifier must not be blank");
        }
    }
}
