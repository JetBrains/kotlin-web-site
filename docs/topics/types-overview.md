[//]: # (title: Types overview)

In Kotlin, everything is an object in the sense that you can call member functions and properties on any variable.
While certain types have an optimized internal representation as primitive values at runtime (such as numbers, characters, and booleans),
they appear and behave like regular classes to you.

This section describes the basic types used in Kotlin:

* [Numbers](numbers.md) and their [unsigned counterparts](unsigned-integer-types.md)
* [Booleans](booleans.md)
* [Characters](characters.md)
* [Strings](strings.md)
* [Arrays](arrays.md)

To learn about other Kotlin types, such as `Nothing`, `Any`, and `Unit`, look through the Kotlin API reference:

* [`Any`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/)
* [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)
* [`Unit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-unit/)

Kotlin also support non-denotable types. They are types that you can't write directly in the Kotlin code. Instead, the
compiler uses them internally, for example, for interoperability with other languages. Kotlin creates non-denotable
types to represent type information that is more precise than what Kotlin source syntax allows.

Even though you can't declare non-denotable types yourself, you may encounter them in compiler diagnostics, IDE
tooltips, or inferred type displays. Learn more about non-denotable types in:

* [Platform types](java-interop.md#null-safety-and-platform-types)
* [](typecasts.md#intersection-types)
* [](numbers.md#integer-literal-types)
* [](generics.md#captured-types)
* [Kotlin language specification: Platform types](https://kotlinlang.org/spec/type-system.html#platform-types)

> [Learn how to perform type checks and casts in Kotlin](typecasts.md).
>
{style="tip"}