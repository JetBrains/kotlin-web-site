[//]: # (title: Adding Kotlin to a Java project – tutorial)

Kotlin is fully interoperable with Java, so you can gradually introduce it into your existing Java projects without
having to rewrite everything.

In this tutorial, you'll learn how to:

* Set up Maven or Gradle build tools to compile both Java and Kotlin code.
* Organize Java and Kotlin source files in your project directories.
* Convert Java files to Kotlin using IntelliJ IDEA.

> You can use any existing Java project for this tutorial or clone our public [sample project](https://github.com/kotlin-hands-on/kotlin-junit-sample/tree/main/complete)
> with both Maven and Gradle build files already set up.
>
{style="tip"}

## Project configuration

To add Kotlin to a Java project, you need to configure the project to use both Kotlin and Java,
depending on the build tool you use.

The project configuration ensures that both Kotlin and Java code are compiled properly and can reference each other
seamlessly.

### Maven

> Starting with **IntelliJ IDEA 2025.3**, when you add your first Kotlin file to a Maven-based Java project,  
> the IDE automatically updates your `pom.xml` file to include the Kotlin Maven plugin and standard dependencies.  
> You can still configure it manually if you want to customize versions or build phases.
>
{style="note"}

To use Kotlin and Java together in a Maven project, apply the Kotlin Maven plugin and add Kotlin dependencies in your
`pom.xml` file:

1. In the `<properties>` section, add the Kotlin version property:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" ignore-vars="false" include-lines="13,17,18"}

2. In the `<dependencies>` section, add the required dependencies to the `<plugins>` section:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="32,38-43,45-49,62"}

3. In the `<build><plugins>` section, add the Kotlin plugin:

    ```xml
    ```
   {src="jvm-test-tutorial/pom.xml" include-lines="64-66,102-104,105-137"}

   In this configuration:

    * `<extensions>true</extensions>` lets Maven integrate the Kotlin plugin into the build lifecycle.
    * Custom execution phases allow the Kotlin plugin to compile Kotlin first, then Java.
    * Kotlin and Java code can reference each other through the configured `sourceDirs` directories.
    * You don't need a separate `maven-compiler-plugin` in the `<build><pluginManagement>` section when using the Kotlin
      Maven plugin with extensions.

4. Reload the Maven project in your IDE.
5. Run tests to verify the configuration:

    ```bash
    ./mvnw clean test
    ```

### Gradle

To use Kotlin and Java together in a Gradle project, apply the Kotlin JVM plugin and add Kotlin dependencies in your
`build.gradle.kts` file:

1. In the `plugins {}` block, add the Kotlin JVM plugin:

    ```kotlin
    plugins {
        // Other plugins
        kotlin("jvm") version "%kotlinVersion%"
    }
    ```

2. Set the JVM toolchain version to match your Java version:

    ```kotlin
    kotlin {
        jvmToolchain(17)
    }
    ```

   This ensures Kotlin uses the same JDK version as your Java code.

3. In the `dependencies {}` block, add the `kotlin("test")` library that provides Kotlin test utilities and integrates
   with JUnit:

    ```kotlin
    dependencies {
        // Other dependencies
    
        testImplementation(kotlin("test"))
        // Other test dependencies
    }
    ```

4. Reload the Gradle project in your IDE.
5. Run your tests to verify the configuration:

    ```bash
    ./gradlew clean test
    ```

## Project structure

With this configuration, you can mix Java and Kotlin files in the same source directories:

```none
src/
  ├── main/
  │    ├── java/          # Java and Kotlin production code
  │    └── kotlin/        # Additional Kotlin production code (optional)
  └── test/
       ├── java/          # Java and Kotlin test code
       └── kotlin/        # Additional Kotlin test code (optional)
```

You can create these directories manually or let IntelliJ IDEA create them when you add your first Kotlin file.

The Kotlin plugin automatically recognizes both `src/main/java` and `src/test/java` directories,
so you can keep `.kt` and `.java` files in the same directories.

## Convert Java files to Kotlin

The Kotlin plugin also bundles a Java to Kotlin converter (_J2K_) that automatically converts Java files to Kotlin.
To use J2K on a file, click **Convert Java File to Kotlin File** in its context menu or in the **Code** menu of IntelliJ IDEA.

![Convert Java to Kotlin](convert-java-to-kotlin.png){width=500}

While the converter is not fool-proof, it does a pretty decent job of converting most boilerplate code from Java to Kotlin.
However, some manual tweaking is sometimes required.

## Next step

The easiest way to start using Kotlin in a Java project is by adding Kotlin tests first:

[Add your first Kotlin test to your Java project](jvm-test-using-junit.md)

### See also

* [Kotlin and Java interoperability details](java-to-kotlin-interop.md)
* [Maven build configuration reference](maven.md)