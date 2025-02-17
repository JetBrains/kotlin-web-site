[//]: # (title: Functions)

Kotlin functions are declared using the `fun` keyword:

```kotlin
//sampleStart
// Doubles the given number
fun double(number: Int): Int {
    return 2 * number
}

fun main() {
    val input = 5
    val result = double(input)
    println(result)
    // Prints: 10
}
//sampleEnd
```

## Function usage

Functions are called using the standard approach:

```kotlin
//sampleStart
fun main() {
    // Calls the double function with different arguments
    val result1 = double(2)
    val result2 = double(10)

    println(result1)
    // Prints: 4
    println(result2)
    // Prints: 20
}
//sampleEnd
```

Calling member functions uses dot notation:

```kotlin
//sampleStart
class TextReader {
    // Reads text from a source and returns it as a string
    fun readText(): String {
        return "Sample text"
    }
}

fun main() {
    // Creates an instance of TextReader and calls readText()
    val reader = TextReader()
    val text = reader.readText()
    println(text)
    // Prints: Sample text
}
//sampleEnd
```

### Parameters

Function parameters are defined using Pascal notation - *name*: *type*. Parameters are separated using commas, and each
parameter must be explicitly typed:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

You can use a [trailing comma](coding-conventions.md#trailing-commas) when you declare function parameters:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

### Default arguments

Function parameters can have default values, which are used when you skip the corresponding argument. This reduces the number
of overloads:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

A default value is set by appending `=` to the type.

Overriding methods always use the base method's default parameter values.
When overriding a method that has default parameter values, the default parameter values must be omitted from the signature:

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // No default value is allowed.
}
```

If a default parameter precedes a parameter with no default value, the default value can only be used by calling
the function with [named arguments](#named-arguments):

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int,
) { /*...*/ }

foo(baz = 1) // The default value bar = 0 is used
```

If the last argument after default parameters is a [lambda](lambdas.md#lambda-expression-syntax),
you can pass it either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

```kotlin
fun foo(
    bar: Int = 0,
    baz: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

foo(1) { println("hello") }     // Uses the default value baz = 1
foo(qux = { println("hello") }) // Uses both default values bar = 0 and baz = 1
foo { println("hello") }        // Uses both default values bar = 0 and baz = 1
```

### Named arguments

You can name one or more of a function's arguments when calling it. This can be helpful when a function has many
arguments and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order that they are listed in. If you want to
use their default values, you can just leave these arguments out altogether.

Consider the `reformat()` function, which has 4 arguments with default values.

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

When calling this function, you don't have to name all its arguments:

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

You can skip all the ones with default values:

```kotlin
reformat("This is a long String!")
```

You are also able to skip specific arguments with default values, rather than omitting them all. However, after the first
skipped argument, you must name all subsequent arguments:

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

You can pass a [variable number of arguments (`vararg`)](#variable-number-of-arguments-varargs) with names using the
`spread` operator:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> When calling Java functions on the JVM, you can't use the named argument syntax because Java bytecode does not
> always preserve the names of function parameters.
>
{style="note"}

### Unit-returning functions

If a function does not return a useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`.
This value does not have to be returned explicitly:

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```

The `Unit` return type declaration is also optional. The above code is equivalent to:

```kotlin
//sampleStart
// Prints a greeting message based on the provided name
fun printHello(name: String?) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
}

fun main() {
    printHello("Alice")
    // Prints: Hello Alice

    printHello(null)
    // Prints: Hi there!
}
//sampleEnd
```

### Single-expression functions

When the function body consists of a single expression, the curly braces can be omitted and the body specified after an `=` symbol:

```kotlin
fun double(x: Int): Int = x * 2
```

Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler:

```kotlin
fun double(x: Int) = x * 2
```

### Explicit return types

Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow
in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler).

### Variable number of arguments (varargs)

You can mark a parameter of a function (usually the last one) with the `vararg` modifier:

```kotlin
//sampleStart
// Creates a list from a variable number of elements
fun <T> createList(vararg elements: T): List<T> {
    val resultList = ArrayList<T>()
    // Iterates through the elements array and adds each to the list
    for (element in elements) {
        resultList.add(element)
    }
    return resultList
}

fun main() {
    // Creates lists with different numbers of elements
    val numbers = createList(1, 2, 3, 4, 5)
    println(numbers)
    // Prints: [1, 2, 3, 4, 5]

    val fruits = createList("apple", "banana", "orange")
    println(fruits)
    // Prints: [apple, banana, orange]
}
//sampleEnd
```

In this case, you can pass a variable number of arguments to the function:

```kotlin
val list = asList(1, 2, 3)
```

Inside a function, a `vararg`-parameter of type `T` is visible as an array of `T`, as in the example above, where the `ts`
variable has type `Array<out T>`.

Only one parameter can be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
subsequent parameters can be passed using named argument syntax, or, if the parameter has a function type, by passing
a lambda outside the parentheses.

When you call a `vararg`-function, you can pass arguments individually, for example `asList(1, 2, 3)`. If you already have
an array and want to pass its contents to the function, use the *spread* operator (prefix the array with `*`):

```kotlin
//sampleStart
fun main() {
    // Creates a regular array of strings
    val colors = arrayOf("red", "green", "blue")
    // Creates a list with additional elements before and after the array
    val colorList = createList("purple", "yellow", *colors, "orange")
    println(colorList)
    // Prints: [purple, yellow, red, green, blue, orange]

    // Creates a primitive type array of integers
    val numbers = intArrayOf(1, 2, 3)
    // Converts primitive array to regular array and creates a list
    val numberList = createList(0, *numbers.toTypedArray(), 4, 5)
    println(numberList)
    // Prints: [0, 1, 2, 3, 4, 5]
}
//sampleEnd
```

### Infix notation

Functions marked with the `infix` keyword can also be called using the infix notation (omitting the dot and the parentheses
for the call). Infix functions must meet the following requirements:

* They must be member functions or [extension functions](extensions.md).
* They must have a single parameter.
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have
no [default value](#default-arguments).

```kotlin
//sampleStart
// Defines an infix function that performs string concatenation with a separator
class StringWrapper(val value: String) {
    // Joins two strings with the given separator
    infix fun joinWith(other: String): String {
        return "$value - $other"
    }
}

fun main() {
    val greeting = StringWrapper("Hello")

    // Using infix notation
    val result1 = greeting joinWith "World"
    println(result1)
    // Prints: Hello - World

    // Using regular method call notation
    val result2 = greeting.joinWith("Kotlin")
    println(result2)
    // Prints: Hello - Kotlin
}
//sampleEnd
```

> Infix function calls have lower precedence than arithmetic operators, type casts, and the `rangeTo` operator.
> The following expressions are equivalent:
> * `1 shl 2 + 3` is equivalent to `1 shl (2 + 3)`
> * `0 until n * 2` is equivalent to `0 until (n * 2)`
> * `xs union ys as Set<*>` is equivalent to `xs union (ys as Set<*>)`
>
> On the other hand, an infix function call's precedence is higher than that of the boolean operators `&&` and `||`, `is`-
> and `in`-checks, and some other operators. These expressions are equivalent as well:
> * `a && b xor c` is equivalent to `a && (b xor c)`
> * `a xor b in c` is equivalent to `(a xor b) in c`
>
{style="note"}

Note that infix functions always require both the receiver and the parameter to be specified. When you're
calling a method on the current receiver using the infix notation, use `this` explicitly. This is required to ensure
unambiguous parsing.

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }

    fun build() {
        this add "abc"   // Correct
        add("abc")       // Correct
        //add "abc"        // Incorrect: the receiver must be specified
    }
}
```

## Function scope

Kotlin functions can be declared at the top level in a file, meaning you do not need to create a class to hold a function,
which you are required to do in languages such as Java, C#, and Scala ([top level definition is available since Scala 3](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html#inner-main)). In addition
to top level functions, Kotlin functions can also be declared locally as member functions and extension functions.

### Local functions

Kotlin supports local functions, which are functions inside other functions:

```kotlin
//sampleStart
// Calculates the total price with tax and optional discount
fun calculateOrder(items: List<Double>, taxRate: Double) {
    // Local function to calculate price with tax
    fun addTax(price: Double): Double {
        return price * (1 + taxRate)
    }

    // Local function to apply discount if total is over threshold
    fun applyDiscount(total: Double): Double {
        val discountThreshold = 100.0
        val discountRate = 0.1
        return if (total > discountThreshold) {
            total * (1 - discountRate)
        } else {
            total
        }
    }

    // Calculate total with tax for all items
    var total = 0.0
    for (item in items) {
        total += addTax(item)
    }

    // Apply discount to final total
    val finalTotal = applyDiscount(total)

    println("Subtotal: $${String.format("%.2f", items.sum())}")
    println("Total with tax: $${String.format("%.2f", total)}")
    println("Final total with discount: $${String.format("%.2f", finalTotal)}")
}

fun main() {
    val items = listOf(50.0, 40.0, 20.0)
    calculateOrder(items, 0.08)
    // Prints:
    // Subtotal: $110.00
    // Total with tax: $118.80
    // Final total with discount: $106.92
}
//sampleEnd
```

### Member functions

A member function is a function that is defined inside a class or object:

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

Member functions are called with dot notation:

```kotlin
Sample().foo() // creates instance of class Sample and calls foo
```

For more information on classes and overriding members see [Classes](classes.md) and [Inheritance](classes.md#inheritance).

## Generic functions

Functions can have generic parameters, which are specified using angle brackets before the function name:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

For more information on generic functions, see [Generics](generics.md).

## Tail recursive functions

Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
For some algorithms that would normally use loops, you can use a recursive function instead without the risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required formal conditions, the compiler optimizes out
the recursion, leaving behind a fast and efficient loop based version instead:

```kotlin
//sampleStart
// Calculates factorial using tail recursion
tailrec fun factorial(n: Long, accumulator: Long = 1): Long =
    when {
        n <= 1 -> accumulator
        else -> factorial(n - 1, n * accumulator)
    }

// Calculates sum of numbers in a range using tail recursion
tailrec fun sumRange(start: Long, end: Long, accumulator: Long = 0): Long =
    when {
        start > end -> accumulator
        else -> sumRange(start + 1, end, accumulator + start)
    }

fun main() {
    // Calculate factorial of 5
    val fact5 = factorial(5)
    println("Factorial of 5 is: $fact5")
    // Prints: Factorial of 5 is: 120

    // Calculate sum of numbers from 1 to 100
    val sum = sumRange(1, 100)
    println("Sum of numbers from 1 to 100 is: $sum")
    // Prints: Sum of numbers from 1 to 100 is: 5050
}
//sampleEnd
```

This code demonstrates two practical uses of tail recursion:
1. Calculating factorial without stack overflow for large numbers
2. Summing a range of numbers efficiently

The traditional loop-based equivalent would look like this:

```kotlin
//sampleStart
// Traditional loop-based factorial calculation
fun factorialLoop(n: Long): Long {
    var result = 1L
    for (i in 1..n) {
        result *= i
    }
    return result
}

// Traditional loop-based range sum calculation
fun sumRangeLoop(start: Long, end: Long): Long {
    var sum = 0L
    for (i in start..end) {
        sum += i
    }
    return sum
}

fun main() {
    println("Factorial of 5 is: ${factorialLoop(5)}")
    println("Sum of 1..100 is: ${sumRangeLoop(1, 100)}")
}
//sampleEnd
```

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use
tail recursion when there is more code after the recursive call, within `try`/`catch`/`finally` blocks, or on open functions.
Currently, tail recursion is supported by Kotlin for the JVM and Kotlin/Native.

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)
