[//]: # (title: Enum classes)

Enum classes represent a fixed set of possible values. Use an enum class when a value can only be one of several
predefined options, such as available states or modes.

Each value in an enum class is called an _enum constant_. Enum constants are [singleton objects](object-declarations.md)
of the enum class type, so they can have properties, functions, and custom behavior.

Use enum classes when all possible values are known in advance and have the same structure. Use [sealed classes or interfaces](sealed-classes.md)
when you need to ahve hold different data or have a different structure for each case.

## Create enum classes

To create an enum class, use the `enum` keyword and list the enum constants inside the class body, separated by
commas:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

In this example, `Direction` is the enum class, and `NORTH`, `SOUTH`, `WEST`, and `EAST` are enum constants.

By convention, enum constants are usually written in uppercase because they represent constant values.

You can access an enum constant by using the enum class name followed by the constant name:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}

fun main() {
    // `Direction.NORTH` is an enum constant of type `Direction`.
    val direction: Direction = Direction.NORTH

    println(direction) // NORTH
}
```
{kotlin-runnable="true" id="create-enum-class-kotlin"}

Every enum class in Kotlin inherits from the [`Enum<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-enum/) constructor,
where `T` is the enum class itself. For example, the `Direction` enum class inherits from `Enum<Direction>`.
This is why enum constants have built-in properties, such as [`name`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-enum/name.html) and [`ordinal`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-enum/ordinal.html).

Since enum constants are values, you can assign them to variables, print them, pass them to functions, compare them,
and use them in `when` expressions.

## Working with enum constants

### Declare enum constants

In Kotlin, enum constants don't use assignment syntax like `RED = "#FF0000"` or `LOW = 0`.
Instead, you can define properties in the enum class constructor and pass values to each enum constant in parentheses.

Enum constants can have associated values of any type. Strings and numbers are common examples, but you can also use
other types, such as `Boolean`, another enum class, or a custom class.

Consider the `Color` enum class that stores a hexadecimal color code for each color:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

fun main() {
    println(Color.RED.hex) // #FF0000
}
```
{kotlin-runnable="true" id="declare-enum-hex-kotlin"}

The value passed to each enum constant must match the constructor parameter type. Here, `hex` is a string property of the
`Color` enum class. Each enum constant passes its own string value for this property.

You can also associate numeric values with enum constants. For example, declare the `Int` type in the constructor and
provide an `Int` value for each enum constant:

```kotlin
enum class Priority(val level: Int) {
    LOW(0),
    MEDIUM(1),
    HIGH(2)
}

fun main() {
    println(Priority.MEDIUM.level) // 1
}
```
{kotlin-runnable="true" id="declare-enum-level-kotlin"}

### Access enum constants and their properties

You can access an enum constant through the enum class name:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

fun main() {
    val color: Color = Color.RED

    println(color) // RED
    println(color.hex) // #FF0000
    println(Color.GREEN.hex) // #00FF00
}
```
{kotlin-runnable="true" id="access-enum-properties-kotlin"}

Here, `Color.RED` is an enum constant of the `Color` type. The color variable stores this enum constant.

When you print an enum constant directly, Kotlin prints its name. To access a property associated with an enum constant,
use dot notation, such as `color.hex` or `Color.GREEN.hex`.

Besides any properties you define, every enum constant also has the built-in `name` and `ordinal` properties for
obtaining its name and position (starting from 0) in the enum class declaration:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    println(RGB.RED.name)    // RED
    println(RGB.RED.ordinal) // 0
}
```
{kotlin-runnable="true" id="rgb-enums-properties-kotlin"}

### Pass enum constants to functions

Because enum constants are values, you can pass them to functions:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun printColor(color: Color) {
    println("Color: $color")
    println("Hex code: ${color.hex}")
}

fun main() {
    printColor(Color.BLUE)
    // Color: BLUE
    // Hex code: #0000FF
}
//sampleEnd
```
{kotlin-runnable="true" id="pass-enum-to-function-kotlin"}

