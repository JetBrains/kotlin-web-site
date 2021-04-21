[//]: # (title: Returns and jumps)

Kotlin has three structural jump expressions:

* `return` by default returns from the nearest enclosing function or [anonymous function](lambdas.md#anonymous-functions)
* `break` terminates the nearest enclosing loop
* `continue` proceeds to the next step of the nearest enclosing loop

All of these expressions can be used as part of larger expressions:

```kotlin
val s = person.name ?: return
```

The type of these expressions is the [Nothing type](exceptions.md#the-nothing-type).

## Break and continue labels

Any expression in Kotlin may be marked with a _label_.
Labels have the form of an identifier followed by the `@` sign, for example: `abc@`, `fooBar@`.
To label an expression, just add a label in front of it.

```kotlin
loop@ for (i in 1..100) {
    // ...
}
```

Now, we can qualify a `break` or a `continue` with a label:

```kotlin
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

A `break` qualified with a label jumps to the execution point right after the loop marked with that label.
A `continue` proceeds to the next iteration of that loop.

## Return at labels

With function literals, local functions and object expressions, functions can be nested in Kotlin. 
Qualified `return`s allow us to return from an outer function. 
The most important use case is returning from a lambda expression. Recall that when we write this:

```kotlin
//sampleStart
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return // non-local return directly to the caller of foo()
        print(it)
    }
    println("this point is unreachable")
}
//sampleEnd

fun main() {
    foo()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

The `return`-expression returns from the nearest enclosing function - `foo`.
Note that such non-local returns are supported only for lambda expressions passed to [inline functions](inline-functions.md).
To return from a lambda expression, label it and qualify the `return`:

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

Now, it returns only from the lambda expression. Oftentimes it is more convenient to use _implicit labels_:
such a label has the same name as the function to which the lambda is passed.

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

Note that the use of local returns in previous three examples is similar to the use of `continue` in regular loops.
There is no direct equivalent for `break`, but it can be simulated by adding another nesting lambda and non-locally returning from it:

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

When returning a value, the parser gives preference to the qualified return:

```kotlin
return@a 1
```

This means "return `1` at label `@a`" and not "return a labeled expression `(@a 1)`".
