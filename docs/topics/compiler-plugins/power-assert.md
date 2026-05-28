[//]: # (title: Power-assert compiler plugin)
<primary-label ref="experimental-opt-in"/>

The Kotlin Power-assert compiler plugin improves the debugging experience
by providing detailed failure messages with contextual information.
It simplifies the process of writing tests by automatically generating 
intermediate values in failure messages. 
It helps you understand why a test failed without needing complex assertion libraries.

This is an example message provided by the plugin:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

The Power-assert plugin key features:

* **Enhanced error messages**: The plugin captures and displays the values of variables and 
   sub-expressions within the assertion to clearly identify the cause of failure.
* **Simplified testing**: Automatically generates informative failure messages,
   reducing the need for complex assertion libraries.
* **Support for multiple functions**: By default, it transforms `assert()` function calls but can also transform other functions,
   such as `require()`, `check()`, and `assertTrue()`.

The plugin also includes a runtime library that provides the `@PowerAssert` annotation and the `CallExplanation` class.
They make Power-assert capable functions more discoverable and easier to configure by integrating them directly with
the compiler plugin transformations.

## Apply the plugin

### Gradle

To enable the Power-assert plugin, configure your `build.gradle(.kts)` file as follows:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '%kotlinVersion%'
}
```

</tab>
</tabs>

The Power-assert plugin provides several options to customize its behavior:

* **`functions`**: A list of fully-qualified function paths. The Power-assert plugin will transform the calls to these functions. If not specified, only `kotlin.assert()` calls will be transformed by default.
* **`includedSourceSets`**: A list of Gradle source sets that the Power-assert plugin will transform. If not specified, all _test source sets_ will be transformed by default.

To customize the behavior, add the `powerAssert {}` block to your build script file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
```

</tab>
</tabs>

