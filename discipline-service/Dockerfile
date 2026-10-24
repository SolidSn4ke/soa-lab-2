FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app
COPY pom.xml ./
RUN mvn --batch-mode --no-transfer-progress dependency:go-offline

COPY src ./src
RUN mvn --batch-mode --no-transfer-progress package -DskipTests

FROM jetty:12.1.14-jdk25

RUN java -jar "$JETTY_HOME/start.jar" --add-modules=ee11-deploy,ee11-annotations

COPY --from=build --chown=jetty:jetty /app/target/discipline-service.war /var/lib/jetty/webapps/api.war
