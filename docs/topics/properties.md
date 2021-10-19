[//]: # (title: Properties)

## Declaring properties

Properties in Kotlin classes can be declared either as mutable, using the `var` keyword, or as read-only, using the `val` keyword.

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```

To use a property, simply refer to it by its name:

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // there's no 'new' keyword in Kotlin
    result.name = address.name // accessors are called
    result.street = address.street
    // ...
    return result
}
```

## Getters and setters

The full syntax for declaring a property is as follows:

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```

The initializer, getter, and setter are optional. The property type is optional if it can be inferred from the initializer
or from the initializer’s or the getter’s return type, as shown below:

```kotlin
var initialized = 1 // has type Int, default getter and setter
// var allByDefault // ERROR: explicit initializer required, default getter and setter implied
```

The full syntax of a read-only property declaration differs from a mutable one in two ways: it starts with `val` instead
of `var` and does not allow a setter:

```kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

You can define custom accessors for a property. If you define a custom getter, it will be called every time you access
the property (this way you can implement a computed property). Here's an example of a custom getter:

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val square: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, square=${rectangle.square}")
}
```
{kotlin-runnable="true"}

You can omit the property type if it can be inferred from the getter:

```kotlin
val square get() = this.width * this.height
```

If you define a custom setter, it will be called every time you assign a value to the property, except its initialization.
A custom setter looks like this:

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // parses the string and assigns values to other properties
    }
```

By convention, the name of the setter parameter is `value`, but you can choose a different name if you prefer.

If you need to annotate an accessor or change its visibility, but you don't need to change the default implementation,
you can define the accessor without defining its body:

```kotlin
var setterVisibility: String = "abc"
    private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
    @Inject set // annotate the setter with Inject
```

### Backing fields

In Kotlin, a field is only used as a part of a property to hold its value in memory. Fields cannot be declared directly.
However, when a property needs a backing field, Kotlin provides it automatically. This backing field can be referenced in
the accessors using the `field` identifier:

```kotlin
var counter = 0 // the initializer assigns the backing field directly
    set(value) {
        if (value >= 0)
            field = value
            // counter = value // ERROR StackOverflow: Using actual name 'counter' would make setter recursive
    }
```

The `field` identifier can only be used in the accessors of the property.

A backing field will be generated for a property if it uses the default implementation of at least one of the accessors,
or if a custom accessor references it through the `field` identifier.

For example, there would be no backing field in the following case:

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### Backing properties

If you want to do something that does not fit into this _implicit backing field_ scheme, you can always fall back to having
a _backing property_:

```kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
    get() {
        if (_table == null) {
            _table = HashMap() // Type parameters are inferred
        }
        return _table ?: throw AssertionError("Set to null by another thread")
    }
```

> On the JVM: Access to private properties with default getters and setters is optimized to avoid function call overhead.
>
{type="note"}

## Compile-time constants

If the value of a read-only property is known at compile time, mark it as a _compile time constant_ using the `const` modifier.
Such a property needs to fulfil the following requirements:

* It must be a top-level property, or a member of an [`object` declaration](object-declarations.md#object-declarations-overview) or a _[companion object](object-declarations.md#companion-objects)_.
* It must be initialized with a value of type `String` or a primitive type
* It cannot be a custom getter

Such properties can be used in annotations:

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```

## Late-initialized properties and variables

Normally, properties declared as having a non-null type must be initialized in the constructor.
However, it is often the case that doing so is not convenient. For example, properties can be initialized through dependency
injection, or in the setup method of a unit test. In these cases, you cannot supply a non-null initializer in the constructor,
but you still want to avoid null checks when referencing the property inside the body of a class.

To handle such cases, you can mark the property with the `lateinit` modifier:

```kotlin
public class MyTest {
    lateinit var subject: TestSubject

    @SetUp fun setup() {
        subject = TestSubject()
    }

    @Test fun test() {
        subject.method()  // dereference directly
    }
}
```

This modifier can be used on `var` properties declared inside the body of a class (not in the primary constructor,
and only when the property does not have a custom getter or setter), as well as for top-level properties and local variables.
The type of the property or variable must be non-null, and it must not be a primitive type.

Accessing a `lateinit` property before it has been initialized throws a special exception that clearly identifies the property
being accessed and the fact that it hasn't been initialized.

### Checking whether a `lateinit var` is initialized

To check whether a `lateinit var` has already been initialized, use `.isInitialized` on the [reference to that property](reflection.md#property-references):

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```

This check is only available for properties that are lexically accessible when declared in the same type, in one of the
outer types, or at top level in the same file.

## Overriding properties

See [Overriding properties](inheritance.md#overriding-properties)

## Delegated properties

The most common kind of property simply reads from (and maybe writes to) a backing field, but custom getters and setters
allow you to use properties so one can implement any sort of behavior of a property.
Somewhere in between the simplicity of the first kind and variety of the second, there are common patterns for what properties
can do. A few examples: lazy values, reading from a map by a given key, accessing a database, notifying a listener on access.

Such common behaviors can be implemented as libraries using [delegated properties](delegated-properties.md).
