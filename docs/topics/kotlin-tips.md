[//]: # (title: Kotlin tips)

Kotlin Tips is a series of short videos where members of the Kotlin team show how to use Kotlin in a more efficient and idiomatic way to have more fun when writing code.

[Subscribe to our YouTube channel](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw) to not miss new Kotlin Tips videos.

## The suspend and inline mystery

How come functions like [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html), [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) and [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) accept suspending functions in their lambdas, even though their signatures aren’t coroutines-aware? In this episode of Kotlin Tips Sebastian solves the riddle: it has something to do with the inline modifier:

<video width="560" height="315" href="R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## Unshadowing declarations with their fully qualified name

Shadowing means having two declarations in a scope have the same name. So, how do you pick? In this episode of Kotlin Tips Sebastian shows you a simple Kotlin trick to call exactly the function that you need, using the power of fully qualified names:

<video width="560" height="315" href="mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Return and throw with the Elvis operator

[Elvis](null-safety.md#elvis-operator) has entered the building once more! Seb explains why the operator is named after the famous singer, and how you can use `?:` in Kotlin to return or throw. The magic behind the scenes? [The Nothing type](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html).

<video width="560" height="315" href="L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## Destructuring declarations

With [destructuring declarations](destructuring-declarations.md) in Kotlin, you can create multiple variables from a single object, all at once. In this video Sebastian shows you a selection of things that can be destructured – pairs, lists, maps, and more. And what about your own objects? Kotlin’s component functions provide an answer for those as well:

<video width="560" height="315" href="zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## Operator functions with nullable values

In Kotlin, you can override operators like addition and subtraction for your classes and supply your own logic. But what if you want to allow null values, both on their left and right sides? In this video, Sebastian answers this question:

<video width="560" height="315" href="x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## Timing code

Watch Seb give a quick overview of the [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) function, and learn how you can time your code:

<video width="560" height="315" href="j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## Improving loops

In this video, Sebastian will demonstrate how to improve [loops](control-flow.md#for-loops) to make your code more readable, understandable, and concise:

<video width="560" height="315" href="i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## Strings

In this episode, Kate Petrova shows three tips to help you work with [Strings](basic-types.md#strings) in Kotlin:

<video width="560" height="315" href="IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Doing more with the Elvis operator

In this video, Sebastian will show how to add more logic to the [Elvis operator](null-safety.md#elvis-operator), such as logging to the right part of the operator:

<video width="560" height="315" href="L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin collections

In this episode, Kate Petrova shows three tips to help you work with [Kotlin Collections](collections-overview.md):

<video width="560" height="315" href="ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## What’s next?

* See the complete list of Kotlin Tips in our [YouTube playlist](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)
* Learn how to write [idiomatic Kotlin code for popular cases](idioms.md)
