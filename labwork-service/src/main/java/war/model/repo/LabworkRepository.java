package war.model.repo;

import jakarta.data.repository.CrudRepository;
import jakarta.data.repository.Repository;
import war.model.entity.LabworkEntity;

@Repository
public interface LabworkRepository extends CrudRepository<LabworkEntity, Integer> {

}
