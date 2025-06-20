[//]: # (title: Returns and jumps)

Kotlin has three structural jump expressions:

* `return` by default returns from the nearest enclosing function or [anonymous function](lambdas.md#anonymous-functions).
* `break` terminates the nearest enclosing loop.
* `continue` proceeds to the next step of the nearest enclosing loop.

All of these expressions can be used as part of larger expressions:

```kotlin
val s = person.name ?: return
```

The type of these expressions is the [Nothing type](exceptions.md#the-nothing-type).

## Break and continue labels

Any expression in Kotlin may be marked with a _label_.
Labels have the form of an identifier followed by the `@` sign, such as `abc@` or `fooBar@`.
To label an expression, just add a label in front of it.

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

Now, you can qualify a `break` or a `continue` with a label:

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

A `break` qualified with a label jumps to the execution point right after the loop marked with that label.
A `continue` proceeds to the next iteration of that loop.

> In some cases, you can apply `break` and `continue` *non-locally* without explicitly defining labels.
> Such non-local usages are valid in lambda expressions used in enclosing [inline functions](inline-functions.md#break-and-continue).
>
{style="note"}

## Return to labels

In Kotlin, functions can be nested using function literals, local functions, and object expressions.
A qualified `return` allows you to return from an outer function.

The most important use case is returning from a lambda expression. To return from a lambda expression,
label it and qualify the `return`:

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // local return to the caller of the lambda - the forEach loop
        print(it)
    }
    print(" done with explicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Now, it returns only from the lambda expression. Often it is more convenient to use _implicit labels_, because such a label
has the same name as the function to which the lambda is passed.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // local return to the caller of the lambda - the forEach loop
        print(it)
    }
    print(" done with implicit label")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Alternatively, you can replace the lambda expression with an [anonymous function](lambdas.md#anonymous-functions).
A `return` statement in an anonymous function will return from the anonymous function itself.

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // local return to the caller of the anonymous function - the forEach loop
        print(value)
    })
    print(" done with anonymous function")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Note that the use of local returns in the previous three examples is similar to the use of `continue` in regular loops.

There is no direct equivalent for `break`, but it can be simulated by adding another nesting lambda and non-locally
returning from it, as long as the lambda is passed to an [inline function](inline-functions.md):

```kotlin
//sampleStart
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // non-local return from the lambda passed to run
            print(it)
        }
    }
    print(" done with nested loop")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Here, both `forEach()` extension and `run` scope function are inline functions from the Kotlin standard library.

When returning a value, the parser gives preference to the qualified return:

```kotlin
return@a 1
```

This means "return `1` at label `@a`" rather than "return a labeled expression `(@a 1)`".

> In some cases, you can return from a lambda expression without using labels. Such *non-local* returns are located in a
> lambda but exit the enclosing [inline function](inline-functions.md#returns).
>
{style="note"}
