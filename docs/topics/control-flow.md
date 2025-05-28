[//]: # (title: Conditions and loops)

## If expression

In Kotlin, `if` is an expression: it returns a value.
Therefore, there is no ternary operator (`condition ? then : else`) because ordinary `if` works fine in this role.

```kotlin
fun main() {
    val a = 2
    val b = 3

    //sampleStart
    var max = a
    if (a < b) max = b

    // With else
    if (a > b) {
      max = a
    } else {
      max = b
    }

    // As expression
    max = if (a > b) a else b

    // You can also use `else if` in expressions:
    val maxLimit = 1
    val maxOrLimit = if (maxLimit > a) maxLimit else if (a > b) a else b
  
    println("max is $max")
    // max is 3
    println("maxOrLimit is $maxOrLimit")
    // maxOrLimit is 3
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

Branches of an `if` expression can be blocks. In this case, the last expression is the value of a block:

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

## When expressions and statements

`when` is a conditional expression that runs code based on multiple possible values or conditions. It is
similar to the `switch` statement in Java, C, and similar languages. For example:

```kotlin
fun main() {
    //sampleStart
    val x = 2
    when (x) {
        1 -> print("x == 1")
        2 -> print("x == 2")
        else -> print("x is neither 1 nor 2")
    }
    // x == 2
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

`when` matches its argument against all branches sequentially until some branch condition is satisfied.

You can use `when` in a few different ways. Firstly, you can use `when` either as an **expression** or as a **statement**.
As an expression, `when` returns a value for later use in your code. As a statement, `when` completes an action
without returning anything of further use:

<table>
   <tr>
       <td>Expression</td>
       <td>Statement</td>
   </tr>
   <tr>
<td>

```kotlin
// Returns a string assigned to the 
// text variable
val text = when (x) {
    1 -> "x == 1"
    2 -> "x == 2"
    else -> "x is neither 1 nor 2"
}
```

</td>
<td>

```kotlin
// Returns nothing but triggers a 
// print statement
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> print("x is neither 1 nor 2")
}
```

</td>
</tr>
</table>

Secondly, you can use `when` with or without a subject. Whether you use a subject with `when` or not, your expression or
statement behaves the same. We recommend using `when` with a subject when possible, as it makes your code easier to read
and maintain by clearly showing what you're checking.

<table>
   <tr>
       <td>With subject <code>x</code></td>
       <td>Without subject</td>
   </tr>
   <tr>
<td>

```kotlin
when(x) { ... }
```

</td>
<td>

```kotlin
when { ... }
```

</td>
</tr>
</table>

Depending on how you use `when`, there are different requirements for whether you need to cover all possible cases in your
branches.

If you use `when` as a statement, you don't have to cover all possible cases. In this example, some cases aren't covered,
so nothing happens. However, no error occurs:

```kotlin
fun main() {
    //sampleStart
    val x = 3
    when (x) {
        // Not all cases are covered
        1 -> print("x == 1")
        2 -> print("x == 2")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

In a `when` statement, the values of individual branches are ignored. Just like with `if`, each branch can be a block, 
and its value is the value of the last expression in the block.

If you use `when` as an expression, you have to cover all possible cases. In other words, it must be _exhaustive_.
The value of the first matching branch becomes the value of the overall expression. If you don't cover all cases, 
the compiler throws an error.

If your `when` expression has a subject, you can use an `else` branch to make sure that all possible cases are covered, but
it isn't mandatory. For example, if your subject is a `Boolean`, [`enum` class](enum-classes.md), [`sealed` class](sealed-classes.md),
or one of their nullable counterparts, you can cover all cases without an `else` branch:

```kotlin
enum class Bit {
    ZERO, ONE
}

val numericValue = when (getRandomBit()) {
    // No else branch is needed because all cases are covered
    Bit.ZERO -> 0
    Bit.ONE -> 1
}
```

> To simplify `when` expressions and reduce repetition, try out context-sensitive resolution (currently in preview).
> This feature allows you to omit the type name when using enum entries or sealed class members in `when` expressions if the expected type is known.
> 
> For more information, see [Preview of context-sensitive resolution](whatsnew2220.md#preview-of-context-sensitive-resolution) or the related [KEEP proposal](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md).
> 
{style="tip"}

If your `when` expression **doesn't** have a subject, you **must** have an `else` branch or the compiler throws an error.
The `else` branch is evaluated when none of the other branch conditions are satisfied:

```kotlin
val message = when {
    a > b -> "a is greater than b"
    a < b -> "a is less than b"
    else -> "a is equal to b"
}
```

`when` expressions and statements offer different ways to simplify your code, handle multiple conditions, and perform 
type checks.

You can define a common behavior for multiple cases by combining their conditions in a single line with a comma: 

```kotlin
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

You can use arbitrary expressions (not only constants) as branch conditions:

```kotlin
when (x) {
    s.toInt() -> print("s encodes x")
    else -> print("s does not encode x")
}
```

You can also check whether a value is or isn't contained in a [range](ranges.md) or collection via the `in` or `!in` keywords:

```kotlin
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

Additionally, you can check that a value is or isn't a particular type via the `is` or `!is` keywords. Note that,
due to [smart casts](typecasts.md#smart-casts), you can access the member functions and properties of the type without
any additional checks.

```kotlin
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

You can use `when` as a replacement for an `if`-`else` `if` chain.
If there's no subject, the branch conditions are simply boolean expressions. The first branch with a `true` condition runs:

```kotlin
when {
    x.isOdd() -> print("x is odd")
    y.isEven() -> print("y is even")
    else -> print("x+y is odd")
}
```

You can capture the subject in a variable by using the following syntax:

```kotlin
fun Request.getBody() =
    when (val response = executeRequest()) {
        is Success -> response.body
        is HttpError -> throw HttpException(response.status)
    }
```

The scope of a variable introduced as the subject is restricted to the body of the `when` expression or statement.

### Guard conditions in when expressions

> Guard conditions are an [experimental feature](components-stability.md#stability-levels-explained) that may be changed at any time.
> We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback).
>
{style="warning"}

Guard conditions allow you to include 
more than one condition to the branches of a `when` expression, making complex control flow more explicit and concise.
You can use guard conditions in `when` expressions or statements with a subject.

To include a guard condition in a branch, place it after the primary condition, separated by `if`:

```kotlin
sealed interface Animal {
    data class Cat(val mouseHunter: Boolean) : Animal
    data class Dog(val breed: String) : Animal
}

fun feedAnimal(animal: Animal) {
    when (animal) {
        // Branch with only primary condition. Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> feedDog()
        // Branch with both primary and guard conditions. Calls `feedCat()` when `animal` is `Cat` and not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}
```

In a single `when` expression, you can combine branches with and without guard conditions. 
The code in a branch with a guard condition runs only if both the primary condition and the guard condition evaluate to true.
If the primary condition does not match, the guard condition is not evaluated. 

If you use guard conditions in `when` statements without an `else` branch, and none of the conditions matches, none of the branches is executed. 

Otherwise, if you use guard conditions in `when` expressions without an `else` branch, the compiler requires you to declare all the possible cases to avoid runtime errors.

Additionally, guard conditions support `else if`:

```kotlin
when (animal) {
    // Checks if `animal` is `Dog`
    is Animal.Dog -> feedDog()
    // Guard condition that checks if `animal` is `Cat` and not `mouseHunter`
    is Animal.Cat if !animal.mouseHunter -> feedCat()
    // Calls giveLettuce() if none of the above conditions match and animal.eatsPlants is true
    else if animal.eatsPlants -> giveLettuce()
    // Prints "Unknown animal" if none of the above conditions match
    else -> println("Unknown animal")
}
```

Combine multiple guard conditions within a single branch using the boolean operators `&&` (AND) or `||` (OR).
Use parentheses around the boolean expressions to [avoid confusion](coding-conventions.md#guard-conditions-in-when-expression):

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

You can use guard conditions in any `when` expression or statement with a subject, except the case when you have multiple conditions separated by a comma.
For example, `0, 1 -> print("x == 0 or x == 1")`.

> To enable guard conditions in CLI, run the following command:
>
> `kotlinc -Xwhen-guards main.kt`
>
> To enable guard conditions in Gradle, add the following line to the `build.gradle.kts` file:
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
>
{style="note"}

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

* has a member or an extension function `iterator()` that returns `Iterator<>`, which:
  * has a member or an extension function `next()`
  * has a member or an extension function `hasNext()` that returns `Boolean`.

All of these three functions need to be marked as `operator`.

To iterate over a range of numbers, use a [range expression](ranges.md):

```kotlin
fun main() {
//sampleStart
    for (i in 1..3) {
        print(i)
    }
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // 1236420
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
        print(array[i])
    }
    // abc
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
    // the element at 0 is a
    // the element at 1 is b
    // the element at 2 is c
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## While loops

`while` and `do-while` loops process their body continuously while their condition is satisfied.
The difference between them is the condition checking time:
* `while` checks the condition and, if it's satisfied, processes the body and then returns to the condition check.
* `do-while` processes the body and then checks the condition. If it's satisfied, the loop repeats. So, the body of `do-while`
runs at least once regardless of the condition. 

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
