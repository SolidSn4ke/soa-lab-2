package war.model.dto;

import java.util.List;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlElementWrapper;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@XmlRootElement(name = "ErrorMsg")
@XmlAccessorType(XmlAccessType.FIELD)
public class ErrorMsg {
    private String msg;
    private String timestamp;

    @XmlElementWrapper(name = "details")
    @XmlElement(name = "detail")
    private List<String> details;
}