Here, the `printColor()` function accepts a value of type `Color`, so you can pass any `Color` enum constant to it.

### Use enum constants in `when` expressions

Enum classes are commonly used with when expressions when you want to handle each constant separately:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun describeColor(color: Color): String {
    return when (color) {
        Color.RED -> "Red is a warm color"
        Color.GREEN -> "Green is a natural color"
        Color.BLUE -> "Blue is a cool color"
    }
}

fun main() {
    println(describeColor(Color.RED))
    // Red is a warm color
}
//sampleEnd
```
{kotlin-runnable="true" id="enum-when-expression-kotlin"}

When you use all enum constants in a when expression, you don't need an `else` branch.

> To reduce repetition when working with enum entries, try out context-sensitive resolution (currently in preview).
> This feature allows you to omit the enum class name when the expected type is known, such as in `when` expressions or when assigning to a typed variable.
>
> For more information, see [Preview of context-sensitive resolution](whatsnew22.md#preview-of-context-sensitive-resolution) or the related [KEEP proposal](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md).
>
{style="tip"}

### Find enum constants

Sometimes you need to get an enum constant from a string, an index, or one of its associated values. Kotlin provides
built-in APIs to look up constants by name and use [`entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/-enum-entries/)
to look them up by position or custom values.

For example, consider an enum class where each color has an associated RGB value. To find an enum constant by its name,
use the `valueOf()` function:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

fun main() {
    val color = Color.valueOf("RED")

    println(color) // RED
}
```
{kotlin-runnable="true" id="find-enum-valueof-kotlin"}

The name passed to `valueOf()` must match the enum constant name exactly. If there is no enum constant with the
specified name, `valueOf()` throws an `IllegalArgumentException`.

To find an enum constant by its position in the enum declaration, use [`entries.getOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/get-or-null.html):

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

//sampleStart
fun main() {
    val color = Color.entries.getOrNull(0)

    println(color) // RED
}
//sampleEnd
```
{kotlin-runnable="true" id="find-enum-getornull-kotlin"}

Enum positions start from `0`. In this example, `RED` has position 0, `GREEN` has position 1, and `BLUE` has position 2.

This is useful when you need to look up an enum constant by index. Kotlin doesn't support directly casting an `Int` to
an enum constant. If you have an integer, use it as an index with `entries.getOrNull(index)` or define a stable numeric
property and look up the matching enum constant.

> Avoid relying on positions for values that need to stay stable. If you reorder the enum constants, their positions
> change. For stable values, define an explicit property, for example, `rgb` or `code`.
>
{style="note"}

Since `entries` is a specialized `List`, you can use standard collection APIs with it. For example, to find an enum
constant by an associated value, search through entries using [`first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html):

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

//sampleStart
fun main() {
    val color = Color.entries.first { it.rgb == 0xFF0000 }

    println(color) // RED
}
//sampleEnd
```
{kotlin-runnable="true" id="find-enum-first-kotlin"}

The `first()` function throws a `NoSuchElementException` if no matching constant is found. To get `null` instead, use
[`firstOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-or-null.html).

To get the number of enum constants, use the [`size`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-list/size.html) function. For example:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    println(RGB.entries)
    // [RED, GREEN, BLUE]
    println(RGB.entries.size)
    // 3
    println("The first color is: ${RGB.valueOf("RED")}")
    // "The first color is: RED"
}
```
{kotlin-runnable="true" id="rgb-enums-entries-kotlin"}


If you often need to look up enum constants by name, position, or associated value, add helper functions in a [companion object](object-declarations.md#companion-objects):

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF);

    companion object {
        fun fromName(name: String): Color? =
            entries.find { it.name == name }

        fun fromPosition(position: Int): Color? =
            entries.getOrNull(position)

        fun fromRgb(rgb: Int): Color? =
            entries.find { it.rgb == rgb }
    }
}

fun main() {
    println(Color.fromName("RED"))   // RED
    println(Color.fromPosition(1))   // GREEN
    println(Color.fromRgb(0x0000FF)) // BLUE 
    println(Color.fromRgb(0xABCDEF)) // null
}
```
{kotlin-runnable="true" id="find-enum-companion-object-kotlin"}

