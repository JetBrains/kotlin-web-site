[//]: # (title: Interoperability with Swift using Swift export)

<primary-label ref="beta"/>

Kotlin's interoperability with Swift through Swift export is in Beta. Swift export allows you to export Kotlin sources
directly and call Kotlin code from Swift idiomatically, eliminating the need for Objective-C headers.

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L5-L13
-->

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

Starting with Kotlin 2.5.0, you can use the `export { swift {} }` DSL to configure either
[direct Xcode integration](#configure-kotlin-project) or [Swift package generation](#generate-a-swift-package).
Opt in to the DSL with `@OptIn(ExperimentalSwiftExportDsl::class)`.

<!-- Sources:
https://youtrack.jetbrains.com/issue/KT-89803
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L9-L13
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L103-L169
-->

### Configure Kotlin project

For direct Xcode integration, configure your shared module's `build.gradle.kts` as follows.
Direct `api` dependencies are exported automatically; `configure()` customizes their Swift names and packages.

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/SwiftExportVisibility.kt#L9-L13
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L311-L330
-->

```kotlin
// shared/build.gradle.kts
import org.jetbrains.kotlin.gradle.swiftexport.ExperimentalSwiftExportDsl

kotlin {
    iosArm64()
    iosSimulatorArm64()

    export {
        @OptIn(ExperimentalSwiftExportDsl::class)
        swift {
            moduleName = "Shared"
            // Removes this package prefix from generated Swift names
            rootPackage = "com.example.sandbox"

            xcodeIntegration {
                configure(project(":subproject")) {
                    moduleName = "Subproject"
                    rootPackage = "com.subproject.library"
                }
            }
        }
    }

    sourceSets.commonMain.dependencies {
        api(project(":subproject"))
    }
}
```

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/shared/build.gradle.kts
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L183-L215
-->

The direct integration builds the Swift modules and static library and copies them into Xcode's build directory.

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftExport.kt#L147-L193
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/tasks/CopySwiftExportIntermediatesForConsumer.kt#L33-L89
-->

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

### Generate a Swift package

Swift package integration generates a package containing Swift API sources, bridge and runtime headers, and an XCFramework
with compiled Kotlin libraries. Xcode compiles the Swift sources when consuming the package; no Gradle build phase is needed.
Generate the package on macOS with Xcode installed, and set your iOS app's deployment target to **iOS 18.0** or later.

<!-- Sources:
https://youtrack.jetbrains.com/issue/KT-89803
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftPackageExport.kt#L117-L154
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftExport.kt#L50-L59
-->

In your shared module, enable `swiftPackageIntegration` instead of `xcodeIntegration`.
If switching from direct integration, also remove the `embedSwiftExportForXcode` run script from Xcode:

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L128-L169
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L174-L190
-->

```kotlin
// shared/build.gradle.kts
import org.jetbrains.kotlin.gradle.swiftexport.ExperimentalSwiftExportDsl

kotlin {
    iosArm64()
    iosSimulatorArm64()

    export {
        @OptIn(ExperimentalSwiftExportDsl::class)
        swift {
            moduleName = "Shared"
            rootPackage = "com.example.sandbox"

            swiftPackageIntegration {
                outputDirectory.set(
                    layout.projectDirectory.dir("SwiftPackage")
                )
            }
        }
    }
}
```

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/shared/build.gradle.kts
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L367-L378
-->

`outputDirectory` is optional and defaults to `SwiftPackage` beside the module's build script.
The package includes the configured Apple targets: here, iOS devices and ARM64 simulators.
To customize dependency exports, place `configure()` calls inside `swiftPackageIntegration`, as in the direct-integration example.

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L305-L378
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftPackageExport.kt#L69-L85
-->

For example, declare a function in `shared/src/commonMain/kotlin/Greeting.kt`:

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L191-L212
-->

```kotlin
package com.example.sandbox

fun greeting(): String = "Hello from Kotlin"
```

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt
-->

Run the export task for the Kotlin binary configuration you need:

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L367-L374
-->

```bash
# Generates shared/SwiftPackage/Debug
./gradlew :shared:exportDebugSwiftPackage

# Generates shared/SwiftPackage/Release
./gradlew :shared:exportReleaseSwiftPackage
```

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L193-L200
-->

In Xcode, choose **File | Add Package Dependencies | Add Local** and select `shared/SwiftPackage/Debug` or
`shared/SwiftPackage/Release`, not their parent directory. Add the **SharedLibrary** product to your app target.
The product name is your `moduleName` followed by `Library`; the Swift import uses `moduleName` alone.

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L202-L220
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftPackageExport.kt#L95-L108
-->

After exporting the package, call it from Swift without the Kotlin package prefix, thanks to `rootPackage`:

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L191-L212
-->

```swift
import Shared

print(greeting())
```

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L191-L212
-->

Rerun the export task after changing Kotlin code or export configuration, then rebuild your app.
Switching Xcode's build configuration does not switch the package directory: a dependency on `Debug` still uses the Debug
Kotlin binary. Select the `Release` package when you want the Release binary.

<!-- Sources:
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/apple/swiftexport/SwiftPackageExport.kt#L81-L85
https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/plugin/mpp/export/ExportExtension.kt#L367-L374
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/spm-consumer/Package.swift
-->

In Kotlin 2.5.0, Swift package generation does not support dependencies imported through `swiftPMDependencies`.
If SwiftUI previews crash with the generated package, try **Editor | Canvas | Use Legacy Previews Execution**
(see [KT-91412](https://youtrack.jetbrains.com/issue/KT-91412)).

<!-- Sources:
https://youtrack.jetbrains.com/issue/KT-90005
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L222
https://youtrack.jetbrains.com/issue/KT-91412#focus=Comments-27-14650121.0-0
-->

See the [Swift export sample](https://github.com/Kotlin/swift-export-sample#swift-package-export) for a working package
consumer and additional configuration examples.

<!-- Sources:
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/README.md#L193-L222
https://github.com/Kotlin/swift-export-sample/blob/654a686070c07e293679f1c24136be73562df7a1/spm-consumer/Package.swift
-->

## Current limitations

Known issues:

* Types that inherit from `List`, `Set`, or `Map` are ignored during the export ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)).
* Inheritors of `List`, `Set`, or `Map` cannot be instantiated on the Swift side ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
* When exported to Swift, Kotlin generic type parameters are type-erased to their upper bounds.
* No IDE migration tips or automation are available.
* When using declarations that require opt-in, add the opt-in annotation's fully qualified name to
  `kotlin.compilerOptions.optIn` in the exporting module.

  <!-- Sources:
  https://github.com/JetBrains/kotlin/blob/5cfff75aa6c9da4f473a20aa9235e4971c3af70a/libraries/tools/kotlin-gradle-plugin-api/src/common/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinCommonCompilerOptions.kt#L35-L41
  -->

## Mappings

The table below shows how Kotlin concepts are mapped to Swift.

| Kotlin                                                            | Swift                          |
|-------------------------------------------------------------------|--------------------------------|
| [`class`](#classes)                                               | `class`                        |
| [`object`](#objects)                                              | `class` with `shared` property |
| [`enum class`](#enums)                                            | `enum`                         |
| [`sealed` classes and interfaces](#sealed-classes-and-interfaces) | `enum`                         |
| [`typealias`](#type-aliases)                                      | `typealias`                    |
| [Function](#functions)                                            | Function                       |
| [`suspend fun`](#suspending-functions)                            | `async`                        |
| [`kotlinx.coroutines` flows](#flows)                              | `AsyncSequence`                |
| [Property](#properties)                                           | Property                       |
| [Constructor](#constructors)                                      | Initializer                    |
| [Package](#packages)                                              | Nested enum                    |
| `Boolean`                                                         | `Bool`                         |
| `Char`                                                            | `Unicode.UTF16.CodeUnit`       |
| `Byte`                                                            | `Int8`                         |
| `Short`                                                           | `Int16`                        |
| `Int`                                                             | `Int32`                        |
| `Long`                                                            | `Int64`                        |
| `UByte`                                                           | `UInt8`                        |
| `UShort`                                                          | `UInt16`                       |
| `UInt`                                                            | `UInt32`                       |
| `ULong`                                                           | `UInt64`                       |
| `Float`                                                           | `Float`                        |
| `Double`                                                          | `Double`                       |
| `Any`                                                             | `KotlinBase` class             |
| `Unit`                                                            | `Void`                         |
| [`Nothing`](#kotlin-nothing)                                      | `Never`                        |

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

#### Sealed classes and interfaces

Sealed hierarchies defined in Kotlin are mapped to Swift enums, enabling exhaustive `switch` statements.

Swift export generates a `.sealedType()` method on each sealed type. This method returns a Swift enum whose cases match
the direct subclasses of the sealed hierarchy. You can nest these calls to match deeper levels of the hierarchy.

For example, declare a sealed interface with a class hierarchy in Kotlin:

```kotlin
// Kotlin
sealed interface Shape

class Circle : Shape {
    override fun toString(): String = "Circle"
}

class Rectangle : Shape {
    override fun toString(): String = "Rectangle"
}

fun createCircle(): Shape = Circle()
```

On the Swift side, you can use an exhaustive `switch` without a `default` case:

```swift
// Swift
let shape = createCircle()

let name = switch shape.sealedType() {
    case let .circle(type): "It's a \(type.value)"
    case let .rectangle(type): "It's a \(type.value)"
}
// name == "It's a Circle"
```

Because the `switch` is exhaustive, the compiler warns you if a new subclass is added to the sealed hierarchy, so you
can handle it immediately instead of relying on a `default` case for `switch`.

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

## Cross-language inheritance

Swift export supports cross-language inheritance. A common use case for this feature is the [reverse import](native-lib-import-stability.md#swift-library-import)
pattern, where you define a contract in Kotlin and provide platform-specific implementations on the Swift side.
This is especially useful when you need to use pure Swift libraries that can't be directly imported into Kotlin.

To implement the pattern, you need to declare a Kotlin interface and a Kotlin superclass that the Swift implementation
can inherit from. You then implement the interface in Swift and pass the Swift object to Kotlin
functions that accept that interface. For example, for the CryptoKit library:

1. On the Kotlin side, declare an interface, a function that accepts it, and an `open` base class:

    ```kotlin
    // Kotlin
    interface CryptoProvider {
        fun hashMD5(input: String): String
    }

    fun processHash(provider: CryptoProvider, input: String): String = provider.hashMD5(input)

    open class SwiftBase
    ```

2. On the Swift side, inherit from the exported `SwiftBase` class, implement the interface using a pure Swift library,
   and pass the object back to Kotlin:

    ```swift
    // Swift
    import CryptoKit

    final class IosCryptoProvider: SwiftBase, CryptoProvider {
        func hashMD5(input: String) -> String {
            guard let data = input.data(using: .utf8) else { return "failed" }
            return Insecure.MD5.hash(data: data).description
        }
    }

    let provider = IosCryptoProvider()
    
    // Calls the Kotlin function, which calls hashMD5() back in Swift
    print(processHash(provider: provider, input: "Hello, world!"))
    ```

When Kotlin receives the Swift object, it treats it like an implementation of a regular Kotlin interface, calling
the Swift code directly.

## Evolution of Swift export

We're planning to expand and gradually stabilize Swift export in future Kotlin releases, improving interoperability
between Kotlin and Swift. You can leave your feedback:

* In Kotlin Slack – [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw)
  and join the [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) channel.
* Report issues in [YouTrack](https://kotl.in/issue).
