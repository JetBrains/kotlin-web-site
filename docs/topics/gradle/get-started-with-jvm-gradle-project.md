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

5. Select the **Gradle** build system.
6. From the **JDK list**, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in
   your project.
    * If the JDK is installed on your computer, but not defined in the IDE, select **Add JDK** and specify the path to the
      JDK home directory.
    * If you don't have the necessary JDK on your computer, select **Download JDK**.

7. From the **Gradle DSL** list, select **Kotlin**.
8. Select the **Add sample code** checkbox to create a file with a sample `"Hello World!"` application.

   > You can also enable the **Generate code with onboarding tips** option to add some additional useful comments to your
   > sample code.
   >
   {type="tip"}

10. Click **Create**.

You have successfully created a project with Gradle.

#### Specify a Gradle version for your project {initial-collapse-state="collapsed"}

You can explicitly specify a Gradle version for your project under the **Advanced Settings** section, either by using the Gradle Wrapper or a local installation of Gradle:
* **Gradle Wrapper:** From the **Gradle distribution** list,  select **Wrapper**. Deselect the **Auto-select** checkbox, and from the **Gradle version** list, select your Gradle version.
* **Local installation:** From the **Gradle distribution** list, select **Local installation**.  For **Gradle location**, specify the path of your local Gradle version.

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## Explore the build script

Open the `build.gradle.kts` file. This is the Gradle Kotlin build script, which contains Kotlin-related artifacts and other parts required for the application:

```kotlin
 // For `KotlinCompile` task below
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "%kotlinVersion%" // Kotlin version to use
    application // Application plugin. Also see 1️⃣ below the code
}

group = "org.example" // A company name, for example, `org.jetbrains`
version = "1.0-SNAPSHOT" // Version to assign to the built artifact

repositories { // Sources of dependencies. See 2️⃣
    mavenCentral() // Maven Central Repository. See 3️⃣
}

dependencies { // All the libraries you want to use. See 4️⃣
    // Copy dependencies' names after you find them in a repository
    testImplementation(kotlin("test")) // The Kotlin test library
}

tasks.test { // See 5️⃣
    useJUnitPlatform() // JUnitPlatform for tests. See 6️⃣
}

kotlin { // Extension for easy setup
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%) // Target version of generated JVM bytecode. See 7️⃣
}

application {
    mainClass.set("MainKt") // The main class of the application
}
```

* 1️⃣ [Application plugin](https://docs.gradle.org/current/userguide/application_plugin.html) to add support for building CLI application in Java.
* 2️⃣ Lean more about [sources of dependencies](https://docs.gradle.org/current/userguide/declaring_repositories.html).
* 3️⃣ The [Maven Central Repository](https://central.sonatype.com/). It can also be [Google's Maven repository](https://maven.google.com/) or your company's private repository.
* 4️⃣ Learn more about [declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html).
* 5️⃣ Learn more about [tasks](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html).
* 6️⃣ [JUnitPlatform for tests](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform).
* 7️⃣ Learn more about [setting up a Java toolchain](gradle-configure-project.md#gradle-java-toolchains-support).

As you can see, there are a few Kotlin-specific artifacts added to the Gradle build file:

1. In the `plugins{}` block, there is the `kotlin("jvm")` artifact – the plugin defines the version of Kotlin to be used in the project.

2. In the `dependencies` section, there is `testImplementation(kotlin("test"))`. 
   Learn more about [setting dependencies on test libraries](gradle-configure-project.md#set-dependencies-on-test-libraries).

3. After the dependencies section, there is the `KotlinCompile` task configuration block.
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
* [Gradle build file properties](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A).
* [Targeting different platforms and setting library dependencies](gradle-configure-project.md).
* [Compiler options and how to pass them](gradle-compiler-options.md).
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
