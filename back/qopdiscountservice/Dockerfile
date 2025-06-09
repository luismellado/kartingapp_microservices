FROM openjdk:17
ARG JAR_FILE=target/qopdiscountservice.jar
COPY ${JAR_FILE} qopdiscountservice.jar
ENTRYPOINT ["java","-jar","/qopdiscountservice.jar"]