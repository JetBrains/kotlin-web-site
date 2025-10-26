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

To configure a Maven project to use both Kotlin and Java together, you need to apply the Kotlin Maven plugin and add
Kotlin dependencies:

1. Add the Kotlin version property to your `pom.xml`:

    ```xml
    <properties>
        <!-- Other properties -->
        <kotlin.version>%kotlinVersion%</kotlin.version>
    </properties>
    ```

2. Add the required dependencies:

    ```xml
    <dependencies>
        <!-- Other dependencies -->
    
        <!-- Add JUnit Jupiter engine for test runtime -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <scope>test</scope>
        </dependency>
    
        <!-- Add Kotlin standard library to compile and run Kotlin tests -->
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    ```

3. Add the Kotlin Maven plugin configuration to the `<pluginManagement>` section:

    ```xml
    <build>
        <pluginManagement>
            <plugins>
                <!-- Other plugins -->
    
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
        </pluginManagement>
    </build>
    ```

4. In the `<pluginManagement>` section, update the Maven compiler plugin to work with Kotlin:

    ```xml
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.14.0</version>
        <executions>
            <!-- Disable default compile phases -->
            <execution>
                <id>default-compile</id>
                <phase>none</phase>
            </execution>
            <execution>
                <id>default-testCompile</id>
                <phase>none</phase>
            </execution>
            <!-- Enable Java compilation after Kotlin -->
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
    ```

    The configuration ensures that:

    * Default Maven compiler phases are disabled to allow Kotlin to compile first.
    * Kotlin code can reference Java code and vice versa.
    * Custom execution phases run Java compilation after Kotlin.

5. Add the Kotlin plugin to the `<plugins>` section (outside `<pluginManagement>`):

    ```xml
    <build>
        <pluginManagement>
            <!-- ... -->
        </pluginManagement>
    
        <plugins>
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
    ```

6. Reload the Maven project in your IDE.
7. Run tests to verify the configuration:

    ```bash
    ./mvnw clean test
    ```

### Gradle

To configure a Gradle project to use both Kotlin and Java together, you need to apply the Kotlin JVM plugin and add
Kotlin dependencies:

1. Add the Kotlin JVM plugin to your `build.gradle.kts`:

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

3. In the `dependencies` block, add the `kotlin("test")` library that provides Kotlin's test utilities and integrates
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

You can create these directories manually or let IntelliJ IDEA do it when you add your first Kotlin file.

The Kotlin plugin automatically recognizes both `src/main/java` and `src/test/java` directories,
so you can place `.kt` files together with `.java` files in the same directories.

## Convert Java files to Kotlin

The Kotlin plugin also bundles a Java to Kotlin converter (_J2K_) that automatically converts Java files to Kotlin.
To use J2K on a file, click **Convert Java File to Kotlin File** in its context menu or in the **Code** menu of IntelliJ IDEA.

![Convert Java to Kotlin](convert-java-to-kotlin.png){width=500}

While the converter is not fool-proof, it does a pretty decent job of converting most boilerplate code from Java to Kotlin.
However, some manual tweaking is sometimes required.

## Next step

The simplest way to start using Kotlin in a Java project is to first introduce Kotlin tests:

[Add your first Kotlin test to your Java project](jvm-test-using-junit.md)

### See also

* [Kotlin and Java interoperability details](java-to-kotlin-interop.md)
* [Maven build configuration reference](maven.md)