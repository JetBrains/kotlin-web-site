[//]: # (title: Unused return value checker)

<primary-label ref="experimental-general"/>

> This feature is planned to be stabilized and improved in future Kotlin releases.
> We would appreciate your feedback in our issue tracker [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719).
>
{style="note"}

The unused return value checker allows you to detect _ignored results_.
These are values returned from expressions that produce something other than
`Unit` or `Nothing` and aren't passed to a function, checked in a condition, or used otherwise.

It warns you when a value isn't:

* Stored in a variable or property.
* Returned or thrown.
* Passed as an argument to another function.
* Used as a receiver in a call or safe call.
* Checked in a condition such as `if`, `when`, or `while`.
* Used as the last statement of a lambda.

> The checker doesn't report ignored results from increment operations such as `++` and `--`.
>
{style="note"}

You can use the unused return value checker to catch bugs where a function call produces a meaningful result, but the result is silently dropped.
This helps prevent unexpected behavior and makes such issues easier to track down.

Here's an example:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // The checker reports a warning that this result is ignored
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
        // Unused return value of 'plus'.
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

In this example, a string is created but never used, so the checker reports it as an ignored result.

## Configure the unused return value checker

You can control how the compiler reports ignored results with the `-Xreturn-value-checker` compiler option.

It has the following modes:

* `disable` disables the unused return value checker. (Default)
* `check` reports warnings for ignored results from [marked functions](#mark-functions-to-check-ignored-results).
* `full` reports warnings for ignored results from all functions in your project.

To use the unused return value checker in your project, add the compiler option to your build configuration file:

<tabs>
<tab id="kotlin" title="Gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```
</tab>

<tab id="maven" title="Maven">

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=check</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## Mark functions to check ignored results

When you set [the `-Xreturn-value-checker` compiler option](#configure-the-unused-return-value-checker) to `check`,
the checker reports ignored results only from expressions that are marked, like most functions in the Kotlin standard library.

To mark your own code, 
use the [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/) annotation.
You can apply it to a file, class, or function depending on the scope you want the checker to cover.

For example, you can mark an entire file:

```kotlin
// Marks all functions and classes in this file so the checker reports unused return values
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

Or a specific class:

```kotlin
// Marks all functions in this class so the checker reports unused return values
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

To apply the checker to your entire project, set the `-Xreturn-value-checker=check` compiler option to `full`.

## Suppress reports for ignored results

You can suppress reports on specific functions by marking them with the [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/) annotation.
Annotate functions where ignoring the result is common and expected, such as `MutableList.add`:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

You can suppress a warning without marking the function itself.
To do this, assign the result to a special unnamed variable with an underscore syntax (`_`):

```kotlin
// Non-ignorable function
fun computeValue(): Int = 42

fun main() {

    // Reports a warning: result is ignored
    computeValue()

    // Suppresses the warning only at this call site with a special unused variable
    val _ = computeValue()
}
```

You can't override a class or interface marked with `@IgnorableReturnValue` with one that requires its return values to be used.
However, you can mark an override with `@IgnorableReturnValue` in a class or interface annotated with `@MustUseReturnValues` when its result can be safely ignored:

```kotlin
@MustUseReturnValues
interface Greeter {
    fun greet(name: String): String
}

object SilentGreeter : Greeter {
    @IgnorableReturnValue
    override fun greet(name: String): String = ""
}

fun check(g: Greeter) {
    // Reports a warning: unused return value
    g.greet("John")

    // No warning
    SilentGreeter.greet("John")
}
```

