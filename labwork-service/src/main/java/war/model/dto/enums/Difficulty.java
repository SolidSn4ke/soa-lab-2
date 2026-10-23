package war.model.dto.enums;

import jakarta.xml.bind.annotation.XmlEnum;
import jakarta.xml.bind.annotation.XmlEnumValue;
import jakarta.xml.bind.annotation.XmlType;

@XmlType
@XmlEnum(String.class)
public enum Difficulty {
    @XmlEnumValue("EASY")
    EASY,

    @XmlEnumValue("NORMAL")
    NORMAL,

    @XmlEnumValue("VERY_HARD")
    VERY_HARD,

    @XmlEnumValue("IMPOSSIBLE")
    IMPOSSIBLE,

    @XmlEnumValue("HOPELESS")
    HOPELESS;
}
