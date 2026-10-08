package war.model.entity;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import war.model.dto.enums.Difficulty;

@Entity
@Table(name = "labworks")
@Getter
@Setter
public class LabworkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Embedded
    private Coordiantes coordiantes;

    @Column(nullable = false, name = "creation_date")
    private ZonedDateTime creationDate;

    @Column(nullable = false, name = "minimal_point")
    private Long minimalPoint; // Поле не может быть null, Значение поля должно быть больше 0

    @Column(name = "average_point")
    private Long averagePoint; // Поле может быть null, Значение поля должно быть больше 0

    private Difficulty difficulty; // Поле может быть null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discipline_name", nullable = false)
    private DisciplineEntity discipline;

    @PrePersist
    private void setCreationDate() {
        creationDate = ZonedDateTime.now();
    }
}
