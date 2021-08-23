[//]: # (title: Create a RESTful web service with Spring Boot – tutorial)

This tutorial walks you through the process of creating a simple application with Spring Boot.

You will create an application with an HTTP endpoint that returns a data objects list in JSON format.

This tutorial consists of two parts:
* Create a RESTful Web Service with Spring Boot
* [Add a database to a Spring Boot RESTful web service](jvm-spring-boot-restful-db.md) 

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

You can also watch a video of this tutorial:

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## Bootstrap the project

Use Spring Initializr to create a new project:

> You can also create a new project using [IntelliJ IDEA with the Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html)
>
{type="note"}

1. Open [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.4.5.RELEASE&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2). This link opens the page with the project settings for this tutorial already filled in.
This project uses **Gradle**, **Kotlin**, **Spring Web**, **Spring Data JDBC**, and **H2 Database**:

   ![Create a new project with Spring Initializr](spring-boot-create-project-with-initializr.png){width=800}

2. Click **GENERATE** at the bottom of the screen. Spring Initializr will generate the project with the specified settings. The download starts automatically.

3. Unpack the **.zip** file and open it in IntelliJ IDEA.

   The project has the following structure:
   ![The Spring Boot project structure](spring-boot-project-structure.png){width=500}
 
   There are packages and classes under the `main/kotlin` folder that belong to the application. The entry point to the application is the `main()` method of the `DemoApplication.kt` file.

## Explore the project build file

Open the `build.gradle.kts` file.

This is the Gradle Kotlin build script, which contains a list of the dependencies required for the application.

The Gradle file is standard for Spring Boot, but it also contains necessary Kotlin dependencies, including the [kotlin-spring](all-open-plugin.md#spring-support) Gradle plugin.

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
* While Spring Boot looks for a public static `main()` method, the Kotlin application uses a [top-level function](functions.md#function-scope) defined outside `DemoApplication` class.
* The `DemoApplication` class is not declared as `open`, since the [kotlin-spring](all-open-plugin.md#spring-support) plugin does that automatically.

## Create a data class and a controller

To create an endpoint, add a [data class](data-classes.md) and a controller to your project:

1. In the `DemoApplication.kt` file, create a `Message` data class with two properties: `id` and `text`:

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. In the same file, create a `MessageResource` class which will serve the requests and return a JSON document containing a collection of `Message` objects:

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

1. Click the green **Run** icon in the gutter beside the `main()` method or use the **Alt+Enter** shortcut to invoke the launch menu in IntelliJ IDEA:

   ![Run the application](spring-boot-run-the-application.png){width=800}

   > You can also run the `./gradlew bootRun` command in the terminal.
   >
   {type="note"}

2. Once the application starts, open the following URL: [http://localhost:8080](http://localhost:8080).

   You will see a page with a collection of messages in JSON format:

   ![Application output](spring-boot-output.png)

## Proceed to the next tutorial

In the next part of this tutorial you will add a database for storing objects, as well as two endpoints for writing and retrieving those objects: [Add a database to a Spring Boot RESTful web service](jvm-spring-boot-restful-db.md).