Companion object helper functions are useful when you want safe lookups that return null instead of throwing an exception.

The lookup APIs used above, such as `entries` and `valueOf()`, are examples of _synthetic_ members.
In this context, synthetic means that Kotlin provides these members automatically, even though you don't declare them
yourself. This is why every enum class can list its constants with `entries` and get a constant by name with `valueOf()`
without you writing extra code.

Some generic enum helper functions use reified type parameters. A reified type parameter keeps the actual enum type
available inside an inline generic function. This allows functions such as [`enumEntries<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/enum-entries.html) and [`enumValueOf<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/enum-value-of.html) to
work with the enum type `T` directly. You can access the constants in an enum class using the following functions:

| Function                                                                                           | Description                                                                                                    |
|----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| [`enumEntries<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.enums/enum-entries.html) | (Recommended) Returns all enum entries of the enum type `T`. Every call returns the same list.                 |
| [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html)          | Returns an array with all enum entries of the enum type `T`. Every call `enumValues<T>()` creates a new array. |
| [`enumValueOf<T>()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/enum-value-of.html)      | Returns a single enum entry by its name, throwing an `IllegalArgumentException` if no enum entry matches.      |

For example:

```kotlin
import kotlin.enums.enumEntries

enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    println(enumEntries<T>().joinToString { it.name })
}

inline fun <reified T : Enum<T>> findByName(name: String): T = enumValueOf<T>(name)

fun main() {
    printAllValues<RGB>() // RED, GREEN, BLUE
    println(findByName<RGB>("GREEN")) // GREEN
}
```
{kotlin-runnable="true" id="enum-reified-type-parameters-kotlin"}

For more information about inline functions and reified type parameters, see [Inline functions](inline-functions.md).

### Compare and sort enum constants

Use the `==` [structural equality](equality.md#structural-equality) operator to compare enum constants:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF")
}

//sampleStart
fun main() {
    val color = Color.RED

    println(color == Color.RED) // true
    println(color == Color.BLUE) // false
}
//sampleEnd
```
{kotlin-runnable="true" id="compare-enum-constants-kotlin"}

Since each enum constant is a singleton object, comparing enum constants checks whether both values refer to the same
constant.

All enum classes implement the [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
interface by default, so you can compare and sort enum constants. Constants are ordered by their position in the enum
declaration (their `ordinal` value), which means the constant declared first is considered the smallest:

```kotlin
enum class Priority {
    LOW, MEDIUM, HIGH
}

fun main() {
    println(Priority.LOW < Priority.HIGH)    // true
    println(Priority.HIGH > Priority.MEDIUM) // true
}
```
{kotlin-runnable="true" id="compare-enum-comparable-kotlin"}

Sorting follows the same declaration order. For example, `entries.sorted()` returns the constants in the order in which
they are declared, regardless of their names:

```kotlin
enum class Priority {
    HIGH, LOW, MEDIUM
}

fun main() {
    println(Priority.entries.sorted()) // [HIGH, LOW, MEDIUM]
}
```
{kotlin-runnable="true" id="sort-enum-declaration-order-kotlin"}

The `Enum<T>` class provides the `compareTo()`, `equals()`, and `hashCode()` functions, and you can't override them to
customize their behavior like in normal classes. Comparison always follows the declaration order.

If you need a different order, don't rely on the declaration order. Instead, define an explicit property and sort by it.
For example, sort colors by their brightness:

```kotlin
enum class Color(val brightness: Int) {
    RED(1),
    GREEN(3),
    BLUE(2)
}

