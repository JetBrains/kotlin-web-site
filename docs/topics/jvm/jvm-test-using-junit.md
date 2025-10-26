[//]: # (title: Test Java code using Kotlin and JUnit – tutorial)

Kotlin is fully interoperable with Java, which means you can write tests for Java code using Kotlin and run them together
with your existing Java tests in the same project.  

In this tutorial, you'll learn how to:

* Configure a mixed Java–Kotlin project to run tests using [JUnit 5](https://junit.org/junit5/).
* Add Kotlin tests that verify Java code.
* Run tests using Maven or Gradle.

Before you start, make sure you have:

* [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) (Community or Ultimate edition) that has a bundled Kotlin plugin
  or [VS Code](https://code.visualstudio.com/Download) with the installed [Kotlin extension](https://github.com/Kotlin/kotlin-lsp/tree/main?tab=readme-ov-file#vs-code-quick-start).
* Java 17 or later

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
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>
    
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-junit-complete</artifactId>
        <version>1.0-SNAPSHOT</version>
    
        <name>kotlin-junit-complete</name>
        <url>https://kotlinlang.org/docs/jvm-test-using-junit.htm</url>
    
        <properties>
            <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
            <maven.compiler.release>17</maven.compiler.release>
            <jexer.version>1.6.0</jexer.version>
            <kotlin.version>%kotlinVersion%</kotlin.version>
        </properties>
    
        <dependencyManagement>
            <dependencies>
                <dependency>
                    <groupId>org.junit</groupId>
                    <artifactId>junit-bom</artifactId>
                    <version>5.11.0</version>
                    <type>pom</type>
                    <scope>import</scope>
                </dependency>
            </dependencies>
        </dependencyManagement>
    
        <dependencies>
            <dependency>
                <groupId>org.junit.jupiter</groupId>
                <artifactId>junit-jupiter-api</artifactId>
                <scope>test</scope>
            </dependency>
            <!-- JUnit Jupiter engine is required at test runtime -->
            <dependency>
                <groupId>org.junit.jupiter</groupId>
                <artifactId>junit-jupiter-engine</artifactId>
                <scope>test</scope>
            </dependency>
            <!-- Optionally: parameterized tests support -->
            <dependency>
                <groupId>org.junit.jupiter</groupId>
                <artifactId>junit-jupiter-params</artifactId>
                <scope>test</scope>
            </dependency>
            <!-- Kotlin standard library needed to compile/run Kotlin tests -->
            <dependency>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-stdlib</artifactId>
                <version>${kotlin.version}</version>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>com.gitlab.klamonte</groupId>
                <artifactId>jexer</artifactId>
                <version>${jexer.version}</version>
            </dependency>
        </dependencies>
    
        <build>
            <pluginManagement><!-- lock down plugin versions to avoid using Maven defaults (can be moved to a parent pom file) -->
                <plugins>
                    <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
                    <plugin>
                        <artifactId>maven-clean-plugin</artifactId>
                        <version>3.4.0</version>
                    </plugin>
                    <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
                    <plugin>
                        <artifactId>maven-resources-plugin</artifactId>
                        <version>3.3.1</version>
                    </plugin>
                    <plugin>
                        <artifactId>maven-surefire-plugin</artifactId>
                        <version>3.3.0</version>
                    </plugin>
                    <plugin>
                        <artifactId>maven-jar-plugin</artifactId>
                        <version>3.4.2</version>
                    </plugin>
                    <plugin>
                        <artifactId>maven-install-plugin</artifactId>
                        <version>3.1.2</version>
                    </plugin>
                    <plugin>
                        <artifactId>maven-deploy-plugin</artifactId>
                        <version>3.1.2</version>
                    </plugin>
                    <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
                    <plugin>
                        <artifactId>maven-site-plugin</artifactId>
                        <version>3.12.1</version>
                    </plugin>
                    <plugin>
                        <artifactId>maven-project-info-reports-plugin</artifactId>
                        <version>3.6.1</version>
                    </plugin>
    
                    <!-- KOTLIN -->
                    <plugin>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-plugin</artifactId>
                        <version>${kotlin.version}</version>
                        <extensions>true
                        </extensions> <!-- You can set this option to automatically take information about lifecycles -->
                        <executions>
                            <execution>
                                <id>compile</id>
                                <goals>
                                    <goal>compile</goal> <!-- You can skip the <goals> element if you enable extensions for the plugin -->
                                </goals>
                                <configuration>
                                    <sourceDirs>
                                        <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                                        <sourceDir>${project.basedir}/src/main/java</sourceDir>
                                    </sourceDirs>
                                </configuration>
                            </execution>
                            <execution>
                                <id>test-compile</id>
                                <goals>
                                    <goal>test-compile</goal> <!-- You can skip the <goals> element if you enable extensions for the plugin -->
                                </goals>
                                <configuration>
                                    <sourceDirs>
                                        <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                                        <sourceDir>${project.basedir}/src/test/java</sourceDir>
                                    </sourceDirs>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-compiler-plugin</artifactId>
                        <version>3.14.0</version>
                        <executions>
                            <!-- Replacing default-compile as it's treated specifically by Maven -->
                            <execution>
                                <id>default-compile</id>
                                <phase>none</phase>
                            </execution>
                            <!-- Replacing default-testCompile as it's treated specifically by Maven -->
                            <execution>
                                <id>default-testCompile</id>
                                <phase>none</phase>
                            </execution>
                            <execution>
                                <id>java-compile</id>
                                <phase>compile</phase>
                                <goals>
                                    <goal>compile</goal>
                                </goals>
                            </execution>
                            <execution>
                                <id>java-test-compile</id>
                                <phase>test-compile</phase>
                                <goals>
                                    <goal>testCompile</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </pluginManagement>
            <plugins>
                <!-- Activate Kotlin compiler for main and test sources -->
                <plugin>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-maven-plugin</artifactId>
                    <version>${kotlin.version}</version>
                    <extensions>true</extensions>
                    <executions>
                        <execution>
                            <id>compile</id>
                            <goals>
                                <goal>compile</goal>
                            </goals>
                            <configuration>
                                <sourceDirs>
                                    <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                                    <sourceDir>${project.basedir}/src/main/java</sourceDir>
                                </sourceDirs>
                            </configuration>
                        </execution>
                        <execution>
                            <id>test-compile</id>
                            <goals>
                                <goal>test-compile</goal>
                            </goals>
                            <configuration>
                                <sourceDirs>
                                    <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                                    <sourceDir>${project.basedir}/src/test/java</sourceDir>
                                </sourceDirs>
                            </configuration>
                        </execution>
                    </executions>
                </plugin>
            </plugins>
        </build>
    </project>
    ```
   {initial-collapse-state="collapsed" collapsible="true" collapsed-title="pom.xml file"}

    * In the `<properties>` section, set the Kotlin version.
    * In the `<dependencies>` section, add the `kotlin-stdlib` dependency to compile and run Kotlin tests.
    * In the `<pluginManagement>` section, add and configure the `kotlin-maven-plugin` plugin.
    * In the `<pluginManagement>` section, configure the `maven-compiler-plugin` plugin to disable default compile phases,
      and compile Java after Kotlin.
    * In the `<plugins>` section, add the `kotlin-maven-plugin`.

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

    * In the `plugins` block, add the `kotlin("jvm")` plugin.
    * Set the JVM toolchain version to match your Java version.
    * In the `dependencies` block, add the `kotlin.test` library that provides Kotlin's test utilities and integrates with JUnit.

    </tab>
    </tabs>

4. Reload the build file in your IDE.

For more detailed instructions on build file setup, see [Project configuration](mixing-java-kotlin-intellij.md#project-configuration).

## Add Kotlin test

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
   * In Kotlin, the `lateinit` keyword allows declaring non-null properties that are initialized later.
     This helps to avoid having to use nullable types (`TodoRepository?`) in your tests.

4. Add a test inside the `TodoRepositoryTest` class, covering the initial repository state and its size:

   ```kotlin
   @Test
   @DisplayName("Should start with empty repository")
   fun shouldStartEmpty() {
       Assertions.assertEquals(0, repository.size())
       Assertions.assertTrue(repository.all.isEmpty())
   }
   ```

   * Compared to Java's static import, Jupiter's `Assertions` is imported as a class, and you can use it as a qualifier
     for assertion functions.
   * Instead of writing `.getAll()` cals, you can access Java getters as properties in Kotlin with `repository.all`. 

5. Verify copy behavior for all items:

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
   * You can split complex assertions across multiple lines without needing special continuation characters.

6. Test finding items by ID:

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

   Kotlin works smoothly with the Java `Optional` API, automatically converting getter methods to properties,
   `isPresent()` method is accessed as a property.

7. Add a test covering the item removal mechanism:

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

   In Kotlin, you can chain method calls and property access together: `repository.getById(id).isEmpty`.

> You can add even more tests to the `TodoRepositoryTest` test class to cover more functionality.
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

2. Ensure that the test works correctly by changing one of the variable values.
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

3. Run the test again and check that the test execution fails:

   ![Check the test result. The test has failed](test-failed.png)

> You can find the fully configured project with tests in the sample project's
> [`complete`](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete) module.
>
{style="tip"}

## Popular test libraries

Apart from JUnit, you can use other libraries that support both Kotlin and Java to make your tests more expressive and idiomatic:

| Library                                                     | Description                                                                                                           |
|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | Fluent assertion library with chainable assertions.                                                                   |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Kotlin wrapper for Mockito that provides idiomatic helper functions and better integration with Kotlin's type system. |
| [MockK](https://github.com/mockk/mockk)                     | Native Kotlin mocking library that supports Kotlin-specific features including coroutines and extension functions.    |
| [Kotest](https://github.com/kotest/kotest)                  | Assertion library for Kotlin offering multiple assertion styles and extensive matcher support.                        |
| [Strikt](https://github.com/robfletcher/strikt)             | Assertion library for Kotlin with type-safe assertions and support for data classes.                                  |

## What's next

* Explore the features of the [`kotlin.test` library](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/).
* Improve your test output with the [Kotlin's Power-assert compiler plugin](power-assert.md).
* Create your first [server-side application with Kotlin and Spring Boot](jvm-get-started-spring-boot.md).