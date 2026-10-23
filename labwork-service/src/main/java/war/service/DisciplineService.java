package war.service;

import java.util.List;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response.Status;
import war.exception.HttpStatusException;
import war.mapper.DisciplineMapper;
import war.model.dto.GetResourceRequestParams;
import war.model.dto.PageInfo;
import war.model.dto.disciplines.CreateDisciplineRequest;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.disciplines.PatchDisciplineRequest;
import war.model.entity.DisciplineEntity;
import war.model.repo.DisciplineQueryRepository;
import war.model.repo.DisciplineRepository;

@ApplicationScoped
public class DisciplineService {

    @Inject
    DisciplineMapper mapper;

    @Inject
    DisciplineRepository disciplineRepo;

    @EJB
    DisciplineQueryRepository disciplineQueryRepo;

    public PageInfo<DisciplineDto> getAll(GetResourceRequestParams params) {
        List<DisciplineEntity> page = disciplineQueryRepo.findAll(params.getSearch(), params.getSort(),
                params.getPage(), params.getSize());

        return PageInfo.<DisciplineDto>builder()
                .items(page.stream().map(mapper::toDto).toList())
                .page(params.getPage())
                .size(params.getSize())
                .totalPages(0L)
                .totalElements(0L)
                .build();
    }

    public DisciplineDto getById(String id) {
        DisciplineEntity discipline = disciplineRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", id))));
        return mapper.toDto(discipline);
    }

    @Transactional
    public DisciplineDto create(CreateDisciplineRequest req) {
        if (disciplineRepo.findById(req.getName()).isPresent()) {
            throw new HttpStatusException(Status.CONFLICT, List.of("Discipline '%s' already exists", req.getName()));
        }

        DisciplineEntity discipline = mapper.toEntity(req);
        discipline = disciplineRepo.save(discipline);
        return mapper.toDto(discipline);
    }

    @Transactional
    public DisciplineDto update(String id, CreateDisciplineRequest req) {
        DisciplineEntity discipline = disciplineRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", id))));

        if (discipline.getName().equals(req.getName())) {
            mapper.updateFromPut(req, discipline);
            discipline = disciplineRepo.update(discipline);
            return mapper.toDto(discipline);
        }

        if (disciplineRepo.findById((req.getName())).isPresent()) {
            throw new HttpStatusException(Status.CONFLICT, List.of("Discipline '%s' already exists", req.getName()));
        }

        // TODO: change disciplineId in labworks
        DisciplineEntity newDiscipline = mapper.toEntity(req);
        newDiscipline = disciplineRepo.save(newDiscipline);
        disciplineRepo.delete(discipline);
        return mapper.toDto(newDiscipline);
    }

    @Transactional
    public DisciplineDto partialUpdate(String id, PatchDisciplineRequest req) {
        DisciplineEntity discipline = disciplineRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", id))));

        if (req.getName() == null || discipline.getName().equals(req.getName())) {
            mapper.updateFromPatch(req, discipline);
            discipline = disciplineRepo.update(discipline);
            return mapper.toDto(discipline);
        }

        if (disciplineRepo.findById((req.getName())).isPresent()) {
            throw new HttpStatusException(Status.CONFLICT, List.of("Discipline '%s' already exists", req.getName()));
        }

        // TODO: change disciplineId in labworks
        DisciplineEntity newDiscipline = new DisciplineEntity();
        newDiscipline.setName(req.getName());
        newDiscipline.setLabsCount(req.getLabsCount() != null ? req.getLabsCount() : discipline.getLabsCount());

        newDiscipline = disciplineRepo.save(newDiscipline);
        disciplineRepo.delete(discipline);
        return mapper.toDto(newDiscipline);
    }

    @Transactional
    public void delete(String id) {
        disciplineRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", id))));
        disciplineRepo.deleteById(id);
    }
}
