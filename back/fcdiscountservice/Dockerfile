FROM openjdk:17
ARG JAR_FILE=target/fcdiscountservice.jar
COPY ${JAR_FILE} fcdiscountservice.jar
ENTRYPOINT ["java","-jar","/fcdiscountservice.jar"]