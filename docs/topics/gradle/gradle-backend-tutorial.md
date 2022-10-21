[//]: # (title: Get started with Gradle and Kotlin/JVM)

This tutorial demonstrates how to use IntelliJ IDEA and Gradle for creating a console application.

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create a project

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **New Project**.
3. Name the new project and change its location, if necessary.

   > Select the **Create Git repository** checkbox to place the new project under version control. You will be able to do
   > it later at any time.
   >
   {type="tip"}

4. From the **Language** list, select **Kotlin**.

   ![Create a console application](jvm-new-gradle-project.png){width=700}

5. Select the **Gradle** build system. Choose the Kotlin language for the build script.
6. From the **JDK list**, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in
   your project.
    * If the JDK is installed on your computer, but not defined in the IDE, select **Add JDK** and specify the path to the
      JDK home directory.
    * If you don't have the necessary JDK on your computer, select **Download JDK**.

7. Select the **Add sample code** checkbox to create a file with a sample `"Hello World!"` application.
8. Click **Create**.

You have successfully created a project with Gradle.

## Understand the build script

Open the `build.gradle.kts` file: it is the Gradle Kotlin build script, which contains a list of the dependencies required for the application.

Here is the full script with the explanation of all parts and dependencies:

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile // For `KotlinCompile` task below

plugins {
    kotlin("jvm") version "%kotlinVersion%" 1️⃣ // The version of Kotlin to use
    application // The application plugin to add support for building a CLI application in Java
}

group = "org.example" // Usually a company name, for example, `org.jetbrains`
version = "1.0-SNAPSHOT" // A version that will be assigned to the built artifact

repositories { // A source of dependencies
    mavenCentral() // Often, it's `mavenCentral`. Also, it can be a private repository where your company stores artifacts
}

dependencies { // All the libraries you want to use
   // You can copy dependencies' names after you find them in the [Maven Central Repository](https://search.maven.org/)
   testImplementation(kotlin("test")) // The Kotlin test library
}

tasks.test { // Learn more about tasks in the [Gradle official documentation](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html)
    useJUnitPlatform() // [JUnitPlatform for tests](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
}

tasks.withType<KotlinCompile> { // Settings for `KotlinCompile` tasks
   // Kotlin compiler options
    kotlinOptions.jvmTarget = "1.8" // This option specifies the target version of the generated JVM bytecode
}

application {
    mainClass.set("MainKt") // Defines the main class for the application
}
```

1️⃣

As you can see, there are a few Kotlin-related artifacts added to the Gradle build file:

1. In the `plugins` block, there is the `kotlin("jvm")` artifact – the plugin defines the version of Kotlin to be used in the project.

2. In the `dependencies` section, there is `testImplementation(kotlin("test"))`. 
   Learn more about [setting dependencies on test libraries](gradle-configure.md#set-dependencies-on-test-libraries).

3. After the dependencies section, you can see the `KotlinCompile` task configuration block.
   This is where you can add extra arguments to the compiler to enable or disable various language features.

## Run the application

Open the `Main.kt` file in `src/main/kotlin`.  
The `src` directory contains Kotlin source files and resources. The `Main.kt` file contains sample code that will print
`Hello World!`.

![Main.kt with main fun](jvm-main-kt-initial-gradle.png){width=700}

The easiest way to run the application is to click the green **Run** icon in the gutter and select **Run 'MainKt'**.

![Running a console app](jvm-run-app-gradle.png){width=350}

You can see the result in the **Run** tool window.

![Kotlin run output](jvm-output-gradle.png){width=600}

Congratulations! You have just run your first Kotlin application.

## What's next?

Learn more about:
* [Gradle build file properties](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A)
* [Targeting different platforms and setting library dependencies](gradle-configure.md)
* [Compiler options and how to pass them](gradle-compiler-options.md)
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md)
* [The Kotlin DSL](gradle-kotlin-dsl.md)