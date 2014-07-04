---
type: doc
layout: reference
category: "Classes and Objects"
title: "Data Classes"
---

# Data Classes

We frequently create classes that do nothing but hold data. In such classes some functionality if often mechanically 
derivable from the data they hold. In Kotlin a class can be annotated as `data`:
 
``` kotlin
data class User(val name: String, val age: Int)
```

This is called a _data class_. The compiler automatically derives the following members from all properties _declared in 
the primary constructor_:
  
  * `equals()`/`hashCode()` pair, 
  * `toString()` of the form `"User(name=a, age=1)"`,
  * [`componentN()` functions](multi-declarations.html) corresponding to the properties in their order or declaration,
  * `copy()` function (see below).
  
If any of these functions is explicitly defined in the class body or inherited from the base types, it will not be generated.  
  
*NOTE* that if a constructor parameter does not have a `val` or `var` in front of it, it will not be included in computation 
of all these functions; nor will be properties declared in the class body or inherited from the superclass.
  
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

## Data Classes and Multi-Declarations

_Component functions_ generated for data classes enable their use in [multi-declarations](multi-declarations.html):

``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // prints "Jane, 35 years of age"
```

## Standard Data Classes

The standard library provides `Pair` and `Triple`. In most cases, though, named data classes are a better design choice, 
because they make the code more readable by providing meaningful names for properties.  