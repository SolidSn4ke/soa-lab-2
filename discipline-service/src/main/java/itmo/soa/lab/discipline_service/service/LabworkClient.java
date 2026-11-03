package itmo.soa.lab.discipline_service.service;

import java.util.ArrayList;
import java.util.List;
import itmo.soa.lab.discipline_service.model.dto.PageInfo;
import itmo.soa.lab.discipline_service.model.dto.discipline.Discipline;
import itmo.soa.lab.discipline_service.model.dto.labwork.BatchAssignRequestBody;
import itmo.soa.lab.discipline_service.model.dto.labwork.Labwork;
import lombok.RequiredArgsConstructor;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class LabworkClient {
    private final RestClient client;

    public Discipline getDiscipline(String id) {
        return client.get().uri("/disciplines/{id}", id).retrieve().body(Discipline.class);
    }

    public Labwork getLabwork(int id) {
        return client.get().uri("/labworks/{id}", id).retrieve().body(Labwork.class);
    }

    public List<Labwork> getLabworks() {
        List<Labwork> result = new ArrayList<>();
        for (int page = 0;; page++) {
            int currentPage = page;
            PageInfo<Labwork> response = client.get()
                    .uri(uri -> uri.path("/labworks").queryParam("page", currentPage)
                            .queryParam("size", 100).queryParam("sort", "id,asc").build())
                    .retrieve().body(new ParameterizedTypeReference<PageInfo<Labwork>>() {
                    });
            if (response.items != null) {
                result.addAll(response.items);
            }
            if (page + 1 >= response.totalPages) {
                return result;
            }
        }
    }

    public void assignBatch(List<Integer> labworkIds, String disciplineId) {
        client.post().uri("/labworks/batch").contentType(MediaType.APPLICATION_XML)
                .body(new BatchAssignRequestBody(disciplineId, labworkIds)).retrieve().toBodilessEntity();
    }

    public void deleteLabwork(int id) {
        client.delete().uri("/labworks/{id}", id).retrieve().toBodilessEntity();
    }

}
