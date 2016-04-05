---
type: doc
layout: reference
category: "Syntax"
title: "Enum Classes"
---

# Enum Classes

The most basic usage of enum classes is implementing type-safe enums

``` kotlin
enum class Direction {
  NORTH, SOUTH, WEST, EAST
}
```

Each enum constant is an object. Enum constants are separated with commas.

## Initialization

Since each enum is an instance of the enum class, they can be initialized

``` kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## Anonymous Classes

Enum constants can also declare their own anonymous classes

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

with their corresponding methods, as well as overriding base methods. Note that if the enum class defines any
members, you need to separate the enum constant definitions from the member definitions with a semicolon, just like
in Java.

## Working with Enum Constants

Just like in Java, enum classes in Kotlin have synthetic methods allowing to list
the defined enum constants and to get an enum constant by its name. The signatures
of these methods are as follows (assuming the name of the enum class is `EnumClass`):

``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

The `valueOf()` method throws an `IllegalArgumentException` if the specified name does
not match any of the enum constants defined in the class.

Every enum constant has properties to obtain its name and position in the enum class declaration:

``` kotlin
val name: String
val ordinal: Int
```

The enum constants also implement the [Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) interface,
with the natural order being the order in which they are defined in the enum class.
