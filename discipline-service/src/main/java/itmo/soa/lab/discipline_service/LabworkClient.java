package itmo.soa.lab.discipline_service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import itmo.soa.lab.discipline_service.exception.ApiException;
import itmo.soa.lab.discipline_service.model.dto.Assignment;
import itmo.soa.lab.discipline_service.model.dto.Discipline;
import itmo.soa.lab.discipline_service.model.dto.Labwork;
import itmo.soa.lab.discipline_service.model.dto.LabworkPage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.converter.xml.JacksonXmlHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@Component
public class LabworkClient {
    @Value("${labwork-service.base-url}")
    String baseUrl;

    private final RestClient client = RestClient
            .builder()
            .baseUrl(baseUrl)
            .defaultHeader("Accept", MediaType.APPLICATION_XML_VALUE)
            .configureMessageConverters(
                    converters -> converters.withXmlConverter(new JacksonXmlHttpMessageConverter()))
            .build();

    public Discipline getDiscipline(String id) {
        return call(() -> required(client.get().uri("/disciplines/{id}", id)
                .retrieve().body(Discipline.class)));
    }

    public Labwork getLabwork(int id) {
        return call(() -> required(client.get().uri("/labworks/{id}", id)
                .retrieve().body(Labwork.class)));
    }

    public List<Labwork> getLabworks() {
        List<Labwork> result = new ArrayList<>();
        for (int page = 0;; page++) {
            int currentPage = page;
            LabworkPage response = call(() -> required(client.get()
                    .uri(uri -> uri.path("/labworks").queryParam("page", currentPage)
                            .queryParam("size", 100).queryParam("sort", "id,asc").build())
                    .retrieve().body(LabworkPage.class)));
            if (response.items != null) {
                result.addAll(response.items);
            }
            if (page + 1 >= response.totalPages) {
                return result;
            }
        }
    }

    public void assignDiscipline(int id, String disciplineId) {
        call(() -> client.patch().uri("/labworks/{id}", id).contentType(MediaType.APPLICATION_XML)
                .body(new Assignment(disciplineId)).retrieve().toBodilessEntity());
    }

    public void deleteLabwork(int id) {
        call(() -> client.delete().uri("/labworks/{id}", id).retrieve().toBodilessEntity());
    }

    private <T> T required(T body) {
        if (body == null) {
            throw new ApiException(503, "Labwork service returned an empty response");
        }
        return body;
    }

    private <T> T call(Supplier<T> operation) {
        try {
            return operation.get();
        } catch (RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 404) {
                throw new ApiException(404, "Requested discipline or labwork was not found");
            }
            if (exception.getStatusCode().is5xxServerError()) {
                throw new ApiException(503, "Labwork service is temporarily unavailable");
            }
            throw new ApiException(500, "Labwork service rejected the operation");
        } catch (RestClientException exception) {
            throw new ApiException(503, "Labwork service is temporarily unavailable");
        }
    }

}
