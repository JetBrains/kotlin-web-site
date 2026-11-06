[//]: # (title: Unused return value checker)

> For more information about the unused return value checker, see the related [KEEP proposal](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md).
>
{style="note"}

The unused return value checker detects _ignored results_.
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
    val [first, last] = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## Configure the unused return value checker

You can select one of the following modes to control how the compiler reports ignored results:

* `check` enables the checker and reports warnings for ignored results from [marked functions](#mark-functions-to-check-ignored-results) (default).
* `full` enables the checker, treats all functions in your project as [marked](#mark-functions-to-check-ignored-results), and reports warnings for ignored results.
* `disable` disables the unused return value checker.

> All marked functions are propagated as such, and ignored results are reported if the checker is enabled in projects that use your code as a dependency.
> 
{style="note"}

To use a different mode, configure it in your build configuration file:

<tabs group="build-system">
<tab id="kotlin" title="Gradle">

The `returnValueCheckerMode` Gradle DSL property controls the mode the checker uses for main source sets.

You can use the `returnValueCheckerModeForTests` property to configure the checker separately for non-main source sets.
For example, you can disable the checker for tests while adopting it in a larger project:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi
import org.jetbrains.kotlin.gradle.dsl.ReturnValueCheckerMode

@OptIn(ExperimentalKotlinGradlePluginApi::class)
kotlin {
    // Uses full mode for main source sets
    returnValueCheckerMode = ReturnValueCheckerMode.Full
    
    // Disables the checker for non-main source sets
    returnValueCheckerModeForTests = ReturnValueCheckerMode.Disabled
}
```

If you don't set the `returnValueCheckerModeForTests` property, it uses the value of the `returnValueCheckerMode` property:


</tab>

<tab id="maven" title="Maven">

For Maven projects, add the `-Xreturn-value-checker` compiler option to your `pom.xml` file:

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=full</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## Mark functions to check ignored results

In the default `check` mode, the checker reports ignored results only from marked functions, including most functions in the Kotlin standard library.

> The checker also reports ignored results from lambda calls because they use the standard library's non-ignorable `invoke()` operator.
>
{style="note"}

To mark your own code, use the [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-values/) annotation.
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

> In `full` mode, you don't have to annotate your code with `@MustUseReturnValues`.
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

## Check for unused results in higher-order functions

Some higher-order functions, such as the `let` scope function, return the result of a lambda.
To check for unused lambda results of higher-order functions, add the [`returnsResultOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.contracts/-contract-builder/returns-result-of.html) contract to the function's contract.

> Kotlin contracts are Experimental. To opt in, add the `@OptIn(ExperimentalContracts::class)` annotation when declaring a function with a contract.
>
{style="warning"}

Here's an example:

```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
inline fun <T, R> T.customLet(block: (T) -> R): R {
    contract {
        returnsResultOf(block)
    }
    return block(this)
}
```

You can then use a function with this contract, such as `.customLet()`, to check if the lambda result is used:

```kotlin
fun handleNullablePackageName(packageName: String?, builder: StringBuilder) {
    // The checker doesn't report a warning because the return value of append() can be ignored
    packageName?.customLet { builder.append(it) }

    // The checker reports a warning because the returned string is unused
    packageName?.customLet { "kotlin.$it" }
}
```

> The `returnsResultOf()` contract produces pre-release binaries that Kotlin compiler versions 2.4.0 and earlier can't read.
>
{style="warning"}

## Interoperability with Java annotations

Some Java libraries use similar mechanisms with different annotations. 
The unused return value checker treats the following annotations as equivalent to using `@MustUseReturnValues`:

* [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
* [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
* [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
* [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
* [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

It also treats [`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html) as equivalent to using `@IgnorableReturnValue`.
