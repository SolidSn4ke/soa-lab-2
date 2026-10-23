package war.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import war.model.dto.disciplines.CreateDisciplineRequest;
import war.model.dto.disciplines.DisciplineDto;
import war.model.dto.disciplines.PatchDisciplineRequest;
import war.model.entity.DisciplineEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface DisciplineMapper {
    DisciplineDto toDto(DisciplineEntity entity);

    @Mapping(target = "version", ignore = true)
    @Mapping(target = "labworks", ignore = true)
    DisciplineEntity toEntity(CreateDisciplineRequest dto);

    @Mapping(target = "version", ignore = true)
    @Mapping(target = "labworks", ignore = true)
    void updateFromPut(CreateDisciplineRequest req, @MappingTarget DisciplineEntity entity);

    @Mapping(target = "version", ignore = true)
    @Mapping(target = "labworks", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromPatch(PatchDisciplineRequest req, @MappingTarget DisciplineEntity entity);
}
