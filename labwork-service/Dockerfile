FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn --batch-mode --no-transfer-progress dependency:go-offline

COPY src ./src
RUN mvn --batch-mode --no-transfer-progress clean package

FROM quay.io/wildfly/wildfly:41.0.1.Final-jdk25

COPY --from=build --chown=jboss:root /app/target/labwork-service.war \
    /opt/jboss/wildfly/standalone/deployments/labwork-service.war

EXPOSE 8080

CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0"]
