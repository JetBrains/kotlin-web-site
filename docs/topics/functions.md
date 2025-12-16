[//]: # (title: Functions)

To declare a function in Kotlin:
* Use the `fun` keyword.
* Specify the parameters in parentheses `()`.
* Include the [return type](#return-types) if needed.

For example:

```kotlin
//sampleStart
// 'double' is the name of the function
// 'x' is a parameter of Int type
// The expected return value is of Int type too
fun double(x: Int): Int {
    return 2 * x
}
//sampleEnd

fun main() {
    println(double(5))
    // 10
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="kotlin-function-double"}

## Function usage

Functions are called using the standard approach:

```kotlin
val result = double(2)
```

To call a [member](classes.md) or [extension function](extensions.md#extension-functions), use a period `.`:

```kotlin
// Creates an instance of the Stream class and calls read()
Stream().read()
```

### Parameters

Declare function parameters using Pascal notation: `name: Type`.
You must separate parameters using commas and give each parameter a type explicitly:

```kotlin
fun powerOf(number: Int, exponent: Int): Int { /*...*/ }
```

Inside the body of a function, received arguments are read-only (implicitly declared as `val`):

```kotlin
fun powerOf(number: Int, exponent: Int): Int {
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
> For more information, see [](lambdas.md).
> 
{style="note"}

### Parameters with default values {id="parameters-with-default-values"}

You can make a function parameter optional by specifying a default value for it.
Kotlin uses the default value when you call the function without providing an argument that corresponds to that parameter.
Parameters with default values are also known as _optional parameters_.

Optional parameters reduce the need for multiple overloads, since you don't have to declare different versions of a function
just to allow skipping a parameter with a reasonable default.

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

When you declare a parameter **with** a default value before a parameter **without** a default value,
you can only use the default value by [naming the argument](#named-arguments):

```kotlin
fun greeting(
    userId: Int = 0,
    message: String,
) { /*...*/ }

fun main() {
    // Uses 0 as the default value for 'userId'
    greeting(message = "Hello!")
    
    // Error: No value passed for parameter 'userId'
    greeting("Hello!")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="default-before-ordinary"}

[Trailing lambdas](lambdas.md#passing-trailing-lambdas) are an exception to this rule,
since the last parameter must correspond to the passed function:

```kotlin
fun main () {
//sampleStart    
fun greeting(
    userId: Int = 0,
    message: () -> Unit,
)
{ println(userId)
  message() }
    
// Uses the default value for 'userId'
greeting() { println ("Hello!") }
// 0
// Hello!
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="default-before-trailing-lambda"}

[Overriding methods](inheritance.md#overriding-methods) always use the base method's default parameter values.
When you override a method that has default parameter values, you must omit the default parameter values from the signature:

```kotlin
open class Shape {
    open fun draw(width: Int = 10, height: Int = 5) { /*...*/ }
}

class Rectangle : Shape() {
    // It's not allowed to specify default values here
    // but this function also uses 10 for 'width' and 5 for 'height'
    // by default.
    override fun draw(width: Int, height: Int) { /*...*/ }
}
```

#### Non-constant expressions as default values

You can assign a parameter a default value that isn't constant.
For example, the default can be the result of a function call or a calculation that uses the values of other arguments,
like the `len` parameter in this example:

```kotlin
fun read(
    b: ByteArray,
    off: Int = 0,
    len: Int = b.size,
) { /*...*/ }
```

Parameters that refer to the values of other parameters must be declared later in the order.
In this example, `len` must be declared after `b`.

In general, you can assign any expression as the default value of a parameter.
However, default values are only evaluated when the function is called **without** the corresponding parameter
and a default value needs to be assigned.
For example, this function prints out a line only when it is called without the `print` parameter:

```kotlin
fun main() {
//sampleStart
    fun read(
        b: Int,
        print: Unit? = println("No argument passed for 'print'")
    ) { println(b) }
    
    // Prints "No argument passed for 'print'", then "1"
    read(1)
    // Prints only "1"
    read(1, null)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="non-constant-default"}

If the last parameter in a function declaration has a functional type,
you can pass the corresponding [lambda](lambdas.md#lambda-expression-syntax) argument either as a named argument or [outside the parentheses](lambdas.md#passing-trailing-lambdas):

```kotlin
fun main() {
    //sampleStart
    fun log(
        level: Int = 0,
        code:  Int = 1,
        action: () -> Unit,
    ) { println (level)
        println (code)
        action() }
    
    // Passes 1 for 'level' and uses the default value 1 for 'code'
    log(1) { println("Connection established") }
    
    // Uses both default values, 0 for 'level' and 1 for 'code'
    log(action = { println("Connection established") })
    
    // Equivalent to the previous call, uses both default values
    log { println("Connection established") }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="lambda-outside-parentheses"}

### Named arguments

You can name one or more of a function's arguments when calling it.
This can be helpful when a function call has many arguments.
In such cases, it's difficult to associate a value with an argument, especially if it's `null` or a boolean value.

When you use named arguments in a function call, you can list them in any order.

Consider the `reformat()` function, which has 4 arguments with default values:

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

You can skip all the arguments with default values:

```kotlin
reformat("This is a long String!")
```

You can also skip _some_ arguments with default values, rather than omitting them all.
However, after the first skipped argument, you must name all subsequent arguments:

```kotlin
reformat(
    "This is a short String!",
    upperCaseFirstLetter = false,
    wordSeparator = '_'
)
```

You can pass a [variable number of arguments](#variable-number-of-arguments-varargs) (`vararg`) by naming the corresponding argument.
In this example, it's an array:

```kotlin
fun mergeStrings(vararg strings: String) { /*...*/ }

mergeStrings(strings = arrayOf("a", "b", "c"))
```

<!-- Rationale for named arguments interaction with varargs is here https://youtrack.jetbrains.com/issue/KT-52505#focus=Comments-27-6147916.0-0 -->

> When calling Java functions on the JVM, you can't use the named argument syntax because Java bytecode does not
> always preserve the names of function parameters.
>
{style="note"}

### Return types

When you declare a function with a block body (by putting instructions within curly braces `{}`),
you must always specify a return type explicitly.
The only exception is when they return `Unit`,
[in which case specifying the return type is optional](#unit-returning-functions).

Kotlin doesn't infer return types for functions with block bodies.
Their control flow can be complex, which makes the return type unclear to the reader and sometimes even to the compiler.
However, Kotlin can infer the return type for [single-expression functions](#single-expression-functions) if you don't specify it.

### Single-expression functions

When the function body consists of a single expression, you can omit the curly braces and specify the body after an `=` symbol:

```kotlin
fun double(x: Int): Int = x * 2
```

Most of the time you don't have to explicitly declare [the return type](#return-types):

```kotlin
// Compiler infers that the function returns Int
fun double(x: Int) = x * 2
```

The compiler can sometimes run into problems when inferring return types from single expressions.
In such cases, you should add the return type explicitly.
For example, functions that are recursive or mutually recursive (calling each other)
and functions with typeless expressions like `fun empty() = null` always require a return type.

When you do use an inferred return type,
make sure to check the actual result because the compiler may infer a type that is less useful to you.
In the example above, if you want the `double()` function to return `Number` instead of `Int`, 
you have to declare this explicitly.

### Unit-returning functions

If a function has a block body (instructions within curly braces `{}`) and does not return a useful value,
the compiler assumes its return type  is `Unit`.
`Unit` is a type that has only one value, also called `Unit`.

You don't have to specify `Unit` as a return type, except for functional type parameters.
You never have to return `Unit` explicitly.

For example, you can declare a `printHello()` function without returning `Unit`:

```kotlin
// The declaration of the functional type parameter ('action') still 
// needs an explicit return type
fun printHello(name: String?, action: () -> Unit) {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
}

fun main() {
    printHello("Kodee") {
        println("This runs after the greeting.")
    }
    // Hello Kodee
    // This runs after the greeting.

    printHello(null) {
        println("No name provided, but action still runs.")
    }
    // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-implicit"}

Which is equivalent to this verbose declaration:

```kotlin
//sampleStart
fun printHello(name: String?, action: () -> Unit): Unit {
    if (name != null)
        println("Hello $name")
    else
        println("Hi there!")

    action()
    return Unit
}
//sampleEnd
fun main() {
    printHello("Kodee") {
        println("This runs after the greeting.")
    }
    // Hello Kodee
    // This runs after the greeting.

    printHello(null) {
        println("No name provided, but action still runs.")
    }
    // No name provided, but action still runs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="return-unit-explicit"}

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
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts) // ts is an Array
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val list = asList(1, 2, 3)
    println(list)
    // [1, 2, 3]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist"}

Only one parameter can be marked as `vararg`.
If you declare a `vararg` parameter anywhere other than last in the parameter list, you must pass values for the following
parameters using named arguments.
If a parameter has a function type, you can also pass its value by placing a lambda outside the parentheses.

When you call a `vararg`-function, you can pass arguments individually, as in the example of `asList(1, 2, 3)`.
If you already have an array and want to pass its contents to a function as a `vararg` parameter or as a part of it,
use the [spread operator](arrays.md#pass-variable-number-of-arguments-to-a-function) by prefixing the array name with `*`:

```kotlin
fun <T> asList(vararg ts: T): List<T> {
    val result = ArrayList<T>()
    for (t in ts)
        result.add(t)
    return result
}

fun main() {
    //sampleStart
    val a = arrayOf(1, 2, 3)

    // The function receives the array [-1, 0, 1, 2, 3, 4]
    list = asList(-1, 0, *a, 4)

    println(list)
    // [-1, 0, 1, 2, 3, 4]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" validate="false" id="varargs-aslist-with-array"}

If you want to pass a [primitive type array](arrays.md#primitive-type-arrays)
as `vararg`, you need to convert it to a regular (typed) array using the [`.toTypedArray()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-typed-array.html) function:

```kotlin
// 'a' is an IntArray, which is a primitive type array
val a = intArrayOf(1, 2, 3)
val list = asList(-1, 0, *a.toTypedArray(), 4)
```

### Infix notation

You can declare functions that can be called without parentheses or the period by using the `infix` keyword.
This can help make simple function calls in your code easier to read.

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
* The parameter must not [accept a variable number of arguments](#variable-number-of-arguments-varargs) (`vararg`) and must have
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
    val items = mutableListOf<String>()

    infix fun add(s: String) {
        println("Adding: $s")
        items += s
    }

    fun build() {
        add("first")      // Correct: ordinary function call
        this add "second" // Correct: infix call with an explicit receiver
        // add "third"    // Compiler error: needs an explicit receiver
    }

    fun printAll() = println("Items = $items")
}

fun main() {
    val myStrings = MyStringCollection()
    // Adds "first" and "second" to the list twice
    myStrings.build()
      
    myStrings.printAll()
    // Adding: first
    // Adding: second
    // Items = [first, second]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="infix-notation-example"}

## Function scope

You can declare Kotlin functions at the top level in a file, meaning you do not need to create a class to hold a function.
Functions can also be declared locally as _member functions_ or _extension functions_.

### Local functions

Kotlin supports local functions, which are functions declared inside other functions.
For example, the following code implements the Depth-first search algorithm for a given graph.
The local `dfs()` function inside the outer `dfs()` function to hide the implementation and handle recursive calls:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    fun dfs(current: Person, visited: MutableSet<Person>) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend, visited)
    }
    dfs(graph.people[0], HashSet())
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs"}

A local function can access local variables of outer functions (the closure).
In the case above, the `visited` function parameter can be a local variable:

```kotlin
class Person(val name: String) {
    val friends = mutableListOf<Person>()
}
class SocialGraph(val people: List<Person>)
//sampleStart
fun dfs(graph: SocialGraph) {
    val visited = HashSet<Person>()
    fun dfs(current: Person) {
        if (!visited.add(current)) return
        println("Visited ${current.name}")
        for (friend in current.friends)
            dfs(friend)
    }
    dfs(graph.people[0])
}
//sampleEnd
fun main() {
    val alice = Person("Alice")
    val bob = Person("Bob")
    val charlie = Person("Charlie")
    alice.friends += bob
    bob.friends += charlie
    charlie.friends += alice
    val network = SocialGraph(listOf(alice, bob, charlie))
    dfs(network)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="local-functions-dfs-with-local-variable"}

### Member functions

A member function is a function that is defined inside a class or object:

```kotlin
class Sample {
    fun foo() { print("Foo") }
}
```

To call member functions, write the instance or object name, then add a `.` and write the function name:

```kotlin
// Creates an instance of the Stream class and calls read()
Stream().read()
```

For more information on classes and overriding members see [Classes](classes.md) and [Inheritance](classes.md#inheritance).

## Generic functions

You can specify generic parameters for a function by using angle brackets `<>` before the function name:

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

You can apply the `tailrec` modifier to a function only when it calls itself as its final operation.
You cannot use tail recursion when there is more code after the recursive call,
within [`try`/`catch`/`finally` blocks](exceptions.md#handle-exceptions-using-try-catch-blocks),
or when the function is [open](inheritance.md).

**See also**:
* [Inline functions](inline-functions.md)
* [Extension functions](extensions.md)
* [Higher-order functions and lambdas](lambdas.md)

