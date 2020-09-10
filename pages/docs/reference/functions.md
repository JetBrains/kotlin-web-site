---
type: doc
layout: reference
category: "Syntax"
title: "Functions: infix, vararg, tailrec"
---

# Functions

## Function declarations

Functions in Kotlin are declared using the `fun` keyword:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun double(x: Int): Int {
    return 2 * x
}
```
</div>

## Function usage

Calling functions uses the traditional approach:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val result = double(2)
```
</div>


Calling member functions uses the dot notation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
Stream().read() // create instance of class Stream and call read()
```
</div>

### Parameters

Function parameters are defined using Pascal notation, i.e. *name*: *type*. Parameters are separated using commas.
Each parameter must be explicitly typed:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun powerOf(number: Int, exponent: Int) { /*...*/ }
```
</div>

You can use a [trailing comma](coding-conventions.html#trailing-commas) when you declare function parameters:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun powerOf(
    number: Int,
    exponent: Int, // trailing comma
) { /*...*/ }
```
</div>

### Default arguments

Function parameters can have default values, which are used when you skip the corresponding argument. This reduces a number 
of overloads compared to other languages:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun read(
    b: Array<Byte>, 
    off: Int = 0, 
    len: Int = b.size,
) { /*...*/ }
```
</div>

A default value is defined using the `=` after the type.

Overriding methods always use the same default parameter values as the base method.
When overriding a method with default parameter values, the default parameter values must be omitted from the signature:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class A {
    open fun foo(i: Int = 10) { /*...*/ }
}

class B : A() {
    override fun foo(i: Int) { /*...*/ }  // No default value is allowed
}
```
</div>

If a default parameter precedes a parameter with no default value, the default value can only be used by calling the function with [named arguments](#named-arguments):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(
    bar: Int = 0, 
    baz: Int,
) { /*...*/ }

foo(baz = 1) // The default value bar = 0 is used
```
</div>

