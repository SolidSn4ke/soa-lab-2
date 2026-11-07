package war.model.xml.adapter;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.xml.bind.annotation.adapters.XmlAdapter;

public class ZonedDateTimeAdapter extends XmlAdapter<String, ZonedDateTime> {
    private static final ZoneId RESPONSE_ZONE = ZoneId.of("Europe/Moscow");

    @Override
    public ZonedDateTime unmarshal(String value) {
        return value == null || value.isBlank() ? null : ZonedDateTime.parse(value);
    }

    @Override
    public String marshal(ZonedDateTime value) {
        return value == null ? null
                : value.withZoneSameInstant(RESPONSE_ZONE).format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
    }
}
