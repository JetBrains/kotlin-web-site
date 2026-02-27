---

# Basic Syntax Overview (Enhanced & Updated)

This document presents a structured overview of Kotlin’s fundamental syntax elements with practical examples. Each section concludes with a reference link for deeper exploration of the topic.

To gain a complete and structured understanding of Kotlin fundamentals, you can also explore the free **Kotlin Core track** offered by JetBrains Academy.

---

## Package Definition and Imports

The package declaration must appear at the top of a Kotlin source file:

```kotlin
package my.demo

import kotlin.text.*

// ...
```

Unlike many other languages, Kotlin does **not strictly require** the directory structure to match the package name. Source files may be organized freely in the file system.

See: *Packages*

---

## Program Entry Point

The entry point of a Kotlin application is the `main` function:

```kotlin
fun main() {
    println("Hello world!")
}
```

An alternative version of `main` accepts command-line arguments:

```kotlin
fun main(args: Array<String>) {
    println(args.contentToString())
}
```

Both forms are valid depending on whether your program needs external input parameters.

---

## Printing to Standard Output

The `print()` function outputs text without adding a new line:

```kotlin
print("Hello ")
print("world!")
```

The `println()` function outputs text followed by a line break:

```kotlin
println("Hello world!")
println(42)
```

Use `println()` when you want each output on a new line.

---

## Reading from Standard Input

The `readln()` function reads an entire line of user input as a `String`.

Example:

```kotlin
println("Enter any word: ")
val yourWord = readln()
print("You entered the word: ")
print(yourWord)
```

These basic input/output functions allow interactive console programs.

See: *Read standard input*

---

## Functions

### Function with Explicit Return Type

```kotlin
fun sum(a: Int, b: Int): Int {
    return a + b
}
```

### Expression Body Function (Type Inferred)

```kotlin
fun sum(a: Int, b: Int) = a + b
```

Kotlin can infer the return type automatically when using an expression body.

### Function Returning No Meaningful Value

```kotlin
fun printSum(a: Int, b: Int): Unit {
    println("sum of $a and $b is ${a + b}")
}
```

The `Unit` return type is optional and may be omitted:

```kotlin
fun printSum(a: Int, b: Int) {
    println("sum of $a and $b is ${a + b}")
}
```

See: *Functions*

---

## Variables

Kotlin uses two keywords for variable declaration:

* `val` → Immutable (read-only)
* `var` → Mutable (reassignable)

### Immutable Variable

```kotlin
val x: Int = 5
```

Once assigned, the value cannot change.

### Mutable Variable

```kotlin
var x: Int = 5
x += 1
```

The value can be reassigned.

### Type Inference

Kotlin automatically infers types:

```kotlin
val x = 5  // Inferred as Int
```

### Delayed Initialization

```kotlin
val c: Int
c = 3
```

When initializing later, you must explicitly declare the type.

### Top-Level Variables

```kotlin
val PI = 3.14
var x = 0
```

Top-level properties are accessible throughout the file.

See: *Properties*

---

## Creating Classes and Instances

### Basic Class

```kotlin
class Shape
```

### Class with Properties

```kotlin
class Rectangle(val height: Double, val length: Double) {
    val perimeter = (height + length) * 2
}
```

### Creating an Instance

```kotlin
val rectangle = Rectangle(5.0, 2.0)
println(rectangle.perimeter)
```

### Inheritance

Kotlin classes are `final` by default. To allow inheritance, use `open`:

```kotlin
open class Shape

class Rectangle(val height: Double, val length: Double) : Shape()
```

See: *Classes* and *Objects and instances*

---

## Comments

### Single-Line Comment

```kotlin
// This is a comment
```

### Multi-Line Comment

```kotlin
/* Multi-line
   comment */
```

Kotlin supports nested block comments, which improves documentation flexibility.

See: *Documenting Kotlin Code*

---

## String Templates

String templates allow embedding variables and expressions directly:

```kotlin
val a = 1
val s1 = "a is $a"
val s2 = "${s1.replace("is", "was")}, but now is $a"
```

They improve readability and reduce concatenation complexity.

See: *String templates*

---

## Conditional Expressions

### Traditional If-Else

```kotlin
fun maxOf(a: Int, b: Int): Int {
    if (a > b) return a
    else return b
}
```

### If as an Expression

```kotlin
fun maxOf(a: Int, b: Int) = if (a > b) a else b
```

In Kotlin, `if` returns a value.

See: *if-expressions*

---

## For Loop

```kotlin
for (item in items) {
    println(item)
}
```

Or using indices:

```kotlin
for (index in items.indices) {
    println(items[index])
}
```

See: *for loops*

---

## While Loop

```kotlin
while (index < items.size) {
    println(items[index])
    index++
}
```

See: *while loops*

---

## When Expression

The `when` expression replaces traditional `switch` statements:

```kotlin
fun describe(obj: Any): String =
    when (obj) {
        1 -> "One"
        "Hello" -> "Greeting"
        is Long -> "Long"
        !is String -> "Not a string"
        else -> "Unknown"
    }
```

`when` is powerful and can return values directly.

See: *when expressions and statements*

---

## Ranges

### Check Inside a Range

```kotlin
if (x in 1..10) {
    println("In range")
}
```

### Iterate Over a Range

```kotlin
for (x in 1..5) {
    print(x)
}
```

### Progressions

```kotlin
for (x in 1..10 step 2) print(x)
for (x in 9 downTo 0 step 3) print(x)
```

See: *Ranges and progressions*

---

## Collections

### Iteration

```kotlin
for (item in items) {
    println(item)
}
```

### Membership Check

```kotlin
if ("apple" in items) {
    println("Found")
}
```

### Functional Operations (Lambdas)

```kotlin
fruits
    .filter { it.startsWith("a") }
    .sorted()
    .map { it.uppercase() }
    .forEach { println(it) }
```

Kotlin’s collection API encourages a functional programming style.

See: *Collections overview*

---

## Nullable Values and Null Safety

Nullable types use `?`:

```kotlin
fun parseInt(str: String): Int?
```

### Null Check Example

```kotlin
if (x != null && y != null) {
    println(x * y)
}
```

### Early Return Pattern

```kotlin
if (x == null) return
```

Kotlin’s null-safety system prevents `NullPointerException` at compile time.

See: *Null-safety*

---

## Type Checks and Smart Casts

Use `is` to check types:

```kotlin
if (obj is String) {
    println(obj.length) // Smart cast
}
```

Kotlin automatically casts the variable after a successful type check (Smart Cast).

You can also combine checks:

```kotlin
if (obj is String && obj.length > 0) {
    println(obj.length)
}
```

See: *Type casts*

---

# Summary

This enhanced overview preserves the original structure while clarifying explanations and modernizing phrasing. It covers:

* Program structure
* Functions and variables
* Classes and inheritance
* Control flow
* Collections
* Null safety
* Type checking
