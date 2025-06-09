FROM openjdk:17
ARG JAR_FILE=target/weeklyrackservice.jar
COPY ${JAR_FILE} weeklyrackservice.jar
ENTRYPOINT ["java","-jar","/weeklyrackservice.jar"]