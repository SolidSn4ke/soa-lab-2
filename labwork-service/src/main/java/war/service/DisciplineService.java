package war.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import war.mapper.DisciplineMapper;
import war.model.dto.PageInfo;
import war.model.dto.disciplines.CreateDisciplineRequest;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.disciplines.PatchDisciplineRequest;
import war.model.repo.DisciplineRepository;

@ApplicationScoped
public class DisciplineService {

    @Inject
    DisciplineMapper mapper;

    @Inject
    DisciplineRepository disciplineRepo;

    public PageInfo<DisciplineDto> getAll() {
        // TODO: add impl
        return null;
    }

    public DisciplineDto getById(String id) {
        // TODO: add impl
        return null;
    }

    public DisciplineDto create(CreateDisciplineRequest req) {
        // TODO: add impl
        return null;
    }

    public DisciplineDto update(String id, CreateDisciplineRequest req) {
        // TODO: add impl
        return null;
    }

    public DisciplineDto partialUpdate(String id, PatchDisciplineRequest req) {
        // TODO: add impl
        return null;
    }

    public Boolean delete(String id) {
        // TODO: add impl
        return null;
    }
}
