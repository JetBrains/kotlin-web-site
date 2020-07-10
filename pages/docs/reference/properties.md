---
type: doc
layout: reference
category: "Syntax"
title: "Properties and Fields: Getters, Setters, const, lateinit"
---

# Properties and Fields

## Declaring Properties

Properties in Kotlin classes can be declared either as mutable using the *var*{: .keyword } keyword, or as read-only using the *val*{: .keyword } keyword.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
    var state: String? = null
    var zip: String = "123456"
}
```
</div>

To use a property, simply refer to it by name:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun copyAddress(address: Address): Address {
    val result = Address() // there's no 'new' keyword in Kotlin
    result.name = address.name // accessors are called
    result.street = address.street
    // ...
    return result
}
```
</div>

## Getters and Setters

The full syntax for declaring a property is

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```
</div>

The initializer, getter and setter are optional. Property type is optional if it can be inferred from the initializer
(or from the getter return type, as shown below).

Examples:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```
</div>

The full syntax of a read-only property declaration differs from a mutable one in two ways: it starts with `val` instead of `var` and does not allow a setter:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```
</div>

We can define custom accessors for a property. If we define a custom getter, it will be called every time we access
the property (this allows us to implement a computed property). Here's an example of a custom getter:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```
</div>

If we define a custom setter, it will be called every time we assign a value to the property. A custom setter looks like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
var stringRepresentation: String
    get() = this.toString()
    set(value) {
        setDataFromString(value) // parses the string and assigns values to other properties
    }
```
</div>

By convention, the name of the setter parameter is `value`, but you can choose a different name if you prefer.

Since Kotlin 1.1, you can omit the property type if it can be inferred from the getter:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val isEmpty get() = this.size == 0  // has type Boolean
```
</div>

If you need to change the visibility of an accessor or to annotate it, but don't need to change the default implementation,
you can define the accessor without defining its body:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
var setterVisibility: String = "abc"
    private set // the setter is private and has the default implementation

var setterWithAnnotation: Any? = null
    @Inject set // annotate the setter with Inject
```
</div>

### Backing Fields

Fields cannot be declared directly in Kotlin classes. However, when a property needs a backing field, Kotlin provides it automatically. This backing field can be referenced in the accessors using the `field` identifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
var counter = 0 // Note: the initializer assigns the backing field directly
    set(value) {
        if (value >= 0) field = value
    }
```
</div>

The `field` identifier can only be used in the accessors of the property.

A backing field will be generated for a property if it uses the default implementation of at least one of the accessors, or if a custom accessor references it through the `field` identifier.

For example, in the following case there will be no backing field:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```
</div>

### Backing Properties

If you want to do something that does not fit into this "implicit backing field" scheme, you can always fall back to having a *backing property*:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

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
</div>

> **On the JVM**: The access to private properties with default getters and setters is optimized
so no function call overhead is introduced in this case.


## Compile-Time Constants

If the value of a read-only property is known at the compile time, mark it as a _compile time constant_ using the *const*{: .keyword } modifier.
Such properties need to fulfil the following requirements:

  * Top-level, or member of an [*object*{: .keyword } declaration](object-declarations.html#object-declarations) or [a *companion object*{: .keyword }](object-declarations.html#companion-objects).
  * Initialized with a value of type `String` or a primitive type
  * No custom getter

Such properties can be used in annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun foo() { ... }
```
</div>


## Late-Initialized Properties and Variables

Normally, properties declared as having a non-null type must be initialized in the constructor.
However, fairly often this is not convenient. For example, properties can be initialized through dependency injection,
or in the setup method of a unit test. In this case, you cannot supply a non-null initializer in the constructor,
but you still want to avoid null checks when referencing the property inside the body of a class.

To handle this case, you can mark the property with the `lateinit` modifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

The modifier can be used on `var` properties declared inside the body of a class (not in the primary constructor, and only
when the property does not have a custom getter or setter) and, since Kotlin 1.2, for top-level properties and 
local variables. The type of the property or variable must be non-null, and it must not be a primitive type.

Accessing a `lateinit` property before it has been initialized throws a special exception that clearly identifies the property
being accessed and the fact that it hasn't been initialized.

### Checking whether a lateinit var is initialized (since 1.2)

To check whether a `lateinit var` has already been initialized, use `.isInitialized` on 
the [reference to that property](reflection.html#property-references):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (foo::bar.isInitialized) {
    println(foo.bar)
}
```
</div>

This check is only available for the properties that are lexically accessible, i.e. declared in the same type or in one of
the outer types, or at top level in the same file.

## Overriding Properties

See [Overriding Properties](classes.html#overriding-properties)

## Delegated Properties
  
The most common kind of properties simply reads from (and maybe writes to) a backing field. 
On the other hand, with custom getters and setters one can implement any behaviour of a property.
Somewhere in between, there are certain common patterns of how a property may work. A few examples: lazy values,
reading from a map by a given key, accessing a database, notifying listener on access, etc.

Such common behaviours can be implemented as libraries using [_delegated properties_](delegated-properties.html).
