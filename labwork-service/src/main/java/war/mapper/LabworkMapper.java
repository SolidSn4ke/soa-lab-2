package war.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import war.model.dto.labworks.CreateLabworkRequest;
import war.model.dto.labworks.LabworkDto;
import war.model.dto.labworks.PatchLabworkRequest;
import war.model.entity.LabworkEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface LabworkMapper {
    LabworkDto toDto(LabworkEntity entity);

    LabworkEntity toEntity(CreateLabworkRequest dto);

    void updateFromPut(CreateLabworkRequest req, @MappingTarget LabworkEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromPatch(PatchLabworkRequest req, @MappingTarget LabworkEntity entity);
}
