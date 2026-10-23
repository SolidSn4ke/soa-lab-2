package war.model.entity;

import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "discipline")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<LabworkEntity> labworks;

    @Version
    private Long version;
}
