[//]: # (title: Unused return value checker)

<primary-label ref="experimental-general"/>

> This feature is planned to be stabilized and improved in future Kotlin releases.
> We would appreciate your feedback in our issue tracker [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719).
> 
> For more information, see the related [KEEP proposal](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md).
>
{style="note"}

The unused return value checker allows you to detect _ignored results_.
These are values returned from expressions that produce something other than
`Unit`, `Nothing`, or `Nothing?` and aren't:

* Stored in a variable or property.
* Returned or thrown.
* Passed as an argument to another function.
* Used as a receiver in a call or safe call.
* Checked in a condition such as `if`, `when`, or `while`.
* Used as the last statement of a lambda.

The checker doesn't report ignored results for increment operations like `++` and `--`,
or for boolean shortcuts where the right-hand side exits the current function, for example, `condition || return`.

You can use the unused return value checker to catch bugs where a function call produces a meaningful result, but the result is silently dropped.
This helps prevent unexpected behavior and makes such issues easier to track down.

Here's an example where a string is created but never used, so the checker reports it as an ignored result:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // The checker reports a warning that this result is ignored:
        // "Unused return value of 'plus'."
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## Configure the unused return value checker

You can control how the compiler reports ignored results with the `-Xreturn-value-checker` compiler option.

It has the following modes:

* `disable` disables the unused return value checker (default).
* `check` enables the checker, and reports warnings for ignored results from [marked functions](#mark-functions-to-check-ignored-results).
* `full` enables the checker, treats all functions in your project as [marked](#mark-functions-to-check-ignored-results), and reports warnings for ignored results.

> All marked functions are propagated as such, and ignored results are reported if the checker is enabled in projects that use your code as a dependency.
> 
{style="note"}

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

> You can apply the checker to your entire project by setting the `-Xreturn-value-checker` compiler option to `full`.
> With this option, you don't have to annotate your code with `@MustUseReturnValues`.
>
{style="note"}

## Suppress reports for ignored results

You can suppress reports on specific functions by annotating them with [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/).
Annotate functions where ignoring the result is common and expected, such as `MutableList.add`:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

You can suppress a warning without annotating the function itself.
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

### Ignored results in function overrides

When you override a function, the override inherits the reporting rules defined by the annotations on the base declaration.
This also applies when the base declaration is part of the Kotlin standard library or of other library dependencies, so the checker reports ignored results for overrides of functions like `Any.hashCode()`.

Additionally, you can't override a function marked with `@IgnorableReturnValue` with another function that [requires its return value to be used](#mark-functions-to-check-ignored-results).
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

## Interoperability with Java annotations

Some Java libraries use similar mechanisms with different annotations. 
The unused return value checker treats the following annotations as equivalent to using `@MustUseReturnValues`:

* [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
* [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
* [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
* [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
* [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

It also treats [`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html) as equivalent to using `@IgnorableReturnValue`.
