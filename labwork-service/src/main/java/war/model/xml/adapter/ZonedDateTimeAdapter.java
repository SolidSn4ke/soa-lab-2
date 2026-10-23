package war.model.xml.adapter;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.xml.bind.annotation.adapters.XmlAdapter;

public class ZonedDateTimeAdapter extends XmlAdapter<String, ZonedDateTime> {

    @Override
    public ZonedDateTime unmarshal(String value) {
        return value == null || value.isBlank() ? null : ZonedDateTime.parse(value);
    }

    @Override
    public String marshal(ZonedDateTime value) {
        return value == null ? null : value.format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
    }
}