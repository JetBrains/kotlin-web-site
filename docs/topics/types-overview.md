[//]: # (title: Types overview)

In Kotlin, everything is an object in the sense that you can call member functions and properties on any variable.
Some types, such as numbers, characters, and booleans, have an optimized internal representation as primitive values at
runtime, but they appear and behave like regular classes in Kotlin code.

## Basic types

This section describes the basic types used in Kotlin:

| **Category**                                              | **Basic types**                    | **Definition**                     |
|-----------------------------------------------------------|------------------------------------|------------------------------------|
| [Integers](numbers.md#integer-types)                      | `Byte`, `Short`, `Int`, `Long`     | Whole numbers                      |
| [Unsigned integers](unsigned-integer-types.md)            | `UByte`, `UShort`, `UInt`, `ULong` | Non-negative whole numbers         |
| [Floating-point numbers](numbers.md#floating-point-types) | `Float`, `Double`                  | Numbers with a fractional part     |
| [Booleans](booleans.md)                                   | `Boolean`                          | Logical values: `true` and `false` |
| [Characters](characters.md)                               | `Char`                             | A single character                 |
| [Strings](strings.md)                                     | `String`                           | A sequence of characters           |
| [Arrays](arrays.md)                                       | `Array<T>`, primitive-type arrays  | A fixed-size sequence of values    |


By default, every type is non-nullable. To allow `null` values, declare a variable with a `?` sign right after the variable type.
For example, `String?`. Learn more in [Null safety](null-safety.md#nullable-types-and-non-nullable-types).

To learn about other Kotlin types, such as `Nothing`, `Any`, and `Unit`, look through the Kotlin API reference:

* [`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/) – The root of the Kotlin class hierarchy.
* [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html) – A type that has no values.
* [`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/) – A type with only one value (`Unit`).

## Non-denotable types

Kotlin also has non-denotable types. They are the types that you can't write directly in the Kotlin code. Instead, the
compiler uses them internally, for example, for interoperability with other languages. Kotlin creates non-denotable
types to represent type information that is more precise than what Kotlin source syntax allows.

Even though you can't declare non-denotable types yourself, you may encounter them in compiler diagnostics, IDE
tooltips, or inferred type displays. Learn more about non-denotable types in:

* [Platform types](java-interop.md#null-safety-and-platform-types)
* [](typecasts.md#intersection-types)
* [](numbers.md#integer-literal-types)
* [](generics.md#captured-types)
* [Kotlin language specification: Type system](https://kotlinlang.org/spec/type-system.html)

> [Learn how to perform type checks and casts in Kotlin](typecasts.md).
>
{style="tip"}