FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml ./
RUN mvn --batch-mode --no-transfer-progress dependency:go-offline

COPY src ./src
RUN mvn --batch-mode --no-transfer-progress package -DskipTests

FROM jetty:12.1.14-jdk21

RUN java -jar "$JETTY_HOME/start.jar" --add-modules=ee11-deploy,ee11-annotations,ssl,https

COPY jetty-https.ini /var/lib/jetty/start.d/https.ini

COPY --from=build --chown=jetty:jetty /app/target/discipline-service.war /var/lib/jetty/webapps/api.war

EXPOSE 8443
