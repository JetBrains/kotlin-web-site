---
type: doc
layout: reference
category: "Classes and Objects"
title: "Visibility Modifiers"
---

# Visibility Modifiers

Classes, objects, traits, constructors, functions, properties and their setters can have _visibility modifiers_. 
(Getters always have the same visibility as the property.) 
There are four visibility modifiers in Kotlin:

* `private` --- visible only in the declaring scope and its subscopes (inside the same module);
* `protected` --- (applicable only to class/trait members) like `private`, but also visible in subclasses;
* `internal` --- (used by default) visible everywhere within the same module (if the owner of declaring scope is visible);
* `public` --- visible everywhere (if the owner of declaring scope is visible).

**NOTE**: Functions _with expression bodies_ and all properties declared `public` must always specify return types explicitly. 
This is required so that one has no chance of accidentally changing a type that is a part of a public API by merely 
altering the implementation.

``` kotlin
public val foo: Int = 5    // explicit return type required
public fun bar() : Int = 5 // explicit return type required     
public fun bar() {}        // block body: return type is Unit and can't be changed 
                           // accidentally, so not required      
```

Below please find explanations of these for different type of declaring scopes.  
  
## Packages
  
Functions, properties and classes, objects and traits can be declared on the "top-level", i.e. directly inside a package:
  
``` kotlin
// file name: example.kt
package foo

fun baz() {}
class Bar {}
```

* If you do not specify any visibility modifier, `internal` is used by default, which means that your declarations will be 
visible everywhere within the same module;  
* If you mark a declaration `private`, it will only be visible inside this package and its subpackages, and only within 
the same module;
* If you mark it `public`, it is visible everywhere;
* `protected` is not available for top-level declarations.

Examples:

``` kotlin
// file name: example.kt
package foo

private fun foo() {} // visible inside this package and subpackaged

public var bar: Int = 5 // property is visible everywhere
    private set         // setter is visible only in this package and subpackages
    
internal val baz = 6    // visible inside the same module, the modifier can be omitted    
```

## Classes and Traits

When declared inside a class:

* `private` means visible inside this class only (including all its members);
* `protected` --- same as `private` + visible in subclasses too;
* `internal` --- any client *inside this module* who sees the declaring class sees its `internal` members;
* `public` --- any client who sees the declaring class sees its `public` members.

*NOTE* for Java users: outer class does not see private members of its inner classes in Kotlin.
 
Examples:

``` kotlin
open class Outer {
    private val a = 1
    protected val b = 2
    val c = 3 // internal by default
    public val d: Int = 4 // return type required
    
    protected class Nested {
        public val e: Int = 5
    }
}

class Subclass : Outer() {
    // a is not visible
    // b, c and d are visible
    // Nested and e are visible
}

class Unrelated(o: Outer) {
    // o.a, o.b are not visible
    // o.c and o.d are visible (same module)
    // Outer.Nested is not visible, and Nested::e is not visible either 
}
```

### Constructors

To specify visibility of a constructor, use the following syntax:

``` kotlin
class C private (a: Int) { ... }
```

Here constructor is private. Unlike other declarations, by default, all constructors are `public`, which effectively 
amounts to the being visible everywhere where the class is visible (i.e. a constructor of an `internal` class is only 
visible within the same module).
     
### Local declarations
     
Local variables, functions and classes can not have visibility modifiers.     