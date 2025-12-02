[//]: # (title: Functions)

To declare a function in Kotlin, use the `fun` keyword, specify the parameters in brackets
and indicate the return type if necessary:

```kotlin
// 'double' is the name of the function,
// 'x' is a parameter of the Int type,
// and the expected return value is of the Int type, too
fun double(x: Int): Int {
    return 2 * x
}
```

## Function usage

To call a function, use the brackets notation for arguments:

```kotlin
val result = double(2)
```

To call a member function, use the dot notation:

```kotlin
// Creates an instance of the Stream class and calls read()
Stream().read()
```

### Parameters

Declare function parameters using Pascal notation: `name: Type`.
You must separate parameters using commas and type each parameter explicitly:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

Inside the body of a function, received arguments are read-only (implicitly declared as `val`):

```kotlin
fun powerOf (number: Int, exponent: Int): Int {
    number = 2 // Error: 'val' cannot be reassigned.
}
```

You can use a [trailing comma](coding-conventions.md#trailing-commas) when declaring function parameters:

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```

Trailing commas help with refactorings and code maintenance:
you can move parameters within the declaration without worrying about which is going to be the last one.

> Kotlin functions can receive other functions as parameters — and be passed as arguments.
> For details, see [](lambdas.md).
> 
{style="note"}

### Parameters with default values (optional parameters) {id="parameters-with-default-values"}

You can specify default values for function parameters, to be used when the corresponding argument is skipped
in a function call.
This reduces the number of necessary overloads as you don't need to declare different versions of a function
simply to allow skipping a parameter that has a reasonable default.
Parameters with default values are also referred to as _optional parameters_.

Set a default value by appending `=` to the parameter declaration:

```kotlin
fun read(
    b: ByteArray,
    // The default value of 'off' is 0
    off: Int = 0,
    // The default value of 'len' is calculated
    // as the size of the 'b' array
    len: Int = b.size,
) { /*...*/ }
```

When you declare a parameter with a default value before a parameter without a default value,
you can only use the default value by [naming arguments](#named-arguments):

```kotlin
fun foo(
    foo: Int = 0,
    bar: Int,
) { /*...*/ }

fun main () {
    // Uses the default value foo = 0
    foo(bar = 1)
    
    // Error: No value passed for parameter 'bar'
    foo(1)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[Trailing lambdas](lambdas.md#passing-trailing-lambdas) are an exception to this rule,
since the last parameter must correspond to the passed function:

```kotlin
fun foo(
    foo: Int = 0,
    bar: () -> Unit,
)
{ println(foo)
  bar() }

fun main () {
    // Prints the default value 0 for 'foo', then prints "bar"
    foo() { println ("bar") }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[Overriding methods](inheritance.md#overriding-methods) always use the base method's default parameter values.
When overriding a method that has default parameter values, you must omit the default parameter values from the signature:

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

Parameters that refer to values of other parameters must be declared later in the order
(in this example, `len` must be declared after `b`).

In general, you can assign any expression as the default value of a parameter.
But default values are only calculated when the function is called **without** the corresponding parameter
and a default value actually needs to be assigned.
For example, this function prints out a line only when it is called without the `print` parameter:

```kotlin
fun main() {
//sampleStart
fun read(
    b: Int,
    print: Unit? = println("No argument passed for 'print'")
) { println(b) }

// Prints "No argument passed for 'print'", then "1"
read (1)
// Prints only "1"
read (1, null)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

If the last parameter in a function declaration has a functional type,
you can pass the corresponding [lambda](lambdas.md#lambda-expression-syntax) argument either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

```kotlin
fun main() {
//sampleStart
fun foo(
    foo: Int = 0,
    bar: Int = 1,
    qux: () -> Unit,
) { println (foo)
    println (bar)
    qux() }

// Passes foo = 1 and ses the default value bar = 1
foo(1) { println("hello") }

// Uses both default values, foo = 0 and bar = 1
foo(qux = { println("hello") })

// Equivalent to the previous call, uses both default values
foo { println("hello") }
//sampleEnd   
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### Named arguments

You can name one or more of a function's arguments when calling it. This can be helpful when a function call has many
argument and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order that they are listed in.

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

When calling this function, you can name some of the arguments:

```kotlin
reformat(
    "String!",
    normalizeCase = false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

You can skip all the ones with default values:

```kotlin
reformat("This is a long String!")
```

You can also skip _some_ arguments with default values, rather than omitting them all.
However, after the first skipped argument, you must name all subsequent arguments:

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

### Explicit return types

Functions with a block body must always specify return types explicitly, unless it's intended for them to return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow
in the body, and the return type will not be obvious to the reader (and sometimes even for the compiler).
But the return type is inferred, unless specified, for [single-expression functions](#single-expression-functions).

### Single-expression functions

When the function body consists of a single expression, you can omit the curly braces and specify the body after an `=` symbol:

```kotlin
fun double(x: Int): Int = x * 2
```

You don't have to [explicitly declare](#explicit-return-types) the return type when it can be inferred by the compiler:

```kotlin
fun double(x: Int) = x * 2
```

### Unit-returning functions

If a function has a block body and does not return a useful value, compiler assumes the return type to be `Unit`
(corresponds to the `void` type in Java).
`Unit` is a type with only one value, `Unit`.

You don't have to specify `Unit` as a return type, except for functional type parameters,
and you never have to return `Unit` explicitly.

Therefore, this verbose declaration:

```kotlin
fun printHello(name: String?, aux: () -> Unit): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    return Unit
}
```

can be shortened to:

```kotlin
// The declaration of the functional type parameter ('aux') still 
// needs an explicit return type
fun printHello(name: String?, aux: () -> Unit) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
}
```

### Variable number of arguments (varargs)

To pass a variable number of arguments to a function, you can mark one of its parameters
(usually the last one) with the `vararg` modifier.
Inside a function, you can use a `vararg`-parameter of type `T` as an array of `T`:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```

Then you can pass a variable number of arguments to the function:

```kotlin
val list = asList(1, 2, 3)
```

Only one parameter can be marked as `vararg`.
If you declare a `vararg` parameter not as the last one in the list, values for subsequent parameters must be passed
using the named argument syntax, or, if a parameter has the function type, by passing a lambda outside the parentheses.

When you call a `vararg`-function, you can pass arguments individually, as in the example of `asList(1, 2, 3)`.
If you already have an array and want to pass its contents to the function in place (or as a part) of a `vararg` parameter,
use the spread operator (prefix the name of the array with `*`):

```kotlin
val a = arrayOf(1, 2, 3)
// The function receives the array [-1, 0, 1, 2, 3, 4]
val list = asList(-1, 0, *a, 4)
```

If you want to pass a [primitive type array](arrays.md#primitive-type-arrays)
as `vararg`, you need to convert it to a regular (typed) array using the `toTypedArray()` function:

```kotlin
// 'a' is an IntArray, which is a primitive type array
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### Infix notation

You can declare functions to be called without parentheses and the dot using the `infix` keyword.
This can be useful to clear up simple function calls in your code.

```kotlin
infix fun Int.shl(x: Int): Int { /*...*/ }

// Calls the function using the general notation 
1.shl(2)

// Calls the function using the infix notation
1 shl 2
```

Infix functions must meet the following requirements:

* They must be member functions of a class or [extension functions](extensions.md).
* They must have a single parameter.
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) (`vararg`) and must have
  no [default value](#parameters-with-default-values).

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

Note that infix functions always require both the receiver and the parameter to be specified.
When you call a method on the current receiver using the infix notation, use `this` explicitly.
This ensures unambiguous parsing.

```kotlin
class MyStringCollection {
    infix fun add(s: String) { /*...*/ }
    
    fun build() {
        this add "abc"   // Correct
        add("abc")       // Correct
        add "abc"        // Incorrect: the receiver must be specified
    }
}
```
{validate="false"}

## Function scope

You can declare Kotlin functions at the top level in a file, meaning you do not need to create a class to hold a function
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

A local function can access local variables of outer functions (the closure).
In the case above, `visited` can be a local variable:

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

To call member functions, use the dot notation:

```kotlin
// Creates an instance of the `Sample' class and calls 'foo()'
Sample().foo()
```

For more information on classes and overriding members see [Classes](classes.md) and [Inheritance](classes.md#inheritance).

## Generic functions

You can specify generic parameters for a function by using angle brackets before the function name:

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

// An arbitrary "good enough" precision
val eps = 1E-10

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (abs(x - cos(x)) < eps) x else findFixPoint(cos(x))
```

This code calculates the fixed point of cosine (a mathematical constant).
The function calls `cos()` repeatedly starting at `1.0` until the result no longer changes,
yielding a result of `0.7390851332151611` for the specified `eps` precision.
The code is equivalent to this more traditional style:

```kotlin
import kotlin.math.cos
import kotlin.math.abs

// An arbitrary "good enough" precision
val eps = 1E-10

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = cos(x)
        if (abs(x - y) < eps) return x
        x = cos(x)
    }
}
```

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs.
You cannot use tail recursion when there is more code after the recursive call,
within `try`/`catch`/`finally` blocks, or on [open functions](inheritance.md).

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)

