[//]: # (title: Get started with Gradle and Kotlin/JVM)

This tutorial demonstrates how to use IntelliJ IDEA and Gradle to create a JVM console application.

To get started, first download and install the latest version of [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).

## Create a project

1. In IntelliJ IDEA, select **File** | **New** | **Project**.
2. In the panel on the left, select **Kotlin**.
3. Name the new project and change its location, if necessary.

   > Select the **Create Git repository** checkbox to place the new project under version control. You will be able to do
   > it later at any time.
   >
   {type="tip"}

   ![Create a console application](jvm-new-gradle-project.png){width=700}

4. Select the **Gradle** build system.
5. From the **JDK list**, select the [JDK](https://www.oracle.com/java/technologies/downloads/) that you want to use in
   your project.
    * If the JDK is installed on your computer, but not defined in the IDE, select **Add JDK** and specify the path to the
      JDK home directory.
    * If you don't have the necessary JDK on your computer, select **Download JDK**.

6. Select the **Kotlin** DSL for Gradle.
7. Select the **Add sample code** checkbox to create a file with a sample `"Hello World!"` application.

   > You can also enable the **Generate code with onboarding tips** option to add some additional useful comments to your
   > sample code.
   >
   {type="tip"}

8. Click **Create**.

You have successfully created a project with Gradle!

#### Specify a Gradle version for your project {initial-collapse-state="collapsed"}

You can explicitly specify a Gradle version for your project under the **Advanced Settings** section, 
either by using the Gradle Wrapper or a local installation of Gradle:

* **Gradle Wrapper:**
   1. From the **Gradle distribution** list, select **Wrapper**.
   2. Disable the **Auto-select** checkbox.
   3. From the **Gradle version** list, select your Gradle version.
* **Local installation:**
   1. From the **Gradle distribution** list, select **Local installation**. 
   2. For **Gradle location**, specify the path of your local Gradle version.

   ![Advanced settings](jvm-new-gradle-project-advanced.png){width=700}

## Explore the build script

Open the `build.gradle.kts` file. This is the Gradle Kotlin build script, which contains Kotlin-related artifacts and other parts required for the application:

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%" // Kotlin version to use
}

group = "org.example" // A company name, for example, `org.jetbrains`
version = "1.0-SNAPSHOT" // Version to assign to the built artifact

repositories { // Sources of dependencies. See 1️⃣
    mavenCentral() // Maven Central Repository. See 2️⃣
}

dependencies { // All the libraries you want to use. See 3️⃣
    // Copy dependencies' names after you find them in a repository
    testImplementation(kotlin("test")) // The Kotlin test library
}

tasks.test { // See 4️⃣
    useJUnitPlatform() // JUnitPlatform for tests. See 5️⃣
}
```

* 1️⃣ Lean more about [sources of dependencies](https://docs.gradle.org/current/userguide/declaring_repositories.html).
* 2️⃣ The [Maven Central Repository](https://central.sonatype.com/). It can also be [Google's Maven repository](https://maven.google.com/) or your company's private repository.
* 3️⃣ Learn more about [declaring dependencies](https://docs.gradle.org/current/userguide/declaring_dependencies.html). 
* 4️⃣ Learn more about [tasks](https://docs.gradle.org/current/dsl/org.gradle.api.Task.html).
* 5️⃣ [JUnitPlatform for tests](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform).

As you can see, there are a few Kotlin-specific artifacts added to the Gradle build file:

1. In the `plugins {}` block, there is the `kotlin("jvm")` artifact. This plugin defines the version of Kotlin to be used in the project.

2. In the `dependencies {}` block, there is `testImplementation(kotlin("test"))`. 
   Learn more about [setting dependencies on test libraries](gradle-configure-project.md#set-dependencies-on-test-libraries).

## Run the application

1. Open the Gradle window by selecting **View** | **Tool Windows** | **Gradle**:

   ![Main.kt with main fun](jvm-gradle-view-build.png){width=700}

2. Execute the **build** Gradle task in `Tasks\build\`. In the **Build** window, `BUILD SUCCESSFUL` appears.
   It means that Gradle built the application successfully.

3. In `src/main/kotlin`, open the `Main.kt` file:
   * `src` directory contains Kotlin source files and resources. 
   * `Main.kt` file contains sample code that will print `Hello World!`.

4. Run the application by clicking the green **Run** icon in the gutter and select **Run 'MainKt'**.

   ![Running a console app](jvm-run-app-gradle.png){width=350}

You can see the result in the **Run** tool window:

![Kotlin run output](jvm-output-gradle.png){width=600}

Congratulations! You have just run your first Kotlin application.

## What's next?

Learn more about:
* [Gradle build file properties](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html#N14E9A).
* [Targeting different platforms and setting library dependencies](gradle-configure-project.md).
* [Compiler options and how to pass them](gradle-compiler-options.md).
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
