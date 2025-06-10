FROM openjdk:17
ARG JAR_FILE=build/libs/fcdiscountservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} fcdiscountservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/fcdiscountservice-0.0.1-SNAPSHOT.jar"]