Since the plugin is [Experimental](components-stability.md#stability-levels-explained), you will see warnings every time you build your app.
To exclude these warnings, add this `@OptIn` annotation before declaring the `powerAssert {}` block:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

### Maven

To enable the Power-assert compiler plugin in a Maven project, update the `<plugin>` section of `kotlin-maven-plugin`
in the `pom.xml` file:

```xml
<build>
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>%kotlinVersion%</version>
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
            </configuration>

            <!-- Add the Power-assert plugin dependency -->
            <dependencies>
                <dependency>
                    <groupId>org.jetbrains.kotlin</groupId>
                    <artifactId>kotlin-maven-power-assert</artifactId>
                    <version>%kotlinVersion%</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

You can customize which functions the Power-assert plugin transforms by using the `function` option.
For example, you can include `kotlin.test.assertTrue()`, `kotlin.test.assertEquals()`, and others.
If not specified, only `kotlin.assert()` calls are transformed by default.

Specify this option in the `<configuration>` section of `kotlin-maven-plugin`:

```xml
<configuration>
    <!-- Specify the functions to transform -->
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.test.assertTrue</option>
        <option>power-assert:function=kotlin.test.AssertEquals</option>
    </pluginOptions>
</configuration>
```

## Use the Power-assert plugin

This section provides examples of using the Power-assert compiler plugin.

See the complete code of the build script file `build.gradle.kts` or `pom.xml` for all these examples:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts

import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}

group = "com.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertEquals", "kotlin.test.assertTrue", "kotlin.test.assertNull", "kotlin.require", "com.example.AssertScope.assert")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '%kotlinVersion%'
}

group = 'com.example'
version = '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useJUnitPlatform()
}

powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.test.assertEquals',
            'kotlin.test.assertTrue',
            'kotlin.test.assertNull',
            'kotlin.require',
            'com.example.AssertScope.assert'
    ]
}
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>maven-power-assert-plugin-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <kotlin.code.style>official</kotlin.code.style>
        <kotlin.compiler.jvmTarget>1.8</kotlin.compiler.jvmTarget>
    </properties>

    <repositories>
        <repository>
            <id>mavenCentral</id>
            <url>https://repo1.maven.org/maven2/</url>
        </repository>
    </repositories>

    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>%kotlinVersion%</version>
                <executions>
                    <execution>
                        <id>compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>test-compile</id>
                        <phase>test-compile</phase>
                        <goals>
                            <goal>test-compile</goal>
                        </goals>
                    </execution>
                </executions>

                <configuration>
                    <compilerPlugins>
                        <plugin>power-assert</plugin>
                    </compilerPlugins>

                    <pluginOptions>
                        <option>power-assert:function=kotlin.assert</option>
                        <option>power-assert:function=kotlin.require</option>
                        <option>power-assert:function=kotlin.test.assertTrue</option>
                        <option>power-assert:function=kotlin.test.assertEquals</option>
                        <option>power-assert:function=kotlin.test.assertNull</option>
                        <option>power-assert:function=com.example.AssertScope.assert</option>
                    </pluginOptions>
                </configuration>

                <dependencies>
                    <dependency>
                        <groupId>org.jetbrains.kotlin</groupId>
                        <artifactId>kotlin-maven-power-assert</artifactId>
                        <version>%kotlinVersion%</version>
                    </dependency>
                </dependencies>

            </plugin>
            <plugin>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.22.2</version>
            </plugin>
            <plugin>
                <artifactId>maven-failsafe-plugin</artifactId>
                <version>2.22.2</version>
            </plugin>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>1.6.0</version>
                <configuration>
                    <mainClass>MainKt</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-test-junit5</artifactId>
            <version>%kotlinVersion%</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.0</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
</project>
```
{initial-collapse-state="collapsed" collapsible="true"}

</tab>
</tabs>

### `@PowerAssert`-annotated functions

If a library function is annotated with `@PowerAssert`, the Power-assert plugin transforms calls to it automatically.
You don't need to register the function in your build configuration — just call it with the plugin enabled:

```kotlin
import kotlin.test.Test

data class Mascot(val name: String)

class SampleTest {

    @Test
    fun testAnnotatedFunction() {
        val subject: Any? = Mascot(name = "Unknown")
        // If assertThat() is annotated with @PowerAssert in the library,
        // the plugin transforms this call automatically
        assertThat(subject) {
            require(subject is Mascot)
            check(subject.name == "Kodee")
        }
    }
}
```

The plugin provides detailed failure messages with intermediate expression values, just like with `assert()`:

```text
Assertion failed:
 * Condition failed: subject.name == "Kodee"
assertThat(subject) {
           |
           Mascot(name=Unknown)
    require(subject is Mascot)
    check(subject.name == "Kodee")
                  |    |
                  |    false
                  "Unknown"
}
```

No additional build configuration is needed for functions annotated with `@PowerAssert`.

### Assert function

Consider the following test with the `assert()` function:

```kotlin
import kotlin.test.Test

class SampleTest {

    @Test
    fun testFunction() {
        val hello = "Hello"
        val world = "world!"
        assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
    }
}
```

If you run the `testFunction()` test with the Power-assert plugin enabled, you get the explicit failure message:

```text
Incorrect length
assert(hello.length == world.substring(1, 4).length) { "Incorrect length" }
       |     |      |  |     |               |
       |     |      |  |     |               3
       |     |      |  |     orl
       |     |      |  world!
       |     |      false
       |     5
       Hello
```

To get a more complete error message, always inline the variable into the test function parameters.
Consider the following test function:

```kotlin
class ComplexExampleTest {

    data class Person(val name: String, val age: Int)
 
    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        val isValidName = person.name.startsWith("A") && person.name.length > 3
        val isValidAge = person.age in 21..28
        assert(isValidName && isValidAge)
    }
}
```

The output of the executed code doesn't provide enough information to find the cause of the problem:

```text
Assertion failed
assert(isValidName && isValidAge)
       |              |
       |              false
       true
```

Inline the variable into the `assert()` function:

```kotlin
class ComplexExampleTest {

    data class Person(val name: String, val age: Int)

    @Test
    fun testComplexAssertion() {
        val person = Person("Alice", 10)
        assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
    }
}
```

After execution, you get more explicit information about what went wrong:

```text
Assertion failed
assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
       |      |    |                  |      |    |      |      |      |   |
       |      |    |                  |      |    |      |      |      |   false
       |      |    |                  |      |    |      |      |      10
       |      |    |                  |      |    |      |      Person(name=Alice, age=10)
       |      |    |                  |      |    |      true
       |      |    |                  |      |    5
       |      |    |                  |      Alice
       |      |    |                  Person(name=Alice, age=10)
       |      |    true
       |      Alice
       Person(name=Alice, age=10)
```

### Beyond assert function

The Power-assert plugin can transform various functions beyond `assert` which is transformed by default.
Functions like `require()`, `check()`, `assertTrue()`, `assertEqual()` and others can also be transformed,
if they have a form that allows taking a `String` or `() -> String` value as the last parameter.

Before using a new function in a test, add the function to your build file.
For example, the `require()` function:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.require'
    ]
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<configuration>
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.require</option>
    </pluginOptions>
</configuration>
```
</tab>
</tabs>


After adding the function, you can use it in your tests:

```kotlin
class RequireExampleTest {

    @Test
    fun testRequireFunction() {
        val value = ""
        require(value.isNotEmpty()) { "Value should not be empty" }
    }
}
```

The output for this example uses the Power-assert plugin to provide detailed information about the failed test:

```text
Value should not be empty
require(value.isNotEmpty()) { "Value should not be empty" }
        |     |
        |     false
        
