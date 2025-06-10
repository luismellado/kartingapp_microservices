FROM openjdk:17
ARG JAR_FILE=build/libs/reportservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} reportservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/reportservice-0.0.1-SNAPSHOT.jar"]