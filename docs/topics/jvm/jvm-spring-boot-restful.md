[//]: # (title: Create a RESTful web service with a database using Spring Boot – tutorial)

This tutorial walks you through the process of creating a simple application with Spring Boot and adding a database
to store the information.

In this tutorial, you will:
* Create an application with an HTTP endpoint
* Learn how to return a data objects list in the JSON format
* Create a database for storing objects
* Use endpoints for writing and retrieving database objects

You can download and explore the [completed project](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)
or watch a video of this tutorial:

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## Before you start

Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Bootstrap the project

Use Spring Initializr to create a new project:

> You can also create a new project using [IntelliJ IDEA with the Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html)
>
{type="note"}

1. Open [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.4.5.RELEASE&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2). This link opens the page with the project settings for this tutorial already filled in.
This project uses **Gradle**, **Kotlin**, **Spring Web**, **Spring Data JDBC**, and **H2 Database**:

   ![Create a new project with Spring Initializr](spring-boot-create-project-with-initializr.png){width=800}

2. Click **GENERATE** at the bottom of the screen. Spring Initializr will generate the project with the specified
settings. The download starts automatically.

3. Unpack the **.zip** file and open it in IntelliJ IDEA.

   The project has the following structure:
   ![The Spring Boot project structure](spring-boot-project-structure.png){width=500}
 
   There are packages and classes under the `main/kotlin` folder that belong to the application. The entry point to
the application is the `main()` method of the `DemoApplication.kt` file.

## Explore the project build file

Open the `build.gradle.kts` file.

This is the Gradle Kotlin build script, which contains a list of the dependencies required for the application.

The Gradle file is standard for Spring Boot, but it also contains necessary Kotlin dependencies, including
the [kotlin-spring](all-open-plugin.md#spring-support) Gradle plugin.

## Explore the Spring Boot application

Open the `DemoApplication.kt` file:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

Note that the Kotlin application file differs from a Java application file:
* While Spring Boot looks for a public static `main()` method, the Kotlin application uses a
[top-level function](functions.md#function-scope) defined outside `DemoApplication` class.
* The `DemoApplication` class is not declared as `open`, since the [kotlin-spring](all-open-plugin.md#spring-support)
plugin does that automatically.

## Create a data class and a controller

To create an endpoint, add a [data class](data-classes.md) and a controller to your project:

1. In the `DemoApplication.kt` file, create a `Message` data class with two properties: `id` and `text`:

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. In the same file, create a `MessageResource` class which will serve the requests and return a JSON document
containing a collection of `Message` objects:

   ```kotlin
   @RestController
   class MessageResource {
       @GetMapping
       fun index(): List<Message> = listOf(
           Message("1", "Hello!"),
           Message("2", "Bonjour!"),
           Message("3", "Privet!"),
       )
   }
   ```

Full code of the `DemoApplication.kt`:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageResource {
    @GetMapping
    fun index(): List<Message> = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## Run the application

The application is now ready to run:

1. Click the green **Run** icon in the gutter beside the `main()` method or use the **Alt+Enter** shortcut to invoke
the launch menu in IntelliJ IDEA:

   ![Run the application](spring-boot-run-the-application.png){width=800}

   > You can also run the `./gradlew bootRun` command in the terminal.
   >
   {type="note"}

2. Once the application starts, open the following URL: [http://localhost:8080](http://localhost:8080).

   You will see a page with a collection of messages in JSON format:

   ![Application output](spring-boot-output.png)

## Add database support

To use a database in your application, first create two endpoints: one for saving messages and one for retrieving them:

1. Add the `@Table` annotation to the `Message` class to declare mapping to a database table. Add the `@Id` annotation
before the `id` field. These annotations also require additional imports:

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. Use the [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) to access the database:

   ```kotlin
   import org.springframework.data.jdbc.repository.query.Query
   import org.springframework.data.repository.CrudRepository
  
   interface MessageRepository : CrudRepository<Message, String>{
  
       @Query("select * from messages")
       fun findMessages(): List<Message>
   }
   ```

   When you call the `findMessages()` method on an instance of `MessageRepository`, it will execute the corresponding
database query:

   ```sql
   select * from messages
   ```

   This query retrieves a list of all `Message` objects in the database table.

3. Create the `MessageService` class:

   ```kotlin
   import org.springframework.stereotype.Service
  
   @Service
   class MessageService(val db: MessageRepository) {

       fun findMessages(): List<Message> = db.findMessages()

       fun post(message: Message){
           db.save(message)
       }
   }
   ```

   This class contains two methods:
   * `post()` for writing a new `Message` object to the database
   * `findMessages()` for getting all the messages from the database

4. Update the `MessageResource` class:

   ```kotlin
   import org.springframework.web.bind.annotation.RequestBody
   import org.springframework.web.bind.annotation.PostMapping
  
  
   @RestController
   class MessageResource(val service: MessageService) {
       @GetMapping
       fun index(): List<Message> = service.findMessages()
  
       @PostMapping
       fun post(@RequestBody message: Message) {
           service.post(message)
       }
   }
   ```

   Now it uses `MessageService` to work with the database.

## Configure the database

Configure the database in the application:

1. Create a new folder called `sql` in the `src/main/resources` with the `schema.sql` file inside. It will store
the database scheme:

   ![Create a new folder](spring-boot-sql-scheme.png){width=300}

2. Update the `src/main/resources/sql/schema.sql` file with the following code:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   It creates the `messages` table with two fields: `id` and `text`. The table structure matches the structure of
the `Message` class.

3. Open the `application.properties` file located in the `src/main/resources` folder and add the following application
properties:

   ```properties
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.datasource.schema=classpath:sql/schema.sql
   spring.datasource.initialization-mode=always
   ```

   These settings enable the database for the Spring Boot application.
   See the full list of common application properties in the [Spring documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## Execute HTTP requests

You should use an HTTP client to work with previously created endpoints. In IntelliJ IDEA, you can use
the embedded [HTTP client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html):

1. Run the application. Once the application is up and running, you can execute POST requests to store messages
in the database.

2. Create the `requests.http` file and add the following HTTP requests:

   ```http request
   ### Post 'Hello!"
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Hello!"
   }
  
   ### Post "Bonjour!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Bonjour!"
   }
  
   ### Post "Privet!"
  
   POST http://localhost:8080/
   Content-Type: application/json
  
   {
     "text": "Privet!"
   }
  
   ### Get all the messages
   GET http://localhost:8080/
   ```

3. Execute all POST requests. Use the green **Run** icon in the gutter next to the request declaration.
   These requests write the text messages to the database.

   ![Run HTTP POST requests](spring-boot-run-http-request.png)

4. Execute the GET request and see the result in the **Run** tool window:

   ![Run HTTP GET request](spring-boot-output-2.png)

### Alternative way to execute requests

You can also use any other HTTP client or cURL command-line tool. For example, you can run the following commands in
the terminal to get the same result:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## What's next?

For more tutorials, check out the Spring website:

* [Building web applications with Spring Boot and Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [Spring Boot with Kotlin Coroutines and RSocket](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)