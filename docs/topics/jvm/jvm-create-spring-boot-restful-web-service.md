[//]: # (title: Create a RESTful web service with Spring Boot)


Create the project
  Explore the project build file
  Explore the Spring Boot application
Create a data class and a controller 
Run the application
--
Add the database support
Run the final application


This tutorial walks you through the process of creating a simple application with Spring Boot. 
First, you will create an application with the HTTP endpoint that returns a data objects list in the JSON format.
In the next tutorial, you'll add another endpoint to write the data and the database support for storing it.

## Bootstrap the project

To generate a new project, use `start.spring.io` application. By following this link you will open the project generator tool where all the parameters for this tutorial are preselected. We will use Gradle as a build tool, select Kotlin as a language of choice, and add a few dependencies: Spring Web, Spring Data JDBC, and H2 Database.

> You can also create a new project using [IntelliJ IDEA with the Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html) 
>
>

1. Open the [spring initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.4.2.RELEASE&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2). The link from the tutorial opens the window with the predefined settings of the new project. 

    Pay special attention to the following:
    * **Gradle project** – the project will use Gradle as a build system. See [Using Gradle](gradle.html) for details on setting up Gradle to work with Kotlin.
    * **Kotlin** – 
    * **Dependencies**: 
        * **Spring Web** 
        * **Spring Data JDBC** 
        * **H2 Database** 

2. Click **GENERATE** at the bottom of the screen. Spring initializr will generate the project with the specified settings. The download starts automatically.

3. Unpack the **.zip** file and open in the IntelliJ IDEA.
  
   The project has the following structure: 
   <!-- [!image]() -->
   
   Under the main/kotlin folder there are packages and classes that belong to the application. The entry point to the application is the DemoApplication.kt file. This is where the main method is. We are going to edit the file throughout the tutorial.

## Explore the project build file

Open the `build.gradle.kts` file:

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
   id("org.springframework.boot") version "2.4.2"
   id("io.spring.dependency-management") version "1.0.10.RELEASE"
   kotlin("jvm") version "1.4.21"
   kotlin("plugin.spring") version "1.4.21"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_11

repositories {
   mavenCentral()
}

dependencies {
   implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
   implementation("org.springframework.boot:spring-boot-starter-web")
   implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
   implementation("org.jetbrains.kotlin:kotlin-reflect")
   implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
   runtimeOnly("com.h2database:h2")
   testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
   kotlinOptions {
       freeCompilerArgs = listOf("-Xjsr305=strict")
       jvmTarget = "11"
   }
}

tasks.withType<Test> {
   useJUnitPlatform()
}
```

This is the Gradle Kotlin build script, which contains a list of the dependencies required for our application. 
The Gradle file is pretty much standard for Spring Boot. 
The only differences are the structure layout for source folders for Kotlin, the required Kotlin dependencies and the `kotlin-spring` Gradle plugin (CGLIB proxies used for example for `@Configuration` and `@Bean` processing require open classes).

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

As Spring Boot looks for a public static main method, we need to define this in Kotlin. Here we prefer using a [top-level function](https://kotlinlang.org/docs/reference/functions.html) defined outside DemoApplication class since it leads to more concise and clean code. 
[scope](https://kotlinlang.org/docs/functions.html#function-scope)

No need to mark the DemoApplication class as open since we are using the [kotlin-spring](https://kotlinlang.org/docs/reference/compiler-plugins.html#kotlin-spring-compiler-plugin) Gradle plugin which does that automatically.
[new kotlin-spring](https://kotlinlang.org/docs/all-open-plugin.html#spring-support)

### Create a data class and a controller

What for we need a

1. In the `DemoApplication.kt` file, create a `Message` data class with two properties: `id` and `text`:

  ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. In the same file, create a `MessageResource` class which will serve the requests and return a JSON document representing a collection of `Message` objects:

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

  * `@RestController` annotation before the class description is for ...
  * `@GetMapping` annotation is for mapping ...


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

data class Message(@Id val id: String?, val text: String)
```

## Run the application

Application is ready to run:

1. Click the green __Run__ icon in the gutter to the `main` method or hit the **Alt+Enter** shortcut to invoke the launch menu in IntelliJ IDEA:

    > You can also run the `./gradlew bootRun` command in the terminal.
    >
    {type="note"}

2. Once the application starts, open the following URL: [http://localhost:8080](http://localhost:8080). You will see a page with a collection of messages in JSON format:

    <!-- ![pic](jvm-main-kt-updated.png) -->

## Add database support

In the following step, we will demonstrate how to integrate our application with a real database to store the messages.


First, we need to say that the `Message` class maps to a database table. This is done by using `@Table` annotation:

```kotlin
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table


@Table("MESSAGES")
data class Message(@Id val id: String?, val text: String)
```

Next, we are going to use the Spring Data Repository API to access the database:

```kotlin
import org.springframework.data.jdbc.repository.query.Query
import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message, String>{

   @Query("select * from messages")
   fun findMessages(): List<Message>
}
```

Calling the `findMessages` method on an instance of `MessageRepository` will execute the corresponding database query, `select * from messages`. As a result, we will retrieve a list of `Message` objects.

We will use the `MessageRepository` from within the service layer implemented by `MessageService` class:  

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

Finally, `MessageResource` will make use of the new service:

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

We have added database support to the application. Now we need to configure the database.

Since this is a demo project, we will not be designing anything complex and we’ll stick to the following structure:

```sql
CREATE TABLE IF NOT EXISTS messages (
  id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
  text                   VARCHAR      NOT NULL
);
```

1.️ Create a new folder called sql in the src/main/resources directory. Then put the SQL code from above into the src/main/resources/sql/schema.sql file. 

1. Open the `application.properties` located in the `src/main/resources` folder, and add the following application properties:

```properties
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.url=jdbc:h2:file:./data/testdb
spring.datasource.username=sa
spring.datasource.password=password
spring.datasource.schema=classpath:sql/schema.sql
spring.datasource.initialization-mode=always
```

See the full list of common application properties in the [Spring documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## Run the final application

Let’s run the application again and see how it behaves. Once the application is up and running, we can execute a few post request to store some message in the database.

In IntelliJ IDEA, we can do that by using the embedded [HTTP client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html). Create a file with the .http extension and add a few requests there:

1. Create a file with the `.http` extension and add the following requests there:

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

2. Execute all `POST` requests.
   These requests write the text messages to the database.

3. Execute the `GET` request and see the result in the **Run** tool window:

    <!-- ![Create a console application](jvm-new-project-1.png) -->

    All the previously sent messages are in the database! All your base are belong to us!

> You can also use any other HTTP client or cURL command-line tool. For example, you can run the following commands in the terminal to get the same result:
> 
> ```cURL
> curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"hello\" }"
>
> curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"bonjour\" }"
> 
> curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"privet\" }"
> 
> curl -X GET --location "http://localhost:8080"
> ```
> 
{type="note"}



