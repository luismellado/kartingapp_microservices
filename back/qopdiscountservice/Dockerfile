FROM openjdk:17
ARG JAR_FILE=build/libs/qopdiscountservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} qopdiscountservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/qopdiscountservice-0.0.1-SNAPSHOT.jar"]