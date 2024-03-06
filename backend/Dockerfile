FROM openjdk:21-jdk
VOLUME /tmp
COPY target/socialmedia-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar","-server.port=8083"]
EXPOSE 8083
