[//]: # (title: Conditions and loops)

## If expression

In Kotlin, `if` is an expression: it returns a value.
Therefore, there is no ternary operator (`condition ? then : else`) because ordinary `if` works fine in this role.

```kotlin
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

Branches of `if` branches can be blocks. In this case, the last expression is the value of a block:

```kotlin
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

If you're using `if` as an expression, for example, for returning its value or
assigning it to a variable, the `else` branch is mandatory.

## When expression

`when` defines a conditional expression with multiple branches. It is similar to the `switch` statement in C-like languages.
Its simple form looks like this.

```kotlin
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // Note the block
        print("x is neither 1 nor 2")
    }
}
```

`when` matches its argument against all branches sequentially until some branch condition is satisfied.

`when` can be used either as an expression or as a statement. If it is used as an expression, the value
of the first matching branch becomes the value of the overall expression. If it is used as a statement, the values of
individual branches are ignored. Just like with `if`, each branch can be a block, and its value
is the value of the last expression in the block.

The `else` branch is evaluated if none of the other branch conditions are satisfied.
If `when` is used as an expression, the `else` branch is mandatory,
unless the compiler can prove that all possible cases are covered with branch conditions,
for example, with [`enum` class](enum-classes.md) entries and [`sealed` class](sealed-classes.md) subtypes).

To define a common behavior for multiple cases, combine their conditions in a single line with a comma: 

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

You can use arbitrary expressions (not only constants) as branch conditions

```kotlin
when (x) {
    parseInt(s) -> print("s encodes x")
    else -> print("s does not encode x")
}
```

You can also check a value for being `in` or `!in` a [range](ranges.md) or a collection:

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

Another option is checking that a value `is` or `!is` of a particular type. Note that,
due to [smart casts](typecasts.md#smart-casts), you can access the methods and properties of the type without
any extra checks.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

`when` can also be used as a replacement for an `if`-`else` `if` chain.
If no argument is supplied, the branch conditions are simply boolean expressions, and a branch is executed when its condition is true:

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

You can capture *when* subject in a variable using following syntax:

```kotlin
fun Request.getBody() =
        when (val response = executeRequest()) {
            is Success -> response.body
            is HttpError -> throw HttpException(response.status)
        }
```

The scope of variable introduced in *when* subject is restricted to the body of this *when*.

## For loops

The `for` loop iterates through anything that provides an iterator. This is equivalent to the `foreach` loop in languages like C#.
The syntax of `for` is the following:

```kotlin
for (item in collection) print(item)
```

The body of `for` can be a block.

```kotlin
for (item: Int in ints) {
    // ...
}
```

As mentioned before, `for` iterates through anything that provides an iterator. This means that it:

* has a member or an extension function `iterator()` that returns `Iterator<>`:
  * has a member or an extension function `next()`
  * has a member or an extension function `hasNext()` that returns `Boolean`.

All of these three functions need to be marked as `operator`.

To iterate over a range of numbers, use a [range expression](ranges.md):

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

A `for` loop over a range or an array is compiled to an index-based loop that does not create an iterator object.

If you want to iterate through an array or a list with an index, you can do it this way:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Alternatively, you can use the `withIndex` library function:

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## While loops

`while` and `do-while` loops execute their body continuously while their condition is satisfied.
The difference between them is the condition checking time:
* `while` checks the condition and, if it's satisfied, executes the body and then returns to the condition check.
* `do-while` executes the body and then checks the condition. If it's satisfied, the loop repeats. So, the body of `do-while`
executes at least once regardless of the condition. 

```kotlin
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## Break and continue in loops

Kotlin supports traditional `break` and `continue` operators in loops. See [Returns and jumps](returns.md).

