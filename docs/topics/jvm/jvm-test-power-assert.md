[//]: # (title: Test with the Power-assert compiler plugin)

<web-summary>Configure the Power-assert compiler plugin in a JVM Maven project to get detailed console diagrams for test failures.</web-summary>

The Kotlin [Power-assert compiler plugin](power-assert.md) generates detailed failure messages that display intermediate
values in your assertions.

In this tutorial, you'll learn how to configure a Kotlin/JVM Maven project to get the full Power-assert console diagrams
and visual diffs in IntelliJ IDEA.

## Configure the build file

To activate Power-assert, add the compiler plugin to your `kotlin-maven-plugin` configuration.
The `@PowerAssert` annotation lets the compiler automatically discover target functions at compile time,
so you don't need to register them manually with `<pluginOptions>`.

Add the following configuration to your project's `pom.xml`:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
    <kotlin.compiler.jdkRelease>17</kotlin.compiler.jdkRelease>
</properties>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <version>${kotlin.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>compile</id>
                    <phase>process-sources</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <phase>process-test-sources</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <!-- Specify the Power-assert plugin -->
                <compilerPlugins>
                    <plugin>power-assert</plugin>
                </compilerPlugins>
                <!-- Specify the functions to transform -->
                <pluginOptions>
                    <option>power-assert:function=kotlin.test.assertEquals</option>
                    <option>power-assert:function=kotlin.test.assertTrue</option>
                </pluginOptions>
            </configuration>
            <!-- Add the Power-assert plugin dependency -->
            <dependencies>
                <dependency>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-maven-power-assert</artifactId>
                    <version>${kotlin.version}</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

* In the `<properties>` section, set the Kotlin version and the target JDK release version, for example, JDK 17.
* In the `<dependencies>` section, add `kotlin-test-junit5` for running tests.
* In the `<build><plugins>` section, configure `kotlin-maven-plugin` with the `power-assert` compiler plugin. 
  List the assertion functions you want to transform under `<pluginOptions>` and add the Power-assert plugin dependency.

## Write a test

To see the Power-assert compiler plugin in action, let's create a `UserProfileBackendTest.kt` in the `src/test/kotlin` directory:

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class UserProfileBackendTest {

    data class UserProfile(val id: Long, val email: String)

    @Test
    fun `verify backend entity mapping matches`() {
        // Define expected domain object state
        val expectedRecord = UserProfile(id = 451L, email = "admin-dev@company.internal")

        // Simulate a mismatched backend response payload 
        val actualRecord = UserProfile(id = 451L, email = "admin-prod@company.com")

        // Standard idiomatic kotlin.test assertion
        assertEquals(expectedRecord, actualRecord, "Profile configurations out of sync")
    }
}
```

## Run the test and verify the output

Run your tests using the standard Maven command:

```bash
mvn test
```

The console displays the full Power-assert diagram, showing the expected and actual values at each position in the expression:

```text
Profile configurations out of sync
assertEquals(expectedRecord, actualRecord, "Profile configurations out of sync")
             |               |
             |               UserProfile(id=451, email=admin-prod@company.com)
             UserProfile(id=451, email=admin-dev@company.internal)
```

## What's next

* [Learn more about the [Power-assert compiler plugin and its configuration options](power-assert.md)
* [Explore testing Kotlin projects with Maven for unit and integration test setup](jvm-test-maven.md)
* [Check out the `kotlin.test` library for built-in assertion utilities](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)
