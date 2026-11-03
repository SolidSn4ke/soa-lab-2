package itmo.soa.lab.discipline_service.rest.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.soa.lab.discipline_service.model.dto.Discipline;
import itmo.soa.lab.discipline_service.service.DisciplineService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor 
@RequestMapping(value = "/bars/discipline/{discipline-id}", produces = MediaType.APPLICATION_XML_VALUE)
public class DisciplineController {
    private final DisciplineService service;

    @DeleteMapping("/labwork/{labwork-id}/remove")
    public ResponseEntity<Void> remove(@PathVariable("discipline-id") String disciplineId,
            @PathVariable("labwork-id") Integer labworkId) {
        service.remove(disciplineId, labworkId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/make-hardcore")
    public Discipline makeHardcore(@PathVariable("discipline-id") String disciplineId) {
        return service.makeHardcore(disciplineId);
    }
}
