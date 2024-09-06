[//]: # (title: What's new in Kotlin 1.7.20)

<tldr>
   <p>The IDE support for Kotlin 1.7.20 is available for IntelliJ IDEA 2021.3, 2022.1, and 2022.2.</p>
</tldr>

_[Released: 29 September 2022](releases.md#release-details)_

The Kotlin 1.7.20 release is out! Here are some highlights from this release:

* [The new Kotlin K2 compiler supports `all-open`, SAM with receiver, Lombok, and other compiler plugins](#support-for-kotlin-k2-compiler-plugins)
* [We introduced the preview of the `..<` operator for creating open-ended ranges](#preview-of-the-operator-for-creating-open-ended-ranges)
* [The new Kotlin/Native memory manager is now enabled by default](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [We introduced a new experimental feature for JVM: inline classes with a generic underlying type](#generic-inline-classes)

You can also find a short overview of the changes in this video:

<video src="https://youtu.be/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## Support for Kotlin K2 compiler plugins

The Kotlin team continues to stabilize the K2 compiler.
K2 is still in **Alpha** (as announced in the [Kotlin 1.7.0 release](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)),
but it now supports several compiler plugins. You can follow [this YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604)
to get updates from the Kotlin team on the new compiler.

Starting with this 1.7.20 release, the Kotlin K2 compiler supports the following plugins:

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> The Alpha version of the new K2 compiler only works with JVM projects.
> It doesn't support Kotlin/JS, Kotlin/Native, or other multiplatform projects.
>
{style="warning"}

Learn more about the new compiler and its benefits in the following videos:
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### How to enable the Kotlin K2 compiler

To enable the Kotlin K2 compiler and test it, use the following compiler option:

```bash
-Xuse-k2
```

You can specify it in your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

Check out the performance boost on your JVM projects and compare it with the results of the old compiler.

### Leave your feedback on the new K2 compiler

We really appreciate your feedback in any form:
* Provide your feedback directly to K2 developers in Kotlin Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) and join the [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) channel.
* Report any problems you faced with the new K2 compiler to [our issue tracker](https://kotl.in/issue).
* [Enable the **Send usage statistics** option](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) to allow JetBrains collecting anonymous data about K2 usage.

## Language

Kotlin 1.7.20 introduces preview versions for new language features, as well as puts restrictions on builder type inference:

* [Preview of the ..< operator for creating open-ended ranges](#preview-of-the-operator-for-creating-open-ended-ranges)
* [New data object declarations](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [Builder type inference restrictions](#new-builder-type-inference-restrictions)

### Preview of the ..< operator for creating open-ended ranges

> The new operator is [Experimental](components-stability.md#stability-levels-explained), and it has limited support in the IDE.
>
{style="warning"}

This release introduces the new `..<` operator. Kotlin has the `..` operator to express a range of values. The new `..<`
operator acts like the `until` function and helps you define the open-ended range.

<video src="https://youtu.be/v0AHdAIBnbs" title="New operator for open-ended ranges"/>

Our research shows that this new operator does a better job at expressing open-ended ranges and making it clear that the
upper bound is not included.

Here is an example of using the `..<` operator in a `when` expression:

```kotlin
when (value) {
    in 0.0..<0.25 -> // First quarter
    in 0.25..<0.5 -> // Second quarter
    in 0.5..<0.75 -> // Third quarter
    in 0.75..1.0 ->  // Last quarter  <- Note closed range here
}
```
{validate="false"}

#### Standard library API changes

The following new types and operations will be introduced in the `kotlin.ranges` packages in the common Kotlin standard
library:

##### New OpenEndRange&lt;T&gt; interface

The new interface to represent open-ended ranges is very similar to the existing `ClosedRange<T>` interface:

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // Lower bound
    val start: T
    // Upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### Implementing OpenEndRange in the existing iterable ranges

When developers need to get a range with an excluded upper bound, they currently use the `until` function to effectively
produce a closed iterable range with the same values. To make these ranges acceptable in the new API that takes `OpenEndRange<T>`,
we want to implement that interface in the existing iterable ranges: `IntRange`, `LongRange`, `CharRange`, `UIntRange`,
and `ULongRange`. So they will simultaneously implement both the `ClosedRange<T>` and `OpenEndRange<T>` interfaces.

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### rangeUntil operators for the standard types

The `rangeUntil` operators will be provided for the same types and combinations currently defined by the `rangeTo` operator.
We provide them as extension functions for prototype purposes, but for consistency, we plan to make them members later
before stabilizing the open-ended ranges API.

#### How to enable the `..<` operator

To use the `..<` operator or to implement that operator convention for your own types, enable the `-language-version 1.8`
compiler option.

The new API elements introduced to support the open-ended ranges of the standard types require an opt-in, as usual for
an experimental stdlib API: `@OptIn(ExperimentalStdlibApi::class)`. Alternatively, you could use
the `-opt-in=kotlin.ExperimentalStdlibApi` compiler option.

[Read more about the new operator in this KEEP document](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md).

### Improved string representations for singletons and sealed class hierarchies with data objects

> Data objects are [Experimental](components-stability.md#stability-levels-explained), and have limited support in the IDE at the moment.
>
{style="warning"}

This release introduces a new type of `object` declaration for you to use: `data object`. [Data object](https://youtrack.jetbrains.com/issue/KT-4107)
behaves conceptually identical to a regular `object` declaration but comes with a clean `toString` representation out of the box.

<video src="https://youtu.be/ovAqcwFhEGc" title="Data objects in Kotlin 1.7.20"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

This makes `data object` declarations perfect for sealed class hierarchies, where you may use them alongside `data class`
declarations. In this snippet, declaring `EndOfFile` as a `data object` instead of a plain `object` means that it will
get a pretty `toString` without the need to override it manually, maintaining symmetry with the accompanying `data class`
definitions:

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

#### How to enable data objects

To use data object declarations in your code, enable the `-language-version 1.9` compiler option. In a Gradle project,
you can do so by adding the following to your `build.gradle(.kts)`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

Read more about data objects, and share your feedback on their implementation in the [respective KEEP document](https://github.com/Kotlin/KEEP/pull/316).

### New builder type inference restrictions

Kotlin 1.7.20 places some major restrictions on the [use of builder type inference](using-builders-with-builder-inference.md)
that could affect your code. These restrictions apply to code containing builder lambda functions, where it's impossible
to derive the parameter without analyzing the lambda itself. The parameter is used as an argument. Now, the compiler will
always show an error for such code and ask you to specify the type explicitly.

This is a breaking change, but our research shows that these cases are very rare, and the restrictions shouldn't affect
your code. If they do, consider the following cases:

* Builder inference with extension that hides members.

  If your code contains an extension function with the same name that will be used during the builder inference,
  the compiler will show you an error:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
    {validate="false"} 
  
  To fix the code, you should specify the type explicitly:

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // Resolves to 1
        }
    }
    ```

* Builder inference with multiple lambdas and the type arguments are not specified explicitly.

  If there are two or more lambda blocks in builder inference, they affect the type. To prevent an error, the compiler
  requires you to specify the type:

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  To fix the error, you should specify the type explicitly and fix the type mismatch:

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

If you haven't found your case mentioned above, [file an issue](https://kotl.in/issue) to our team.

See this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797) for more information about this builder inference update.

## Kotlin/JVM

Kotlin 1.7.20 introduces generic inline classes, adds more bytecode optimizations for delegated properties, and supports
IR in the kapt stub generating task, making it possible to use all the newest Kotlin features with kapt:

* [Generic inline classes](#generic-inline-classes)
* [More optimized cases of delegated properties](#more-optimized-cases-of-delegated-properties)
* [Support for the JVM IR backend in kapt stub generating task](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### Generic inline classes

> Generic inline classes is an [Experimental](components-stability.md#stability-levels-explained) feature.
> It may be dropped or changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994).
>
{style="warning"}

Kotlin 1.7.20 allows the underlying type of JVM inline classes to be a type parameter. The compiler maps it to `Any?` or,
generally, to the upper bound of the type parameter.

<video src="https://youtu.be/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

Consider the following example:

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

The function accepts the inline class as a parameter. The parameter is mapped to the upper bound, not the type argument.

To enable this feature, use the `-language-version 1.8` compiler option.

We would appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994).

### More optimized cases of delegated properties

In Kotlin 1.6.0, we optimized the case of delegating to a property by omitting the `$delegate` field and [generating
immediate access to the referenced property](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance). In 1.7.20, we've implemented this optimization for more cases.
The `$delegate` field will now be omitted if a delegate is:

* A named object:

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* A final `val` property with a [backing field](properties.md#backing-fields) and a default getter in the same module:

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* A constant expression, an enum entry, `this`, or `null`. Here's an example of `this`:

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

Learn more about [delegated properties](delegated-properties.md).

We would appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397).

### Support for the JVM IR backend in kapt stub generating task

> Support for the JVM IR backend in the kapt stub generating task is an [Experimental](components-stability.md) feature.
> It may be changed at any time. Opt-in is required (see details below), and you should use it only for evaluation purposes.
>
{style="warning"}

Before 1.7.20, the kapt stub generating task used the old backend, and [repeatable annotations](annotations.md#repeatable-annotations)
didn't work with [kapt](kapt.md). With Kotlin 1.7.20, we've added support for the [JVM IR backend](whatsnew15.md#stable-jvm-ir-backend)
in the kapt stub generating task. This makes it possible to use all the newest Kotlin features with kapt, including
repeatable annotations.

To use the IR backend in kapt, add the following option to your `gradle.properties` file:

```none
kapt.use.jvm.ir=true
```

We would appreciate your feedback on this feature in [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682).

## Kotlin/Native

Kotlin 1.7.20 comes with the new Kotlin/Native memory manager enabled by default and gives you the option to customize
the `Info.plist` file:

* [The new default memory manager](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [Customizing the Info.plist file](#customizing-the-info-plist-file)

### The new Kotlin/Native memory manager enabled by default

This release brings further stability and performance improvements to the new memory manager, allowing us to promote the
new memory manager to [Beta](components-stability.md).

The previous memory manager complicated writing concurrent and asynchronous code, including issues with implementing the
`kotlinx.coroutines` library. This blocked the adoption of Kotlin Multiplatform Mobile because concurrency limitations
created problems with sharing Kotlin code between iOS and Android platforms. The new memory manager finally paves the way
to [promote Kotlin Multiplatform Mobile to Beta](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/).

The new memory manager also supports the compiler cache that makes compilation times comparable to previous releases.
For more on the benefits of the new memory manager, see our original [blog post](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)
for the preview version. You can find more technical details in the [documentation](native-memory-manager.md).

#### Configuration and setup

Starting with Kotlin 1.7.20, the new memory manager is the default. Not much additional setup is required.

If you've already turned it on manually, you can remove the `kotlin.native.binary.memoryModel=experimental` option from
your `gradle.properties` or `binaryOptions["memoryModel"] = "experimental"` from the `build.gradle(.kts)` file.

If necessary, you can switch back to the legacy memory manager with the `kotlin.native.binary.memoryModel=strict` option
in your `gradle.properties`. However, compiler cache support is no longer available for the legacy memory manager,
so compilation times might worsen.

#### Freezing

In the new memory manager, freezing is deprecated. Don't use it unless you need your code to work with the legacy manager
(where freezing is still required). This may be helpful for library authors that need to maintain support for the legacy
memory manager or developers who want to have a fallback if they encounter issues with the new memory manager.

In such cases, you can temporarily support code for both new and legacy memory managers. To ignore deprecation warnings,
do one of the following:

* Annotate usages of the deprecated API with `@OptIn(FreezingIsDeprecated::class)`.
* Apply `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` to all the Kotlin source sets in Gradle.
* Pass the compiler flag `-opt-in=kotlin.native.FreezingIsDeprecated`.

#### Calling Kotlin suspending functions from Swift/Objective-C

The new memory manager still restricts calling Kotlin `suspend` functions from Swift and Objective-C from threads other
than the main one, but you can lift it with a new Gradle option.

This restriction was originally introduced in the legacy memory manager due to cases where the code dispatched a continuation
to be resumed on the original thread. If this thread didn't have a supported event loop, the task would never run,
and the coroutine would never be resumed.

In certain cases, this restriction is no longer required, but a check of all the necessary conditions can't be easily
implemented. Because of this, we decided to keep it in the new memory manager while introducing an option for you to disable
it. For this, add the following option to your `gradle.properties`:

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> Do not add this option if you use the `native-mt` version of `kotlinx.coroutines` or other libraries that have the same
> "dispatch to the original thread" approach.
>
{style="warning"}

The Kotlin team is very grateful to [Ahmed El-Helw](https://github.com/ahmedre) for implementing this option.

#### Leave your feedback

This is a significant change to our ecosystem. We would appreciate your feedback to help make it even better.

Try the new memory manager on your projects and [share feedback in our issue tracker, YouTrack](https://youtrack.jetbrains.com/issue/KT-48525).

### Customizing the Info.plist file

When producing a framework, the Kotlin/Native compiler generates the information property list file, `Info.plist`.
Previously, it was cumbersome to customize its contents. With Kotlin 1.7.20, you can directly set the following properties:

| Property                     | Binary option              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

To do that, use the corresponding binary option. Pass the
`-Xbinary=$option=$value` compiler flag or set the `binaryOption(option, value)` Gradle DSL for the necessary framework.

The Kotlin team is very grateful to Mads Ager for implementing this feature.

## Kotlin/JS

Kotlin/JS has received some enhancements that improve the developer experience and boost performance:

* Klib generation is faster in both incremental and clean builds, thanks to efficiency improvements for the loading of dependencies.
* [Incremental compilation for development binaries](js-ir-compiler.md#incremental-compilation-for-development-binaries)
  has been reworked, resulting in major improvements in clean build scenarios, faster incremental builds, and stability fixes.
* We've improved `.d.ts` generation for nested objects, sealed classes, and optional parameters in constructors.

## Gradle

The updates for the Kotlin Gradle plugin are focused on compatibility with the new Gradle features and the latest Gradle
versions.

Kotlin 1.7.20 contains changes to support Gradle 7.1. Deprecated methods and properties were removed or replaced,
reducing the number of deprecation warnings produced by the Kotlin Gradle plugin and unblocking future support for Gradle 8.0.

There are, however, some potentially breaking changes that may need your attention:

### Target configuration

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` now has a generic parameter, `SingleTargetExtension<T : KotlinTarget>`.
* The `kotlin.targets.fromPreset()` convention has been deprecated. Instead, you can still use `kotlin.targets { fromPreset() }`,
  but we recommend using more [specialized ways to create targets](multiplatform-set-up-targets.md).
* Target accessors auto-generated by Gradle are no longer available inside the `kotlin.targets { }` block. Please use the `findByName("targetName")`
  method instead.

  Note that such accessors are still available in the case of `kotlin.targets`, for example, `kotlin.targets.linuxX64`.

### Source directories configuration

The Kotlin Gradle plugin now adds Kotlin `SourceDirectorySet` as a `kotlin` extension to Java's `SourceSet` group.
This makes it possible to configure source directories in the `build.gradle.kts` file similarly to how they are configured
in [Java, Groovy, and Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl):

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

You no longer need to use a deprecated Gradle convention and specify the source directories for Kotlin.

Remember that you can also use the `kotlin` extension to access `KotlinSourceSet`:

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### New method for JVM toolchain configuration

This release provides a new `jvmToolchain()` method for enabling the [JVM toolchain feature](gradle-configure-project.md#gradle-java-toolchains-support).
If you don't need any additional [configuration fields](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html),
such as `implementation` or `vendor`, you can use this method from the Kotlin extension:

```kotlin
kotlin {
    jvmToolchain(17)
}
```

This simplifies the Kotlin project setup process without any additional configuration.
Before this release, you could specify the JDK version only in the following way:

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## Standard library

Kotlin 1.7.20 offers new [extension functions](extensions.md#extension-functions) for the `java.nio.file.Path` class, which allows you to walk through a file tree:

* `walk()` lazily traverses the file tree rooted at the specified path.
* `fileVisitor()` makes it possible to create a `FileVisitor` separately. `FileVisitor` defines actions on directories
  and files when traversing them.
* `visitFileTree(fileVisitor: FileVisitor, ...)` consumes a ready `FileVisitor` and uses `java.nio.file.Files.walkFileTree()`
  under the hood.
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` creates a `FileVisitor` with the `builderAction` and
  calls the `visitFileTree(fileVisitor, ...)` function.
* `FileVisitResult`, return type of `FileVisitor`, has the `CONTINUE` default value that continues the processing of the
  file.

> The new extension functions for `java.nio.file.Path` are [Experimental](components-stability.md).
> They may be changed at any time. Opt-in is required (see details below), and you should use them only for evaluation purposes.
>
{style="warning"}

Here are some things you can do with these new extension functions:

* Explicitly create a `FileVisitor` and then use:

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* Create a `FileVisitor` with the `builderAction` and use it immediately:

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes ->
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* Traverse a file tree rooted at the specified path with the `walk()` function:

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ ->
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // Use walk function:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  //sampleEnd
  }
  ```

As is usual for an experimental API, the new extensions require an opt-in: `@OptIn(kotlin.io.path.ExperimentalPathApi::class)`
or `@kotlin.io.path.ExperimentalPathApi`. Alternatively, you can use a compiler option: `-opt-in=kotlin.io.path.ExperimentalPathApi`.

We would appreciate your feedback on the [`walk()` function](https://youtrack.jetbrains.com/issue/KT-52909) and the
[visit extension functions](https://youtrack.jetbrains.com/issue/KT-52910) in YouTrack.

## Documentation updates

Since the previous release, the Kotlin documentation has received some notable changes:

### Revamped and improved pages

* [Basic types overview](basic-types.md) – learn about the basic types used in Kotlin: numbers, Booleans, characters, strings, arrays, and unsigned integer numbers.
* [IDEs for Kotlin development](kotlin-ide.md) – see the list of IDEs with official Kotlin support and tools that have community-supported plugins.

### New articles in the Kotlin Multiplatform journal

* [Native and cross-platform app development: how to choose?](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – check out our overview and advantages of cross-platform app development and the native approach.
* [The six best cross-platform app development frameworks](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – read about the key aspects to help you choose the right framework for your cross-platform project.

### New and updated tutorials

* [Get started with Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – learn about cross-platform mobile development with Kotlin and create an app that works on both Android and iOS.
* [Build a web application with React and Kotlin/JS](js-react.md) – create a browser app exploring Kotlin's DSLs and features of a typical React program.

### Changes in release documentation

We no longer provide a list of recommended kotlinx libraries for each release. This list included only the versions
recommended and tested with Kotlin itself. It didn't take into account that some libraries depend on each other and require
a special kotlinx version, which may differ from the recommended Kotlin version.

We're working on finding a way to provide information on how libraries interrelate and depend on each other so that it
will be clear which kotlinx library version you should use when you upgrade the Kotlin version in your project.

## Install Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3, 2022.1, and 2022.2 automatically suggest updating the Kotlin plugin to 1.7.20.

> For Android Studio Dolphin (213), Electric Eel (221), and Flamingo (222), the Kotlin plugin 1.7.20 will be delivered
> with upcoming Android Studios updates.
>
{style="note"}

The new command-line compiler is available for download on the [GitHub release page](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20).

### Compatibility guide for Kotlin 1.7.20

Although Kotlin 1.7.20 is an incremental release, there are still incompatible changes we had to make
to limit spread of the issues introduced in Kotlin 1.7.0.

Find the detailed list of such changes in the [Compatibility guide for Kotlin 1.7.20](compatibility-guide-1720.md).