```

The message shows the intermediate values that lead to the failure, making it easier to debug.

<!-- ### Function call tracing

The plugin supports function call tracing, which is similar to Rust's `dbg!` macro.
Use it to trace and print function calls and their results:

```kotlin
class FunctionTrailingExampleTest {

    fun exampleFunction(x: Int, y: Int): Int {
        return x + y
    }

    @Test
    fun testFunctionCallTracing() {
        assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
    }
}
```

The output shows the intermediate results of functions calls:

```text
Assertion failed
assert(exampleFunction(2, 3) + exampleFunction(1, 2) == 9)
       |                     | |                     |
       |                     | |                     false
       |                     | 3
       |                     | FunctionTrailingExampleTest@533bda92
       |                     8
       5
       FunctionTrailingExampleTest@533bda92
```
-->

### Soft assertions

The Power-assert plugin supports soft assertions, which do not immediately fail the test but instead collect
assertion failures and report them at the end of the test run.
This can be useful when you want to see all assertion failures in a single run without stopping at the first failure.

To enable soft assertions, implement the way you will collect error messages:

```kotlin
fun <R> assertSoftly(block: AssertScope.() -> R): R {
    val scope = AssertScopeImpl()
    val result = scope.block()
    if (scope.errors.isNotEmpty()) {
        throw AssertionError(scope.errors.joinToString("\n"))
    }
    return result
}

interface AssertScope {
    fun assert(assertion: Boolean, message: (() -> String)? = null)
}

class AssertScopeImpl : AssertScope {
    val errors = mutableListOf<String>()
    override fun assert(assertion: Boolean, message: (() -> String)?) {
        if (!assertion) {
            errors.add(message?.invoke() ?: "Assertion failed")
        }
    }
}
```

Add these functions to your build file to make them available for the Power-assert plugin:

<tabs group="build-script">
<tab title="Gradle (Kotlin)" group-key="kotlin">

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assert", "com.example.AssertScope.assert")
}
```

</tab>
<tab title="Gradle (Groovy)" group-key="groovy">

```groovy
powerAssert {
    functions = [
            'kotlin.assert',
            'kotlin.test.assert',
            'com.example.AssertScope.assert'
    ]
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<configuration>
    <pluginOptions>
        <option>power-assert:function=kotlin.assert</option>
        <option>power-assert:function=kotlin.require</option>
        <option>power-assert:function=com.example.AssertScope.assert</option>
    </pluginOptions>
</configuration>
```
</tab>
</tabs>



> You should specify the full name of the package where you declare the `AssertScope.assert()` function.
>
{style="tip"}

After that, you could use it in your test code:

```kotlin
// Import the assertSoftly() function
import com.example.assertSoftly
        
class SoftAssertExampleTest1 {

    data class Employee(val name: String, val age: Int, val salary: Int)

    @Test
    fun `test employees data`() {
        val employees = listOf(
            Employee("Alice", 30, 60000),
            Employee("Bob", 45, 80000),
            Employee("Charlie", 55, 40000),
            Employee("Dave", 150, 70000)
        )

        assertSoftly {
            for (employee in employees) {
                assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
                assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
            }
        }
    }
}
```

In the output, all the `assert()` function error messages will be printed one after another:

```text
Charlie has an invalid salary: 40000
assert(employee.salary > 50000) { "${employee.name} has an invalid salary: ${employee.salary}" }
       |        |      |
       |        |      false
       |        40000
       Employee(name=Charlie, age=55, salary=40000)
Dave has an invalid age: 150
assert(employee.age < 100) { "${employee.name} has an invalid age: ${employee.age}" }
       |        |   |
       |        |   false
       |        150
       Employee(name=Dave, age=150, salary=70000)
```

## Support the Power-assert plugin

If you are a library author, you can add out-of-the-box Power-assert support to your library using the `@PowerAssert`
annotation and the `CallExplanation` class from the Power-assert runtime library.

### The @PowerAssert annotation