If the last argument after default parameters is a [lambda](lambdas.html#lambda-expression-syntax), you can pass it 
either as a named argument or [outside the parentheses](lambdas.html#passing-a-lambda-to-the-last-parameter):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

### Named arguments

When calling a function, you can name one or more of its arguments. This may be helpful when a function has a large number of arguments, 
and it's difficult to associate a value with an argument, especially if it's a boolean or `null` value.

When you use named arguments in a function call, you can freely change the order they are listed in, and if you want to 
use their default values you can just leave them out altogether.

Consider the following function `reformat()` that has 4 arguments with default values.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun reformat(
    str: String,
    normalizeCase: Boolean = true,
    upperCaseFirstLetter: Boolean = true,
    divideByCamelHumps: Boolean = false,
    wordSeparator: Char = ' ',
) {
/*...*/
}
```

</div>

When calling this function, you don’t have to name all its arguments:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
reformat(
    'String!',
    false,
    upperCaseFirstLetter = false,
    divideByCamelHumps = true,
    '_'
)
```

</div>

You can skip all arguments with default values:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
reformat('This is a long String!')
```

</div>

You can skip some arguments with default values. However, after the first skipped argument, you must name all subsequent arguments:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
reformat('This is a short String!', upperCaseFirstLetter = false, wordSeparator = '_')
```

</div>

You can pass a [variable number of arguments (`vararg`)](#variable-number-of-arguments-varargs) with names using the 
`spread` operator:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(vararg strings: String) { /*...*/ }

foo(strings = *arrayOf("a", "b", "c"))
```

</div>

> **On the JVM**: You can't use the named argument syntax when calling Java functions because Java bytecode does not
always preserve names of function parameters.
{:.note}

### Unit-returning functions

If a function does not return any useful value, its return type is `Unit`. `Unit` is a type with only one value - `Unit`. This
value does not have to be returned explicitly:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun printHello(name: String?): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")
    // `return Unit` or `return` is optional
}
```
</div>

The `Unit` return type declaration is also optional. The above code is equivalent to:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun printHello(name: String?) { ... }
```
</div>

### Single-expression functions

When a function returns a single expression, the curly braces can be omitted and the body is specified after a **=** symbol:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun double(x: Int): Int = x * 2
```
</div>

Explicitly declaring the return type is [optional](#explicit-return-types) when this can be inferred by the compiler:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun double(x: Int) = x * 2
```
</div>

### Explicit return types

Functions with block body must always specify return types explicitly, unless it's intended for them to return `Unit`, [in which case it is optional](#unit-returning-functions).
Kotlin does not infer return types for functions with block bodies because such functions may have complex control flow in the body, and the return
type will be non-obvious to the reader (and sometimes even for the compiler). 


### Variable number of arguments (Varargs)

A parameter of a function (normally the last one) may be marked with `vararg` modifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}
```
</div>

allowing a variable number of arguments to be passed to the function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val list = asList(1, 2, 3)
```
</div>

Inside a function a `vararg`-parameter of type `T` is visible as an array of `T`, i.e. the `ts` variable in the example above has type `Array<out T>`.

Only one parameter may be marked as `vararg`. If a `vararg` parameter is not the last one in the list, values for the
following parameters can be passed using the named argument syntax, or, if the parameter has a function type, by passing
a lambda outside parentheses.

When we call a `vararg`-function, we can pass arguments one-by-one, e.g. `asList(1, 2, 3)`, or, if we already have an array
 and want to pass its contents to the function, we use the **spread** operator (prefix the array with `*`):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val a = arrayOf(1, 2, 3)
val list = asList(-1, 0, *a, 4)
```
</div>

### Infix notation

Functions marked with the *infix*{: .keyword } keyword can also be called using the infix notation (omitting the dot and the parentheses for the call). Infix functions must satisfy the following requirements:

* They must be member functions or [extension functions](extensions.html);
* They must have a single parameter;
* The parameter must not [accept variable number of arguments](#variable-number-of-arguments-varargs) and must have no [default value](#default-arguments).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
infix fun Int.shl(x: Int): Int { ... }

// calling the function using the infix notation
1 shl 2

// is the same as
1.shl(2)
```
</div>

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
> See the [Grammar reference](grammar.html#expressions) for the complete operators precedence hierarchy.
{:.note}

Note that infix functions always require both the receiver and the parameter to be specified. When you're
calling a method on the current receiver using the infix notation, you need to use `this` explicitly; unlike regular method calls, 
it cannot be omitted. This is required to ensure unambiguous parsing.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>


## Function scope

In Kotlin functions can be declared at top level in a file, meaning you do not need to create a class to hold a function, which you are required to do in languages such as Java, C# or Scala. In addition
to top level functions, Kotlin functions can also be declared local, as member functions and extension functions.

### Local functions

Kotlin supports local functions, i.e. a function inside another function:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

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
</div>

Local function can access local variables of outer functions (i.e. the closure), so in the case above, the *visited* can be a local variable:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

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
</div>

### Member functions

A member function is a function that is defined inside a class or object:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```
</div>

Member functions are called with dot notation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
Sample().foo() // creates instance of class Sample and calls foo
```
</div>

For more information on classes and overriding members see [Classes](classes.html) and [Inheritance](classes.html#inheritance).

## Generic functions

Functions can have generic parameters which are specified using angle brackets before the function name:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun <T> singletonList(item: T): List<T> { /*...*/ }
```
</div>

For more information on generic functions see [Generics](generics.html).

## Inline functions

Inline functions are explained [here](inline-functions.html).

## Extension functions

Extension functions are explained in [their own section](extensions.html).

## Higher-order functions and lambdas

Higher-Order functions and Lambdas are explained in [their own section](lambdas.html).

## Tail recursive functions

Kotlin supports a style of functional programming known as [tail recursion](https://en.wikipedia.org/wiki/Tail_call).
This allows some algorithms that would normally be written using loops to instead be written using a recursive function, but without the risk of stack overflow.
When a function is marked with the `tailrec` modifier and meets the required form, the compiler optimizes out the recursion, leaving behind a fast and efficient loop based version instead:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val eps = 1E-10 // "good enough", could be 10^-15

tailrec fun findFixPoint(x: Double = 1.0): Double
        = if (Math.abs(x - Math.cos(x)) < eps) x else findFixPoint(Math.cos(x))
```
</div>

This code calculates the fixpoint of cosine, which is a mathematical constant. It simply calls Math.cos repeatedly starting at 1.0 until the result doesn't change any more, yielding a result of 0.7390851332151611 for the specified `eps` precision. The resulting code is equivalent to this more traditional style:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

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
</div>

To be eligible for the `tailrec` modifier, a function must call itself as the last operation it performs. You cannot use tail recursion when there is more code after the recursive call, and you cannot use it within try/catch/finally blocks. Currently, tail recursion is supported by Kotlin for JVM and Kotlin/Native.
