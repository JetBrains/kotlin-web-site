[//]: # (title: Data classes)

Data classes in Kotlin are primarily used to hold data. For each data class, the compiler automatically generates 
additional member functions that allow you to print an instance to readable output, compare instances, copy instances, and more.
Data classes are marked with `data`:

```kotlin
data class User(val name: String, val age: Int)
```

The compiler automatically derives the following members from all properties declared in the primary constructor:

* `.equals()`/`.hashCode()` pair.
* `.toString()` of the form `"User(name=John, age=42)"`.
* [`.componentN()` functions](destructuring-declarations.md) corresponding to the properties in their order of declaration.
* `.copy()` function (see below).

To ensure consistency and meaningful behavior of the generated code, data classes have to fulfill the following requirements:

* The primary constructor must have at least one parameter.
* All primary constructor parameters must be marked as `val` or `var`.
* Data classes can't be abstract, open, sealed, or inner.

Additionally, the generation of data class members follows these rules with regard to the members' inheritance:

* If there are explicit implementations of `.equals()`, `.hashCode()`, or `.toString()` in the data class body or
  `final` implementations in a superclass, then these functions are not generated, and the existing
  implementations are used.
* If a supertype has `.componentN()` functions that are `open` and return compatible types, the
  corresponding functions are generated for the data class and override those of the supertype. If the functions of the
  supertype cannot be overridden due to incompatible signatures or due to their being final, an error is reported.
* Providing explicit implementations for the `.componentN()` and `.copy()` functions is not allowed.

Data classes may extend other classes (see [Sealed classes](sealed-classes.md) for examples).

> On the JVM, if the generated class needs to have a parameterless constructor, default values for the properties have
> to be specified (see [Constructors](classes.md#constructors)):
> 
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## Properties declared in the class body

The compiler only uses the properties defined inside the primary constructor for the automatically generated
functions. To exclude a property from the generated implementations, declare it inside the class body:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

In the example below, only the `name` property is used by default inside the `.toString()`, `.equals()`, `.hashCode()`, 
and `.copy()` implementations, and there is only one component function, `.component1()`. 
The `age` property is declared inside the class body and is excluded.
Therefore, two `Person` objects with the same `name` but different `age` values are considered equal since `.equals()` 
only evaluates properties from the primary constructor:

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

    println("person1 == person2: ${person1 == person2}")
    // person1 == person2: true
  
    println("person1 with age ${person1.age}: ${person1}")
    // person1 with age 10: Person(name=John)
  
    println("person2 with age ${person2.age}: ${person2}")
    // person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Copying

Use the `.copy()` function to copy an object, allowing you to alter _some_ of its properties while keeping the rest unchanged.
The implementation of this function for the `User` class above would be as follows:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

You can then write the following:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## Data classes and destructuring declarations

_Component functions_ generated for data classes make it possible to use them in [destructuring declarations](destructuring-declarations.md):

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age") 
// Jane, 35 years of age
```

## Standard data classes

The standard library provides the `Pair` and `Triple` classes. In most cases, though, named data classes are a better design choice
because they make the code easier to read by providing meaningful names for the properties.