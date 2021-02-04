[//]: # (title: Create a RESTful web service with Spring Boot)

This tutorial walks you through the process of creating a simple application with Spring Boot.

You will create an application with the HTTP endpoint that returns a data objects list in the JSON format.  

To get started, first download and install the latest version of [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html).

## Bootstrap the project

To generate a new project, use the Spring Initializr:

> You can also create a new project using [IntelliJ IDEA with the Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html) 
>
{type="note"}

1. Open the [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.4.2.RELEASE&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2). The link from the tutorial opens the window with the predefined settings of the new project. 
  This project uses **Gradle** as a build tool, **Kotlin** as a language of choice, and the following dependencies: **Spring Web**, **Spring Data JDBC**, and **H2 Database**:

    ![Create a new project with Spring Initializr](spring-boot-create-project-with-initializr.png){width=800}

2. Click **GENERATE** at the bottom of the screen. Spring Initializr will generate the project with the specified settings. The download starts automatically.

3. Unpack the **.zip** file and open in the IntelliJ IDEA.
  
   The project has the following structure: 
   ![The Spring Boot project structure](spring-boot-project-structure.png)
   
   Under the `main/kotlin` folder there are packages and classes that belong to the application. The entry point to the application is the `main()` method of the `DemoApplication.kt` file.

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

This is the Gradle Kotlin build script, which contains a list of the dependencies required for the application. 

The Gradle file is standard for Spring Boot, but also contains necessary Kotlin dependencies, including [kotlin-spring](all-open-plugin.md#spring-support) Gradle plugin.

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

Comparing to Java, the application file has the following differences:
* As Spring Boot looks for a public static `main()` method, the Kotlin uses a [top-level function](functions.md#function-scope) defined outside `DemoApplication` class.
* The `DemoApplication` class is not declared as `open`, since the [kotlin-spring](all-open-plugin.md#spring-support) Gradle plugin does that automatically.

## Create a data class and a controller

To create an endpoint, you need to create a [data class](data-classes.md) and a controller:

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

Application is ready to run:

1. Click the green **Run** icon in the gutter to the `main()` method or hit the **Alt+Enter** shortcut to invoke the launch menu in IntelliJ IDEA:

    ![Run the application](spring-boot-run-the-application.png){width=800}

    > You can also run the `./gradlew bootRun` command in the terminal.
    >
    {type="note"}

2. Once the application starts, open the following URL: [http://localhost:8080](http://localhost:8080).

    You will see a page with a collection of messages in JSON format:

    ![Application output](spring-boot-output.png)

## What's next?

Once you’ve created this application, you can enhance it by adding a database for storing objects.
Proceed to the next tutorial – [Add a database to a Spring Boot RESTful web service](jvm-spring-boot-restful-db.md). 