[//]: # (title: Enum classes)

The most basic use case for enum classes is the implementation of type-safe enums:

```kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
Each enum constant is an object. Enum constants are separated by commas.

Since each enum is an instance of the enum class, it can be initialized as:

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## Anonymous classes

Enum constants can declare their own anonymous classes with their corresponding methods, as well as with overriding base
methods.

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
```

If the enum class defines any members, separate the constant definitions from the member definitions with a semicolon.

## Implementing interfaces in enum classes

An enum class can implement an interface (but it cannot derive from a class), providing either a common implementation of
interface members for all the entries, or separate implementations for each entry within its anonymous class.
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
    for (f in IntArithmetics.values()) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
{kotlin-runnable="true"}

All enum classes implement the [Comparable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
interface by default. Constants in the enum class are defined in the natural order. For more information, see [Ordering](collection-ordering.md).

## Working with enum constants

Enum classes in Kotlin have synthetic methods for listing
the defined enum constants and getting an enum constant by its name. The signatures
of these methods are as follows (assuming the name of the enum class is `EnumClass`):

```kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

Below is an example of these methods in action:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.values()) println(color.toString()) // prints RED, GREEN, BLUE
    println("The first color is: ${RGB.valueOf("RED")}") // prints "The first color is: RED"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-kotlin"}

The `valueOf()` method throws an `IllegalArgumentException` if the specified name does
not match any of the enum constants defined in the class.

You can access the constants in an enum class in a generic way using
the [`enumValues<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-values.html) and [`enumValueOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/enum-value-of.html) functions:

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

printAllValues<RGB>() // prints RED, GREEN, BLUE
```

> For more information about inline functions and reified type parameters, see [Inline functions](inline-functions.md).
> 
> {type="tip"}

In Kotlin 1.9.0, the `entries` property is introduced as a replacement for the `values()` function. The 
`entries` property returns a pre-allocated immutable list of your enum constants. This is particularly useful when you 
are working with [collections](collections-overview.md) and can you help you avoid [performance issues](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md#examples-of-performance-issues).

For example:
```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    for (color in RGB.entries) println(color.toString())
    // prints RED, GREEN, BLUE
}
```

Every enum constant also has properties: [`name`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/name.html)
and [`ordinal`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-enum/ordinal.html), for obtaining its name and 
position (starting from 0) in the enum class declaration:

```kotlin
enum class RGB { RED, GREEN, BLUE }

fun main() {
    //sampleStart
    println(RGB.RED.name) // prints RED
    println(RGB.RED.ordinal) // prints 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="rgb-enums-properties-kotlin"}
