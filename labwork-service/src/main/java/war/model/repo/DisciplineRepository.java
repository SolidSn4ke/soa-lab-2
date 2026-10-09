package war.model.repo;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import war.model.entity.DisciplineEntity;

@Repository
public interface DisciplineRepository extends CrudRepository<DisciplineEntity, String> {

}
