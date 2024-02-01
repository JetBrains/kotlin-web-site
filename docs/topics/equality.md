[//]: # (title: Equality)

In Kotlin, there are two types of equality:

* _Structural_ equality (`==`) - a check for the `equals()` function
* _Referential_ equality (`===`) - a check for two references pointing to the same object

## Structural equality

Structural equality is checked by the `==` operation and its negated counterpart `!=`.
By convention, an expression like `a == b` is translated to:

```kotlin
a?.equals(b) ?: (b === null)
```

If `a` is not `null`, it calls the `equals(Any?)` function. Otherwise (`a` is `null`), it checks that `b`
is referentially equal to `null`.

Note that there's no point in optimizing your code when comparing to `null` explicitly:
`a == null` will be automatically translated to `a === null`.

To provide a custom equals check implementation, override the
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) function.
Functions with the same name and other signatures (like `equals(other: Foo)`) don't affect equality checks with
the operators `==` and `!=`.

While this equality operator (`==`) is called structural equality to distinguish it from the [referential equality](#referential-equality) (`===`),
its underlying behavior could be referential in nature.

One common scenario where structural equality can exhibit referential behavior is when handling non-data classes, 
especially those without a custom implementation of the `equals()` function. In fact, this behavior is inherent by default
in all classes except for [data classes](data-classes.md).

Structural equality has nothing to do with comparison defined by the `Comparable<...>` interface, so only a custom 
`equals(Any?)` implementation may affect the behavior of the operator. 

## Referential equality

Referential equality is checked by the `===` operation and its negated counterpart `!==`. `a === b` evaluates to
true if and only if `a` and `b` point to the same object. For values represented by primitive types at runtime
(for example, `Int`), the `===` equality check is equivalent to the `==` check.

> In Kotlin/JS, there is no difference between `===` and `==` operators when comparing strings. The reason is that in Kotlin/JS,
> the `==` operator checks that two values are equal. Meanwhile, the `===` operator also checks that two values are equal 
> besides verifying that the types of these two values are equal. In JS, Kotlin always uses the `===` operator:
>
> ```kotlin
> fun main() {
>     val name = "kotlin"
>     val value1 = name.substring(0, 1)
>     val value2 = name.substring(0, 1)
>     
>     println(if (value1 === value2) "yes" else "no")
>     // Prints 'yes' in Kotlin/JS
>     // Prints 'no' in other platforms
> }
> ```
>
{type="note"}

## Floating-point numbers equality

When an equality check operands are statically known to be `Float` or `Double` (nullable or not), the check follows the 
[IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754). 

Otherwise, structural equality is used, which disagrees with the standard so that `NaN` is equal to itself, `NaN` is considered greater than any other element, including `POSITIVE_INFINITY`, and `-0.0` is not equal to `0.0`.

For more information, see [Floating-point numbers comparison](numbers.md#floating-point-numbers-comparison).

## Array equality

To compare whether two arrays have the same elements in the same order, use [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html).

For more information, see [Compare arrays](arrays.md#compare-arrays).