fun main() {
    println(Color.entries.sortedBy { it.brightness })
    // [RED, BLUE, GREEN]
}
```
{kotlin-runnable="true" id="sort-enum-brightness-kotlin"}

For more information, see [Ordering](collection-ordering.md).

## Add functions to enum classes

Just like properties, enum classes can have functions. You can add functions that are shared by all enum constants,
combine them with properties, or define operator functions.

### Add functions shared by all constants

To add behavior that every enum constant shares, define a function in the enum class body. If the enum class defines any
members, separate the constant definitions from the member definitions with a semicolon:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST;

    fun isVertical(): Boolean = this == NORTH || this == SOUTH
}

fun main() {
    println(Direction.NORTH.isVertical()) // true
    println(Direction.EAST.isVertical())  // false
}
```
{kotlin-runnable="true" id="enum-shared-function-kotlin"}

Every enum constant can call the shared function. Inside the function, `this` refers to the enum constant it was called on.

You can combine constructor properties with functions to associate data with each constant and add behavior that uses
that data:

```kotlin
enum class Color(val hex: String) {
    RED("#FF0000"),
    GREEN("#00FF00"),
    BLUE("#0000FF");

    fun describe(): String = "$name has hex code $hex"
}

fun main() {
    println(Color.RED.describe()) // RED has hex code #FF0000
}
```
{kotlin-runnable="true" id="enum-properties-functions-kotlin"}

Here, each constant stores its own `hex` value, and the shared `describe()` function uses both the built-in `name`
property and the `hex` property.

### Add operator functions

Enum classes can also define [operator functions](operator-overloading.md), so you can use enum constants with
operators. For example, define the `not()` operator function to return the opposite direction with the `!` operator:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST;

    operator fun not(): Direction = when (this) {
        NORTH -> SOUTH
        SOUTH -> NORTH
        WEST -> EAST
        EAST -> WEST
    }
}

fun main() {
    println(!Direction.NORTH) // SOUTH
}
```
{kotlin-runnable="true" id="enum-operator-function-kotlin"}

## Use anonymous classes

Enum constants can declare their own anonymous classes with their corresponding methods, as well as with overriding base
methods. With anonymous classes, you write the class body directly after the enum constant
name, and Kotlin infers the enum class as the supertype.

This is useful when you declare an abstract function in the enum class and require each constant to provide its own
implementation. Each constant overrides the abstract function inside its own anonymous class:

```kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}

fun main() {
    var state = ProtocolState.WAITING

    println(state) // WAITING
    state = state.signal()
    println(state) // TALKING
}
```
{kotlin-runnable="true" id="enum-abstract-function-kotlin"}

Here, each constant implements the abstract `signal()` function differently, so calling `signal()` returns a different
next state depending on the constant.

## Implement interfaces in enum classes

An enum class can implement an interface (but it cannot derive from a class), providing either a common implementation of
interface members for all the entries or separate implementations for each entry within its anonymous class.
This is done by adding the interfaces you want to implement to the enum class declaration as follows:

```kotlin
import java.util.function.BinaryOperator
import java.util.function.IntBinaryOperator

//sampleStart
enum class IntArithmetics : BinaryOperator<Int>, IntBinaryOperator {
    PLUS {
        override fun apply(t: Int, u: Int): Int = t + u
    },
    TIMES {
        override fun apply(t: Int, u: Int): Int = t * u
    };
    
    override fun applyAsInt(t: Int, u: Int) = apply(t, u)
}
//sampleEnd

fun main() {
    val a = 13
    val b = 31
    for (f in IntArithmetics.entries) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true" id="implement-interfaces-enum-kotlin"}

In this example, the `IntArithmetics` enum class implements two interfaces in the
enum class declaration: `BinaryOperator<Int>` and `IntBinaryOperator`. Each
constant can override interface members inside its own anonymous class body, as `PLUS` and `TIMES` do for `apply()`,
while `applyAsInt()` provides a shared implementation for all constants.
