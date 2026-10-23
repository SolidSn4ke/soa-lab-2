package war.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Coordinates {

    @Column(nullable = false)
    private Long x;

    @Column(nullable = false)
    private Float y;
}
