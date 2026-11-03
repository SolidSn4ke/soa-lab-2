package itmo.soa.lab.discipline_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.xml.JacksonXmlHttpMessageConverter;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${labwork-service.base-url}")
    String baseUrl;

    @Bean
    RestClient restClient() {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Accept", MediaType.APPLICATION_XML_VALUE)
                .configureMessageConverters(converters -> converters.withXmlConverter(
                        new JacksonXmlHttpMessageConverter()))
                .build();
    }
}
