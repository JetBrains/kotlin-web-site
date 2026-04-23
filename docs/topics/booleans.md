[//]: # (title: Booleans)
[//]: # (description: Learn how to use Boolean values in Kotlin, including declaration, logical operators, and conditions.)

<show-structure depth="1"/>

The [`Boolean`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) type represents 
logical values: `true` and `false`.

Use `Boolean` values in functions that answer yes-or-no questions, and in the
`while`, `if`, and `when` conditions.


## Declare a `Boolean` variable

To declare a `Boolean` variable, assign it `true` or `false`.

You can specify the `Boolean` type explicitly or let Kotlin infer it from the value:

```kotlin
val isTrue: Boolean = true
val isFalse = false // Kotlin infers Boolean
```

If a value can be `null`, use `Boolean?`:

```kotlin
val isEnabled: Boolean? = null
```

> You cannot assign an integer value to a `Boolean` variable.
> In Kotlin, `0` and `1` are not `Boolean` values.
>
{style="note"}

## Produce `Boolean` values

You can use comparison expressions and functions to produce `Boolean` values:

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0 
    println(isPositive) // true

    val language = "Kotlin"
    val isEmpty = language.isEmpty() 
    println(isEmpty) // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

You can use the results in conditions and other expressions as well:

```kotlin
fun main() {
//sampleStart
    val number = 10
    val isPositive = number > 0 // true

    if (isPositive) {
        println("The number is positive.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## `Boolean` operations

Kotlin provides operators and infix functions for working with `Boolean` values. 
You can use them to invert a `Boolean` value or combine multiple `Boolean` values into a single result.

### Negation (NOT)

The NOT operator inverts a `Boolean` value. 

> On the JVM, nullable references to boolean objects are boxed in Java classes, just like with [numbers](numbers.md#boxing-and-caching-numbers-on-the-jvm).
>
{style="note"}
