---
type: doc
layout: reference
category: "Classes and Objects"
title: "Data Classes"
---

# Data Classes

We frequently create a class to do nothing but hold data. In such a class some standard functionality is often mechanically
derivable from the data. In Kotlin, this is called a _data class_ and is marked as `data`:
 
``` kotlin
data class User(val name: String, val age: Int)
```

The compiler automatically derives the following members from all properties declared in the primary constructor:
  
  * `equals()`/`hashCode()` pair, 
  * `toString()` of the form `"User(name=John, age=42)"`,
  * [`componentN()` functions](multi-declarations.html) corresponding to the properties in their order of declaration,
  * `copy()` function (see below).
  
If any of these functions is explicitly defined in the class body or inherited from the base types, it will not be generated.

To ensure consistency and meaningful behavior of the generated code, data classes have to fulfil the following requirements:

  * The primary constructor needs to have at least one parameter;
  * All primary constructor parameters need to be marked as `val` or `var`;
  * Data classes cannot be abstract, open, sealed or inner;
  * Data classes may not extend other classes (but may implement interfaces).
  
> On the JVM, if the generated class needs to have a parameterless constructor, default values for all properties have to be specified
> (see [Constructors](classes.html#constructors)).
>
> ``` kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```

## Copying
  
It's often the case that we need to copy an object altering _some_ of its properties, but keeping the rest unchanged. 
This is what `copy()` function is generated for. For the `User` class above, its implementation would be as follows:
     
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     

This allows us to write

``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## Data Classes and Destructuring Declarations

_Component functions_ generated for data classes enable their use in [destructuring declarations](multi-declarations.html):

``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

## Standard Data Classes

The standard library provides `Pair` and `Triple`. In most cases, though, named data classes are a better design choice, 
because they make the code more readable by providing meaningful names for properties.
