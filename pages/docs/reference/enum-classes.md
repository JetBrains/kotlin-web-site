---
type: doc
layout: reference
category: "Syntax"
title: "Enum Classes"
---

# Enum Classes

The most basic usage of enum classes is implementing type-safe enums:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```
</div>

Each enum constant is an object. Enum constants are separated with commas.

## Initialization

Since each enum is an instance of the enum class, they can be initialized as:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
enum class Color(val rgb: Int) {
        RED(0xFF0000),
        GREEN(0x00FF00),
        BLUE(0x0000FF)
}
```
</div>

## Anonymous Classes

Enum constants can also declare their own anonymous classes:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
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
</div>

with their corresponding methods, as well as overriding base methods. Note that if the enum class defines any
members, you need to separate the enum constant definitions from the member definitions with a semicolon, just like
in Java.

Enum entries cannot contain nested types other than inner classes (deprecated in Kotlin 1.2).

## Implementing Interfaces in Enum Classes

An enum class may implement an interface (but not derive from a class), providing either a single interface members implementation for all of the entries, or separate ones for each entry within its anonymous class. This is done by adding the interfaces to the enum class declaration as follows:

<div class="sample" markdown="1" theme="idea">

``` kotlin
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

fun main(args: Array<String>) {
    val a = 13
    val b = 31
    for (f in IntArithmetics.values()) {
        println("$f($a, $b) = ${f.apply(a, b)}")
    }
}
```
</div>

## Working with Enum Constants

Just like in Java, enum classes in Kotlin have synthetic methods allowing to list
the defined enum constants and to get an enum constant by its name. The signatures
of these methods are as follows (assuming the name of the enum class is `EnumClass`):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```
</div>

The `valueOf()` method throws an `IllegalArgumentException` if the specified name does
not match any of the enum constants defined in the class.

Since Kotlin 1.1, it's possible to access the constants in an enum class in a generic way, using
the `enumValues<T>()` and `enumValueOf<T>()` functions:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumValues<T>().joinToString { it.name })
}

printAllValues<RGB>() // prints RED, GREEN, BLUE
```
</div>

Every enum constant has properties to obtain its name and position in the enum class declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
val name: String
val ordinal: Int
```
</div>

The enum constants also implement the [Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) interface,
with the natural order being the order in which they are defined in the enum class.
