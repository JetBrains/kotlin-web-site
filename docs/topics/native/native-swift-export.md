[//]: # (title: Interoperbility with Swift using Swift export)

<primary-label ref="experimental-general"/>

Kotlin provides experimental support for Swift export. It allows you to export Kotlin sources
directly and call Kotlin code from Swift idiomatically, eliminating the need for Objective-C headers.

Swift export makes multiplatform development for Apple targets easier. For example, if you have a Kotlin module
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

## How to enable

The feature is currently [Experimental](components-stability.md#stability-levels-explained) and not ready for production.
To try it out, [configure the build file](#kotlin-project-configuration) in your Kotlin project and [set up Xcode](#xcode-project-configuration)
to integrate Swift export.

### Kotlin project configuration

You can use the following build file in your project as a starting point for setting up Swift export:

```kotlin
// build.gradle.kts
kotlin {

    iosArm64()
    iosSimulatorArm64()

    swiftExport {
        // Root module name
        moduleName = "Shared"

        // Collapse rule
        // Removes package prefix from generated Swift code
        flattenPackage = "com.example.sandbox"

        // Export external modules
        export(project(":subproject")) {
            // Exported module name
            moduleName = "Subproject"
            // Collapse exported dependency rule
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
static `a` library, and header and `modulemap` files) and copies them into the app's build directory, which you can
access from Xcode.

> You can also clone our [public sample](https://github.com/Kotlin/swift-export-sample) with Swift export already set
> up.
>
{style="tip"}

### Xcode project configuration

To configure Xcode to integrate Swift export in your project:

1. In Xcode, open the project settings.
2. On the **Build Phases** tab, locate the **Run Script** phase with the `embedAndSignAppleFrameworkForXcode` task.
3. Adjust the script to feature the `embedSwiftExportForXcode` task instead in the run script phase:

   ```bash
   ./gradlew :<Shared module name>:embedSwiftExportForXcode
   ```

   ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. Build the project. Swift modules are generated in the build output directory.

## Current limitations

Swift export currently works only in projects that use
[direct integration](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html) to
connect the iOS framework to the Xcode project.
This is a standard configuration for Kotlin Multiplatform projects created with the Kotlin Multiplatform plugin in IntelliJ
IDEA or through the [web wizard](https://kmp.jetbrains.com/).

Other known issues:

* When exported to Swift, Kotlin generic type parameters are type-erased to their upper bounds.
* Swift closures can be passed into Kotlin, but Kotlin cannot export functional types to Swift.
* Cross-language inheritance is not supported, so Swift classes cannot directly subclass from Kotlin-exported classes or
  interfaces.
* No IDE migration tips or automation are available.
* When using declarations that require opt-in, it's necessary to add an explicit `optIn` compiler option at the _module
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

| Kotlin                 | Swift                          | Notes                                                |
|------------------------|--------------------------------|------------------------------------------------------|
| `class`                | `class`                        | [note](#classes)                                     |
| `object`               | `class` with `shared` property | [note](#objects)                                     |
| `typealias`            | `typealias`                    | [note](#typealiases)                                 |
| Function               | Function                       | [note](#functions)                                   |
| Property               | Property                       | [note](#properties)                                  |
| Constructor            | Initializer                    | [note](#constructors)                                |
| Package                | Nested enum                    | [note](#packages)                                    |
| `Boolean`              | `Bool`                         |                                                      |
| `Char`                 | `Unicode.UTF16.CodeUnit`       |                                                      |
| `Byte`                 | `Int8`                         |                                                      |
| `Short`                | `Int16`                        |                                                      |
| `Int`                  | `Int32`                        |                                                      |
| `Long`                 | `Int64`                        |                                                      |
| `UByte`                | `UInt8`                        |                                                      |
| `UShort`               | `UInt16`                       |                                                      |
| `UInt`                 | `UInt32`                       |                                                      |
| `ULong`                | `UInt64`                       |                                                      |
| `Float`                | `Float`                        |                                                      |
| `Double`               | `Double`                       |                                                      |
| `Any`                  | `KotlinBase` class             |                                                      |
| `Unit`                 | `Void`                         |                                                      |
| `Nothing`              | `Never`                        | [note](#kotlin-nothing)                              |

### Declarations

#### Classes

Swift export supports only final classes that directly inherit from `Any` (like `class Foo()`).
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

Objects are translated to Swift classes with private `init` and static `shared` accessor:

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

#### Typealiases

Kotlin typealiases are exported as is:

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

#### Functions

Swift export supports only simple top-level functions and methods.
Extensions, `suspend`, `inline`, and `operator` subtypes are not supported.

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

`Nothing` is translated to the `Never` type:

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

Swift export currently supports only a limited number of reference types, namely final classes that directly inherit from `Any`.

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

## Evolution of Swift export

We're planning to expand and gradually stabilize Swift export in future Kotlin releases, improving interoperability
between Kotlin and Swift, particularly around coroutines and flows.

You can leave your feedback:

* In Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report issues in [YouTrack](https://kotl.in/issue).
