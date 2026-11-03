package war.service;

import java.time.ZonedDateTime;
import java.util.List;

import jakarta.data.Limit;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.core.Response.Status;
import war.exception.HttpStatusException;
import war.mapper.LabworkMapper;
import war.model.dto.GetResourceRequestParams;
import war.model.dto.PageInfo;
import war.model.dto.enums.Difficulty;
import war.model.dto.labworks.CreateLabworkRequest;
import war.model.dto.labworks.LabworkDto;
import war.model.dto.labworks.PatchLabworkRequest;
import war.model.entity.DisciplineEntity;
import war.model.entity.LabworkEntity;
import war.model.repo.DisciplineRepository;
import war.model.repo.LabworkQueryRepository;
import war.model.repo.LabworkRepository;

@ApplicationScoped
public class LabworkService {

    @Inject
    LabworkMapper mapper;

    @Inject
    LabworkRepository labworkRepo;

    @Inject
    DisciplineRepository disciplineRepo;

    @Inject
    LabworkQueryRepository labworkQueryRepository;

    public PageInfo<LabworkDto> getAll(GetResourceRequestParams params) {
        List<LabworkEntity> page = labworkQueryRepository.findAll(params.getSearch(), params.getSort(),
                params.getPage(), params.getSize());
        long totalElements = labworkQueryRepository.count(params.getSearch());
        long totalPages = (totalElements + params.getSize() - 1) / params.getSize();

        return PageInfo.<LabworkDto>builder()
                .items(page.stream().map(mapper::toDto).toList())
                .page(params.getPage())
                .size(params.getSize())
                .totalPages(totalPages)
                .totalElements(totalElements)
                .build();
    }

    public LabworkDto getById(Integer id) {
        LabworkEntity entity = labworkRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Labwork with id '%s' was not found", id))));
        return mapper.toDto(entity);
    }

    @Transactional
    public LabworkDto create(CreateLabworkRequest req) {
        DisciplineEntity discipline = disciplineRepo.findById(req.getDisciplineId())
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", req.getDisciplineId()))));
        LabworkEntity entity = mapper.toEntity(req);
        entity.setCreationDate(ZonedDateTime.now());
        entity.setDiscipline(discipline);
        entity = labworkRepo.save(entity);
        return mapper.toDto(entity);
    }

    @Transactional
    public LabworkDto update(Integer id, CreateLabworkRequest req) {
        LabworkEntity entity = labworkRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Labwork with id '%s' was not found", id))));
        DisciplineEntity discipline = disciplineRepo.findById(req.getDisciplineId())
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Discipline '%s' was not found", req.getDisciplineId()))));

        mapper.updateFromPut(req, entity);
        entity.setDiscipline(discipline);
        entity = labworkRepo.update(entity);
        return mapper.toDto(entity);
    }

    @Transactional
    public LabworkDto partialUpdate(Integer id, PatchLabworkRequest req) {
        LabworkEntity entity = labworkRepo.findById(id)
                .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                        List.of(String.format("Labwork with id '%s' was not found", id))));
        mapper.updateFromPatch(req, entity);
        if (req.getDisciplineId() != null && !req.getDisciplineId().isBlank()) {
            DisciplineEntity discipline = disciplineRepo.findById(req.getDisciplineId())
                    .orElseThrow(() -> new HttpStatusException(Status.NOT_FOUND,
                            List.of(String.format("Discipline '%s' was not found", req.getDisciplineId()))));
            entity.setDiscipline(discipline);
        }
        entity = labworkRepo.update(entity);
        return mapper.toDto(entity);
    }

    @Transactional
    public void delete(Integer id) {
        labworkRepo.deleteById(id);
    }

    @Transactional
    public void deleteByDifficulty(Difficulty difficulty) {
        List<LabworkEntity> list = labworkRepo.findByDifficulty(difficulty, Limit.of(1));
        if (!list.isEmpty()) {
            labworkRepo.delete(list.get(0));
        }
    }
}
