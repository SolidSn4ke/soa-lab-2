package war.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
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

    DisciplineEntity toEntity(CreateDisciplineRequest dto);

    void updateFromPut(CreateDisciplineRequest req, @MappingTarget DisciplineEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromPatch(PatchDisciplineRequest req, @MappingTarget DisciplineEntity entity);
}
