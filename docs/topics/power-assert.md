[//]: # (title: Power-assert compiler plugin)

> The Power-assert compiler plugin is [Experimental](components-stability.md).
> It may be changed at any time. Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

The Kotlin Power-assert compiler plugin improves the debugging experience
by providing detailed and contextual information in assertion failure messages.
It simplifies the process of writing tests by automatically generating failure messages 
that include intermediate values of the assertion expression. 
It helps you quickly understand why a test failed without the need for complex assertion libraries.

Key features:

- **Enhanced Error Messages**: The plugin captures and displays the values of variables and sub-expressions within the assertion, making it clear which part of the condition caused the failure.
- **Simplified Testing**: Automatically generates informative failure messages, reducing the need for complex assertion libraries.
- **Supports Multiple Functions**: By default, it transforms `assert()` function calls but can also transform other functions like `require()`, `check()`, and `assertTrue()`.

## Apply the plugin

To enable the Power-assert plugin, configure your `build.gradle(.kts)` file as follows:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

Since the plugin is Experimental, you will see warnings every time you build your app. 
To exclude warnings, add the `@OptIn` annotation before declaring the `powerAssert {}` block:

```kotlin
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    ...
}
```

## Configure the plugin

The Power-assert plugin provides several options to customize its behavior:

- **`functions`**: A set of fully-qualified function paths whose calls will be transformed by the Power-assert plugin. If empty, only `kotlin.assert()` will be transformed by default.
- **`includedSourceSets`**: A set of Gradle source sets that will be transformed by the Power-assert plugin. If empty, all _test source sets_ will be transformed by default.

Example configuration:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
powerAssert {
    // List of functions for the Power-assert plugin
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull")
    // List of source sets for the Power-assert plugin
    includedSourceSets = listOf("commonMain", "jvmMain", "jsMain", "nativeMain")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
powerAssert {
    // List of functions for the Power-assert plugin
    functions = ["kotlin.assert", "kotlin.test.assertTrue", "kotlin.test.assertEquals", "kotlin.test.assertNull"]
    // List of source sets for the Power-assert plugin
    includedSourceSets = ["commonMain", "jvmMain", "jsMain", "nativeMain"]
}
```

</tab>
</tabs>

## Use the plugin

This section contains examples of using the Power-assert compiler plugin.

See the complete code of the build script file `build.gradle.kts` for all these examples:

```kotlin
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins {
    kotlin("jvm") version "%kotlinVersion%"
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}

group = "org.example"
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
    functions = listOf("kotlin.assert", "kotlin.test.assertEquals", "kotlin.test.assertTrue", "kotlin.test.assertNull", "kotlin.require")
}
```
{initial-collapse-state="collapsed"}

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
@Test
    fun testComplexAssertion() {
        val person = Person("Alice", 30)
        val isValidName = person.name.startsWith("A") && person.name.length > 3
        val isValidAge = person.age > 20 && person.age < 29
        assert(isValidName && isValidAge)
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
@Test
    fun testComplexAssertion() {
        val person = Person("Alice", 30)
        assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
    }
```

After execution, you get more explicit information about what went wrong:

```text
Assertion failed
assert(person.name.startsWith("A") && person.name.length > 3 && person.age > 20 && person.age < 29)
       |      |    |                  |      |    |      |      |      |   |       |      |   |
       |      |    |                  |      |    |      |      |      |   |       |      |   false
       |      |    |                  |      |    |      |      |      |   |       |      30
       |      |    |                  |      |    |      |      |      |   |       Person(name=Alice, age=30)
       |      |    |                  |      |    |      |      |      |   true
       |      |    |                  |      |    |      |      |      30
       |      |    |                  |      |    |      |      Person(name=Alice, age=30)
       |      |    |                  |      |    |      true
       |      |    |                  |      |    5
       |      |    |                  |      Alice
       |      |    |                  Person(name=Alice, age=30)
       |      |    true
       |      Alice
       Person(name=Alice, age=30)
```

### Beyond assert function

The Power-assert plugin can transform various functions beyond `assert`.
Functions like `require()`, `check()`, `assertTrue()`, `assertEqual()` and others can also be transformed,
if they have a form that allows taking a `String` or `() -> String` value as the last parameter.

Before adding a new function in a test, specify the function in the `powerAssert {}` block of your build script file.
For example, the `require()` function:

```kotlin
// build.gradle.kts
@OptIn(ExperimentalKotlinGradlePluginApi::class)
powerAssert {
    functions = listOf("kotlin.assert", "kotlin.require")
}
```

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

### Function call tracing

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

After that, you could use it in your test code:

```kotlin
// Import the assertSoftly() function
import org.example.assertSoftly
        
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
Dave has an invalid age: 150
```

## What's next

* Look through a [simple project with the plugin enabled](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-integration-tests/src/test/resources/testProject/powerAssertSimple)
   and more [complex project with multiple source sets](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-integration-tests/src/test/resources/testProject/powerAssertSourceSets)