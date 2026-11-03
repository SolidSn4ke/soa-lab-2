package itmo.soa.lab.discipline_service.model.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonRootName;

import tools.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import tools.jackson.dataformat.xml.annotation.JacksonXmlProperty;

@JsonRootName("ErrorMsg")
public record ErrorMsg(String msg, String timestamp,
        @JacksonXmlElementWrapper(localName = "details") @JacksonXmlProperty(localName = "detail") List<String> details) {
}
