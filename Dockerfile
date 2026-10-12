# ==============================================================================
# Multi-Stage Dockerfile for CampusVault Spring Boot Backend (Root Context)
# Compatible with Railway, Render, and Docker cloud deployment
# ==============================================================================

# Stage 1: Build the Application
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache Maven dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code and build executable jar
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production JRE Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Set non-root user for security
RUN groupadd -r campusvault && useradd -r -g campusvault campusvault

# Create upload/storage directory with proper permissions
RUN mkdir -p /app/storage && chown -R campusvault:campusvault /app

# Copy compiled jar from build stage
COPY --from=build /app/target/campusvault-backend-*.jar app.jar
RUN chown campusvault:campusvault app.jar

USER campusvault

# Dynamic port binding
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
