FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x gradlew && ./gradlew clean build -x test

RUN find build/libs -name "*.jar" ! -name "*plain*" -exec cp {} app.jar \;

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]