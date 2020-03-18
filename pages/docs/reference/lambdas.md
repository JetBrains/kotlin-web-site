---
type: doc
layout: reference
category: "Syntax"
title: "Higher-Order Functions and Lambdas"
---

# Higher-Order Functions and Lambdas

Kotlin functions are [*first-class*](https://en.wikipedia.org/wiki/First-class_function), which means that they can 
be stored in variables and data structures, passed as arguments to and returned from other 
[higher-order functions](#higher-order-functions). You can operate with functions in any way that is possible for other 
non-function values. 

To facilitate this, Kotlin, as a statically typed programming language, uses a family of 
[function types](#function-types) to represent functions and provides a set of specialized language constructs, such as [lambda expressions](#lambda-expressions-and-anonymous-functions).

## Higher-Order Functions

A higher-order function is a function that takes functions as parameters, or returns a function.

A good example is the [functional programming idiom `fold`](https://en.wikipedia.org/wiki/Fold_(higher-order_function)) 
for collections, which takes an initial accumulator value and a combining function and builds its return value by 
consecutively combining current accumulator value with each collection element, replacing the accumulator:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun <T, R> Collection<T>.fold(
    initial: R, 
    combine: (acc: R, nextElement: T) -> R
): R {
    var accumulator: R = initial
    for (element: T in this) {
        accumulator = combine(accumulator, element)
    }
    return accumulator
}
```

</div>

In the code above, the parameter `combine` has a [function type](#function-types) `(R, T) -> R`, so it accepts a function that 
takes two arguments of types `R` and `T` and returns a value of type `R`. 
It is [invoked](#invoking-a-function-type-instance) inside the *for*{: .keyword }-loop, and the return value is 
then assigned to `accumulator`.

To call `fold`, we need to pass it an [instance of the function type](#instantiating-a-function-type) as an argument, and lambda expressions ([described in more detail below](#lambda-expressions-and-anonymous-functions)) are widely used for 
this purpose at higher-order function call sites:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    //sampleStart
    val items = listOf(1, 2, 3, 4, 5)
    
    // Lambdas are code blocks enclosed in curly braces.
    items.fold(0, { 
        // When a lambda has parameters, they go first, followed by '->'
        acc: Int, i: Int -> 
        print("acc = $acc, i = $i, ") 
        val result = acc + i
        println("result = $result")
        // The last expression in a lambda is considered the return value:
        result
    })
    
    // Parameter types in a lambda are optional if they can be inferred:
    val joinedToString = items.fold("Elements:", { acc, i -> acc + " " + i })
    
    // Function references can also be used for higher-order function calls:
    val product = items.fold(1, Int::times)
    //sampleEnd
    println("joinedToString = $joinedToString")
    println("product = $product")
}
```

</div>

The following sections explain in more detail the concepts mentioned so far.

## Function types

Kotlin uses a family of function types like `(Int) -> String` for declarations that deal with functions: `val onClick: () -> Unit = ...`.

These types have a special notation that corresponds to the signatures of the functions, i.e. their parameters and return values:

* All function types have a parenthesized parameter types list and a return type: `(A, B) -> C` denotes a type that
 represents functions taking two arguments of types `A` and `B` and returning a value of type `C`. 
 The parameter types list may be empty, as in `() -> A`. The [`Unit` return type](functions.html#unit-returning-functions) 
 cannot be omitted. 
 
* Function types can optionally have an additional *receiver* type, which is specified before a dot in the notation:
 the type `A.(B) -> C` represents functions that can be called on a receiver object of `A` with a parameter of `B` and
 return a value of `C`.
 [Function literals with receiver](#function-literals-with-receiver) are often used along with these types.
 
* [Suspending functions](coroutines.html#suspending-functions) belong to function types of a special kind, which have a *suspend*{: .keyword} modifier in the 
 notation, such as `suspend () -> Unit` or `suspend A.(B) -> C`.
 
The function type notation can optionally include names for the function parameters: `(x: Int, y: Int) -> Point`.
These names can be used for documenting the meaning of the parameters.

> To specify that a function type is [nullable](null-safety.html#nullable-types-and-non-null-types), use parentheses: `((Int, Int) -> Int)?`.
> 
> Function types can be combined using parentheses: `(Int) -> ((Int) -> Unit)`
>
> The arrow notation is right-associative, `(Int) -> (Int) -> Unit` is equivalent to the previous example, but not to 
`((Int) -> (Int)) -> Unit`.

You can also give a function type an alternative name by using [a type alias](type-aliases.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
typealias ClickHandler = (Button, ClickEvent) -> Unit
```

</div>
 
### Instantiating a function type

There are several ways to obtain an instance of a function type:

* Using a code block within a function literal, in one of the forms: 
    * a [lambda expression](#lambda-expressions-and-anonymous-functions): `{ a, b -> a + b }`,
    * an [anonymous function](#anonymous-functions): `fun(s: String): Int { return s.toIntOrNull() ?: 0 }`
    
   [Function literals with receiver](#function-literals-with-receiver) can be used as values of function types with receiver.
   
* Using a callable reference to an existing declaration:
    * a top-level, local, member, or extension [function](reflection.html#function-references): `::isOdd`, `String::toInt`,
    * a top-level, member, or extension [property](reflection.html#property-references): `List<Int>::size`,
    * a [constructor](reflection.html#constructor-references): `::Regex`
    
   These include [bound callable references](reflection.html#bound-function-and-property-references-since-11) that point to a member of a particular instance: `foo::toString`.
   
* Using instances of a custom class that implements a function type as an interface: 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class IntTransformer: (Int) -> Int {
    override operator fun invoke(x: Int): Int = TODO()
}

val intFunction: (Int) -> Int = IntTransformer()
```

</div>

The compiler can infer the function types for variables if there is enough information:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val a = { i: Int -> i + 1 } // The inferred type is (Int) -> Int
```

</div>

*Non-literal* values of function types with and without receiver are interchangeable, so that the receiver can stand in 
for the first parameter, and vice versa. For instance, a value of type `(A, B) -> C` can be passed or assigned 
 where a `A.(B) -> C` is expected and the other way around:
 
<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    //sampleStart
    val repeatFun: String.(Int) -> String = { times -> this.repeat(times) }
    val twoParameters: (String, Int) -> String = repeatFun // OK
    
    fun runTransformation(f: (String, Int) -> String): String {
        return f("hello", 3)
    }
    val result = runTransformation(repeatFun) // OK
    //sampleEnd
    println("result = $result")
}
```

</div>

> Note that a function type with no receiver is inferred by default, even if a variable is initialized with a reference
> to an extension function. 
> To alter that, specify the variable type explicitly.

### Invoking a function type instance  

A value of a function type can be invoked by using its [`invoke(...)` operator](operator-overloading.html#invoke): `f.invoke(x)` or just `f(x)`.

If the value has a receiver type, the receiver object should be passed as the first argument.
Another way to invoke a value of a function type with receiver is to prepend it with the receiver object,
as if the value were an [extension function](extensions.html): `1.foo(2)`,

Example:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    //sampleStart
    val stringPlus: (String, String) -> String = String::plus
    val intPlus: Int.(Int) -> Int = Int::plus
    
    println(stringPlus.invoke("<-", "->"))
    println(stringPlus("Hello, ", "world!")) 
    
    println(intPlus.invoke(1, 1))
    println(intPlus(1, 2))
    println(2.intPlus(3)) // extension-like call
    //sampleEnd
}
```

</div>

### Inline functions

Sometimes it is beneficial to use [inline functions](inline-functions.html), which provide flexible control flow,
for higher-order functions.

## Lambda Expressions and Anonymous Functions

Lambda expressions and anonymous functions are 'function literals', i.e. functions that are not declared,
but passed immediately as an expression. Consider the following example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
max(strings, { a, b -> a.length < b.length })
```

</div>

Function `max` is a higher-order function, it takes a function value as the second argument.
This second argument is an expression that is itself a function, i.e. a function literal, which is equivalent to
the following named function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

</div>

### Lambda expression syntax

The full syntactic form of lambda expressions is as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val sum: (Int, Int) -> Int = { x: Int, y: Int -> x + y }
```

</div>

A lambda expression is always surrounded by curly braces,
parameter declarations in the full syntactic form go inside curly braces and have optional type annotations,
the body goes after an `->` sign. If the inferred return type of the lambda is not `Unit`, the last (or possibly single)
expression inside the lambda body is treated as the return value.

If we leave all the optional annotations out, what's left looks like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val sum = { x: Int, y: Int -> x + y }
```

</div>

{:#passing-a-lambda-to-the-last-parameter}

### Passing trailing lambdas

In Kotlin, there is a convention: if the last parameter of a function is a function, then a lambda expression 
passed as the corresponding argument can be placed outside the parentheses:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val product = items.fold(1) { acc, e -> acc * e }
```

</div>

Such syntax is also known as _trailing lambda_.

If the lambda is the only argument to that call, the parentheses can be omitted entirely: 

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
run { println("...") }
```

</div>

### `it`: implicit name of a single parameter

It's very common that a lambda expression has only one parameter.

If the compiler can figure the signature out itself, it is allowed not to declare the only parameter and omit `->`. 
The parameter will be implicitly declared under the name `it`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```

</div>

### Returning a value from a lambda expression

We can explicitly return a value from the lambda using the [qualified return](returns.html#return-at-labels) syntax. 
Otherwise, the value of the last expression is implicitly returned. 

Therefore, the two following snippets are equivalent:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
ints.filter {
    val shouldFilter = it > 0 
    shouldFilter
}

ints.filter {
    val shouldFilter = it > 0 
    return@filter shouldFilter
}
```

</div>

This convention, along with [passing a lambda expression outside parentheses](#passing-a-lambda-to-the-last-parameter), allows for 
[LINQ-style](https://docs.microsoft.com/en-us/previous-versions/dotnet/articles/bb308959(v=msdn.10)) code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
strings.filter { it.length == 5 }.sortedBy { it }.map { it.toUpperCase() }
```

</div>

### Underscore for unused variables (since 1.1)

If the lambda parameter is unused, you can place an underscore instead of its name:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
map.forEach { _, value -> println("$value!") }
```

</div>

### Destructuring in lambdas (since 1.1)

Destructuring in lambdas is described as a part of [destructuring declarations](multi-declarations.html#destructuring-in-lambdas-since-11).

### Anonymous functions

One thing missing from the lambda expression syntax presented above is the ability to specify the return type of the
function. In most cases, this is unnecessary because the return type can be inferred automatically. However, if you
do need to specify it explicitly, you can use an alternative syntax: an _anonymous function_.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun(x: Int, y: Int): Int = x + y
```

</div>

An anonymous function looks very much like a regular function declaration, except that its name is omitted. Its body
can be either an expression (as shown above) or a block:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun(x: Int, y: Int): Int {
    return x + y
}
```

</div>

The parameters and the return type are specified in the same way as for regular functions, except that the parameter
types can be omitted if they can be inferred from context:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
ints.filter(fun(item) = item > 0)
```

</div>

The return type inference for anonymous functions works just like for normal functions: the return type is inferred
automatically for anonymous functions with an expression body and has to be specified explicitly (or is assumed to be
`Unit`) for anonymous functions with a block body.

Note that anonymous function parameters are always passed inside the parentheses. The shorthand syntax allowing
to leave the function outside the parentheses works only for lambda expressions.

One other difference between lambda expressions and anonymous functions is the behavior of
[non-local returns](inline-functions.html#non-local-returns). A *return*{: .keyword }  statement without a label
always returns from the function declared with the *fun*{: .keyword } keyword. This means that a *return*{: .keyword }
inside a lambda expression will return from the enclosing function, whereas a *return*{: .keyword } inside
an anonymous function will return from the anonymous function itself.

### Closures

A lambda expression or anonymous function (as well as a [local function](functions.html#local-functions) and an [object expression](object-declarations.html#object-expressions))
can access its _closure_, i.e. the variables declared in the outer scope. The variables captured in the closure can be modified in the lambda:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
    sum += it
}
print(sum)
```

</div>

### Function literals with receiver

[Function types](#function-types) with receiver, such as `A.(B) -> C`, can be instantiated with a special form of function literals – 
function literals with receiver.

As said above, Kotlin provides the ability [to call an instance](#invoking-a-function-type-instance) of a function type with receiver providing the _receiver object_.

Inside the body of the function literal, the receiver object passed to a call becomes an *implicit* *this*{: .keyword}, so that you 
can access the members of that receiver object without any additional qualifiers, or access the receiver object 
using a [`this` expression](this-expressions.html).
 
This behavior is similar to [extension functions](extensions.html), which also allow you to access the members of the receiver object 
inside the body of the function.

Here is an example of a function literal with receiver along with its type, where `plus` is called on the 
receiver object:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val sum: Int.(Int) -> Int = { other -> plus(other) } 
```

</div>

The anonymous function syntax allows you to specify the receiver type of a function literal directly.
This can be useful if you need to declare a variable of a function type with receiver, and to use it later.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val sum = fun Int.(other: Int): Int = this + other
```

</div>

Lambda expressions can be used as function literals with receiver when the receiver type can be inferred from context.
One of the most important examples of their usage is [type-safe builders](type-safe-builders.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class HTML {
    fun body() { ... }
}

fun html(init: HTML.() -> Unit): HTML {
    val html = HTML()  // create the receiver object
    html.init()        // pass the receiver object to the lambda
    return html
}

html {       // lambda with receiver begins here
    body()   // calling a method on the receiver object
}
```

</div>
