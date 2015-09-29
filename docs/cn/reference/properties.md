---
type: doc
layout: reference
category: "Syntax"
title: "Properties and Fields"
---

# Properties and Fields

## Declaring Properties

Classes in Kotlin can have properties.
These can be declared as mutable, using the *var*{: .keyword } keyword or read-only using the *val*{: .keyword } keyword.

``` kotlin
public class Address { 
  public var name: String = ...
  public var street: String = ...
  public var city: String = ...
  public var state: String? = ...
  public var zip: String = ...
}
```

To use a property, we simply refer to it by name, as if it were a field in Java:

``` kotlin
fun copyAddress(address: Address): Address {
  val result = Address() // there's no 'new' keyword in Kotlin
  result.name = address.name // accessors are called
  result.street = address.street
  // ...
  return result
}
```

## Getters and Setters

The full syntax for declaring a property is

``` kotlin
var <propertyName>: <PropertyType> [= <property_initializer>]
  <getter>
  <setter>
```

The initializer, getter and setter are optional. Property type is optional if it can be inferred from the initializer or from the base class member being overridden.

Examples:

``` kotlin
var allByDefault: Int? // error: explicit initializer required, default getter and setter implied
var initialized = 1 // has type Int, default getter and setter
```

The full syntax of a read-only property declaration differs from a mutable one in two ways: it starts with val instead of var and does not allow a setter:

``` kotlin
val simple: Int? // has type Int, default getter, must be initialized in constructor
val inferredType = 1 // has type Int and a default getter
```

We can write custom accessors, very much like ordinary functions, right inside a property declaration. Here's an example of a custom getter:

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

A custom setter looks like this:

``` kotlin
var stringRepresentation: String
  get() = this.toString()
  set(value) {
    setDataFromString(value) // parses the string and assigns values to other properties
  }
```

By convention, the name of the setter parameter is `value`, but you can choose a different name if you prefer.

If you need to change the visibility of an accessor or to annotate it, but don't need to change the default implementation,
you can define the accessor without defining its body:

``` kotlin
var setterVisibility: String = "abc" // Initializer required, not a nullable type
  private set // the setter is private and has the default implementation

var setterWithAnnotation: Any?
  @Inject set // annotate the setter with Inject
```

### Backing Fields

Classes in Kotlin cannot have fields. However, sometimes it is necessary to have a backing field when using custom accessors. For these purposes, Kotlin provides
an automatic backing field which can be accessed using the *$* symbol followed by the property name.

``` kotlin
var counter = 0 // the initializer value is written directly to the backing field
  set(value) {
    if (value >= 0)
      $counter = value
  }
```

The `$counter` field can be accessed only from inside the class where the counter property is defined.

The compiler looks at the accessors' bodies, and if they use the backing field (or the accessor implementation is left by default), a backing field is generated, otherwise it is not.

For example, in the following case there will be no backing field:

``` kotlin
val isEmpty: Boolean
  get() = this.size == 0
```

### Backing Properties

If you want to do something that does not fit into this "implicit backing field" scheme, you can always fall back to having a *backing property*:

``` kotlin
private var _table: Map<String, Int>? = null
public val table: Map<String, Int>
  get() {
    if (_table == null)
      _table = HashMap() // Type parameters are inferred
    return _table ?: throw AssertionError("Set to null by another thread")
  }
```

In all respects, this is just the same as in Java since access to private properties with default getters and setters is optimized so that no function call overhead is introduced.


## Late-Initialized Properties

Normally, properties declared as having a non-null type must be initialized in the constructor.
However, fairly often this is not convenient. For example, properties can be initialized through dependency injection,
or in the setup method of a unit test. In this case, you cannot supply a non-null initializer in the constructor,
but you still want to avoid null checks when referencing the property inside the body of a class.

To handle this case, you can mark the property with the `lateinit` modifier:

``` kotlin
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

The modifier can only be used on properties declared inside the body of a class (not in the primary constructor), and only
when the property does not have a custom getter or setter. The type of the property must be non-null, and it must not be
a primitive type.

Accessing a `lateinit` property before it has been initialized throws a special exception that clearly identifies the property
being accessed and the fact that it hasn't been initialized.

## Overriding Properties

See [Overriding Members](classes.html#overriding-members)

## Delegated Properties
  
The most common kind of properties simply reads from (and maybe writes to) a backing field. 
On the other hand, with custom getters and setters one can implement any behaviour of a property.
Somewhere in between, there are certain common patterns of how a property may work. A few examples: lazy values,
reading from a map by a given key, accessing a database, notifying listener on access, etc.

Such common behaviours can be implemented as libraries using _delegated properties_.
For more information, look [here](delegated-properties.html).

