[//]: # (title: Functions)

Kotlin functions are declared using the `fun` keyword:

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## Function usage

Functions are called using the standard approach:

```kotlin
val result = double(2)
```

Calling member functions uses dot notation:

```kotlin
// Creates instance of the Stream class and calls read()
Stream().read()
```

### Parameters

Function parameters are defined using Pascal notation: `name: Type`.
Parameters are separated using commas, and each parameter must be explicitly typed:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

Inside the body of a function, received parameters are read-only (implicitly `val`):

```kotlin
fun powerOf (number: Int, exponent: Int): Int {
    number = 2 // Error: 'val' cannot be reassigned.
}
```

You can use a [trailing comma](coding-conventions.md#trailing-commas) when you declare function parameters:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

This helps with refactorings and code maintenance:
you can move parameters within the declaration without worrying about which is going to be the last one.

Kotlin functions can receive other functions as parameters — and be passed as arguments.
For details, see [](lambdas.md).

### Parameters with default values (optional parameters)

Function parameters can have default values, which are used when you skip the corresponding argument.
This reduces the number of necessary overloads.
Parameters with default values are also referred to as _optional parameters_.

A default value is set by appending `=` to the parameter declaration:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

If a parameter with default value precedes a parameter with no default value, the default value can only be used by calling
the function with [named arguments](#named-arguments):

```kotlin
fun foo(
    foo: Int = 0,
    bar: Int,
) { /*...*/ }

foo(bar = 1) // Uses the default value foo = 0
foo(1) // Error: No value passed for parameter 'bar'
```

[Overriding methods](inheritance.md#overriding-methods) always use the base method's default parameter values.
When overriding a method that has default parameter values, the default parameter values must be omitted from the signature:

```kotlin
open class A {
    open fun foo(i: Int = 10, j: Int = 0) { /*...*/ }
}

class B : A() {
    // It's not allowed to specify default values here
    // but this function also uses 10 for 'i' and 0 for 'j'
    // by default.
    override fun foo(i: Int, j: Int) { /*...*/ }
}
```

#### Non-constant expressions as default values

You can assign to a parameter a default value that is not constant, as in a function call, or a calculation that uses
values of other arguments, like the `len` parameter in the example above:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

Parameters referring to other parameters' values must be declared later in the order
(in this example, `len` must be declared after `b`).

In general default value of a parameter can be any expression.
But such expressions are only calculated when the function is called **without** the corresponding parameter
and a default value needs to be assigned.
For example, this function prints out a line only when it is called without the `print` parameter:

```kotlin
fun read(
    b: Int,
    print: Unit? = println("No argument passed for 'print'.")
) { println(b) }

fun main() {
    read (1) // BothFirst "No argument passed for 'print'.", then "1" is printed
    read (1, null) // Only the "1" is printed
}
```

If the last parameter in a function declaration has a functional type,
then you can pass the corresponding [lambda](lambdas.md#lambda-expression-syntax) argument either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

```kotlin
fun foo(
    foo: Int = 0,
    bar: Int = 1,
    qux: () -> Unit,
) { /*...*/ }

// Uses the default value bar = 1
foo(1) { println("hello") }     

// Uses both default values foo = 0 and bar = 1
foo(qux = { println("hello") })

// Uses both default values foo = 0 and bar = 1
foo { println("hello") }        
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

You can pass a [variable number of arguments](#variable-number-of-arguments-varargs) (`vararg`) naming the correspoding array:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> When calling Java functions on the JVM, you can't use the named argument syntax because Java bytecode does not
> always preserve the names of function parameters.
>
{style="note"}

### Unit-returning functions

If a function does not return a useful value, its return type is `Unit` (corresponds to the `void` type in Java).

`Unit` is a type with only one value - `Unit`.
You don't have to declare this return type, or return `Unit` explicitly.
Therefore, this verbose declaration:

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    return Unit
}
```

is equivalent to:

```kotlin
fun printHello(name: String?) { /*...*/ }
```

### Explicit return types

Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow
in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler).

### Variable number of arguments (varargs)

You can mark a parameter of a function (usually the last one) with the `vararg` modifier:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

In this case, you can pass a variable number of arguments to the function:

```kotlin
val list = asList(1, 2, 3)
```

Inside a function, a `vararg`-parameter of type `T` is visible as an array of `T`, as in the example above, where the `ts`
variable has type `Array<out T>`.

Only one parameter can be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
subsequent parameters must be passed using named argument syntax, or, if the parameter has a function type, by passing
a lambda outside the parentheses.

When you call a `vararg`-function, you can pass arguments individually, for example `asList(1, 2, 3)`. If you already have
an array and want to pass its contents to the function, use the spread operator (prefix the array with `*`):

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

If you want to pass a [primitive type array](arrays.md#primitive-type-arrays)
into `vararg`, you need to convert it to a regular (typed) array using the `toTypedArray()` function:

```kotlin
val a = intArrayOf(1, 2, 3) // IntArray is a primitive type array
val list = asList(-1, 0, *a.toTypedArray(), 4)
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

### Infix notation

Functions marked with the `infix` keyword can also be called using the infix notation (omitting the dot and the parentheses
for the call). Infix functions must meet the following requirements:

* They must be member functions or [extension functions](extensions.md).
* They must have a single parameter.
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have
no [default value](#parameters-with-default-values-optional-parameters).

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
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
calling a method on the current receiver using the infix notation, use `this` explicitly. This ensures
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

Kotlin functions can be declared at the top level in a file, meaning you do not need to create a class to hold a function
(unlike Java, for example).
Functions can also be declared locally as _member functions_ and _extension functions_.

### Local functions

Kotlin supports local functions, which are functions inside other functions:

```kotlin
fun dfs(graph: Graph) {
    fun dfs(current: Vertex, visited: MutableSet<Vertex>) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v, visited)
    }

    dfs(graph.vertices[0], HashSet())
}
```

A local function can access local variables of outer functions (the closure). In the case above, `visited` can be a local variable:

```kotlin
fun dfs(graph: Graph) {
    val visited = HashSet<Vertex>()
    fun dfs(current: Vertex) {
        if (!visited.add(current)) return
        for (v in current.neighbors)
            dfs(v)
    }

    dfs(graph.vertices[0])
}
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
import kotlin.math.cos
import kotlin.math.abs

val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

This code calculates the fixed point of cosine (a mathematical constant). It simply calls `cos()` repeatedly
starting at `1.0` until the result no longer changes, yielding a result of `0.7390851332151611` for the specified
`eps` precision. The resulting code is equivalent to this more traditional style:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use
tail recursion when there is more code after the recursive call, within `try`/`catch`/`finally` blocks, or on open functions.

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)

