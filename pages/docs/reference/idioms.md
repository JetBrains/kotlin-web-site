---
type: doc
layout: reference
category: "Basics"
title: "Idioms"
---

# Idioms

A collection of random and frequently used idioms in Kotlin. If you have a favorite idiom, contribute it by sending a pull request.

### Creating DTOs (POJOs/POCOs)

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
data class Customer(val name: String, val email: String)
```
</div>

provides a `Customer` class with the following functionality:

* getters (and setters in case of *var*{: .keyword }s) for all properties
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* `component1()`, `component2()`, ..., for all properties (see [Data classes](data-classes.html))


### Default values for function parameters

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```
</div>

### Filtering a list

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val positives = list.filter { x -> x > 0 }
```
</div>

Or alternatively, even shorter:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val positives = list.filter { it > 0 }
```
</div>

### Checking element presence in a collection.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```
</div>

### String Interpolation

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
println("Name $name")
```
</div>

### Instance Checks

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```
</div>

### Traversing a map/list of pairs

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```
</div>

`k`, `v` can be called anything.

### Using ranges

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
for (i in 1..100) { ... }  // closed range: includes 100
for (i in 1 until 100) { ... } // half-open range: does not include 100
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
if (x in 1..10) { ... }
```
</div>

### Read-only list

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val list = listOf("a", "b", "c")
```
</div>

### Read-only map

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```
</div>

### Accessing a map

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
println(map["key"])
map["key"] = value
```
</div>

### Lazy property

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val p: String by lazy {
    // compute the string
}
```
</div>

### Extension Functions

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```
</div>

### Creating a singleton

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
object Resource {
    val name = "Name"
}
```
</div>

### If not null shorthand

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val files = File("Test").listFiles()

println(files?.size)
```
</div>

### If not null and else shorthand

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val files = File("Test").listFiles()

println(files?.size ?: "empty")
```
</div>

### Executing a statement if null

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```
</div>

### Get first item of a possibly empty collection

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val emails = ... // might be empty
val mainEmail = emails.firstOrNull() ?: ""
```
</div>

### Execute if not null

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val value = ...

value?.let {
    ... // execute this block if not null
}
```
</div>

### Map nullable value if not null

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// defaultValue is returned if the value or the transform result is null.
```
</div>

### Return on when statement

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```
</div>

### 'try/catch' expression

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // Working with result
}
```
</div>

### 'if' expression

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
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
</div>

### Builder-style usage of methods that return `Unit`

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```
</div>


### Single-expression functions

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun theAnswer() = 42
```
</div>

This is equivalent to

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun theAnswer(): Int {
    return 42
}
```
</div>

This can be effectively combined with other idioms, leading to shorter code. E.g. with the *when*{: .keyword }-expression:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```
</div>

### Calling multiple methods on an object instance (`with`)

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { //draw a 100 pix square
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```
</div>

### Configuring properties of an object (`apply`)
<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```
</div>

This is useful for configuring properties that aren't present in the object constructor.

### Java 7's try with resources

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```
</div>

### Convenient form for a generic function that requires the generic type information

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```
</div>

### Consuming a nullable Boolean

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val b: Boolean? = ...
if (b == true) {
    ...
} else {
    // `b` is false or null
}
```
</div>

### Swapping two variables

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```
</div>

### TODO(): Marking code as incomplete
 
Kotlin's standard library has a `TODO()` function that will always throw a `NotImplementedError`.
Its return type is `Nothing` so it can be used regardless of expected type.
There's also an overload that accepts a reason parameter:
```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA's kotlin plugin understands the semantics of `TODO()` and automatically adds a code pointer in the TODO toolwindow. 

