[//]: # (title: Unsigned integer types)

In addition to [integer types](numbers.md#integer-types), Kotlin provides the following types for unsigned integer numbers:

| Type     | Size (bits) | Min value | Max value                                       |
|----------|-------------|-----------|-------------------------------------------------|
| `UByte`  | 8           | 0         | 255                                             |
| `UShort` | 16          | 0         | 65,535                                          |
| `UInt`   | 32          | 0         | 4,294,967,295 (2<sup>32</sup> - 1)              |
| `ULong`  | 64          | 0         | 18,446,744,073,709,551,615 (2<sup>64</sup> - 1) |


Unsigned types support most of the operations of their signed counterparts.

> Unsigned numbers are implemented as [inline classes](inline-classes.md) with a single storage property that contains the corresponding 
> signed counterpart type of the same width. If you want to convert between unsigned and signed integer types, 
> make sure you update your code so that any function calls and operations support the new type.
>
{style="note"}

## Unsigned arrays and ranges

> Unsigned arrays and operations on them are in [Beta](components-stability.md). They can be changed incompatibly at any time.
> Opt-in is required (see the details below).
>
{style="warning"}

Same as for primitives, each unsigned type has a corresponding type that represents arrays of that type:

* `UByteArray`: an array of unsigned bytes.
* `UShortArray`: an array of unsigned shorts.
* `UIntArray`: an array of unsigned ints.
* `ULongArray`: an array of unsigned longs.

Same as for signed integer arrays, they provide a similar API to the `Array` class without boxing overhead.

When you use unsigned arrays, you receive a warning that indicates that this feature is not stable yet.
To remove the warning, opt-in with the `@ExperimentalUnsignedTypes` annotation.
It's up to you to decide if your clients have to explicitly opt-in into usage of your API, but keep in mind that unsigned
arrays are not a stable feature, so an API that uses them can be broken by changes in the language.
[Learn more about opt-in requirements](opt-in-requirements.md).

[Ranges and progressions](ranges.md) are supported for `UInt` and `ULong` by classes `UIntRange`,`UIntProgression`,
`ULongRange`, and `ULongProgression`. Together with the unsigned integer types, these classes are stable.

## Unsigned integers literals

To make unsigned integers easier to use, you can append a suffix to an integer literal  
indicating a specific unsigned type (similarly to `F` for `Float` or `L` for `Long`):

* `u` and `U` letters signify unsigned literals without specifying the exact type.
    If no expected type is provided, the compiler uses `UInt` or `ULong` depending on the size of the literal:

    ```kotlin
    val b: UByte = 1u  // UByte, expected type provided
    val s: UShort = 1u // UShort, expected type provided
    val l: ULong = 1u  // ULong, expected type provided
  
    val a1 = 42u // UInt: no expected type provided, constant fits in UInt
    val a2 = 0xFFFF_FFFF_FFFFu // ULong: no expected type provided, constant doesn't fit in UInt
    ```

* `uL` and `UL` explicitly specify that literal should be an unsigned long:

    ```kotlin
    val a = 1UL // ULong, even though no expected type provided and the constant fits into UInt
    ```

## Use cases

The main use case of unsigned numbers is utilizing the full bit range of an integer to represent positive values.  
For example, to represent hexadecimal constants that do not fit in signed types such as color in 32-bit `AARRGGBB` format:

```kotlin
data class Color(val representation: UInt)

val yellow = Color(0xFFCC00CCu)
```

You can use unsigned numbers to initialize byte arrays without explicit `toByte()` literal casts:

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