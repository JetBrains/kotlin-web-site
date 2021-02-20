[//]: # (title: Functions)

Functions in Kotlin are declared using the `fun` keyword:

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```

## Function usage

Calling functions uses the traditional approach:

```kotlin
val result = double(2)
```

Calling member functions uses the dot notation:

```kotlin
Stream().read() // create instance of class Stream and call read()
```

### Parameters

Function parameters are defined using Pascal notation - *name*: *type*. Parameters are separated using commas. Each 
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

Function parameters can have default values, which are used when you skip the corresponding argument. This reduces a number 
of overloads compared to other languages:

```kotlin
fun read(
    b: ByteArray, 
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

A default value is defined using the `=` after the type.

Overriding methods always use the same default parameter values as the base method.
When overriding a method with default parameter values, the default parameter values must be omitted from the signature:

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

If the last argument after default parameters is a [lambda](lambdas.md#lambda-expression-syntax), you can pass it 
either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

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

When calling a function, you can name one or more of its arguments. This may be helpful when a function has a large number of arguments, 
and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order they are listed in, and if you want to 
use their default values you can just leave them out altogether.

Consider the following function `reformat()` that has 4 arguments with default values.

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) { /*...*/ }
```

When calling this function, you don’t have to name all its arguments:

```kotlin
reformat(
    "String!",
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

You can skip all arguments with default values:

```kotlin
reformat("This is a long String!")
```

You can skip some arguments with default values. However, after the first skipped argument, you must name all subsequent arguments:

```kotlin
reformat("This is a short String!", upperCaseFirstLetter = false, wordSeparator = '_')
```

You can pass a [variable number of arguments (`vararg`)](#variable-number-of-arguments-varargs) with names using the 
`spread` operator:

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

> On the JVM: You can't use the named argument syntax when calling Java functions because Java bytecode does not
> always preserve names of function parameters.
>
{type="note"}

### Unit-returning functions

If a function does not return any useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`. 
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
fun printHello(name: String?) { ... }
```

### Single-expression functions

When a function returns a single expression, the curly braces can be omitted and the body is specified after a `=` symbol:

```kotlin
fun double(x: Int): Int = x * 2
```

Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler:

```kotlin
fun double(x: Int) = x * 2
```

### Explicit return types

Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`, 
[in which case it is optional](#unit-returning-functions).

Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow 
in the body, and the return type will be non-obvious to the reader (and sometimes even for the compiler). 

### Variable number of arguments (Varargs)

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

Inside a function a `vararg`-parameter of type `T` is visible as an array of `T`, i.e. the `ts` variable in the example 
above has type `Array<out T>`.

Only one parameter can be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
following parameters can be passed using the named argument syntax, or, if the parameter has a function type, by passing
a lambda outside parentheses.

When you call a `vararg`-function, you can pass arguments one-by-one, for example `asList(1, 2, 3)`. If you already have an array
 and want to pass its contents to the function, use the *spread* operator (prefix the array with `*`):

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```

### Infix notation

Functions marked with the `infix` keyword can also be called using the infix notation (omitting the dot and the parentheses 
for the call). Infix functions must meet the following requirements:

* They must be member functions or [extension functions](extensions.md).
* They must have a single parameter.
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have 
no [default value](#default-arguments).

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```

> Infix function calls have lower precedence than the arithmetic operators, type casts, and the `rangeTo` operator.
> The following expressions are equivalent:
> * `1 shl 2 + 3` is equivalent to `1 shl (2 + 3)`
> * `0 until n * 2` is equivalent to `0 until (n * 2)`
> * `xs union ys as Set<*>` is equivalent to `xs union (ys as Set<*>)`
>
> On the other hand, infix function call's precedence is higher than that of the boolean operators `&&` and `||`, `is`- and `in`-checks, and some other operators. These expressions are equivalent as well:
> * `a && b xor c` is equivalent to `a && (b xor c)`
> * `a xor b in c` is equivalent to `(a xor b) in c`
>
{type="note"}

Note that infix functions always require both the receiver and the parameter to be specified. When you're
calling a method on the current receiver using the infix notation, use `this` explicitly. This is required to ensure unambiguous parsing.

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
which you are required to do in languages such as Java, C# or Scala. In addition
to top level functions, Kotlin functions can also be declared locally, as member functions and extension functions.

### Local functions

Kotlin supports local functions, which are functions inside another function:

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

A local function can access local variables of outer functions (the closure). In the case above, the `visited` can be a local variable:

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

Functions can have generic parameters which are specified using angle brackets before the function name:

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```

For more information on generic functions, see [Generics](generics.md).

## Tail recursive functions

Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
For some algorithms that would normally use loops you can use a recursive function instead without a risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required form, the compiler optimizes out the recursion, 
leaving behind a fast and efficient loop based version instead:

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double =
    if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```

This code calculates the `fixpoint` of cosine, which is a mathematical constant. It simply calls `Math.cos` repeatedly 
starting at `1.0` until the result doesn't change anymore, yielding a result of `0.7390851332151611` for the specified 
`eps` precision. The resulting code is equivalent to this more traditional style:

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

private fun findFixPoint(): Double {
    var x = 1.0
    while (true) {
        val y = Math.cos(x)
        if (Math.abs(x - y) < eps) return x
        x = Math.cos(x)
    }
}
```

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use 
tail recursion when there is more code after the recursive call, and you cannot use it within `try`/`catch`/`finally` blocks. 
Currently, tail recursion is supported by Kotlin for JVM and Kotlin/Native.

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)

