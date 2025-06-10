FROM openjdk:17
ARG JAR_FILE=build/libs/spfeeservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} spfeeservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/spfeeservice-0.0.1-SNAPSHOT.jar"]