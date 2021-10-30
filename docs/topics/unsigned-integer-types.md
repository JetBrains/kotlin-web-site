[//]: # (title: Unsigned integer types)

In addition to [integer types](numbers.md#integer-types), Kotlin provides the following types for unsigned integer numbers:

* `UByte`: an unsigned 8-bit integer, ranges from 0 to 255
* `UShort`: an unsigned 16-bit integer, ranges from 0 to 65535
* `UInt`: an unsigned 32-bit integer, ranges from 0 to 2^32 - 1
* `ULong`: an unsigned 64-bit integer, ranges from 0 to 2^64 - 1

Unsigned types support most of the operations of their signed counterparts.

>Changing type from unsigned type to signed counterpart (and vice versa) is a *binary incompatible* change.
>
{type="note"}

## Unsigned arrays and ranges

> Unsigned arrays and operations on them are in [Beta](components-stability.md). They can be changed incompatibly at any time.
> Opt-in is required (see the details below).
>
{type="warning"}

Same as for primitives, each of unsigned type has corresponding type that represents arrays of that type:

* `UByteArray`: an array of unsigned bytes
* `UShortArray`: an array of unsigned shorts
* `UIntArray`: an array of unsigned ints
* `ULongArray`: an array of unsigned longs

Same as for signed integer arrays, they provide similar API to `Array` class without boxing overhead.

When you use unsigned arrays, you'll get a warning that indicates that this feature is not stable yet.
To remove the warning, opt in using the `@ExperimentalUnsignedTypes` annotation.
It's up to you to decide if your clients have to explicitly opt-in into usage of your API, but keep in mind that unsigned
array are not a stable feature, so API which uses them can be broken by changes in the language.
[Learn more about opt-in requirements](opt-in-requirements.md).

[Ranges and progressions](ranges.md) are supported for `UInt` and `ULong` by classes `UIntRange`,`UIntProgression`,
`ULongRange`, and `ULongProgression`. Together with the unsigned integer types, these classes are stable.

## Literals

To make unsigned integers easier to use, Kotlin provides an ability to tag an integer literal with a suffix
indicating a specific unsigned type (similarly to `Float` or `Long`):

* `u` and `U` tag unsigned literals. The exact type is determined based on the expected type.
  If no expected type is provided, compiler will use `UInt` or `ULong` depending on the size of literal.

```kotlin
val b: UByte = 1u  // UByte, expected type provided
val s: UShort = 1u // UShort, expected type provided
val l: ULong = 1u  // ULong, expected type provided

val a1 = 42u // UInt: no expected type provided, constant fits in UInt
val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
```

* `uL` and `UL` explicitly tag literal as unsigned long.

```kotlin
val a = 1UL // ULong, even though no expected type provided and constant fits into UInt
```

## Use cases

The main use case of unsigned numbers is utilizing the full bit range of an integer to represent positive values. 
For example, to represent hexadecimal constants that do not fit in signed types such as color in 32-bit `AARRGGBB` format:

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

Or to initialize byte arrays without explicit `toByte()` literal casts:

```kotlin
val byteOrderMarkUtf8 = ubyteArrayOf(0xEFu, 0xBBu, 0xBFu)
```

Another use case is interoperability with native APIs. Kotlin allows representing native declarations that contain 
unsigned types in the signature. The mapping won't substitute unsigned integers with signed ones keeping the semantics unaltered.

### Non-goals

While unsigned integers can only represent positive numbers and zero, it's not a goal to use them where application 
domain requires non-negative integers. For example, as a type of collection size or collection index value.
There are a couple of reasons:

* Using signed integers can help to detect accidental overflows and signal error conditions, such as 
  [`List.lastIndex`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index.html) being -1 for an empty list.
* Unsigned integers cannot be treated as a range-limited version of signed ones because their range of values is not a 
  subset of the signed integers range. Neither signed, nor unsigned integers are subtypes of each other.