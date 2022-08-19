[//]: # (title: Create a Spring Boot project with Kotlin)

This tutorial walks you through the process of creating a simple application with Spring Boot and adding a database
to store the information.

## Before you start

Download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create the Spring Boot project

Create a new Spring Boot project with Kotlin by using the project wizard in IntelliJ IDEA Ultimate Edition:

> You can also create a new project using [IntelliJ IDEA with the Spring Boot plugin](https://www.jetbrains.com/help/idea/spring-boot.html)
>
{type="note"}

1. In IntelliJ IDEA, select **File** | **New** | **Project**. 
2. In the panel on the left, select **New Project** | **Spring Initializr**.
3. Specify the following fields and options in the project wizard window:
   * **Name**: demo
   * **Language**: Kotlin
   * **Build system**: Gradle
   * **JDK**: Java 17 JDK
     
     > Use **Amazon Corretto version 17** for this tutorial.
     >
     {type="note"}
   
   * **Java**: 17

   ![Create Spring Boot project](create-spring-boot-project.png){width=800}

4. Ensure that all the fields are specified and click **Next**.

5. Select the following dependencies that will be required for the tutorial:
   * **Spring Web**
   * **Spring Data JDBC**
   * **H2 Database**

   ![Set up Spring Boot project](set-up-spring-boot-project.png){width=800}

6. Click **Create** to generate and set up the project.

The IDE will generate and open the new project. It may take some time to download and import the project dependencies.
After this, you can observe the following structure in the **Project view**:

![Set up Spring Boot project](spring-boot-project-view.png){width=400}

The generated Gradle project corresponds to Maven’s standard directory layout.
There are packages and classes under the `main/kotlin` folder that belong to the application.
The entry point to the application is the `main()` method of the `DemoApplication.kt` file.

## Explore the project Gradle build file {initial-collapse-state="collapsed"}

Open the `build.gradle.kts` file. `build.gradle.kts` is the Gradle Kotlin build script, which contains a list of the dependencies required for the application.

The Gradle file is standard for Spring Boot, but it also contains necessary Kotlin dependencies, including the kotlin-spring Gradle plugin – `kotlin("plugin.spring")`.

Here is the full script with the explanation of all parts and dependencies:

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile // for `KotlinCompile` task below

plugins { 
    id("org.springframework.boot") version "2.7.1"
    id("io.spring.dependency-management") version "1.0.11.RELEASE"
    kotlin("jvm") version "%kotlinVersion%" // The version of Kotlin to use
    kotlin("plugin.spring") version "1.6.21" // The Kotlin Spring plugin
}

group = "com.example"
version = "0.0.1-SNAPSHOT" 
java.sourceCompatibility = JavaVersion.VERSION_17 

repositories {
    mavenCentral()
}

dependencies { 
    implementation("org.springframework.boot:spring-boot-starter-data-jdbc") 
    implementation("org.springframework.boot:spring-boot-starter-web") 
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin") // Jackson extensions for Kotlin for working with JSON
    implementation("org.jetbrains.kotlin:kotlin-reflect") // Kotlin reflection library, required for working with Spring
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8") // Kotlin standard library
    runtimeOnly("com.h2database:h2") 
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> { // Settings for `KotlinCompile` tasks
    kotlinOptions { // Kotlin compiler options
        freeCompilerArgs = listOf("-Xjsr305=strict") // `-Xjsr305=strict` enables the strict mode for [JSR-305 annotations](java-interop.md#jsr-305-support)
        jvmTarget = "17" // This option specifies the target version of the generated JVM bytecode
    }
}

tasks.withType<Test> { 
    useJUnitPlatform()
}
```

As you can see, there are a few Kotlin-related artifacts added to the Gradle build file.

In the `plugins` block, there are two Kotlin artifacts:

* `kotlin("jvm")` – the plugin defines the version of Kotlin to be used in the project
* `kotlin("plugin.spring")` – Kotlin Spring compiler plugin for adding the open modifier to Kotlin classes in order to make them compatible with Spring Framework features.

In the `dependencies` block, you can see a few Kotlin-related modules listed:

* `com.fasterxml.jackson.module:jackson-module-kotlin` - the module adds support for serialization and deserialization of Kotlin classes and data classes.
* `org.jetbrains.kotlin:kotlin-reflect` - Kotlin reflection library
* `org.jetbrains.kotlin:kotlin-stdlib-jdk8` - Kotlin’s standard library

After the dependencies section, you can see the `KotlinComiple` task configuration block. This is where you can add extra arguments to the compiler to enable or disable various language features.

## Explore the generated Spring Boot application

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


<deflist collapsible="true">
   <def title="Declaring classes">
      Right after package declaration and import statements we can see the first class declaration, <code>class DemoApplication</code>.
      In Kotlin, if a class doesn’t include any members (properties of functions), you can omit the class body (<code>{}</code>) for good.
   </def>
   <def title="@SpringBootApplication annotation">
      <p><a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.using-the-springbootapplication-annotation">This annotation</a> is a convenience annotation in a Spring Boot application.
      It enables Spring Boot’s <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.auto-configuration">auto-configuration</a>, <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html">component scan</a> and be able to define extra configuration on their "application class".
      </p>
   </def>
   <def title="main() – program entry point">
      <p>The <a href="basic-syntax.md#program-entry-point"><code>main()</code></a> function is the entry point to the application.</p>
      <p>It is declared as a <a href="functions.md#function-scope">top-level function</a> outside the <code>DemoApplication</code> class. The main function invokes Spring’s <code>runApplication(&amp;args)</code> function to start the application with Spring Framework.</p>
   </def>
   <def title="The spread operator">
      <p>The args is a parameter to the main function declared as an array of Strings.
        Since we have an array of strings, and we want to pass its contents to the function, we use the spread operator (prefix the array with <code>*</code>).
      </p>
   </def>
   <def title="Variable arguments">
      <p>If you check the declaration of <code>runApplication()</code> function, you will see that the parameter of the function is marked with <a href="functions.md#variable-number-of-arguments-varargs"><code>vararg</code> modifier</a>: <code>vararg args: String</code>.
        This means that you can pass a variable number of String arguments to the function.
      </p>
   </def>
</deflist>

## Run the application

It works! (the aha moment)

## What's next

You ready to upgrade the project: [proceed to the next chapter](jvm-add-http-to-spring-boot-project.md)