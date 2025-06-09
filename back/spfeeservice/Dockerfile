FROM openjdk:17
ARG JAR_FILE=target/spfeeservice.jar
COPY ${JAR_FILE} spfeeservice.jar
ENTRYPOINT ["java","-jar","/spfeeservice.jar"]