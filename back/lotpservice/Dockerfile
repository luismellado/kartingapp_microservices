FROM openjdk:17
ARG JAR_FILE=build/libs/lotpservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} lotpservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/lotpservice-0.0.1-SNAPSHOT.jar"]