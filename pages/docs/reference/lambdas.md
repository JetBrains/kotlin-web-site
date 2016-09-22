---
type: doc
layout: reference
category: "Syntax"
title: "Higher-Order Functions and Lambdas"
---

# Higher-Order Functions and Lambdas

## Higher-Order Functions

A higher-order function is a function that takes functions as parameters, or returns a function.
A good example of such a function is `lock()` that takes a lock object and a function, acquires the lock, runs the function and releases the lock:

``` kotlin
fun <T> lock(lock: Lock, body: () -> T): T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock()
  }
}
```

Let's examine the code above: `body` has a [function type](#function-types): `() -> T`,
so it's supposed to be a function that takes no parameters and returns a value of type `T`.
It is invoked inside the *try*{: .keyword }-block, while protected by the `lock`, and its result is returned by the `lock()` function.

If we want to call `lock()`, we can pass another function to it as an argument (see [function references](reflection.html#function-references)):

``` kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```

Another, often more convenient way is to pass a [lambda expression](#lambda-expressions-and-anonymous-functions):

``` kotlin
val result = lock(lock, { sharedResource.operation() })
```

Lambda expressions are described in more [detail below](#lambda-expressions-and-anonymous-functions), but for purposes of continuing this section, let's see a brief overview:

* A lambda expression is always surrounded by curly braces,
* Its parameters (if any) are declared before `->` (parameter types may be omitted),
* The body goes after `->` (when present).

In Kotlin, there is a convention that if the last parameter to a function is a function, that parameter can be specified outside of the parentheses:

``` kotlin
lock (lock) {
  sharedResource.operation()
}
```

Another example of a higher-order function would be `map()`:

``` kotlin
fun <T, R> List<T>.map(transform: (T) -> R): List<R> {
  val result = arrayListOf<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

This function can be called as follows:

``` kotlin
val doubled = ints.map { it -> it * 2 }
```

Note that the parentheses in a call can be omitted entirely if the lambda is the only argument to that call.

### `it`: implicit name of a single parameter

One other helpful convention is that if a function literal has only one parameter,
its declaration may be omitted (along with the `->`), and its name will be `it`:

``` kotlin
ints.map { it * 2 }
```

These conventions allow to write [LINQ-style](http://msdn.microsoft.com/en-us/library/bb308959.aspx) code:

``` kotlin
strings.filter { it.length == 5 }.sortBy { it }.map { it.toUpperCase() }
```

## Inline Functions

Sometimes it is beneficial to enhance performance of higher-order functions using [inline functions](inline-functions.html).

## Lambda Expressions and Anonymous Functions

A lambda expression or an anonymous function is a "function literal", i.e. a function that is not declared,
but passed immediately as an expression. Consider the following example:

``` kotlin
max(strings, { a, b -> a.length < b.length })
```

Function `max` is a higher-order function, i.e. it takes a function value as the second argument.
This second argument is an expression that is itself a function, i.e. a function literal. As a function, it is equivalent to

``` kotlin
fun compare(a: String, b: String): Boolean = a.length < b.length
```

### Function Types

For a function to accept another function as a parameter, we have to specify a function type for that parameter.
For example the abovementioned function `max` is defined as follows:

``` kotlin
fun <T> max(collection: Collection<T>, less: (T, T) -> Boolean): T? {
  var max: T? = null
  for (it in collection)
    if (max == null || less(max, it))
      max = it
  return max
}
```

The parameter `less` is of type `(T, T) -> Boolean`, i.e. a function that takes two parameters of type `T` and returns a `Boolean`:
true if the first one is smaller than the second one.

In the body, line 4, `less` is used as a function: it is called by passing two arguments of type `T`.

A function type is written as above, or may have named parameters, if you want to document the meaning of each parameter.

``` kotlin
val compare: (x: T, y: T) -> Int = ...
```

### Lambda Expression Syntax

The full syntactic form of lambda expressions, i.e. literals of function types, is as follows:

``` kotlin
val sum = { x: Int, y: Int -> x + y }
```

A lambda expression is always surrounded by curly braces,
parameter declarations in the full syntactic form go inside parentheses and have optional type annotations,
the body goes after an `->` sign.
If we leave all the optional annotations out, what's left looks like this:

``` kotlin
val sum: (Int, Int) -> Int = { x, y -> x + y }
```

It's very common that a lambda expression has only one parameter.
If Kotlin can figure the signature out itself, it allows us not to declare the only parameter, and will implicitly
declare it for us under the name `it`:

``` kotlin
ints.filter { it > 0 } // this literal is of type '(it: Int) -> Boolean'
```

Note that if a function takes another function as the last parameter, the lambda expression argument can be passed
outside the parenthesized argument list.
See the grammar for [callSuffix](grammar.html#call-suffix).

### Anonymous Functions

One thing missing from the lambda expression syntax presented above is the ability to specify the return type of the
function. In most cases, this is unnecessary because the return type can be inferred automatically. However, if you
do need to specify it explicitly, you can use an alternative syntax: an _anonymous function_.

``` kotlin
fun(x: Int, y: Int): Int = x + y
```

An anonymous function looks very much like a regular function declaration, except that its name is omitted. Its body
can be either an expression (as shown above) or a block:

``` kotlin
fun(x: Int, y: Int): Int {
  return x + y
}
```

The parameters and the return type are specified in the same way as for regular functions, except that the parameter
types can be omitted if they can be inferred from context:

``` kotlin
ints.filter(fun(item) = item > 0)
```

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
can access its _closure_, i.e. the variables declared in the outer scope. Unlike Java, the variables captured in the closure can be modified:

``` kotlin
var sum = 0
ints.filter { it > 0 }.forEach {
  sum += it
}
print(sum)
```


### Function Literals with Receiver

Kotlin provides the ability to call a function literal with a specified _receiver object_.
Inside the body of the function literal, you can call methods on that receiver object without any additional qualifiers.
This is similar to extension functions, which allow you to access members of the receiver object inside the body of the function.
One of the most important examples of their usage is [Type-safe Groovy-style builders](type-safe-builders.html).

The type of such a function literal is a function type with receiver:

``` kotlin
sum : Int.(other: Int) -> Int
```

The function literal can be called as if it were a method on the receiver object:

``` kotlin
1.sum(2)
```

The anonymous function syntax allows you to specify the receiver type of a function literal directly.
This can be useful if you need to declare a variable of a function type with receiver, and to use it later.

``` kotlin
val sum = fun Int.(other: Int): Int = this + other
```

Lambda expressions can be used as function literals with receiver when the receiver type can be inferred from context.

``` kotlin
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
