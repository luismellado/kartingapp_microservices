FROM openjdk:17
ARG JAR_FILE=target/bookingservice.jar
COPY ${JAR_FILE} bookingservice.jar
ENTRYPOINT ["java","-jar","/bookingservice.jar"]