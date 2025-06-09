FROM openjdk:17
ARG JAR_FILE=target/reportservice.jar
COPY ${JAR_FILE} reportservice.jar
ENTRYPOINT ["java","-jar","/reportservice.jar"]