[//]: # (title: Booleans)
[//]: # (description: Learn how to use Boolean values in Kotlin, including declaration, logical operators, and conditions.)

<show-structure depth="1"/>

The [`Boolean`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/) type represents logical values.

A `Boolean` has one of two values: `true` or `false`.

Use `Boolean` values in comparisons, conditions, loops, and functions that answer yes-or-no questions.


## Declare `Boolean`

To declare a `Boolean`, assign it `true` or `false`.

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
val number = 10
val isPositive = number > 0 // true

val language = "Kotlin"
val isEmpty = language.isEmpty() // false
```

You can use the results in conditions and other expressions.

>Learn more about `Boolean` functions in the [API Reference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-boolean/).
>
{style="tip"}

## `Boolean` operators

Use logical operators to combine or invert `Boolean` values.

### Negation (NOT)

Negation inverts a `Boolean` value.

Use the `!` operator:

```kotlin
val isOn = true
val isOff = !isOn // isOff is false
```

### Logical AND

AND returns `true` only if both operands are `true`.

Use the `&&` operator:

```kotlin
val a = false && false // false
val b = false && true // false
val c = true && false // false
val d = true && true  // true
```

> If the first operand is `false`, the `&&` operator does not evaluate the second operand.
>
{style="tip"}

### Logical OR

OR returns `true` if at least one operand is `true`.

Use the `||` operator:

```kotlin
val a = false || false // false
val b = false || true  // true
val c = true || false  // true
val d = true || true   // true
```

> If the first operand is `true`, the `||` operator does not evaluate the second operand.
>
{style="tip"}

### Exclusive OR (XOR)

XOR returns `true` if the operands have different values.

Use the `xor` infix function:

```kotlin
val a = false xor false // false
val b = false xor true  // true
val c = true xor false  // true
val d = true xor true   // false
```

## Operator precedence

Logical operators follow precedence rules. They determine how to group variables in
the absence of parentheses. 

The subsequence of execution is: 

1. `!`
2. `xor`
3. `&&`
4. `||`

In the following example, the compiler evaluates `&&` before `||`:

```kotlin
fun main() {
//sampleStart
    val result = true || false && false
    println(result) // true
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> Use parentheses to make evaluation order explicit.
>
{style="tip"}

## `Boolean` in conditions

You can use `Boolean` expressions to control program flow with `if`, `when`, and loops.

### `if` expressions

```kotlin
fun main() {
//sampleStart
    val number = 4
    val isEven = number % 2 == 0
    
    if (isEven) {
        println("The number is even.")
    } else {
        println("The number is odd.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> Since the condition already has the `Boolean` type, you do not need to compare it to `true` or `false`.
>
{style="tip"}

### `when` expressions

```kotlin
fun main() {
//sampleStart
    val number = 3

    when {
        number > 0 -> println("The number is positive.")
        number < 0 -> println("The number is negative.")
        else -> println("The number is zero.")
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Loops

```kotlin
fun main() {
//sampleStart
    var isCalculating = true
    
    while (isCalculating) {
        println("Calculating...")
        isCalculating = false
    }
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}
