[//]: # (title: Conditions and loops)

Kotlin gives you flexible tools for controlling the flow of your program. Use `if`, `when`, and loops to define clear, 
expressive logic for your conditions.

## If expression

In Kotlin, there is no ternary operator (`condition ? then : else`) because `if` serves the same purpose. Add the condition
to check within parentheses `()` and the action to take if the result is true within curly braces `{}`. You can use `else`
and `else if` for additional branches and checks. 

You can also write `if` as an expression, which lets you assign its returned value directly to a variable.
If you do use `if` as an expression, you must have an `else` branch.

For example:

```kotlin
fun main() {
    val heightAlice = 160
    val heightBob = 175

    //sampleStart
    var taller = heightAlice
    if (heightAlice < heightBob) taller = heightBob

    // With else
    if (heightAlice > heightBob) {
        taller = heightAlice
    } else {
        taller = heightBob
    }

    // As expression
    taller = if (heightAlice > heightBob) heightAlice else heightBob

    // With `else if` as an expression:
    val heightLimit = 150
    val heightOrLimit = if (heightLimit > heightAlice) heightLimit else if (heightAlice > heightBob) heightAlice else heightBob

    println("Taller height is $taller")
    // Taller height is 175
    println("Height or limit is $heightOrLimit")
    // Height or limit is 175
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-if-kotlin"}

Branches of an `if` expression can be blocks. In this case, the last expression is the value of a block:

```kotlin
fun main() {
    //sampleStart
    val heightAlice = 160
    val heightBob = 175

    val taller = if (heightAlice > heightBob) {
        print("Choose Alice\n")
        heightAlice
    } else {
        print("Choose Bob\n")
        heightBob
    }

    println("Taller height is $taller")
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="if-else-blocks-kotlin"}

## When expressions and statements

`when` is a conditional expression that runs code based on multiple possible values or conditions. It's
similar to the `switch` statement in Java, C, and similar languages. `when` evaluates its argument against each branch 
in order until one branch condition is satisfied. For example:

```kotlin
fun main() {
    //sampleStart
    val userRole = "Editor"
    when (userRole) {
        "Viewer" -> print("User has read-only access")
        "Editor" -> print("User can edit content")
        else -> print("User role is not recognized")
    }
    // User can edit content
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-conditions-when-statement"}

You can use `when` either as an **expression** or a **statement**.  As an expression, `when` returns a value you can use
later in your code. As a statement, `when` completes an action without returning a result:

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

Secondly, you can use `when` with or without a subject. The behavior stays the same either way. Using a subject usually
makes your code more readable and maintainable because it clearly shows what you're checking.

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

### when as a statement

If you use `when` as a statement, you don't need to cover all possible cases. In this example, some cases aren't covered,
so nothing happens. However, no error occurs:

```kotlin
fun main() {
    //sampleStart
    val deliveryStatus = "OutForDelivery"
    when (deliveryStatus) {
        // Not all cases are covered
        "Pending" -> print("Your order is being prepared")
        "Shipped" -> print("Your order is on the way")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-statement"}

In a `when` statement, the values of individual branches are ignored. Just like with `if`, each branch can be a block, 
and its value is the value of the last expression in the block.

### when as an expression

If you use `when` as an expression, you **must** cover all possible cases. In other words, it must be _exhaustive_.
The value of the first matching branch becomes the value of the overall expression. If you don't cover all cases, 
the compiler throws an error.

If your `when` expression has a subject, you can use an `else` branch to make sure that all possible cases are covered, but
it isn't mandatory. For example, if your subject is a `Boolean`, [`enum` class](enum-classes.md), [`sealed` class](sealed-classes.md),
or one of their nullable counterparts, you can cover all cases without an `else` branch:

```kotlin
import kotlin.random.Random
//sampleStart
enum class Bit {
    ZERO, ONE
}

fun getRandomBit(): Bit {
    return if (Random.nextBoolean()) Bit.ONE else Bit.ZERO
}

fun main() {
    val numericValue = when (getRandomBit()) {
        // No else branch is needed because all cases are covered
        Bit.ZERO -> 0
        Bit.ONE -> 1
    }

    println("Random bit as number: $numericValue")
    // Random bit as number: 0
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-expression-subject"}

> To simplify `when` expressions and reduce repetition, try out context-sensitive resolution (currently in preview).
> This feature allows you to omit the type name when using enum entries or sealed class members in `when` expressions if the expected type is known.
> 
> For more information, see [Preview of context-sensitive resolution](whatsnew22.md#preview-of-context-sensitive-resolution) or the related [KEEP proposal](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md).
> 
{style="tip"}

If your `when` expression **doesn't** have a subject, you **must** have an `else` branch or the compiler throws an error.
The `else` branch is evaluated when none of the other branch conditions are satisfied:

```kotlin
fun main() {
    //sampleStart
    val localFileSize = 1200
    val remoteFileSize = 1200

    val message = when {
        localFileSize > remoteFileSize -> "Local file is larger than remote file"
        localFileSize < remoteFileSize -> "Local file is smaller than remote file"
        else -> "Local and remote files are the same size"
    }

    println(message)
    // Local and remote files are the same size
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-no-subject"}

### Other ways to use when

`when` expressions and statements offer different ways to simplify your code, handle multiple conditions, and perform 
type checks.

You can group multiple conditions into a single branch using commas: 

```kotlin
fun main() {
    val ticketPriority = "High"
    //sampleStart
    when (ticketPriority) {
        "Low", "Medium" -> print("Standard response time")
        else -> print("High-priority handling")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-multiple-cases"}

You can also use expressions that evaluate to `true` or `false` as branch conditions:

```kotlin
fun main() {
    val storedPin = "1234"
    val enteredPin = 1234
  
    //sampleStart
    when (enteredPin) {
        // Expression
        storedPin.toInt() -> print("PIN is correct")
        else -> print("Incorrect PIN")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-branch-expression"}

Check whether a value is or isn't contained in a [range](ranges.md) or collection using the `in` or `!in` keywords:

```kotlin
fun main() {
    val x = 7
    val validNumbers = setOf(15, 16, 17)

    //sampleStart
    when (x) {
        in 1..10 -> print("x is in the range")
        in validNumbers -> print("x is valid")
        !in 10..20 -> print("x is outside the range")
        else -> print("none of the above")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-ranges"}

Check a value's type using the `is` or `!is` keywords. Due to [smart casts](typecasts.md#smart-casts), you can access the member functions 
and properties of the type directly:

```kotlin
fun hasPrefix(input: Any): Boolean = when (input) {
    is String -> input.startsWith("ID-")
    else -> false
}

fun main() {
    val testInput = "ID-98345"
    println(hasPrefix(testInput))
    // true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-type-checks"}

You can use `when` instead of a traditional `if`-`else` `if` chain.
Without a subject, the branch conditions are simply boolean expressions. The first branch with a `true` condition runs:

```kotlin
fun Int.isOdd() = this % 2 != 0
fun Int.isEven() = this % 2 == 0

fun main() {
    //sampleStart
    val x = 5
    val y = 8

    when {
        x.isOdd() -> print("x is odd")
        y.isEven() -> print("y is even")
        else -> print("x+y is odd")
    }
    // x is odd
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-replace-if"}

Finally, you can capture the subject in a variable by using the following syntax:

```kotlin
fun main() {
    val message = when (val input = "yes") {
        "yes" -> "You said yes"
        "no" -> "You said no"
        else -> "Unrecognized input: $input"
    }

    println(message)
    // You said yes
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-when-capture-subject"}

The scope of a variable introduced as the subject is restricted to the body of the `when` expression or statement.

### Guard conditions {id="guard-conditions-in-when-expressions"}
<primary-label ref="experimental-general"/>

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
        // Branch with only primary condition. 
        // Calls `feedDog()` when `animal` is `Dog`
        is Animal.Dog -> feedDog()
        // Branch with both primary and guard conditions. 
        // Calls `feedCat()` when `animal` is `Cat` and not `mouseHunter`
        is Animal.Cat if !animal.mouseHunter -> feedCat()
        // Prints "Unknown animal" if none of the above conditions match
        else -> println("Unknown animal")
    }
}

fun main() {
    val animals = listOf(
        Animal.Dog("Beagle"),
        Animal.Cat(mouseHunter = false),
        Animal.Cat(mouseHunter = true)
    )

    animals.forEach { feedAnimal(it) }
    // Feeding a dog
    // Feeding a cat
    // Unknown animal
}
```

You can't use guard conditions when you have multiple conditions separated by a comma. For example:

```kotlin
0, 1 -> print("x == 0 or x == 1")
```

In a single `when` expression or statement, you can combine branches with and without guard conditions. 
The code in a branch with a guard condition runs only if both the primary condition and the guard condition evaluate to `true`.
If the primary condition doesn't match, the guard condition isn't evaluated. 

Since `when` statements don't need to cover all cases, using guard conditions in `when` statements without an 
`else` branch means that if no conditions match, nothing happens. 

In contrast, `when` expressions must cover all cases. If you use guard conditions in `when` expressions without an `else` branch,
the compiler requires you to handle every possible case to avoid runtime errors.

Combine multiple guard conditions within a single branch using the boolean operators `&&` (AND) or `||` (OR).
Use parentheses around the boolean expressions to [avoid confusion](coding-conventions.md#guard-conditions-in-when-expression):

```kotlin
when (animal) {
    is Animal.Cat if (!animal.mouseHunter && animal.hungry) -> feedCat()
}
```

Guard conditions also support `else if`:

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

> To enable guard conditions in CLI, run the following command:
>
> `kotlinc -Xwhen-guards main.kt`
>
> To enable guard conditions in Gradle, add the following line to your `build.gradle.kts` file:
>
> `kotlin.compilerOptions.freeCompilerArgs.add("-Xwhen-guards")`
>
{style="note"}

#### Leave feedback

We would appreciate your feedback on guard conditions in [YouTrack](https://youtrack.jetbrains.com/issue/KT-71140/Guard-conditions-in-when-expressions-feedback).

## For loops

Use the `for` loop to iterate through a [collection](collections-overview.md), [array](arrays.md), or [range](ranges.md).

The syntax of `for` is the following:

```kotlin
for (item in collection) print(item)
```

The body of `for` can be a block with curly braces `{}`.

```kotlin
fun main() {
    val shoppingList = listOf("Milk", "Bananas", "Bread")
    //sampleStart
    println("Things to buy:")
    for (item in shoppingList) {
        println("- $item")
    }
    // Things to buy:
    // - Milk
    // - Bananas
    // - Bread
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop"}

### Ranges

To iterate over a range of numbers, use a [range expression](ranges.md) with `..` and `..<` operators:

```kotlin
fun main() {
//sampleStart
    println("Closed-ended range:")
    for (i in 1..6) {
        print(i)
    }
    // Closed-ended range:
    // 123456
  
    println("\nOpen-ended range:")
    for (i in 1..<6) {
        print(i)
    }
    // Open-ended range:
    // 12345
  
    println("\nReverse order in steps of 2:")
    for (i in 6 downTo 0 step 2) {
        print(i)
    }
    // Reverse order in steps of 2:
    // 6420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-range"}

### Arrays

If you want to iterate through an array or a list with an index, you can use the `indices` property:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for (i in routineSteps.indices) {
        println(routineSteps[i])
    }
    // Wake up
    // Brush teeth
    // Make coffee
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array"}

Alternatively, you can use the `withIndex` library function:

```kotlin
fun main() {
    val routineSteps = arrayOf("Wake up", "Brush teeth", "Make coffee")
    //sampleStart
    for ((index, value) in routineSteps.withIndex()) {
        println("The step at $index is \"$value\"")
    }
    // The step at 0 is "Wake up"
    // The step at 1 is "Brush teeth"
    // The step at 2 is "Make coffee"
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-array-index"}

### Iterators

The `for` loop iterates through anything that provides an [iterator](iterators.md). Collections provide iterators by 
default, whereas ranges and arrays are compiled into index-based loops.

You can create your own iterators. Iterators must have:

* a member or an extension function `iterator()` that returns `Iterator<>`, which has:
  * a member or an extension function `next()`.
  * a member or an extension function `hasNext()` that returns `Boolean`.

The easiest way to create your own iterator for a class is to inherit from the [`Iterable<T>`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-iterable/) interface and override the
`iterator()`, `next()`, and `hasNext()` functions that are already there. For example:

```kotlin
class Booklet(val totalPages: Int) : Iterable<Int> {
    override fun iterator(): Iterator<Int> {
        return object : Iterator<Int> {
            var current = 1
            override fun hasNext() = current <= totalPages
            override fun next() = current++
        }
    }
}

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-inherit-iterator"}

> Learn more about [interfaces](interfaces.md) and [inheritance](inheritance.md).
> 
{style="tip"}

Alternatively, you can create the functions from scratch. In this case, add the `operator` keywords to the functions:

```kotlin
//sampleStart
class Booklet(val totalPages: Int) {
    operator fun iterator(): Iterator<Int> {
        return object {
            var current = 1

            operator fun hasNext() = current <= totalPages
            operator fun next() = current++
        }.let {
            object : Iterator<Int> {
                override fun hasNext() = it.hasNext()
                override fun next() = it.next()
            }
        }
    }
}
//sampleEnd

fun main() {
    val booklet = Booklet(3)
    for (page in booklet) {
        println("Reading page $page")
    }
    // Reading page 1
    // Reading page 2
    // Reading page 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-for-loop-iterator-from-scratch"}

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
