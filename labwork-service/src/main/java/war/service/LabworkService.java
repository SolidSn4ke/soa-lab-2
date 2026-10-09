package war.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import war.mapper.LabworkMapper;
import war.model.dto.PageInfo;
import war.model.dto.enums.Difficulty;
import war.model.dto.labworks.CreateLabworkRequest;
import war.model.dto.labworks.LabworkDto;
import war.model.dto.labworks.PatchLabworkRequest;
import war.model.repo.LabworkRepository;

@ApplicationScoped
public class LabworkService {

    @Inject
    LabworkMapper mapper;

    @Inject
    LabworkRepository labworkRepo;

    public PageInfo<LabworkDto> getAll() {
        // TODO: add impl
        return null;
    }

    public LabworkDto getById(Integer id) {
        // TODO: add impl
        return null;
    }

    public LabworkDto create(CreateLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    public LabworkDto update(Integer id, CreateLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    public LabworkDto partialUpdate(Integer id, PatchLabworkRequest req) {
        // TODO: add impl
        return null;
    }

    public Boolean delete(Integer id) {
        // TODO: add impl
        return null;
    }

    public Boolean deleteByDifficulty(Difficulty difficulty) {
        // TODO: add impl
        return null;
    }
}
