package war.model.repo;

import java.util.List;
import java.util.Optional;

import jakarta.data.Limit;
import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Find;
import jakarta.data.repository.Query;
import jakarta.data.repository.Repository;
import war.model.dto.enums.Difficulty;
import war.model.entity.DisciplineEntity;
import war.model.entity.LabworkEntity;

@Repository
public interface LabworkRepository extends CrudRepository<LabworkEntity, Integer> {
    @Override
    @Query("select l from LabworkEntity l join fetch l.discipline where l.id = :id")
    Optional<LabworkEntity> findById(Integer id);

    @Query("update LabworkEntity l set l.discipline = :newDiscipline where l.discipline.name = :oldName")
    int reassignDiscipline(String oldName, DisciplineEntity newDiscipline);

    @Find
    List<LabworkEntity> findByDifficulty(Difficulty difficulty, Limit limit);
}
