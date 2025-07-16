[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [Kotlin/JVM: support invokedynamic with when expressions](#kotlin-jvm-support-invokedynamic-with-when-expressions)
* Kotlin/Native: [support for stack canaries in binaries](#support-for-stack-canaries-in-binaries), [smaller binary size for iOS targets](#smaller-binary-size-for-ios-targets), and [improved debugger object summaries](#improved-debugger-object-summaries).
* [Kotlin/Wasm: separated npm dependencies](#kotlin-wasm-separated-npm-dependencies)
* [Kotlin/JS: new DSL function for cleaner arguments](#kotlin-js-new-dsl-function-for-cleaner-arguments)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin/JVM: support invokedynamic with when expressions
<primary-label ref="experimental-general"/> 

In Kotlin %kotlinEapVersion%, you can now compile `when` expressions with `invokedynamic`.
Previously, `when` expressions with multiple type checks compiled to a long chain of `instanceof` checks in the bytecode.

Now you can use `invokedynamic` with `when` expressions to generate smaller bytecode, similar to the bytecode produced by
Java `switch` statements, when the following conditions are met:

* All conditions except for `else` are `is` or `null` checks.
* The expression doesn't contain [guard conditions (`if`)](control-flow.md#guard-conditions-in-when-expressions).
* The conditions don't include types that can't be type-checked directly, such as mutable Kotlin collections (`MutableList`) or function types (`kotlin.Function1`, `kotlin.Function2`, and so on).
* There are at least two conditions besides `else`.
* All branches check the same subject of the `when` expression.

For example:

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // Uses invokedynamic with SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

With the new feature enabled, the `when` expression in this example compiles to a single `invokedynamic` type switch
instead of multiple `instanceof` checks.

To enable this feature, compile your Kotlin code with JVM target 21 or above and add the following compiler option:

```bash
-Xwhen-expressions=indy
```

Or add it to the `compilerOptions {}` block of your `build.gradle.kts` file:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

This feature is [Experimental](components-stability.md#stability-levels-explained). If you have any feedback or questions, share them in [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688).

## Kotlin/Native

Kotlin %kotlinEapVersion% brings improvements for Kotlin/Native binaries and debugging.

### Support for stack canaries in binaries

Starting with %kotlinEapVersion%, Kotlin adds support for stack canaries in the resulting Kotlin/Native binaries. As part of
stack protection, this security feature protects against stack smashing, mitigating some common application vulnerabilities.
Already available in Swift and Objective-C, it's now supported in Kotlin as well.

#### How to enable stack canaries

The implementation of stack protection in Kotlin/Native follows the behavior of the stack protector in [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector).

To enable stack canaries, add the following property to your `gradle.properties` file:

```none
kotlin.native.binary.stackProtector=yes
```

The property enables the feature for all the Kotlin functions that are vulnerable to stack smashing. Alternative modes are:

* `kotlin.native.binary.stackProtector=strong`, which uses a stronger heuristic for the functions vulnerable to stack smashing.
* `kotlin.native.binary.stackProtector=all`, which enables stack protectors for all functions.

Note that in some cases, stack protection might come with a performance cost.

### Smaller binary size for iOS targets
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% introduces the `smallBinary` option that can help you decrease the binary size for iOS targets.
The new option effectively sets `-Oz` as the default optimization argument for the compiler during the LLVM compilation phase.

With the `smallBinary` option enabled, you can make release binaries smaller and improve build time. However, it might
affect runtime performance in some cases.

#### How to enable smaller binary size

The new feature is currently [Experimental](components-stability.md#stability-levels-explained). To try it out in your
project, use the `-Xbinary=smallBinary=true` compiler option or update your `gradle.properties` file with:

```none
kotlin.native.binary.smallBinary=true
```

For a specific binary, set the `binaryOption("smallBinary", "true")` in your `build.gradle.kts` file. For example:

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach {
        it.binaries.framework {
            binaryOption("smallBinary", "true")
        }
    }
}
```

The Kotlin team is grateful to [Troels Lund](https://github.com/troelsbjerre) for his help in implementing this feature.

### Improved debugger object summaries

Kotlin/Native now generates clearer object summaries for debugger tools like LLDB and GDB. This improves the
readability of the produced debug information and streamlines your debugging experience.

Previously, if you inspected an object such as:

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

You'd see limited information, including a pointer to the memory address:

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

With Kotlin %kotlinEapVersion%, the debugger shows richer details, including the actual values:

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

The Kotlin team is grateful to [Nikita Nazarov](https://github.com/nikita-nazarov) for his help in implementing this feature.

For more information on debugging in Kotlin/Native, see the [documentation](native-debugging.md).

## Kotlin/Wasm: separated npm dependencies

Previously, in your Kotlin/Wasm projects, all [npm](https://www.npmjs.com/) dependencies were installed together in your
project folder. It included both your own dependencies and Kotlin tooling dependencies. These dependencies were also recorded
together in your project's lock files (`package-lock.json` or `yarn.lock`).

As a result, whenever Kotlin tooling dependencies were updated, you had to update your lock files even if you didn't add
or change anything.

Starting from Kotlin %kotlinEapVersion%, the Kotlin tooling npm dependencies are installed outside your project. Now, the
tooling and the user dependencies have separate directories:

* **Tooling dependencies' directory:**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **User dependencies' directory:**

  `build/wasm/node_modules`

Also, the lock files inside the project directory contain only user-defined dependencies.

This improvement keeps your lock files focused only on your own dependencies, helps maintain a cleaner project, and
reduces unnecessary changes to your files.

This change is enabled by default for the `wasm-js` target. The change is not yet implemented for the `js` target. While
there are plans to implement it in future releases, the behavior of the npm dependencies remains the same for the `js`
target in Kotlin %kotlinEapVersion%.

## Kotlin/JS: new DSL function for cleaner arguments

When running a Kotlin/JS application with Node.js, the arguments passed to your program (`args`) used to include:

* The path to the executable `Node`.
* The path to your script.
* The actual command-line arguments you provided.

However, the expected behavior for `args` was to include only the command-line arguments. To achieve this, you had to
manually skip the first two arguments using the `drop()` function inside your `build.gradle.kts` file or in your Kotlin code:

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

This workaround was repetitive, error-prone, and didn't work well when sharing code between platforms.

To fix this issue, Kotlin %kotlinEapVersion% introduces a new DSL function called `passCliArgumentsToMainFunction()`.

With this function, the arguments only include the command-line arguments and exclude the `Node` and script paths:

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

This change reduces boilerplate code, avoids mistakes caused by manually dropping arguments, and improves cross-platform compatibility.

To enable this feature, add the following DSL function inside your `build.gradle.kts` file:

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```