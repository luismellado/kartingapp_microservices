FROM openjdk:17
ARG JAR_FILE=build/libs/bookingservice-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} bookingservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","/bookingservice-0.0.1-SNAPSHOT.jar"]