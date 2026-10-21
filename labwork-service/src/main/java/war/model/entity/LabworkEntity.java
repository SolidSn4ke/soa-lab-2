package war.model.entity;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import war.model.dto.enums.Difficulty;

@Entity
@Table(name = "labworks")
@Getter
@Setter
@ToString
public class LabworkEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Embedded
    private Coordinates coordinates;

    @Column(nullable = false, name = "creation_date")
    private ZonedDateTime creationDate;

    @Column(nullable = false, name = "minimal_point")
    private Long minimalPoint;

    @Column(name = "average_point")
    private Long averagePoint;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discipline_name", nullable = false)
    @ToString.Exclude
    private DisciplineEntity discipline;
}
