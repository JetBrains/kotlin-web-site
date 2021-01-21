[//]: # (title: Data classes)

You often create classes whose main purpose is to hold data.
In such classes, some standard functionality and utility functions are often mechanically
derivable from the data. In Kotlin, these are called _data classes_ and are marked with `data`:

```kotlin
data class User(val name: String, val age: Int)
```

The compiler automatically derives the following members from all properties declared in the primary constructor:
  
  * `equals()`/`hashCode()` pair
  * `toString()` of the form `"User(name=John, age=42)"`
  * [`componentN()` functions](destructuring-declarations.md) corresponding to the properties in their order of declaration.
  * `copy()` function (see below).

To ensure consistency and meaningful behavior of the generated code, data classes have to fulfill the following requirements:

  * The primary constructor needs to have at least one parameter.
  * All primary constructor parameters need to be marked as `val` or `var`.
  * Data classes cannot be abstract, open, sealed or inner.
  
Additionally, the members generation follows these rules with regard to the members inheritance:

* If there are explicit implementations of `equals()`, `hashCode()` or `toString()` in the data class body or 
`final` implementations in a superclass, then these functions are not generated, and the existing 
implementations are used.
* If a supertype has the `componentN()` functions that are `open` and return compatible types, the 
corresponding functions are generated for the data class and override those of the supertype. If the functions of the 
supertype cannot be overridden due to incompatible signatures or being final, an error is reported. 
* Providing explicit implementations for the `componentN()` and `copy()` functions is not allowed.
  
Data classes may extend other classes (see [Sealed classes](sealed-classes.md) for examples).

> On the JVM, if the generated class needs to have a parameterless constructor, default values for all properties have 
> to be specified (see [Constructors](classes.md#constructors)).
>
{type="note"}

```kotlin
data class User(val name: String = "", val age: Int = 0)
```

## Properties declared in the class body

The compiler only uses the properties defined inside the primary constructor for the automatically generated 
functions. To exclude a property from the generated implementations, declare it inside the class body:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

Only the property `name` will be used inside the `toString()`, `equals()`, `hashCode()`, and `copy()` implementations, 
and there will only be one component function `component1()`. While two `Person` objects can have different ages, 
they will be treated as equal.

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
    val person1 = Person("John")
    val person2 = Person("John")
    person1.age = 10
    person2.age = 20
//sampleEnd
    println("person1 == person2: ${person1 == person2}")
    println("person1 with age ${person1.age}: ${person1}")
    println("person2 with age ${person2.age}: ${person2}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Copying
  
To copy an object for changing _some_ of its properties, but keeping the rest unchanged, use  
the `copy()` function. For the `User` class above, its implementation would be as follows:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```

You can write the following:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## Data classes and destructuring declarations

_Component functions_ generated for data classes enable their use in [destructuring declarations](destructuring-declarations.md):

```kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

## Standard data classes

The standard library provides `Pair` and `Triple`. In most cases, though, named data classes are a better design choice, 
because they make the code more readable by providing meaningful names for properties.
