[//]: # (title: Equality)

In Kotlin, there are two types of equality:

* _Structural_ equality (`==`) - a check for the `equals()` function
* _Referential_ equality (`===`) - a check for two references pointing to the same object

## Structural equality

Structural equality verifies if two objects have the same content or structure. Structural equality is checked by the `==` 
operation and its negated counterpart `!=`.
By convention, an expression like `a == b` is translated to:

```kotlin
a?.equals(b) ?: (b === null)
```

If `a` is not `null`, it calls the `equals(Any?)` function. Otherwise (`a` is `null`), it checks that `b`
is referentially equal to `null`:

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // true
    println(a == c)
    // false
    println(c == e)
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Note that there's no point in optimizing your code when comparing to `null` explicitly:
`a == null` will be automatically translated to `a === null`.

In Kotlin, the `equals()` function is inherited by all classes from the `Any` class. By default, the `equals()` function 
implements [referential equality](#referential-equality). However, classes in Kotlin can override the `equals()` 
function to provide a custom equality logic and, in this way, implement structural equality.

Value classes and data classes are two specific Kotlin types that automatically override the `equals()` function. 
That's why they implement structural equality by default.

However, in the case of data classes, if the `equals()` function is marked as `final` in the parent class, its behavior remains unchanged.

Distinctly, non-data classes (those not declared with the `data` modifier) do not override the 
`equals()` function by default. Instead, non-data classes implement referential equality behavior inherited from the `Any` class.
To implement structural equality, non-data classes require a custom equality logic to override the `equals()` function.

To provide a custom equals check implementation, override the
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) function:

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // Compares properties for structural equality
        return this.x == other.x && this.y == other.y
    }
}
```
> When overriding the equals() function, you should also override the [hashCode() function](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html) 
> to keep consistency between equality and hashing and ensure a proper behavior of these functions.
>
{type="note"}

Functions with the same name and other signatures (like `equals(other: Foo)`) don't affect equality checks with
the operators `==` and `!=`.

Structural equality has nothing to do with comparison defined by the `Comparable<...>` interface, so only a custom 
`equals(Any?)` implementation may affect the behavior of the operator. 

## Referential equality

Referential equality verifies the memory addresses of two objects to determine if they are the same instance.

Referential equality is checked by the `===` operation and its negated counterpart `!==`. `a === b` evaluates to
true if and only if `a` and `b` point to the same object: 

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // true
    println(a === c)
    // false
    println(c === d)
    // true

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

For values represented by primitive types at runtime
(for example, `Int`), the `===` equality check is equivalent to the `==` check.

> The referential equality is implemented differently in Kotlin/JS. For more information about equality, see the [Kotlin/JS](js-interop.md#equality) documentation.
>
{type="tip"}

## Floating-point numbers equality

When the operands of an equality check are statically known to be `Float` or `Double` (nullable or not), the check follows the 
[IEEE 754 Standard for Floating-Point Arithmetic](https://en.wikipedia.org/wiki/IEEE_754).

The behavior is different for operands that are not statically typed as floating-point numbers. In these cases,
structural equality is implemented. As a result, checks with operands not statically typed as floating-point numbers differ from the 
IEEE standard. In this scenario:

* `NaN` is equal to itself
* `NaN` is greater than any other element (including `POSITIVE_INFINITY`) 
* `-0.0` is not equal to `0.0`

For more information, see [Floating-point numbers comparison](numbers.md#floating-point-numbers-comparison).

## Array equality

To compare whether two arrays have the same elements in the same order, use [`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html).

For more information, see [Compare arrays](arrays.md#compare-arrays).
