# Use the official OpenJDK 17 image as the base
# FROM openjdk:17

# Set the working directory in the container
# WORKDIR /app

# Copy the JAR file to the container
# COPY build/libs/*.jar app.jar

# Set the command to run the Spring application
# CMD ["java", "-jar", "app.jar"]
FROM openjdk:17

ARG JAR_FILE=build/libs/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

