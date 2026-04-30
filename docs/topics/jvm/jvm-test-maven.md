[//]: # (title: Test Kotlin projects with Maven)

Kotlin integrates seamlessly with the Maven ecosystem, allowing you to use industry-standard tools to verify your backend
applications. In this guide, you'll learn how to create tests with JUnit and use Maven plugins to run unit and integration
tests.

> For a detailed guide on setting up your Maven project to use both Kotlin and Java, see [](mixing-java-kotlin-intellij.md#project-configuration).
> 
{style="tip"}

## Create tests with JUnit

[JUnit](https://junit.org/) is the standard testing framework for Kotlin backend development. While Kotlin is compatible
with multiple Junit versions, most modern projects should use JUnit 6.

To create a test in Kotlin using JUnit, use the `@Test` annotation from the `kotlin.test` or JUnit package.

### Add dependency

The `kotlin-test` library is the easiest way to start. It provides a common set of assertions and automatically pulls
in the necessary JUnit artifacts.

#### JUnit 5 and later

For all new projects, use the `kotlin-test-junit5` artifact. It provides full support for JUnit, including features
like nested tests and parallel execution. Kotlin/JVM supports the latest stable JUnit version, JUnit 6.

Update your `pom.xml` file as follows:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> Despite its name, `kotlin-test-junit5` supports all latest JUnit versions, including JUnit 6.
>
{style="note"}

#### JUnit 4

If you'd like to use an earlier version of JUnit, for example, for a legacy project, use the `kotlin-test-junit` artifact
that utilizes JUnit 4:

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> For a detailed guide on using JUnit for testing and a sample project, see the [Test Java code with Kotlin](jvm-test-using-junit.md) tutorial.
>
{style="tip"}

### Write unit tests

Unit tests verify isolated parts of your code, such as individual functions or classes. 
By convention, unit tests are named with the `*Test` suffix, for example:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class OrderServiceTest {
    @Test
    fun `calculate total should sum item prices`() {
        val service = OrderService()
        val result = service.calculateTotal(listOf(10.0, 25.0))
        assertEquals(35.0, result)
    }
}
```

### Write integration tests

Integration tests verify interaction between components (like a service and a database). 
By convention, integration tests are named with the `*IT` suffix, for example:

```kotlin
import kotlin.test.Test
import kotlin.test.assertNotNull

class UserRepositoryIT {
    @Test
    fun saveFindUser() {
        // Example integration with a database or service
        val repository = UserRepository()
        repository.save(User("KotlinUser"))
        
        val user = repository.findByName("KotlinUser")
        assertNotNull(user)
    }
}
```

## Run tests

In Maven projects, test execution is typically split between two plugins: Surefire and Failsafe to ensure a clean build
lifecycle.

### With Surefire plugin

The [Surefire plugin](https://maven.apache.org/surefire/maven-surefire-plugin/) handles _unit tests_.
It runs all Kotlin and Java tests that follow the `*Test` naming pattern.

By default, it executes during the `test` phase of the build lifecycle and fails the build immediately if a test fails.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.5.5</version>
</plugin>
```

To run only your unit tests, use the following command:

```bash
mvn test
```

### With Failsafe plugin

The [Failsafe plugin](https://maven.apache.org/surefire/maven-failsafe-plugin/) handles _integration tests_.
It runs all Kotlin and Java tests that follow the `*IT` naming pattern.

Unlike Surefire, Failsafe allows the build to continue if a test fails during the `integration-test` phase, 
allowing the `post-integration-test` phase tasks (like stopping a Docker container) to run.
The build finally fails during the `verify` phase if there were any test failures.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <version>3.5.5</version>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

To run both unit and integration tests, use the following command:

```bash
mvn verify
```

## Explore other testing frameworks

Besides JUnit, you can use other popular frameworks to make Kotlin tests more idiomatic and readable:

| Library                                                     | Description                                                                                                         |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | Fluent assertion library with chainable assertions.                                                                 |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Kotlin wrapper for Mockito that provides helper functions and better integration with the Kotlin type system.       |
| [MockK](https://github.com/mockk/mockk)                     | Native Kotlin mocking library that supports Kotlin-specific features, including coroutines and extension functions. |
| [Kotest](https://github.com/kotest/kotest)                  | Assertion library for Kotlin offering multiple assertion styles and extensive matcher support.                      |
| [Strikt](https://github.com/robfletcher/strikt)             | Assertion library for Kotlin with type-safe assertions and support for data classes.                                |

## What's next

* Explore the features of the [`kotlin.test` library](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/).
* Improve your test output with the [Kotlin's Power-assert compiler plugin](power-assert.md).
