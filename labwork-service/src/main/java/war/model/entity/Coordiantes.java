package war.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Coordiantes {

    @Column(nullable = false)
    private Long x;

    @Column(nullable = false)
    private Float y;
}
