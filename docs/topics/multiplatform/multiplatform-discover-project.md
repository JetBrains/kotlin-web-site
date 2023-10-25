[//]: # (title: The basics of Kotlin Multiplatform project structure)

With Kotlin Multiplatform, you can share code among different platforms. The setup of such projects might look confusing
at first.

This article explains the constraints of the shared code, how to distinguish between shared and platform-specific parts
of your code, and how to specify the platforms this shared code works on.

You'll also learn the core concepts of Kotlin Multiplatform project setup, such as common code, targets,
platform-specific and intermediate source sets, and test integration.

The model presented here is simplified compared to the one actually used by Kotlin. However, the basic model should be
enough for the majority of popular cases.

## Common code

_Common code_ is the Kotlin code shared among different platforms.

Consider the simple "Hello, World" example and see what it looks like when set up for several platforms:

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

Kotlin code shared among platforms is typically located in the `commonMain` directory. The location of code files is
important: it defines the list of platforms this code is compiled to.

The Kotlin compiler gets the source code as input and produces a set of platform-specific binaries as a result. When
compiling multiplatform projects, it can produce multiple binaries from the same code. For example, the compiler can
produce JVM `.classfiles` and native executable files from the same Kotlin file:

![Common code](common-code-diagram.svg){width=700}

Not every piece of Kotlin code can be compiled to all the platforms. The Kotlin compiler prevents you from using
platform-specific functions or classes in your common code since this code can't be compiled to a different platform.

For instance, you can't use `java.io.File` dependency from the common code because it can't be compiled to native
platforms:

![Unresolved Java reference](unresolved-java-reference.png){width=500}

In common code, you can use Kotlin Multiplatform libraries. Such libraries provide a common API that can be implemented
differently on different platforms. In this case, platform-specific APIs serve as extra parts, and trying to use such an
API in common code results in an error.

For example, `kotlinx.coroutines` is a Kotlin Multiplatform library that supports all the targets, but it also has a
platform-specific part that converts `kotlinx.coroutines` concurrent primitives to the JDK concurrent primitives,
like `fun CoroutinesDispatcher.asExecutor(): Executor`. This additional part of the API won't be available
in `commonMain`.

## Targets

Targets define the platforms to which Kotlin compiles the common code. These could be, for example, JVM, JS, Android,
iPhone devices, or Linux desktops. The previous example compiled the common code to JVM and "native". This is how the
Kotlin compiler understands that you want to compile to exactly those platforms.

A _Kotlin target_ is an identificator that describes a compilation target. It defines the format of the produced
binaries, available language constructions, and allowed dependencies.

> Sometimes, targets are referred to as "platforms''. See the
> full [list of supported targets](multiplatform-dsl-reference.md#targets).
>
> {type="note"}

You should first _declare_ a target to instruct Kotlin to compile code for that specific target. In Gradle, you declare
targets using predefined DSL calls inside the `kotlin {}` block:

```kotlin
kotlin {
    jvm() // Declares a JVM target
    iosArm64() // Declares a target that corresponds to 64-bit iPhones
}
```

This way, each multiplatform project defines a set of supported targets. See
the [Multiplatform hierarchy](multiplatform-hierarchy.md) section to learn more about declaring targets in your build
scripts.

Since you declared two targets, `jvm` and `iosArm64`, the common code in `commonMain` will be compiled to these targets:

![Targets](target-diagram.svg){width=700}

To understand which code is going to be compiled to a specific target, you can think of a target as a "label" attached
to Kotlin source files. Kotlin uses these "labels" to determine how to compile your code, which binaries to produce, and
which language constructions and dependencies are allowed in that code.

If you want to compile the `greeting.kt` file to `.js` as well, you only need to declare the JS target. The code
in `commonMain` then receives an additional `js` label, corresponding to the JS target, and that instructs Kotlin to
produce `.js` files:

![Target labels](target-labels-diagram.svg){width=700}

That's how the Kotlin compiler works with the common code that is compiled to all the declared targets.
See [Source sets](#source-sets) to learn how to write the platform-specific code.

## Source sets

A _Kotlin source set_ is a set of source files with its own targets, dependencies, and compiler options. It's the main
way for sharing code in multiplatform projects.

Each source set in a multiplatform project:

* Has a name that is unique in a given project.
* Contains a set of source files and resources, usually stored in the directory with the source set's name.
* Specifies a set of targets to which the code in this source set compiles. These targets impact which language
  constructions and dependencies are available in this source set.
* Defines its own dependencies and the compiler options.

Kotlin provides a bunch of predefined source sets. One of them is `commonMain`, which is present in all multiplatform
projects and compiles to all declared targets.

You interact with source sets as directories inside `src` in Kotlin Multiplatform projects:

![Shared sources](src-directory-diagram.png){width=350}

In Gradle scripts, you access source sets by their name inside the `kotlin.sourceSets {}` block:

```kotlin
kotlin {
    // Targets declaration:
    // …

    // Source set declaration:
    sourceSets {
        commonMain {
            // configure the commonMain source set
        }
    }
}
```

Source sets can be platform-specific or so-called "intermediate".

### Platform-specific source sets

While having only common code is convenient, it’s not always possible. Code in `commonMain` compiles to all the declared
targets, and Kotlin doesn't allow you to use any platform-specific APIs there.

In an example targeting native and JS, the following code in `commonMain` doesn't compile:

```kotlin
// commonMain/kotlin/common.kt
// Doesn't compile in common code
fun common() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

To solve that, Kotlin creates platform-specific source sets or platform source sets. Each target has a corresponding
platform source set that compiles only for that target. For example, `jvm` target has the corresponding `jvmMain` source
set that compiles only to JVM. Knowing that Kotlin allows using platform-specific dependencies in such source sets, for
instance, JDK in `jvmMain`:

```kotlin
// jvmMain/kotlin/jvm.kt
// You can use Java dependencies in the `jvmMain` source set
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### Compilation to a specific target

Here’s how the compilation to a specific target works with multiple source sets. When Kotlin compiles a multiplatform
project to a specific target, it collects all source sets “labeled” with this target and produces binaries from them.

Consider an example with `jvm`, `iosArm64`, and `js` targets. Kotlin creates the `commonMain` source set for common code
and the corresponding `jvmMain`, `iosArm64Main`, and `jsMain `source sets for specific targets:

![Compilation to a specific target](specific-target-diagram.svg){width=700}

During compilation to JVM, Kotlin selects all source sets labeled with JVM, namely, `jvmMain` and `commonMain`. It then
compiles them together to the JVM class files:

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

Because Kotlin compiles `commonMain` and `jvmMain` together, the resulting binaries contain declarations from
both `commonMain` and `jvmMain`. This is how you can choose which parts of your application should be shared.

When working with multiplatform projects, remember:

* If you want Kotlin to compile your code for a specific platform, declare a corresponding target.
* To choose a directory or source file to store the code, first decide among which targets you want to share your code:
* If the code is shared among all targets, it should be declared in `commonMain`.
* If the code is used only for one target, it should be defined in a specific source set for that target (for
  example, `jvmMain` for JVM).
* Code written in platform-specific source sets can access declarations from the common source set. For example, the
  code in `jvmMain` can use code from `commonMain`. The opposite isn't true: `commonMain` can't use code from `jvmMain`.
* Code written in platform-specific source sets can use the corresponding platform dependencies. For example, the code
  in `jvmMain` can use Java-only libraries, like [Guava](https://github.com/google/guava)
  or [Spring](https://spring.io/).

### Intermediate source sets

In simple multiplatform projects, only common code is shared among all available platforms and platform-specific code.
In practice, you often need more granular code sharing.

Consider an example when you need to target all modern Apple devices and Android devices:

```kotlin
kotlin {
    android()
    iosArm64()         // 64-bit iPhone devices
    macosArm64()   // Modern Apple Silicon-based Macs
    watchosX64()    // Modern 64-bit Apple Watch devices
    tvosArm64()       // Modern Apple TV devices  
}
```

And you need a source set to add the function that generates UUID for all Apple devices:

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // You want to access Apple-specific APIs
    return NSUUID().UUIDString()
}
```

You can't add this function to `commonMain`. Indeed, `commonMain` is compiled to all declared targets, including
Android. `platform.Foundation.NSUUID` is an Apple-specific API, not available on Android. Kotlin shows an error if you
try to reference it in `commonMain`.

You could copy and paste this code to each Apple-specific source
set: `iosArm64Main`, `macosArm64Main`, `watchosX64Main`, and `tvosArm64Main`. But it's not recommended, as code
duplication is always error-prone.

To solve this issue, you can use _intermediate source sets_. An intermediate source set is a Kotlin source set that
compiles to some, but not all the targets in the project. Sometimes, you can also see intermediate source sets referred
to as "hierarchical source sets" or "hierarchies".

Kotlin creates some intermediate source sets by default. In this specific case, the resulting project structure will
look like this:

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

Here, grey blocks at the bottom are platform-specific source sets (target labels are hidden on them for clarity).
The yellow block is an intermediate source set `appleMain` created by Kotlin for sharing code compiled to Apple-specific
targets.

The `appleMain` source set compiles to only Apple targets. Therefore, Kotlin allows using Apple-specific APIs
in `appleMain`, and you can add the `randomUUID()` function here.

> See [Hierarchical project structure](multiplatform-hierarchy.md) to find
> all intermediate source sets that Kotlin creates and sets up by default. This article also explains what you should do
> if the intermediate source set you need in your application isn't provided by default by Kotlin.
>
{type="tip"}

During compilation to a specific target, Kotlin gets all the source sets labeled with this target. That includes all the
intermediate source sets labeled with this target. Therefore, all the code written in the `commonMain`, `appleMain`,
and `iosArm64Main` source sets is combined during the compilation to the `iosArm64` platform target:

![Native executables](native-executables-diagram.svg){width=700}

> It's absolutely fine if some source sets don't have sources. For example, in iOS development, there’s usually no need
> to provide code that is specific for iPhone devices but not for iPhone simulators. Therefore, `iosArm64Main` is rarely
> used.
>
{type="tip"}

#### Apple device and simulator targets {initial-collapse-state="collapsed"}

When you use Kotlin Multiplatform to develop iOS mobile applications, you usually work with the `iosMain` source set.
You might think it's a platform-specific source set for the `ios` target. In fact, there's no single `ios` target, most
mobile projects need at least two:

* **Device target** is used to generate binaries that can be executed on iPhone devices. At the moment, there's only one
  device target for iPhones, `iosArm64`.
* **Simulator target** is used to generate binaries for the iOS simulator launched on your machine. If you have an Apple
  silicon Mac computer, choose `iosSimulatorArm64` as a simulator target, and `iosX64` if you have an Intel-based Mac
  computer.

If you only declare the `iosArm64` device target, you won't be able to run and debug your application and tests on your
local machine.

Platform-specific source sets like `iosArm64Main`, `iosSimulatorArm64Main`, and `iosX64Main` are usually empty, as
Kotlin code for iOS devices and simulators is normally the same. So you can use only the `iosMain` intermediate source
set to share code among all of them.

The same applies to other non-Mac Apple targets. For example, if you have the `tvosArm64` device target for Apple TV and
the `tvosSimulatorArm64` and `tvosX64` simulator targets for Apple TV simulators on Apple silicon and Intel-based
devices, respectively, you can use the `tvosMain` intermediate source set for all of them.

## Integration with tests

Real-life projects also require tests alongside the "main" production code. This is why all source sets created by
default have the `Main` and `Test` prefixes. `Main` contains production code, while `Test` contains tests for this code.
The connection between them is established automatically, and tests can use the API provided by the `Main` code without
additional configuration.

The `Test` counterparts are also source sets similar to `*Main`. For example, `commonTest` is a counterpart
for `commonMain` and compiles to all the declared targets, allowing you to write common tests.Platform-specific test
source sets, such as `jvmTest`, are used to write platform-specific tests. For example, JVM-specific tests or tests that
need JVM APIs.

Besides having a source set to write your common test, you also need some multiplatform testing framework. Kotlin
provides a default [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test) library, which comes with
the `@kotlin.Test` annotation and various assertion methods like `assertEquals` and `assertTrue`.

You can write platform-specific tests like regular tests for each platform in their respective source sets. Like with
the main code, you can have platform-specific dependencies for each source set, such as `JUnit` for JVM and `XCTest` for
iOS. To run tests for a particular target, use the `<targetName>Test` task.

Learn how to create and run multiplatform tests in the [Test your multiplatform app
tutorial](multiplatform-run-tests.md).

## What's next?

* [Learn more about declaring and using predefined source sets in Gradle scripts](multiplatform-hierarchy.md)
* [Learn how to configure compilations](multiplatform-configure-compilations.md)

<!-- Learn how to create custom intermediate source sets and work with low-level abstractions of the Gradle build process, such as tasks, configurations, and outputs-->