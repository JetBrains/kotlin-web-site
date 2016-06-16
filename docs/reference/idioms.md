---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# Idioms

A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it. Do a pull request.

### Creating DTOs (POJOs/POCOs)

``` kotlin
data class Customer(val name: String, val email: String)
```

provides a `Customer` class with the following functionality:

* getters (and setters in case of *var*{: .keyword }s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))


### Default values for function parameters

``` kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

### Filtering a list

``` kotlin
val positives = list.filter { x -> x > 0 }
```

Or alternatively, even shorter:

``` kotlin
val positives = list.filter { it > 0 }
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

`k`, `v` can be called anything.

### Using ranges

``` kotlin
for (i in 1..100) { ... }  // closed range: includes 100
for (i in 1 until 100) { ... } // half-open range: does not include 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
if (x in 1..10) { ... }
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
val p: String by lazy {
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

### 'try/catch' expression

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

### 'if' expression

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

### Builder-style usage of methods that return `Unit`

``` kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```


### Single-expression functions

``` kotlin
fun theAnswer() = 42
```

This is equivalent to

``` kotlin
fun theAnswer(): Int {
    return 42
}
```

This can be effectively combined with other idioms, leading to shorter code. E.g. with the *when*{: .keyword }-expression:

``` kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

### Calling multiple methods on an object instance ('with')

``` kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for(i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

### Java 7's try with resources

``` kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

### Convenient form for a generic function that requires the generic type information

``` kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json): T = this.fromJson(json, T::class.java)
```

### Consuming a nullable Boolean

``` kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` is false or null
}
```
