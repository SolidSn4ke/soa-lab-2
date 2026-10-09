package war.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "disciplines")
@Getter
@Setter
public class DisciplineEntity {

    @Id
    private String name;

    @Column(name = "labs_count")
    private long labsCount;

    @Version
    private Long version;
}
