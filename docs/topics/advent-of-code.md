[//]: # (title: Advent of Code puzzles in idiomatic Kotlin)

[Advent of Code](https://adventofcode.com/) is an annual December event, where holiday-themed puzzles are published
every day from December 1 to December 25. With the permission of [Eric Wastl](http://was.tl/), creator of Advent of Code,
we'll show how to solve these puzzles using the idiomatic Kotlin style:

* [](#advent-of-code-2021)
* [](#advent-of-code-2020)

## Advent of Code 2021

* [](#get-ready)
* [](#day-1-sonar-sweep)
* [](#day-2-dive)
* [](#day-3-binary-diagnostic)
* [](#day-4-giant-squid)

### Get ready

We'll take you through the basic tips on how to get up and running with solving Advent of Code challenges with Kotlin:

* Read our [blog post about Advent of Code 2021](https://blog.jetbrains.com/kotlin/2021/11/advent-of-code-2021-in-kotlin/)
* Use [this GitHub template](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) to create projects
* Check out the welcome video by Kotlin Developer Advocate, Sebastian Aigner:

  <video width="560" height="315" href="6-XSehwRgSY" title="Get Ready for Advent of Code 2021"/>

### Day 1: Sonar sweep

Apply windowed and count functions to work with pairs and triplets of integers.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2021/day/1)
* Check out the solution from Anton Arhipov on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-1)
  or watch the video:

<video width="560" height="315" href="76IzmtOyiHw" title="Advent of Code 2021 in Kotlin, Day 1: Sonar Sweep"/>

### Day 2: Dive!

Learn about destructuring declarations and the `when` expression.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2021/day/2)
* Check out the solution from Pasha Finkelshteyn on [GitHub](https://github.com/asm0dey/aoc-2021/blob/main/src/Day02.kt)
  or watch the video:

<video width="560" height="315" href="4A2WwniJdNc" title="Advent of Code 2021 in Kotlin, Day 2: Dive!"/>

### Day 3: Binary diagnostic

Explore different ways to work with binary numbers.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2021/day/3)
* Check out the solution from Sebastian Aigner on [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/12/advent-of-code-2021-in-kotlin-day-3/)
  or watch the video:

<video width="560" height="315" href="mF2PTnnOi8w" title="Advent of Code 2021 in Kotlin, Day 3: Binary Diagnostic"/>

### Day 4: Giant squid

Learn how to parse the input and introduce some domain classes for more convenient processing.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2021/day/4)
* Check out the solution from Anton Arhipov on the [GitHub](https://github.com/antonarhipov/advent-of-code-2021/blob/main/src/Day04.kt)
  or watch the video:

<video width="560" height="315" href="wL6sEoLezPQ" title="Advent of Code 2021 in Kotlin, Day 4: Giant Squid"/>

## Advent of Code 2020

> You can find all the solutions for the Advent of Code 2020 puzzles in our [GitHub repository](https://github.com/kotlin-hands-on/advent-of-code-2020/).
>
{type="tip"}

* [](#day-1-report-repair)
* [](#day-2-password-philosophy)
* [](#day-3-toboggan-trajectory)
* [](#day-4-passport-processing)
* [](#day-5-binary-boarding)
* [](#day-6-custom-customs)
* [](#day-7-handy-haversacks)
* [](#day-8-handheld-halting)
* [](#day-9-encoding-error)

### Day 1: Report repair

Explore input handling, iterating over a list, different ways of building a map, and using the [`let`](scope-functions.md#let)
function to simplify your code.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/1)
* Check out the solution from Svetlana Isakova on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin/)
or watch the video:

<video width="560" height="315" href="o4emra1xm88" title="Kotlin Tutorial: Advent of Code Puzzles, Day 1"/>

### Day 2: Password philosophy

Explore string utility functions, regular expressions, operations on collections, and how the [`let`](scope-functions.md#let)
function can be helpful to transform your expressions.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/2)
* Check out the solution from Svetlana Isakova on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/07/advent-of-code-in-idiomatic-kotlin-day2/)
or watch the video:

<video width="560" height="315" href="MyvJ7G6aErQ" title="Kotlin Tutorial: Advent of Code Puzzles, Day 2"/>

### Day 3: Toboggan trajectory

Compare imperative and more functional code styles, work with pairs and the [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
function, edit code in the column selection mode, and fix integer overflows.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/3)
* Check out the solution from Mikhail Dvorkin on [GitHub](https://github.com/kotlin-hands-on/advent-of-code-2020/blob/master/src/day03/day3.kt)
or watch the video:

<video width="560" height="315" href="ounCIclwOAw" title="Kotlin Tutorial: Adopting a Functional Style for Advent of Code Puzzles"/>

### Day 4: Passport processing

Apply the [`when`](control-flow.md#when-expression) expression and explore different ways of how to validate the input:
utility functions, working with ranges, checking set membership, and matching a particular regular expression.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/4)
* Check out the solution from Sebastian Aigner on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/validating-input-advent-of-code-in-kotlin/)
or watch the video:

<video width="560" height="315" href="-kltG4Ztv1s" title="Kotlin Tutorial: Validating and Sanitizing Input. Advent of Code Puzzles"/>

### Day 5: Binary boarding

Use the Kotlin standard library functions (`replace()`, `toInt()`, `find()`) to work with the binary representation of numbers,
explore powerful local functions, and learn how to use the `max()` function in Kotlin 1.5.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/5)
* Check out the solution from Svetlana Isakova on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-binary-representation/)
or watch the video:

<video width="560" height="315" href="XEFna3xyxeY" title="Kotlin Tutorial: Binary Representation of Numbers. Advent of Code Puzzles"/> 

### Day 6: Custom customs

Learn how to group and count characters in strings and collections using the standard library functions: `map()`,
`reduce()`, `sumOf()`, `intersect()`, and `union()`.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/6)
* Check out the solution from Anton Arhipov on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-set-operations/)
or watch the video:

<video width="560" height="315" href="QLAB0kZ-Tqc" title="Idiomatic Kotlin: Operations with Sets"/>

### Day 7: Handy haversacks

Learn how to use regular expressions, use Java's `compute()` method for HashMaps from Kotlin for dynamic calculations
of the value in the map, use the `forEachLine()` function to read files, and compare two types of search algorithms:
depth-first and breadth-first.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/7)
* Check out the solution from Pasha Finkelshteyn on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/09/idiomatic-kotlin-traversing-trees/)
or watch the video:

<video width="560" height="315" href="KyZiveDXWHw" title="Idiomatic Kotlin: Solving Advent of Code Puzzles and Traversing Trees"/>

### Day 8: Handheld halting

Apply sealed classes and lambdas to represent instructions, apply Kotlin sets to discover loops in the program execution,
use sequences and the `sequence { }` builder function to construct a lazy collection, and try the experimental
`measureTimedValue()` function to check performance metrics.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/8)
* Check out the solution from Sebastian Aigner on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-simulating-a-console/)
or watch the video:

<video width="560" height="315" href="0GWTTSMatO8" title="Sealed Classes, Sequences, Immutability: Idiomatic Kotlin Solving Advent of Code Puzzles"/>

### Day 9: Encoding error

Explore different ways to manipulate lists in Kotlin using the `any()`, `firstOrNull()`, `firstNotNullOfOrNull()`,
`windowed()`, `takeIf()`, and `scan()` functions, which exemplify an idiomatic Kotlin style.

* Read the puzzle description on [Advent of Code](https://adventofcode.com/2020/day/9)
* Check out the solution from Svetlana Isakova on the [Kotlin Blog](https://blog.jetbrains.com/kotlin/2021/10/idiomatic-kotlin-working-with-lists/)
or watch the video:

<video width="560" height="315" href="vj3J9MuF1mI" title="Manipulating lists using windowed, scan, firstNotNullOfOrNull: Solving Advent of Code Puzzles"/>

## What's next?

* Complete more tasks with [Kotlin Koans](koans.md) 
* Create working applications with the free [Kotlin Basics track](https://hyperskill.org/join/fromdocstoJetSalesStat?redirect=true&next=/tracks/18)