The [`@PowerAssert` annotation](https://github.com/JetBrains/kotlin/blob/master/plugins/power-assert/power-assert-runtime/src/commonMain/kotlin/kotlin/powerassert/PowerAssert.kt)
marks a function as Power-assert capable. If users of your library have the Power-assert compiler plugin in their projects
and make calls to your annotated functions they calls automatically transformed without additional build configuration.

To add support for Power-assert to your library:

1. Add the Power-assert runtime library as a dependency:

   <tabs group="build-script">
   <tab title="Gradle (Kotlin)" group-key="kotlin">

   ```kotlin
   // build.gradle.kts
   dependencies {
       implementation("org.jetbrains.kotlin:kotlin-power-assert-runtime:%kotlinVersion%")
   }
   ```

   </tab>
   <tab title="Gradle (Groovy)" group-key="groovy">

   ```groovy
   // build.gradle
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-power-assert-runtime:%kotlinVersion%'
   }
   ```

   </tab>
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <dependencies>
       <dependency>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-power-assert-runtime</artifactId>
           <version>%kotlinVersion%</version>
       </dependency>
   </dependencies>
   ```

   </tab>
   </tabs>

2. Annotate your assertion functions with `@PowerAssert`:

   ```kotlin
   import kotlin.powerassert.PowerAssert
   import kotlin.powerassert.toDefaultMessage
   import kotlin.contracts.ExperimentalContracts
   import kotlin.contracts.contract
   
   @OptIn(ExperimentalContracts::class)
   @PowerAssert
   fun powerAssert(condition: Boolean, @PowerAssert.Ignore message: String? = null) {
       contract { returns() implies condition }
       if (!condition) {
           val explanation = PowerAssert.explanation
           val failureMessage = buildString {
               if (message?.isNotBlank() == true) appendLine(message)
               if (explanation != null) append(explanation.toDefaultMessage())
           }
           throw AssertionError(failureMessage)
       }
   }
   ```

   * The `PowerAssert.explanation` property provides access to the `Explanation` object containing the call site information.
   * The `toDefaultMessage()` function renders the standard Power-assert diagram.
   * The `@PowerAssert.Ignore` annotation on the `message` parameter excludes it from the diagram.

The compiler plugin detects the `@PowerAssert` annotation and transforms calls to the function at compile time.

> For a full example, see the [`kotlin-test-power-assert`](https://github.com/bnorm/power-assert-examples/tree/main/kotlin-test-power-assert) project.
>
{style="tip"}

### The CallExplanation class

The [`CallExplanation`](https://github.com/JetBrains/kotlin/blob/master/plugins/power-assert/power-assert-runtime/src/commonMain/kotlin/kotlin/powerassert/CallExplanation.kt)
data structure provides detailed information about the call site, including intermediate expression values.
This enables dynamic diagram rendering for assertion failures and better integration with external tools.

The `CallExplanation` parameter must be the last parameter of the function and must have a default value of `null`.
The compiler plugin automatically fills in this parameter at the call site with the relevant call information.

Here is an example of how to use `CallExplanation` to build a fluent assertion library that collects
multiple failures and renders a combined diagram:

```kotlin
import kotlin.powerassert.*

interface AssertScope<T> {
    val subject: T
    fun collect(message: String?, explanation: Explanation? = null)
    fun fail(message: String?, explanation: Explanation? = null)
}

@PowerAssert
fun <T> assertThat(subject: T, block: AssertScope<T>.() -> Unit) {
    val primary = PowerAssert.explanation ?: error("power-assert compiler plugin is required")
    val failures = mutableListOf<Pair<String?, List<Expression>>>()
    val scope = object : AssertScope<T> {
        override val subject: T get() = subject
        override fun collect(message: String?, explanation: Explanation?) {
            val adjusted = explanation?.expressions
                ?.map { it.copy(explanation.offset - primary.offset) }
                .orEmpty()
            failures.add(message to adjusted)
        }
        override fun fail(message: String?, explanation: Explanation?) {
            collect(message, explanation)
            reportFailures(primary, failures)
        }
    }
    scope.block()
    reportFailures(primary, failures)
}

private fun reportFailures(
    primary: CallExplanation,
    failures: List<Pair<String?, List<Expression>>>,
) {
    if (failures.isNotEmpty()) {
        val expressions = failures.flatMap { it.second }
        val synthetic = CallExplanation.Argument(
            -1, -1, CallExplanation.Argument.Kind.VALUE, expressions
        )
        val combined = CallExplanation(
            primary.offset, primary.source, primary.arguments + synthetic
        )
        val message = buildString {
            appendLine("Assertion failed:")
            for ((msg, _) in failures) {
                if (msg != null) appendLine(" * $msg")
            }
            appendLine()
            append(combined.toDefaultMessage())
        }
        throw AssertionError(message)
    }
}
```

With this setup, users of your library get Power-assert diagrams automatically when they call `assertThat()`,
without any additional build configuration on their side.

> For a full example, see the [`fluent-assert`](https://github.com/bnorm/power-assert-examples/tree/main/fluent-assert) project.
> 
{style="tip"}

## What's next

Look through our sample projects:

* [A simple project with the plugin enabled](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)
* [A more complex project with multiple source sets](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/powerAssertSimple)
* [Example collection for experimenting with runtime library features](https://github.com/bnorm/power-assert-examples#power-assert-examples)
