package war.model.dto.coordinates;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@XmlRootElement(name = "coordinates")
@XmlAccessorType(XmlAccessType.FIELD)
@NoArgsConstructor
public class CreateCoordinatesRequest {
    @NotNull
    @Min(value = -718)
    private Long x;

    @NotNull
    private Float y;

}
