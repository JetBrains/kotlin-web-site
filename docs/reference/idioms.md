---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# Idioms

A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it. Do a pull request.

### Creating DTO's (POJO's/POCO's)

``` kotlin
data class Customer(val name: String, val email: String)
```

provides a Customer class with the following functionality:

* getters (and setters in case of `var`'s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))

### Declaring a final local variable

``` kotlin
val a = foo()
```

### Default values for function paramters

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### Filtering a list

``` kotlin
val positivies = list.filter { x -> x > 0 }
```

Or alternatively, even shorter:

``` kotlin
val positivies = list.filter { it > 0 }
```

### String Interpolation

``` kotlin
println("Name $name")
```

### Instance Checks

``` kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

### Traversing a map/list of pairs

``` kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

k,v can be called anything.

### Using ranges

``` kotlin
for (i in 1..100) { ... }
for (x in 2..10) { ... }
```

### Read-only list

``` kotlin
val list = listOf("a", "b", "c")
```

### Read-only map

``` kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

### Accessing a map

``` kotlin
println(map["key"])
map["key"] = value
```

### Lazy property

``` kotlin
val p: String by Delegates.lazy {
    // compute the string
}
```

### Extension Functions

``` kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

### Creating a singleton

``` kotlin
object Resource {
    val name = "Name"
}
```

### If not null shorthand

``` kotlin
val files = File("Test").listFiles()

println(files?.size)
```

### If not null and else shorthand

``` kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```

### Executing a statement if null

``` kotlin
val data = ...
val email = data["email"] ?: throw IllegalStateException("Email is missing!")
```

### Execute if not null

``` kotlin
val data = ...

data?.let {
    ... // execute this block if not null
}
```

### Return on when statement

``` kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

### Return on try catch block

``` kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```

### Return on if statement

``` kotlin
fun foo(param: Int) {
    val result = if (param == 1) {
        "one"
    } else if (param == 2) {
        "two"
    } else {
        "three"
    }
}
```

### Single-expression functions

``` kotlin
fun theAnswer() = 42
```

This is equivalent to

``` kotlin
fun theAnswer() {
    return 42
}
```

This can be effectively combined with other idioms, leading to shorter code. E.g. with the when expression:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
