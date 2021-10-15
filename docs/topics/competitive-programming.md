[//]: # (title: Kotlin for competitive programming)

This tutorial is designed both for competitive programmers that did not use Kotlin before and 
for Kotlin developers that did not participate in any competitive programming events before.
It assumes the corresponding programming skills.

[Competitive programming](https://en.wikipedia.org/wiki/Competitive_programming)
is a mind sport where contestants write programs to solve precisely specified 
algorithmic problems within strict constraints. Problems can range from simple ones that can be solved by 
any software developer and require little code to get a correct solution, to complex ones that require knowledge of 
special algorithms, data structures, and a lot of practice. While not being specifically designed for competitive 
programming, Kotlin incidentally fits well in this domain, reducing the typical amount of boilerplate that a 
programmer needs to write and read while working with the code almost to the level offered by dynamically-typed 
scripting languages, while having tooling and performance of a statically-typed language.

See [Get started with Kotlin/JVM](jvm-get-started.md) on how to set up development
environment for Kotlin. In competitive programming, a single project is usually created and each problem's solution is 
written in a single source file.

## Simple example: Reachable Numbers problem

Let's take a look at a concrete example. 

[Codeforces](https://codeforces.com/) 
Round 555 was held on April 26th for 3rd Division, which means it had problems fit for any developer to try. 
You can use [this link](https://codeforces.com/contest/1157) to read the problems. 
The simplest problem in the set is the 
[Problem A: Reachable Numbers](https://codeforces.com/contest/1157/problem/A).
It asks to implement a straightforward algorithm described in the problem statement. 

We'd start solving it by creating a Kotlin source file with an arbitrary name. `A.kt` will do well.
First, we need to implement a function specified in the problem statement as:

Let's denote a function f(x) in such a way: we add 1 to x, then, while there is at least one trailing zero 
in the resulting number, we remove that zero.

Kotlin is a pragmatic and unopinionated language, supporting both imperative and function programming styles without 
pushing the developer towards either one. We can implement the function `f` in functional style, using such Kotlin 
features as [tail recursion](functions.md#tail-recursive-functions):

```kotlin
tailrec fun removeZeroes(x: Int): Int =
    if (x % 10 == 0) removeZeroes(x / 10) else x
    
fun f(x: Int) = removeZeroes(x + 1)
```

Alternatively, we can write an imperative implementation of the function `f` using the traditional 
[while loop](control-flow.md) and mutable variables that are denoted in Kotlin with 
[var](basic-syntax.md#variables):

```kotlin
fun f(x: Int): Int {
    var cur = x + 1
    while (cur % 10 == 0) cur /= 10
    return cur
}
```

Types in Kotlin are optional in many places due to pervasive use of type-inference, but every declaration still has 
a well-defined static type that is known at compilation.

Now, all is left is to write the main function that reads the input and implements the rest of the algorithm that the problem 
statement asks for &mdash; to compute the number of different integers that are produced while repeatedly applying 
function `f` to the initial number `n` that is given in the standard input.

By default, Kotlin runs on JVM and gives direct access to a rich and efficient collections library with 
general-purpose collections and data-structures like dynamically-sized arrays (`ArrayList`), 
hash-based maps and sets (`HashMap`/`HashSet`), tree-based ordered maps and sets (`TreeMap`/`TreeSet`), etc. 
Using a hash-set of integers to track values that were already reached while applying function `f`, 
the straightforward imperative version of a solution to the problem can be written as shown below:

```kotlin
fun main() {
    var n = readln().toInt() // read integer from the input
    val reached = HashSet<Int>() // a mutable hash set 
    while (reached.add(n)) n = f(n) // iterate function f
    println(reached.size) // print answer to the output
}
```

There is no need to handle the case of misformatted input in competitive programming. An input format is always precisely
specified in competitive programming, and the actual input cannot deviate from the input specification in the problem
statement. That's why we're using Kotlin's `readln()` function. It asserts that the input string is present and throws
an exception otherwise. Likewise, the [String.toInt()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int.html)
function throws an exception if the input string is not an integer.

All online competitive programming events allow the use of pre-written code, so you can define your own library of 
utility functions that are geared towards competitive programming to make your actual solution code somewhat easier 
to read and write. You would then use this code as a template for your solutions. For example, you can define 
the following helper functions for reading inputs in competitive programming:

```kotlin
private fun readInt() = readln().toInt()
private fun readStr() = readln().toString()
// etc for other types you'd use in your solutions
```

Note the use of `private` [visibility modifier](visibility-modifiers.md) here.
While the concept of visibility modifier is not relevant for competitive programming at all, 
it allows you to place multiple solution files based on the
same template without getting an error for conflicting public declarations in the same package.

## Functional operators example: Long Number problem

For more complicated problems, Kotlin's extensive library of functional operations on collections comes in handy to 
minimize the boilerplate and turn the code into a linear top-to-bottom and left-to-right fluent data transformation 
pipeline. For example, the 
[Problem B: Long Number](https://codeforces.com/contest/1157/problem/B) problem 
takes a simple greedy algorithm to implement and it can be written using this style without a single mutable variable:

```kotlin
fun main() {
    // read input
    val n = readln().toInt()
    val s = readln()
    val fl = readln().split(" ").map { it.toInt() }
    // define local function f
    fun f(c: Char) = '0' + fl[c - '1']
    // greedily find first and last indices
    val i = s.indexOfFirst { c -> f(c) > c }
        .takeIf { it >= 0 } ?: s.length
    val j = s.withIndex().indexOfFirst { (j, c) -> j > i && f(c) < c }
        .takeIf { it >= 0 } ?: s.length
    // compose and write the answer
    val ans =
        s.substring(0, i) +
        s.substring(i, j).map { c -> f(c) }.joinToString("") +
        s.substring(j)
    println(ans)
}
```

In this dense code, in addition to collection transformations, you can see such handy Kotlin features as local functions
and the [elvis operator](null-safety.md#elvis-operator) `?:`
that allow to express 
[idioms](idioms.md) like "take the value if it is positive or else use length" with a concise and readable 
expressions like `.takeIf { it >= 0 } ?: s.length`, yet it is perfectly fine with Kotlin to create additional mutable
variables and express the same code in imperative style, too.

To make reading the input in competitive programming tasks like this more concise, 
you can have the following list of helper input-reading functions:

```kotlin
private fun readInt() = readln().toInt() // single int
private fun readStrings() = readln().split(" ") // list of strings
private fun readInts() = readStrings().map { it.toInt() } // list of ints
```

With these helpers, the part of code for reading input becomes simpler, closely following the input 
specification in the problem statement line by line:

```kotlin
    // read input
    val n = readInt()
    val s = readln()
    val fl = readInts()
```

Note that in competitive programming it is customary to give variables shorter names than it is 
typical in industrial programming practice, since the code is to be written just once and not supported thereafter. 
However, these names are usually still mnemonic &mdash; `a` for arrays,
`i`, `j`, etc for indices, `r`, and `c` for row and column numbers in tables, `x` and `y` for coordinates, etc.
It is easier to keep the same names for input data as it is given in the problem statement. 
However, more complex problems require more code which leads to using longer self-explanatory
variable and function names.

## More tips and tricks

Competitive programming problems often have input like this:

The first line of the input contains two integers `n` and `k`

In Kotlin this line can be concisely parsed with the following statement using
[destructuring declaration](destructuring-declarations.md) 
from a list of integers:

```kotlin
val (n, k) = readInts() 
```

It might be temping to use JVM's `java.util.Scanner` class to parse less structured 
input formats. Kotlin is designed to interoperate well with JVM libraries, so that their use feels quite
natural in Kotlin. However, beware that `java.util.Scanner` is extremely slow. So slow, in fact, that parsing
10<sup>5</sup> or more integers with it might not fit into a typical 2 second time-limit, which a simple Kotlin's 
`split(" ").map { it.toInt() }` would handle. 

Writing output in Kotlin is usually straightforward with 
[println(...)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 
calls and using Kotlin's 
[string templates](basic-types.md#string-templates). However, care must be taken when output 
contains on order of 10<sup>5</sup> lines or more. Issuing so many `println` calls is too slow, since the output 
in Kotlin is automatically flushed after each line. 
A faster way to write many lines from an array or a list is using
[joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) function
with `"\n"` as the separator, like this:

```kotlin
println(a.joinToString("\n")) // each element of array/list of a separate line
```

## Learning Kotlin

Kotlin is easy to learn, especially for those who already know Java.
A short introduction to the basic syntax of Kotlin for software developers can be found directly in the
reference section of the web site starting from [basic syntax](basic-syntax.md). 

IDEA has built-in 
[Java-to-Kotlin converter](https://www.jetbrains.com/help/idea/converting-a-java-file-to-kotlin-file.html). 
It can be used by people familiar with Java to learn the corresponding Kotlin syntactic constructions, but it
is not perfect and it is still worth familiarizing yourself with Kotlin and learning the 
[Kotlin idioms](idioms.md).

A great resource to study Kotlin syntax and API of the Kotlin standard library are
[Kotlin Koans](koans.md).

