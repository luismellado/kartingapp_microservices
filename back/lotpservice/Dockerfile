FROM openjdk:17
ARG JAR_FILE=target/lotpservice.jar
COPY ${JAR_FILE} lotpservice.jar
ENTRYPOINT ["java","-jar","/lotpservice.jar"]