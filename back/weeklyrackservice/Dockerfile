FROM openjdk:17
ARG JAR_FILE=build/libs/weeklyrackservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} weeklyrackservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/weeklyrackservice-0.0.1-SNAPSHOT.jar"]