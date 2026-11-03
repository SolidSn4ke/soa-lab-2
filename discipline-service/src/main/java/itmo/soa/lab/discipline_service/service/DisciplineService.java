package itmo.soa.lab.discipline_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import itmo.soa.lab.discipline_service.exception.ApiException;
import itmo.soa.lab.discipline_service.model.dto.discipline.Discipline;
import itmo.soa.lab.discipline_service.model.dto.labwork.Labwork;
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
        List<Integer> labworksIds = client.getLabworks().stream()
                .filter(lab -> lab.discipline() != null && !disciplineId.equals(lab.discipline().name()))
                .limit(10)
                .map(e -> e.id())
                .toList();
        if (labworksIds.isEmpty()) {
            return discipline;
        }
        client.assignBatch(labworksIds, disciplineId);
        return client.getDiscipline(disciplineId);
    }

    private void validateDisciplineId(String id) {
        if (id.isBlank()) {
            throw new ApiException(400, "Discipline identifier must not be blank");
        }
    }
}
