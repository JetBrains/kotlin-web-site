[//]: # (title: Interoperability with Swift using Swift export)

<primary-label ref="alpha"/>

Kotlin's interoperability with Swift through Swift export is currently in Alpha. Swift export allows you to export Kotlin sources
directly and call Kotlin code from Swift idiomatically, eliminating the need for Objective-C headers.

Swift export makes multiplatform development for Apple targets more streamlined. For example, if you have a Kotlin module
with top-level functions, Swift export enables clean, module-specific imports, removing the confusing Objective-C
underscores and mangled names.

Current Swift export features are:

* **Multi-module support**. Each Kotlin module is exported as a separate Swift module, simplifying function calls.
* **Package support**. Kotlin packages are explicitly preserved during export, avoiding naming conflicts in the
  generated Swift code.
* **Type aliases**. Kotlin type aliases are exported and preserved in Swift, improving readability.
* **Enhanced nullability for primitives**. Unlike Objective-C interop, which required boxing types like `Int?` into
  wrapper classes like `KotlinInt` to preserve nullability, Swift export converts nullability information directly.
* **Overloads**. You can call Kotlin's overloaded functions in Swift without ambiguity.
* **Flattened package structure**. You can translate Kotlin packages into Swift enums, removing the package prefix from
  generated Swift code.
* **Module name customization**. You can customize the resulting Swift module names in the Gradle configuration of your
  Kotlin project.
* **Concurrency support**. You can seamlessly call suspending Kotlin code from Swift and export `kotlinx.coroutines`
  flows as Swift's `AsyncSequence` out of the box.

## Enable Swift export

Swift export is currently in [Alpha](components-stability.md#stability-levels-explained) and still incomplete, so breaking changes are expected.
To try it out, [configure the build file](#configure-kotlin-project) in your Kotlin project and [set up Xcode](#configure-xcode-project)
to integrate Swift export.

### Configure Kotlin project

You can use the following build file in your project as a starting point for setting up Swift export:

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Set the root module name
        moduleName = "Shared"

        // Set the collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Configure external modules export
        export(project(":subproject")) {
            // Set the name for the exported module 
            moduleName = "Subproject"
            // Set the collapse rule for the exported dependency 
            flattenPackage = "com.subproject.library"
        }

        // Provide compiler arguments to link tasks
        configure {
            freeCompilerArgs.add("-Xexpect-actual-classes")
        }
    }
}
```

The Kotlin compiler automatically generates all the necessary files (including `swiftmodule` files,
static `.a` library, a header file, and a `modulemap` file) and copies them into the app's build directory, which you can
access from Xcode.

> You can also clone our [public sample](https://github.com/Kotlin/swift-export-sample) with Swift export already set up.
>
{style="tip"}

### Configure Xcode project

To configure Xcode to integrate Swift export into your project:

1. In Xcode, open the project settings.
2. On the **Build Phases** tab, locate the **Run Script** phase with the `embedAndSignAppleFrameworkForXcode` task.
3. Replace the script with the `embedSwiftExportForXcode` task in the run script phase:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. Build the project. The build generates Swift modules in the output directory.

## Current limitations

Swift export currently works only in projects that use
[direct integration](https://kotlinlang.org/docs/multiplatform/multiplatform-direct-integration.html) to
connect the iOS framework to the Xcode project.
This is a standard configuration for Kotlin Multiplatform projects created with the Kotlin Multiplatform plugin in IntelliJ
IDEA or through the [web wizard](https://kmp.jetbrains.com/).

Other known issues:

* Types that inherit from `List`, `Set`, or `Map` are ignored during the export ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)).
* Inheritors of `List`, `Set`, or `Map` cannot be instantiated on the Swift side ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
* When exported to Swift, Kotlin generic type parameters are type-erased to their upper bounds.
* Cross-language inheritance is not supported, so Swift classes cannot directly subclass from Kotlin-exported classes or
  interfaces.
* No IDE migration tips or automation are available.
* When using declarations that require opt-in, you must add an explicit `optIn` compiler option at the _module
  level_ to your Gradle build file. For example, for the `kotlinx.datetime` library:

  ```kotlin
  swiftExport {
      moduleName = "Shared"

      export("org.jetbrains.kotlinx:kotlinx-datetime:%dateTimeVersion%") {
          moduleName = "KotlinDateTime"
          flattenPackage = "kotlinx.datetime"
      }
  }

  // Add a separate opt-in block at the module level
  compilerOptions {
      optIn.add("kotlin.time.ExperimentalTime")
  }
  ```

## Mappings

The table below shows how Kotlin concepts are mapped to Swift.

| Kotlin                                     | Swift                          |
|--------------------------------------------|--------------------------------|
| [`class`](#classes)                        | `class`                        |
| [`object`](#objects)                       | `class` with `shared` property |
| [`enum class`](#enums)                     | `enum`                         |
| [`typealias`](#type-aliases)               | `typealias`                    |
| [Function](#functions)                     | Function                       |
| [`suspend fun`](#suspending-functions)     | `async`                        |
| [`kotlinx.coroutines` flows](#flows) | `AsyncSequence`                |
| [Property](#properties)                    | Property                       |
| [Constructor](#constructors)               | Initializer                    |
| [Package](#packages)                       | Nested enum                    |
| `Boolean`                                  | `Bool`                         |
| `Char`                                     | `Unicode.UTF16.CodeUnit`       |
| `Byte`                                     | `Int8`                         |
| `Short`                                    | `Int16`                        |
| `Int`                                      | `Int32`                        |
| `Long`                                     | `Int64`                        |
| `UByte`                                    | `UInt8`                        |
| `UShort`                                   | `UInt16`                       |
| `UInt`                                     | `UInt32`                       |
| `ULong`                                    | `UInt64`                       |
| `Float`                                    | `Float`                        |
| `Double`                                   | `Double`                       |
| `Any`                                      | `KotlinBase` class             |
| `Unit`                                     | `Void`                         |
| [`Nothing`](#kotlin-nothing)               | `Never`                        |

### Declarations

#### Classes

Swift export supports only final classes that directly inherit from `Any`, like `class Foo()`.
They are translated to Swift classes that inherit from a special `KotlinBase` class:

```kotlin
// Kotlin
class MyClass {
    val property: Int = 0

    fun method() {}
}
```

```swift
// Swift
public class MyClass : KotlinRuntime.KotlinBase {
    public var property: Swift.Int32 {
        get {
            // ...
        }
    }
    public override init() {
        // ...
    }
    public func method() -> Swift.Void {
        // ...
    }
}
```

#### Objects

Objects are translated to Swift classes with a private `init` and static `shared` accessor:

```kotlin
// Kotlin
object O
```

```swift
// Swift
public class O : KotlinRuntime.KotlinBase {
    public static var shared: O {
        get {
            // ...
        }
    }
    private override init() {
        // ...
    }
}
```

#### Type aliases

Kotlin type aliases are exported as is:

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### Enums

Kotlin `enum class` declarations are exported as regular native Swift `enum` types:

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    public var rgb: Swift.Int32 { get }
}
```

#### Functions

Swift export supports simple top-level functions and methods:

```kotlin
// Kotlin
fun foo(a: Short, b: Bar) {}

fun baz(): Long = 0
```

```swift
// Swift
public func foo(a: Swift.Int16, b: Bar) -> Swift.Void {
    // ...
}

public func baz() -> Swift.Int64 {
    // ...
}
```

For Kotlin's extension functions, the receiver parameter becomes an ordinary Swift parameter in the first position:

```kotlin
// Kotlin
fun Int.foo(): Unit = TODO()
```

```swift
// Swift
func foo(_ receiver: Int32) {}
```

Kotlin's functions with [`vararg`](functions.md#variable-number-of-arguments-varargs) are mapped to Swift's variadic function
parameters:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
public func log(messages: Swift.String...)
```

> * Support for functions with the [`operator` modifier](operator-overloading.md) is currently limited.
> * Generic types are generally not supported.
>
{style="note"}

#### Properties

Kotlin properties are translated to Swift properties:

```kotlin
// Kotlin
val a: Int = 0

var b: Short = 15

const val c: Int = 0
```

```swift
// Swift
public var a: Swift.Int32 {
    get {
        // ...
    }
}
public var b: Swift.Int16 {
    get {
        // ...
    }
    set {
        // ...
    }
}
public var c: Swift.Int32 {
    get {
        // ...
    }
}
```

#### Constructors

Constructors are translated to Swift initializers:

```kotlin
// Kotlin
class Foo(val prop: Int)
```

```swift
// Swift
public class Foo : KotlinRuntime.KotlinBase {
    public init(
        prop: Swift.Int32
    ) {
        // ...
    }
}
```

### Types

#### kotlin.Nothing

The Kotlin `Nothing` type is translated to the `Never` type:

```kotlin
// Kotlin
fun foo(): Nothing = TODO()

fun baz(input: Nothing) {}
```

```swift
// Swift
public func foo() -> Swift.Never {
    // ...
}

public func baz(input: Swift.Never) -> Void {
    // ...
}
```

#### Classifier types

Swift export currently supports only final classes that directly inherit from `Any`.

### Packages

Kotlin packages are translated to nested Swift enums to avoid name collisions:

```kotlin
// Kotlin
// bar.kt file in foo.bar package
fun callMeMaybe() {}
```

```kotlin
// Kotlin
// baz.kt file in foo.baz package
fun callMeMaybe() {}
```

```swift
// Swift
public extension foo.bar {
    public func callMeMaybe() {}
}

public extension foo.baz {
    public func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

### Concurrency

#### Suspending functions

You can call suspending Kotlin code from Swift. Kotlin [suspending functions](coroutines-basics.md#suspending-functions) and
suspending functional types are exported as Swift's `async` counterparts:

```kotlin
// Kotlin
suspend fun hello(): String {
    delay(1000)
    return "Hello Swift! This is Kotlin."
}
```

```swift
// Swift
let msg = try await hello()
```

#### Flows

You can also export `kotlinx.coroutines` flows as Swift's [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence):

```kotlin
// Kotlin
// Preserves the String type when exporting Flow
fun flowOfStrings(): Flow<String> = flowOf("hello", "any", "world")
```

```swift
// Swift
var actual: [String] = []

// Infers the String type from Kotlin
for try await element in flowOfStrings().asAsyncSequence() {
    actual.append(element)
}
```

#### Coroutine dispatchers

By default, when you call a Kotlin suspending function from Swift or use the `asAsyncSequence` function,
Kotlin creates a coroutine context that uses the [`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html)
dispatcher and executes the exported code there.

To run the exported code on a [different dispatcher](coroutines-basics.md#coroutine-dispatchers), use the `withContext()`
function to switch the coroutine context in Kotlin. For example:

```kotlin
suspend fun runOnMain(): Int = withContext(Dispatchers.Main) {
    delay(10L)
    42
}
```

## Evolution of Swift export

We're planning to expand and gradually stabilize Swift export in future Kotlin releases, improving interoperability
between Kotlin and Swift. You can leave your feedback:

* In Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report issues in [YouTrack](https://kotl.in/issue).
