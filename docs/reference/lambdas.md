---
type: doc
layout: reference
category: "Syntax"
title: "Higher-Order Functions and Lambdas"
---

# Higher-Order Functions and Lambdas

## Higher-Order Functions

A higher-order function is a function that takes functions as parameters, or returns a function. A good example of such a function is lock() that takes a lock object and a function, acquires the lock, runs the functions and releases the lock:

``` kotlin
fun lock<T>(lock : Lock, body : () -> T) : T {
  lock.lock()
  try {
    return body()
  }
  finally {
    lock.unlock();
  }
}
```

Let's examine the code above: body has a [function type](#function-types): () -> T, so it's supposed to be a function that takes no parameters and returns a value of type T. It is invoked inside the try block, while protected by the lock, and its result is returned by the lock() function.

If we want to call lock, we can pass another function to it as an argument (see [function references](reflection.html#function-references)):

``` kotlin
fun toBeSynchronized() = sharedResource.operation()

val result = lock(lock, ::toBeSynchronized)
```

Another, often more convenient way is to pass a [function literal](#function-literals) (often referred to as _lambda expression_):

``` kotlin
val result = lock(lock, { sharedResource.operation() })
```

Function literals are described in more [detail below](#function-literals), but for purposes of continuing this section, let's see a brief overview

* A function literal is always surrounded by curly braces,
* Its parameters (if any) are declared before -> (parameter types may be omitted),
* The body goes after -> (when present).

In Kotlin, there is a convention that if the last parameter to a function is a function, then we can omit the parenthesis

``` kotlin
lock (lock) {
  sharedResource.operation()
}
```

Another example of a higher order function would be map() (of Map/Reduce):

``` kotlin
fun <T, R> List<T>.map(transform : (T) -> R) : List<R> {
  val result = ArrayList<R>()
  for (item in this)
    result.add(transform(item))
  return result
}
```

This function can be called as follows

``` kotlin
val doubled = ints.map {it -> it * 2}
```

One other convention helps is that if a function literal has only one parameter, its declaration may be omitted (along with the ->) and its name will be it

``` kotlin
ints map {it * 2} // Infix call + Implicit 'it'
```

These conventions allow to write [LINQ-style](http://msdn.microsoft.com/en-us/library/bb308959.aspx) code

``` kotlin
strings filter {it.length == 5} sortBy {it} map {it.toUpperCase()}
```

## Inline Functions

Using higher-order functions imposes certain runtime penalties: each function is an object, and it captures a closure, i.e. those variables that are accessed in the body of the function. Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.

But it appears that in many cases this kind of overhead can be eliminated by inlining the function literals. The functions shown above are good examples of this situation. I.e., the lock() function could be easily inlined at call-sites. Consider the following case:

``` kotlin
lock(l) {foo()}
```

Instead of creating a function object for the parameter and generating a call, the compiler could emit the following code

``` kotlin
lock.lock()
try {
  foo()
}
finally {
  lock.unlock()
}
```

Isn't it what we wanted from the very beginning?

To make the compiler do this, one needs to annotate the lock() function with the inline annotation:

``` kotlin
inline fun lock<T>(lock : Lock, body : () -> T) : T {
  // ...
}
```

Inlining may cause the generated code to grow, but if we do it in a reasonable way (do not inline big functions) it will pay off in performance, especially at "megamorphic" call-sites inside loops.

## Function Literals

A function literal as an "anonymous function", i.e. a function that is not declared, but passed immediately as an expression. Consider the following example:

``` kotlin
max(strings, {a, b -> a.length < b.length})
```

Function max is a higher-order function, i.e. is takes a function value as the second argument. This second argument is an expression that is itself a function, i.e. a function literal. As a function, it is equivalent to

``` kotlin
fun compare(a : String, b : String) : Boolean = a.length < b.length
```

### Function Types

For a function to accept another function as a parameter, we have to specify a function type for that parameter. For example the abovementioned function max is defined as follows:

``` kotlin
fun max<T>(collection : Collection<out T>, less : (T, T) -> Boolean) : T? {
  var max : T? = null
  for (it in collection)
    if (max == null || less(max!!, it))
      max = it
  return max
}
```

The parameter less is of type (T, T) -> Boolean, i.e. a function that takes two parameters of type T and returns a Boolean: true if the first one is smaller than the second one.

In the body, line 4, less is used as a function: it is called by passing two arguments of type T.

A function type is written as above, or may have named parameters, for documentation purposes and to enable calls with [named arguments](functions.html#named-arguments).

``` kotlin
val compare : (x : T, y : T) -> Int = ...
```

### Syntactic form of function literals

The full syntactic form of function literals, i.e. literals of function types, is as follows:

``` kotlin
val sum = {(x : Int, y : Int) : Int -> x + y}
```

A function literal is always surrounded by curly braces,
parameter declarations in the full syntactic form go inside parentheses and have optional type annotations,
the optional return type annotation goes after the parameter list,
the body goes after an '->' sign.
If we leave all the optional annotations out, what's left looks like this:

``` kotlin
val sum : (Int, Int) -> Int = {(x, y) -> x + y}
```

As this is the most common case, Kotlin allows us to leave the parentheses out as well, if no type annotations are present, and so we get the short syntactic form for functional literals:

``` kotlin
val sum : (Int, Int) -> Int = {x, y -> x + y}
```

It very common that a function literal has only one parameter. If Kotlin can figure the signature out itself, it allows us not to declare the only parameter, and will implicitly declare it for us under the name it:

``` kotlin
ints.filter {it > 0} // this literal is of type '(it : Int) -> Boolean'
```

Note that if a function takes another function as the last parameter, the function literal argument can be passed outside the parenthesized argument list. See Higher-order functions and the grammar for [callSuffix](grammar.html#call-sufix).

### Closures

A function literal (as well as a [local function](functions.html#local-functions) and [object expressions](object-declarations.html#object-expressions)) can access its closure, i.e. the variables declared in the outer scope. Unlike Java the closure variables can be modified:

``` kotlin
var sum = 0
ints filter {it > 0} forEach {
  sum += it
}
print(sum)
```

### Extension Function Literals

In addition to ordinary functions, Kotlin supports extension functions. This kind of functions in so useful, that extension function literals are also supported. One of the most important examples of their usage is Type-safe Groovy-style builders.

An extension function differs from an ordinary one in that it has a receiver type specification.

``` kotlin
val sum = {Int.(other : Int) : Int -> this + other}
```

Receiver type may be specified only in the full syntactic form of a function literal (remember that parameter types and return type annotations are optional in this form).

Such a literal has a function type with receiver

``` kotlin
sum : Int.(other : Int) -> Int
```

it can be called with a dot or in infix form (since it has only one parameter)

``` kotlin
1.sum(2)
1 sum 2
```






