[//]: # (title: Test Java code using Kotlin and JUnit – tutorial)

Kotlin is fully interoperable with Java, which means you can write tests for Java code using Kotlin and run them together
with your existing Java tests in the same project.

In this tutorial, you'll learn how to:

* Configure a mixed Java–Kotlin project to run tests using [JUnit 5](https://junit.org/junit5/).
* Add Kotlin tests that verify Java code.
* Run tests using Maven or Gradle.

> Before you start, make sure you have:
>
> * [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Community or Ultimate edition) that has a bundled Kotlin plugin
> or [VS Code](https://code.visualstudio.com/Download) with the installed [Kotlin extension](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start).
> * Java 17 or later
>
{style="note"}

## Configure the project

1. In your IDE, clone the sample project from version control:

   ```text
   https://github.com/kotlin-hands-on/kotlin-junit-sample.git
   ```

2. Navigate to the `initial` module and review the project structure:

    ```text
    kotlin-junit-sample/
    ├── initial/
    │   ├── src/
    │   │   ├── main/java/    # Java source code
    │   │   └── test/java/    # JUnit test in Java
    │   ├── pom.xml           # Maven configuration
    │   └── build.gradle.kts  # Gradle configuration
    ```

   The `initial` module contains a simple Todo application in Java with a single test.

3. In the same directory, open the build file, `pom.xml` for Maven or `build.gradle.kts` for Gradle, and update its
   contents to support Kotlin:

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" initial-collapse-state="collapsed" collapsible="true" ignore-vars="false" collapsed-title="pom.xml file"}

    * In the `<properties>` section, set the Kotlin version.
    * In the `<dependencies>` section, add JUnit Jupiter dependencies and the `kotlin-stdlib` (test scope) to compile and
      run Kotlin tests.
    * In the `<build><plugins>` section, apply `kotlin-maven-plugin` with `extensions` enabled and configure `compile`
      and `test-compile` executions with `sourceDirs` for both Kotlin and Java.
    * You don't need to add `maven-compiler-plugin` to the `<build><pluginManagement>` section when using the Kotlin
      Maven plugin with extensions.

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```kotlin
    group = "org.jetbrains.kotlin"
    version = "1.0-SNAPSHOT"
    description = "kotlin-junit-complete"
    java.sourceCompatibility = JavaVersion.VERSION_17
    
    plugins {
        application
        kotlin("jvm") version "%kotlinVersion%"
    }

    kotlin {
        jvmToolchain(17)
    }

    application {
        mainClass.set("org.jetbrains.kotlin.junit.App")
    }

    repositories {
        mavenCentral()
    }

    dependencies {
        implementation("com.gitlab.klamonte:jexer:1.6.0")

        testImplementation(kotlin("test"))
        testImplementation(libs.org.junit.jupiter.junit.jupiter.api)
        testImplementation(libs.org.junit.jupiter.junit.jupiter.params)
        testRuntimeOnly(libs.org.junit.jupiter.junit.jupiter.engine)
        testRuntimeOnly(libs.org.junit.platform.junit.platform.launcher)
    }

    tasks.test {
        useJUnitPlatform()
    }
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="build.gradle.kts file"}

    * In the `plugins {}` block, add the `kotlin("jvm")` plugin.
    * Set the JVM toolchain version to match your Java version.
    * In the `dependencies {}` block, add the `kotlin.test` library that provides Kotlin's test utilities and integrates with JUnit.

    </tab>
    </tabs>

4. Reload the build file in your IDE.

For more detailed instructions on build file setup, see [Project configuration](mixing-java-kotlin-intellij.md#project-configuration).

## Add your first Kotlin test

The `TodoItemTest.java` test in `initial/src/test/java` already verifies the app basics: item creation, defaults,
unique IDs, and state changes.

You can expand the test coverage by adding a Kotlin test that verifies repository-level behavior:

1. Navigate to the same test source directory, `initial/src/test/java`.
2. Create a `TodoRepositoryTest.kt` file in the same package as the Java test.
3. Create the test class with field declarations and setup function:

   ```kotlin
   package org.jetbrains.kotlin.junit

   import org.junit.jupiter.api.BeforeEach
   import org.junit.jupiter.api.Assertions
   import org.junit.jupiter.api.Test
   import org.junit.jupiter.api.DisplayName

   internal class TodoRepositoryTest {
       lateinit var repository: TodoRepository
       lateinit var testItem1: TodoItem
       lateinit var testItem2: TodoItem

       @BeforeEach
       fun setUp() {
           repository = TodoRepository()
           testItem1 = TodoItem("Task 1", "Description 1")
           testItem2 = TodoItem("Task 2", "Description 2")
       }
   }
   ```

    * JUnit 5 annotations work the same in Kotlin as in Java.
    * In Kotlin, the [`lateinit` keyword](properties.md#late-initialized-properties-and-variables) allows declaring
      non-null properties that are initialized later.
      This helps to avoid having to use nullable types (`TodoRepository?`) in your tests.

4. Add a test inside the `TodoRepositoryTest` class to check the initial repository state and its size:

   ```kotlin
   @Test
   @DisplayName("Should start with empty repository")
   fun shouldStartEmpty() {
       Assertions.assertEquals(0, repository.size())
       Assertions.assertTrue(repository.all.isEmpty())
   }
   ```

    * Unlike Java static import, Jupiter's `Assertions` is imported as a class and used as a qualifier for assertion functions.
    * Instead of `.getAll()` calls, you can access Java getters as properties in Kotlin with `repository.all`.

5. Write another test to verify copy behavior for all items:

   ```kotlin
   @Test
   @DisplayName("Should return defensive copy of items")
   fun shouldReturnDefensiveCopy() {
       repository.add(testItem1)

       val items1 = repository.all
       val items2 = repository.all

       Assertions.assertNotSame(items1, items2)
       Assertions.assertThrows(
           UnsupportedOperationException::class.java
       ) { items1.clear() }
       Assertions.assertEquals(1, repository.size())
   }
   ```

    * To get a Java class object from a Kotlin class, use `::class.java`.
    * You can split complex assertions across multiple lines without using any special continuation characters.

6. Add a test to verify finding items by ID:

   ```kotlin
   @Test
   @DisplayName("Should find item by ID")
   fun shouldFindItemById() {
       repository.add(testItem1)
       repository.add(testItem2)

        val found = repository.getById(testItem1.id())

        Assertions.assertTrue(found.isPresent)
        Assertions.assertEquals(testItem1, found.get())
   }
   ```

   Kotlin works smoothly with the Java [`Optional` API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Optional.html).
   It automatically converts getter methods to properties, that's why the `isPresent()` method is accessed here as a property.

7. Write a test to verify the item removal mechanism:

   ```kotlin
    @Test
    @DisplayName("Should remove item by ID")
    fun shouldRemoveItemById() {
        repository.add(testItem1)
        repository.add(testItem2)

        val removed = repository.remove(testItem1.id())

        Assertions.assertTrue(removed)
        Assertions.assertEquals(1, repository.size())
        Assertions.assertTrue(repository.getById(testItem1.id()).isEmpty)
        Assertions.assertTrue(repository.getById(testItem2.id()).isPresent)
    }
   
    @Test
    @DisplayName("Should return false when removing non-existent item")
    fun shouldReturnFalseForNonExistentRemoval() {
        repository.add(testItem1)

        val removed = repository.remove("non-existent-id")

        Assertions.assertFalse(removed)
        Assertions.assertEquals(1, repository.size())
    }
   ```

   In Kotlin, you can chain method calls and property access, for example `repository.getById(id).isEmpty`.

> You can add even more tests to the `TodoRepositoryTest` test class to cover additional functionality.
> See the full source code in the sample project's [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/blob/main/complete/src/test/java/org/jetbrains/kotlin/junit/TodoRepositoryTest.kt) module.
>
{style="tip"}

## Run tests

Run both Java and Kotlin tests to verify your project works as expected:

1. Run the test using the gutter icon:

   ![Run the test](run-test.png)

   You can also run all project tests from the `initial` directory using the command line:

    <tabs group="build-system">
    <tab title="Maven" group-key="maven">

    ```bash
    mvn test
    ```

    </tab>
    <tab title="Gradle" group-key="gradle">

    ```bash
    ./gradlew test
    ```

    </tab>
    </tabs>

2. Check that the test works correctly by changing one of the variable values.
   For example, modify the `shouldAddItem` test to expect an incorrect repository size:

   ```kotlin
   @Test
   @DisplayName("Should add item to repository")
   fun shouldAddItem() {
       repository.add(testItem1)

       Assertions.assertEquals(2, repository.size())  // Changed from 1 to 2
       Assertions.assertTrue(repository.all.contains(testItem1))
   }
   ```

3. Run the test again and verify that it fails:

   ![Check the test result. The test has failed](test-failed.png)

> You can find the fully configured project with tests in the sample project's
> [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) module.
>
{style="tip"}

## Explore other test libraries

Besides JUnit, you can use other libraries that support both Kotlin and Java:

| Library                                                     | Description                                                                                                        |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | Fluent assertion library with chainable assertions.                                                                |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Kotlin wrapper for Mockito that provides helper functions and better integration with Kotlin type system.          |
| [MockK](https://github.com/mockk/mockk)                     | Native Kotlin mocking library that supports Kotlin-specific features including coroutines and extension functions. |
| [Kotest](https://github.com/kotest/kotest)                  | Assertion library for Kotlin offering multiple assertion styles and extensive matcher support.                     |
| [Strikt](https://github.com/robfletcher/strikt)             | Assertion library for Kotlin with type-safe assertions and support for data classes.                               |

## What's next

* Improve your test output with the [Kotlin's Power-assert compiler plugin](power-assert.md).
* Create your first [server-side application with Kotlin and Spring Boot](jvm-get-started-spring-boot.md).
* Explore the features of the [`kotlin.test` library](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/).