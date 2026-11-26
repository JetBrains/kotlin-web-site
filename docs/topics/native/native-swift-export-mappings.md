[//]: # (title: Mappings between Kotlin and Swift)
<primary-label ref="beta"/>

<show-structure depth="1"/>

Swift export maps Kotlin declarations and types to their Swift equivalents.
The table below shows how Kotlin concepts are mapped to Swift.

| Kotlin                                                            | Swift                          |
|-------------------------------------------------------------------|-------------------------------------------------------------|
| [`class`](#classes)                                               | `class`                        |
| [`object`](#objects)                                              | `class` with `shared` property |
| [`enum class`](#enums)                                            | `enum`                         |
| [`sealed` hierarchies](#sealed-classes-and-interfaces) | `enum` built with `sealedType()` method on each sealed type |
| [`typealias`](#type-aliases)                                      | `typealias`                    |
| [`interface`](#interfaces)                                        | `protocol`                     |
| [Function](#functions)                                            | Function                       |
| [`vararg`](#functions)                                            | Variadic parameter             |
| [Value class](#functions)                                         | Wrapper class                  |
| [Extension](#extensions)                                          | Swift extension or static func |
| [`suspend fun`](#suspending-functions)                            | `async`                        |
| [`kotlinx.coroutines` flows](#flows)                              | `AsyncSequence`                |
| [`Throwable`](#error-handling)                                    | `Swift.Error`                  |
| [Property](#properties)                                           | Property                       |
| [Constructor](#constructors)                                      | Initializer                    |
| [Package](#packages)                                              | Nested enum                    |
| [`String`](#primitive-types-and-strings)                           | `String`                       |
| [`List`, `Set`, `Map`](#collections)                              | `[T]`, `Set<T>`, `[K: V]`       |
| [`T?`](#nullability)                                              | `T?`                           |
| [Annotations](#annotations)                                        | Swift attributes and DocC      |
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
| `Any`                                                             | `any _KotlinBridgeable`        |
| `Unit`                                                            | `Void`                         |
| [`Nothing`](#kotlin-nothing)                                      | `Never`                        |
| KDoc | DocC `///` comments|

Check out our [`swift-export-sample`](https://github.com/Kotlin/swift-export-sample) project, a runnable
Kotlin Multiplatform sample that features the mappings described on this page. Each section below links to the Kotlin
declarations and to the Swift code that uses them.

## Declarations

### Classes

Final Kotlin classes that directly inherit from `Any`, like `class Foo()`, are translated to Swift classes that inherit
from a special `KotlinBase` class:

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

Kotlin classes that subclass Objective-C classes are not exported.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Kotlin classes | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Interfaces

Kotlin interfaces are exported as Swift protocols. Use an existential such as `any Repository` when you need a value
whose concrete type can vary. To implement an exported Kotlin interface in Swift, inherit from `KotlinBase` as well as
conforming to the protocol. Swift structs and enums cannot conform to Kotlin interfaces.

```kotlin
// Kotlin
interface Repository {
    fun load(id: String): String
}
```

```swift
// Swift
let repository: any Repository

final class SwiftRepository: KotlinBase, Repository {
    func load(id: String) -> String { "loaded \(id)" }
}
```

Kotlin `fun interface` declarations also become protocols. Swift export provides a lowercase factory that accepts a
closure to create an implementation:

```kotlin
// Kotlin
fun interface StringHandler {
    fun handle(value: String): String
}
```

```swift
// Swift
let handler = stringHandler { value in value.uppercased() }
```

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Kotlin interfaces | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Interfaces.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/InterfacesView.swift) |
| Kotlin interface implemented in Swift | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/SwiftImplementation.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/SwiftImplementationView.swift) |

For the end-to-end pattern, see [Cross-language inheritance](#cross-language-inheritance).

### Open and abstract classes

Kotlin `open` and `abstract` classes are exported as open Swift classes. You can subclass them from Swift, and overrides
of Kotlin `open` members dispatch back to the Swift implementation. Swift does not require you to override an abstract
Kotlin member: the subclass compiles, but calling the unimplemented member fails at runtime. Overriding a Kotlin member
that is not `open` can fail at runtime, and Kotlin `protected` members are not accessible from Swift.

```kotlin
// Kotlin
open class Base {
    fun fixed(): String = "fixed"
    open fun overridable(): String = "Kotlin"
    protected val hidden: String = "protected"
}

abstract class AbstractBase {
    abstract fun required(): String
}
```

```swift
// Swift
class SwiftBase: Base {
    override func overridable() -> String { "Swift" }
}

class SwiftAbstractBase: AbstractBase {}
```

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Kotlin open and abstract classes | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

For the end-to-end pattern, see [Cross-language inheritance](#cross-language-inheritance).

### Data classes

Kotlin data classes are exported as Swift classes. Their `toString()`, `equals()`, and `hashCode()` members map to
`description`, `isEqual(_:)` (and Swift equality), and `hash`, respectively. The generated `copy` method requires every
constructor argument; it does not provide Kotlin's default values for omitted arguments. Kotlin's `componentN()`
functions are not exported.

```kotlin
// Kotlin
data class Person(val name: String, val age: Int)
```

```swift
// Swift
let updated = person.copy(name: "Ada", age: 37)
print(updated.description)
print(updated.isEqual(person))
```

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Data classes | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Objects

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

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Objects | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Companion objects

Kotlin companion objects are exported as singleton objects accessible through the companion type's `shared` property:

```kotlin
// Kotlin
class CompanionObjectClass {
    companion object {
        const val CONST_VAL_EXAMPLE = "123"
    }
}
```

```swift
// Swift
let value = classesandinterfaces.CompanionObjectClass.Companion.shared.CONST_VAL_EXAMPLE
```

Named companions use their declared name. An `object` can also be a subtype in a sealed hierarchy.

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Companion objects | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Type aliases

Kotlin type aliases are exported as is:

```kotlin
// Kotlin
typealias MyInt = Int
```

```swift
// Swift
public typealias MyInt = Swift.Int32
```

### Enums

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

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Enum classes | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Enums.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/EnumsView.swift) |

### Sealed classes and interfaces

Sealed hierarchies defined in Kotlin are mapped to Swift enums, enabling exhaustive `switch` statements.

Swift export generates a `sealedType()` method on each sealed type. This method returns a Swift enum whose cases match
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

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Sealed classes and interfaces | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/SealedTypes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/SealedTypesView.swift) |

### Inner and nested classes

Kotlin nested classes are available through the enclosing Swift type, for example `Outer.Nested()`. Kotlin `inner` classes
also need an instance of their enclosing class; Swift export exposes this as the `outer__` initializer argument.

```kotlin
// Kotlin
class Outer(val value: String) {
    class Nested
    inner class Inner
}
```

```swift
// Swift
let nested = Outer.Nested()
let inner = Outer.Inner(outer__: Outer(value: "example"))
```

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Inner and nested classes | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Functions

Swift export preserves Kotlin function names and uses Kotlin parameter names as Swift argument labels. The Kotlin types map to
their corresponding Swift types:

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

For extension functions declared outside the root package, the receiver becomes the first Swift argument. See
[Extensions](#extensions) for the root-package mapping.

Swift export does not apply Kotlin default argument values on the Swift side. You must pass every argument, including
arguments with a default value: omitting such an argument does not compile. To call a function with fewer arguments,
provide a Kotlin overload. Overloads keep their Kotlin name and labels, so you may need to disambiguate a numeric
literal with a Swift type cast:

```kotlin
// Kotlin
fun greet(name: String, times: Int = 1) {}
fun choose(value: Int) {}
fun choose(value: String) {}
```

```swift
// Swift
greet(name: "Kotlin", times: 1)
choose(value: 2 as Int32)
choose(value: "Kotlin")
```

Value class parameters use the exported wrapper type rather than the underlying value. For example, pass
`ValueClassExample(t: 40)` when a Kotlin function expects that value class. Factory functions named after their return
type have a lowercased Swift name.

Kotlin lambda parameters are exported as `@escaping` Swift closures. You can pass a closure inline or use
trailing-closure syntax; a function that returns a function type returns a Swift closure. Receiver lambdas receive their
Kotlin receiver as the first closure parameter:

```kotlin
// Kotlin
fun transform(action: (String) -> String): String = action("Kotlin")
fun configure(block: StringBuilder.() -> Unit) {}
```

```swift
// Swift
let result = transform { value in "Hello, \(value)" }
configure { builder in builder.append("Swift") }
```

Kotlin [`vararg`](functions.md#variable-number-of-arguments-varargs) parameters map to Swift variadic parameters:

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```swift
// Swift
log(messages: "one", "two")
```

Kotlin operators map to Swift operators where supported. For example, `plus` is available as `a + b`, `get` as `a[index]`,
and `invoke` as `a()`. For more details on Kotlin declaration rules, see [operator overloading](operator-overloading.md).

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Top-level functions, overloads, `vararg`, and default arguments | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |
| Function types and lambdas | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/FunctionTypes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/FunctionTypesView.swift) |
| Lambdas with receiver | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/ReceiverLambdas.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ReceiverLambdasView.swift) |
| Inline functions and a `crossinline` lambda | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/InlineFunctions.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/InlineFunctionsView.swift) |
| Operator functions | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Operators.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/OperatorsView.swift) |
| Context parameters | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/ContextParameters.kt) | — |

### Properties

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

A Kotlin property with a `private set` is read-only from Swift. Top-level properties are available through their package
namespace, like top-level functions.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Top-level properties | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |
| Member properties, including `private set` and `lateinit` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |

### Constructors

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

Kotlin default argument values are not applied when Swift calls an initializer. Pass every argument. A constructor marked
with `@Throws` is exported as a throwing initializer, which you call with `try`.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Primary, secondary, and value class constructors | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Classes.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ClassesView.swift) |
| Throwing constructors | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Exceptions.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ExceptionsView.swift) |

### Extensions

An extension declared in the root package, or in the package selected by `rootPackage`, becomes a Swift extension. An
extension declared in another Kotlin package is exported as a static function in that package namespace, with the
receiver as its first argument. This applies to extension functions and properties, including extensions on regular
Kotlin classes, on platform classes such as `String`, and on companion objects. Outside the root package, you call all
of them through the package namespace as static functions or getters.

```kotlin
// Kotlin
// In the root package or rootPackage
fun String.shout(): String = uppercase()

// In another package
fun String.whisper(): String = lowercase()
```

```swift
// Swift
let loud = "hello".shout()
let quiet = extensions.whisper("HELLO")
```

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Extensions | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Extensions.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ExtensionsView.swift) |

### Annotations

| Kotlin annotation or visibility | Swift export |
| -------------------------------| --------------------------------------------------------------------------------------------------------------------------------|
| `@ObjCName(name, swiftName)` | Renames exported declarations; `swiftName` takes precedence. |
| `@HiddenFromObjC` | Hides declarations from Swift export; references to them can become unavailable stubs. |
| `@ShouldRefineInSwift` | Ignored; the declaration is exported under its normal name and is not refined in Swift. |
| `@Deprecated` | `WARNING` adds a deprecation attribute, `ERROR` makes the declaration unavailable, and `HIDDEN` omits it. |
| `@RequiresOptIn` | Exports public opt-in APIs with `@_spi(Marker)`; import with `@_spi(Marker) import Shared`. Non-public markers are not exported. |
| `@Throws` | Adds Swift `throws` for [error handling](#error-handling). |
| Visibility | Only public API is available from Swift. `protected`, `internal`, and `private` declarations are not reachable. |

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Annotations and KDoc | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Annotations.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/AnnotationsView.swift) |

## Types

### Primitive types and strings

Swift export maps Kotlin primitive types to their Swift counterparts. Kotlin `Int` maps to `Int32`, not Swift `Int`.
Convert a Swift `Int` value to `Int32` before passing it to a Kotlin function. Kotlin `Char` maps to
`Unicode.UTF16.CodeUnit`, not Swift `Character`. Unsigned Kotlin types keep their unsigned Swift counterparts.

| Kotlin | Swift |
|---|---|
| `Boolean` | `Bool` |
| `Byte`, `Short`, `Int`, `Long` | `Int8`, `Int16`, `Int32`, `Int64` |
| `UByte`, `UShort`, `UInt`, `ULong` | `UInt8`, `UInt16`, `UInt32`, `UInt64` |
| `Float`, `Double` | `Float`, `Double` |
| `Char` | `Unicode.UTF16.CodeUnit` |
| `String` | `String` |

```kotlin
// Kotlin
fun acceptInt(value: Int) {}
fun acceptChar(value: Char) {}
```

```swift
// Swift
acceptInt(value: Int32(42))
acceptChar(value: ("A" as NSString).character(at: 0))
```

Swift and Kotlin strings are copied across the boundary. Do not rely on object identity between them.
Kotlin `Any` maps to `any _KotlinBridgeable`, the bridge protocol supported by primitive, string, collection, and Kotlin
object values.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Primitive types, strings, and `Any` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |

### Nullability

Kotlin nullable types map directly to Swift optionals. Swift export does not box nullable primitives in wrapper types:
`Int?` becomes `Int32?`, and a nullable protocol value can be written as `(any Repo)?`.

```kotlin
// Kotlin
fun accept(value: Int?): String? = value?.toString()
```

```swift
// Swift
let result: String? = accept(value: Optional<Int32>.some(42))
```

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Nullability | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |

### Collections

Kotlin read-only collection types map to native Swift collections. Swift export copies collection values across the
boundary:

| Kotlin | Swift |
| -----------------------| ------------------------------------------|
| `List<T>` | `[T]` |
| `Set<T>` | `Set<T>` |
| `Map<K, V>` | `[K: V]` |
| `IntRange`, `LongRange` | `ClosedRange<Int32>`, `ClosedRange<Int64>` |
| `OpenEndRange<Int>` | `Range<Int32>` |

For example, `List<Int>` becomes `[Int32]`. A `Map<Any, V>` uses `AnyHashable` keys. Kotlin `Array<T>` and primitive
arrays map to opaque `ExportedKotlinPackages.kotlin.Array` types that you cannot construct from Swift.

`MutableList`, `MutableSet`, and `MutableMap` are not supported. Types that inherit from `List`, `Set`, or `Map` are
ignored during the export ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416)) and cannot be instantiated on the
Swift side ([KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Collections, ranges, and arrays | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Collections.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/CollectionsView.swift) |

### Generics

Swift export erases Kotlin generic type parameters. The generated Swift API does not keep the Kotlin type arguments,
and you cast a generic result back to its expected Swift type. An unbounded `T` is represented by
`(any _KotlinBridgeable)?`; a bounded type parameter is represented by its bound. For example, a parameter bounded by
`Shape` accepts a `Shape` implementation, but Swift rejects an unrelated type.

```kotlin
// Kotlin
class Box<T>(val value: T)
fun <T> convert(value: T): T = value
class Bounded<T : Shape>(val value: T)
```

```swift
// Swift
let box = Box(value: "text")
let value = box.value as! String
let converted = convert(value: 12) as! Int
```

Kotlin star projections and variance do not add Swift generic type arguments. Swift uses the erased type, and casts
between variance forms do not change it.

Some generic declarations are not exported at all:

* Reified functions.
* F-bounded and multiple-upper-bound generic declarations.
* Functions with a parameter whose type is a generic class instantiated with a concrete type, such as `Box<String>`.
  Collections of such types as parameters can also fail the build.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Generic classes and functions | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Generics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/GenericsView.swift) |
| Reified functions and a concrete type wrapper | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/InlineFunctions.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/InlineFunctionsView.swift) |
| Non-generic wrappers for generic types | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/GenericWrappers.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/GenericWrappersView.swift) |

### kotlin.Nothing

The Kotlin `Nothing` type is translated to the `Never` type. `Unit` values map to Swift's empty tuple `()`, and you
cannot construct a value of `Nothing`/`Never`:

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

See an example in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| `kotlin.Nothing` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |

### Platform and cinterop types

Foundation and UIKit types keep their Swift names, such as `NSDate` and `UIViewController`, and the generated module
imports the corresponding frameworks. Objective-C protocols keep their Objective-C/Swift names, for example
`any NSCopying`.

C structs, C enums, platform type aliases such as `NSTimeInterval`, and POSIX or Darwin types are unavailable through
Swift export.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Platform-specific `expect` declarations | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Platform.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/PlatformView.swift) |

## Packages

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
    public static func callMeMaybe() {}
}

public extension foo.baz {
    public static func callMeMaybe() {}
}

public enum foo {
    public enum bar {}

    public enum baz {}
}
```

Top-level functions and properties are static members of their package enum. Swift export does not generate
`FileNameKt` classes. `ExportedKotlinPackages` provides the package namespaces; it is usually re-exported, so you can
write `foo.bar.callMeMaybe()`. Use the fully qualified `ExportedKotlinPackages` name when a package name conflicts
with a Swift type, module, or local variable.

When you set `rootPackage = "com.example"`, declarations in that exact package are also available at the module level.
Its subpackages are available as namespaces, for example `feature.Foo`.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Top-level declarations with `rootPackage` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Basics.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/BasicsView.swift) |
| Declarations exported from several Gradle modules | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Modules.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ModulesView.swift) |

## Concurrency

### Suspending functions

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

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Suspending functions | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Coroutines.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/CoroutinesView.swift) |

### Flows

You can export `kotlinx.coroutines` flows as Swift's [`AsyncSequence`](https://developer.apple.com/documentation/Swift/AsyncSequence):

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

For `Flow<T>`, Swift export also provides a typed `any KotlinTypedFlow<T>` wrapper. A lower-level API is available as
well: call `collect(collector:)` with a Swift `FlowCollector` implementation whose `emit` method is `async throws`.

`StateFlow<T>` is exposed as a `KotlinTypedStateFlow<T>` with a typed `.value`. `SharedFlow` is exposed through a
`KotlinTypedSharedFlow` wrapper with a typed `replayCache`. `MutableStateFlow<T>` exposes a readable and writable
`.value` and `compareAndSet`; `MutableSharedFlow` exposes `emit(value:)` and `tryEmit(value:)`. Swift cannot create a
Kotlin flow directly. Expose a Kotlin builder that creates and returns a flow; for example, return a
`MutableStateFlow<String>` and set its `.value` from Swift.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Flows, including `StateFlow` and `SharedFlow` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Coroutines.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/CoroutinesView.swift) |
| Kotlin flow implemented in Swift | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/SwiftImplementation.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/SwiftImplementationView.swift) |

### Cancellation

Cancelling the Swift `Task` that calls a suspending function or collects a flow cancels the Kotlin coroutine. Kotlin
suspending functions are exported as `async throws`, so call them with `try await`; cancellation is reported to Swift
as `CancellationError`.

```swift
// Swift
let task = Task {
    try await repository.getThingSimple(succeed: true)
}
task.cancel()
```

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Cancellation of suspending functions and flows | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Coroutines.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/CoroutinesView.swift) |

### Coroutine dispatchers

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

## Error handling

Functions and constructors annotated with `@Throws` are exported as Swift `throws` declarations. Call them with
`try` in a `do` block. `kotlin.Throwable` conforms to `Swift.Error`, so you can catch an exported Kotlin exception by
its concrete type:

```kotlin
// Kotlin
@Throws(MyException::class)
fun save() {
    throw MyException()
}
```

```swift
// Swift
do {
    try save()
} catch let error as MyException {
    print(error.message)
} catch {
    print(error)
}
```

Keep in mind that:

* If the thrown Kotlin exception type is not exported, Swift receives it as `KotlinRuntimeSupport.KotlinError`.
* `try` calls are not necessary if a non-suspending function throws an exception, but doesn't have the `@Throws` annotation.
  Any uncaught exception terminates the process, so try annotating every expected exception with `@Throws`.

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Exceptions and `@Throws` | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/Exceptions.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/ExceptionsView.swift) |

## Cross-language inheritance

Swift export supports cross-language inheritance. A common use case for this feature is the [reverse import](native-lib-import-stability.md#swift-library-import)
pattern, where you define a contract in Kotlin and provide platform-specific implementations on the Swift side.
This is especially useful when you need to use pure Swift libraries that can't be directly imported into Kotlin.

To implement the pattern, declare a Kotlin interface and a function that accepts it. On the Swift side, create a class
that inherits directly from the Kotlin runtime's `KotlinBase` class and conforms to the exported protocol.
Implement the interface using a pure Swift library and pass the object back to Kotlin. For example, for the CryptoKit library:

1. On the Kotlin side, declare an interface and a function that accepts it:

    ```kotlin
    // Kotlin
    interface CryptoProvider {
        fun hashMD5(input: String): String
    }

    fun processHash(provider: CryptoProvider, input: String): String = provider.hashMD5(input)
    ```

2. On the Swift side, inherit from `KotlinBase`, implement the interface using a pure Swift library,
   and pass the object back to Kotlin:

    ```swift
    // Swift
    import CryptoKit
    import Shared
    import KotlinRuntime

    final class IosCryptoProvider: KotlinBase, CryptoProvider {
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

See examples in the Swift export sample:

| Example | Kotlin side | Swift side |
|---|---|---|
| Kotlin contract | [Kotlin side](https://github.com/Kotlin/swift-export-sample/blob/master/shared/src/commonMain/kotlin/com/github/jetbrains/swiftexport/SwiftImplementation.kt) | [Swift side](https://github.com/Kotlin/swift-export-sample/blob/master/appleApp/appleApp/Features/SwiftImplementationView.swift) |

## Limitations

Swift export has the following limitations:

* Kotlin classes that subclass Objective-C classes are not exported.
* Swift structs and enums cannot conform to Kotlin interfaces.
* Only public API is available from Swift; `protected`, `internal`, and `private` declarations are not reachable. Properties with `private set` are read-only.
* Kotlin default argument values are not applied to functions or initializers. Data class `copy` also requires every constructor argument.
* Data class `componentN()` functions are not exported.
* Swift subclasses do not have to implement abstract Kotlin members, but calling an unimplemented member fails at runtime. Overriding a member that is not `open` can also fail at runtime.
* `@ShouldRefineInSwift` is ignored, and non-public `@RequiresOptIn` markers are not exported.
* `@HiddenFromObjC` and `@Deprecated(HIDDEN)` omit declarations; `@Deprecated(ERROR)` makes declarations unavailable, and references can become unavailable stubs.
* Kotlin `Any` values bridge only primitive, string, collection, and Kotlin object values.
* Generic type arguments are erased. Reified functions, F-bounded and multiple-upper-bound declarations, and functions with parameters such as `Box<String>` are not exported.
* Kotlin `Array` and primitive arrays cannot be constructed from Swift.
* `MutableList`, `MutableSet`, and `MutableMap` are not supported.
* Types inheriting from `List`, `Set`, or `Map` are ignored during export and cannot be instantiated from Swift ([KT-80416](https://youtrack.jetbrains.com/issue/KT-80416), [KT-80417](https://youtrack.jetbrains.com/issue/KT-80417)).
* Values of `Nothing`/`Never` cannot be constructed.
* C structs, C enums, platform type aliases such as `NSTimeInterval`, and POSIX or Darwin types are unavailable.
* Kotlin flows cannot be created directly from Swift.
* `FileNameKt` classes are not generated for top-level declarations.
* Member properties named `description`, `debugDescription`, `hash`, or `hashValue` are omitted. Swift resolves them to inherited `NSObject` members; rename or use `@ObjCName`.
* Unexported exception types are reported as `KotlinRuntimeSupport.KotlinError`. Uncaught exceptions from functions without `@Throws` terminate the process.

## What's next

For setup instructions and an overview of Swift export, see [](native-swift-export.md).
