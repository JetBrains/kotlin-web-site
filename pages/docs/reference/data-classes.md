---
type: doc
layout: reference
category: "Classes and Objects"
title: "Data Classes"
---

# Data Classes

We frequently create classes whose main purpose is to hold data.
In such a class some standard functionality and utility functions are often mechanically
derivable from the data. In Kotlin, this is called a _data class_ and is marked as `data`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
data class User(val name: String, val age: Int)
```
</div>

The compiler automatically derives the following members from all properties declared in the primary constructor:
  
  * `equals()`/`hashCode()` pair;
  * `toString()` of the form `"User(name=John, age=42)"`;
  * [`componentN()` functions](multi-declarations.html) corresponding to the properties in their order of declaration;
  * `copy()` function (see below).

To ensure consistency and meaningful behavior of the generated code, data classes have to fulfill the following requirements:

  * The primary constructor needs to have at least one parameter;
  * All primary constructor parameters need to be marked as `val` or `var`;
  * Data classes cannot be abstract, open, sealed or inner;
  * (before 1.1) Data classes may only implement interfaces.
  
Additionally, the members generation follows these rules with regard to the members inheritance:

* If there are explicit implementations of `equals()`, `hashCode()` or `toString()` in the data class body or 
*final*{: .keyword } implementations in a superclass, then these functions are not generated, and the existing 
implementations are used;
* If a supertype has the `componentN()` functions that are *open*{: .keyword } and return compatible types, the 
corresponding functions are generated for the data class and override those of the supertype. If the functions of the 
supertype cannot be overridden due to incompatible signatures or being final, an error is reported; 
* Deriving a data class from a type that already has a `copy(...)` function with a matching signature is deprecated in 
Kotlin 1.2 and will be prohibited in Kotlin 1.3.
* Providing explicit implementations for the `componentN()` and `copy()` functions is not allowed.
  
Since 1.1, data classes may extend other classes (see [Sealed classes](sealed-classes.html) for examples).

On the JVM, if the generated class needs to have a parameterless constructor, default values for all properties have to be specified
(see [Constructors](classes.html#constructors)).

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
data class User(val name: String = "", val age: Int = 0)
```
</div>

## Properties Declared in the Class Body

Note that the compiler only uses the properties defined inside the primary constructor for the automatically generated functions. To exclude a property from the generated implementations, declare it inside the class body:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```
</div>

Only the property `name` will be used inside the `toString()`, `equals()`, `hashCode()`, and `copy()` implementations, and there will only be one component function `component1()`. While two `Person` objects can have different ages, they will be treated as equal.

<div class="sample" markdown="1" theme="idea">

``` kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main(args: Array<String>) {
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
</div>

## Copying
  
It's often the case that we need to copy an object altering _some_ of its properties, but keeping the rest unchanged. 
This is what `copy()` function is generated for. For the `User` class above, its implementation would be as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```
</div>

This allows us to write:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```
</div>

## Data Classes and Destructuring Declarations

_Component functions_ generated for data classes enable their use in [destructuring declarations](multi-declarations.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```
</div>

## Standard Data Classes

The standard library provides `Pair` and `Triple`. In most cases, though, named data classes are a better design choice, 
because they make the code more readable by providing meaningful names for properties.
