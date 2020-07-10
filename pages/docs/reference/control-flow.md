---
type: doc
layout: reference
category: "Syntax"
title: "Control Flow: if, when, for, while"
---

# Control Flow: if, when, for, while

## If Expression

In Kotlin, *if*{: .keyword } is an expression, i.e. it returns a value.
Therefore there is no ternary operator (condition ? then : else), because ordinary *if*{: .keyword } works fine in this role.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Traditional usage 
var max = a 
if (a < b) max = b

// With else 
var max: Int
if (a > b) {
    max = a
} else {
    max = b
}
 
// As expression 
val max = if (a > b) a else b
```

</div>

*if*{: .keyword } branches can be blocks, and the last expression is the value of a block:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

</div>

If you're using *if*{: .keyword } as an expression rather than a statement (for example, returning its value or
assigning it to a variable), the expression is required to have an `else` branch.

See the [grammar for *if*{: .keyword }](grammar.html#ifExpression).

## When Expression

*when*{: .keyword } replaces the switch operator of C-like languages. In the simplest form it looks like this

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // Note the block
        print("x is neither 1 nor 2")
    }
}
```

</div>

*when*{: .keyword } matches its argument against all branches sequentially until some branch condition is satisfied.
*when*{: .keyword } can be used either as an expression or as a statement. If it is used as an expression, the value
of the satisfied branch becomes the value of the overall expression. If it is used as a statement, the values of
individual branches are ignored. (Just like with *if*{: .keyword }, each branch can be a block, and its value
is the value of the last expression in the block.)

The *else*{: .keyword } branch is evaluated if none of the other branch conditions are satisfied.
If *when*{: .keyword } is used as an expression, the *else*{: .keyword } branch is mandatory,
unless the compiler can prove that all possible cases are covered with branch conditions (as, for example, with [*enum*{: .keyword } class](enum-classes.html) entries and [*sealed*{: .keyword } class](sealed-classes.html) subtypes).

If many cases should be handled in the same way, the branch conditions may be combined with a comma:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

</div>

We can use arbitrary expressions (not only constants) as branch conditions

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

</div>

We can also check a value for being *in*{: .keyword } or *!in*{: .keyword } a [range](ranges.html) or a collection:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

</div>

Another possibility is to check that a value *is*{: .keyword } or *!is*{: .keyword } of a particular type. Note that,
due to [smart casts](typecasts.html#smart-casts), you can access the methods and properties of the type without
any extra checks.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

</div>

*when*{: .keyword } can also be used as a replacement for an *if*{: .keyword }-*else*{: .keyword } *if*{: .keyword } chain.
If no argument is supplied, the branch conditions are simply boolean expressions, and a branch is executed when its condition is true:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is even.")
}
```

</div>

Since Kotlin 1.3, it is possible to capture *when*{: .keyword} subject in a variable using following syntax:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

</div>

Scope of variable, introduced in *when*{: .keyword} subject, is restricted to *when*{: .keyword} body.

See the [grammar for *when*{: .keyword }](grammar.html#whenExpression).


## For Loops

*for*{: .keyword } loop iterates through anything that provides an iterator. This is equivalent
to the `foreach` loop in languages like C#. The syntax is as follows:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (item in collection) print(item)
```

</div>

The body can be a block.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (item: Int in ints) {
    // ...
}
```

</div>

As mentioned before, *for*{: .keyword } iterates through anything that provides an iterator, i.e.

* has a member- or extension-function `iterator()`, whose return type
  * has a member- or extension-function `next()`, and
  * has a member- or extension-function `hasNext()` that returns `Boolean`.

All of these three functions need to be marked as `operator`.

To iterate over a range of numbers, use a [range expression](ranges.html):

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        println(i)
    }
    for (i in 6 downTo 0 step 2) {
        println(i)
    }
//sampleEnd
}
```

</div>

A `for` loop over a range or an array is compiled to an index-based loop that does not create an iterator object.

If you want to iterate through an array or a list with an index, you can do it this way:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
val array = arrayOf("a", "b", "c")
//sampleStart
    for (i in array.indices) {
        println(array[i])
    }
//sampleEnd
}
```

</div>

Alternatively, you can use the `withIndex` library function:

<div class="sample" markdown="1" theme="idea">

```kotlin
fun main() {
    val array = arrayOf("a", "b", "c")
//sampleStart
    for ((index, value) in array.withIndex()) {
        println("the element at $index is $value")
    }
//sampleEnd
}
```

</div>

See the [grammar for *for*{: .keyword }](grammar.html#forStatement).

## While Loops

*while*{: .keyword } and *do*{: .keyword }..*while*{: .keyword } work as usual

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

</div>

See the [grammar for *while*{: .keyword }](grammar.html#whileStatement).

## Break and continue in loops

Kotlin supports traditional *break*{: .keyword } and *continue*{: .keyword } operators in loops. See [Returns and jumps](returns.html).
