[//]: # (title: Kotlin tips)

Kotlin Tips is a series of short videos where members of the Kotlin team show how to use Kotlin in a more efficient and idiomatic way to have more fun when writing code.

[Subscribe to our YouTube channel](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw) to not miss new Kotlin Tips videos.

## null + null in Kotlin

What happens when you add `null + null` in Kotlin, and what does it return? Sebastian Aigner addresses this mystery in our latest quick tip. Along the way, he also shows why there's no reason to be scared of nullables: 

<video width="560" height="315" src="https://youtu.be/wwplVknTza4" title="Kotlin Tips: null + null in Kotlin"/>

## Deduplicating collection items

Got a Kotlin collection that contains duplicates? Need a collection with only unique items? Let Sebastian Aigner show you how to remove duplicates from your lists, or turn them into sets in this Kotlin tip: 

<video width="560" height="315" src="https://youtu.be/ECOf0PeSANw" title="Kotlin Tips: Deduplicating Collection Items"/>

## The suspend and inline mystery

How come functions like [`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html), [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) and [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) accept suspending functions in their lambdas, even though their signatures aren't coroutines-aware? In this episode of Kotlin Tips Sebastian Aigner solves the riddle: it has something to do with the inline modifier:

<video width="560" height="315" src="https://youtu.be/R2395u7SdcI" title="Kotlin Tips: The Suspend and Inline Mystery"/>

## Unshadowing declarations with their fully qualified name

Shadowing means having two declarations in a scope have the same name. So, how do you pick? In this episode of Kotlin Tips Sebastian Aigner shows you a simple Kotlin trick to call exactly the function that you need, using the power of fully qualified names:

<video width="560" height="315" src="https://youtu.be/mJRzF9WtCpU" title="Kotlin Tips: Unshadowing Declarations"/>

## Return and throw with the Elvis operator

[Elvis](null-safety.md#elvis-operator) has entered the building once more! Sebastian Aigner explains why the operator is named after the famous singer, and how you can use `?:` in Kotlin to return or throw. The magic behind the scenes? [The Nothing type](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html).

<video width="560" height="315" src="https://youtu.be/L8aFK7QrbA8" title="Kotlin Tips: Return and Throw with the Elvis Operator"/>

## Destructuring declarations

With [destructuring declarations](destructuring-declarations.md) in Kotlin, you can create multiple variables from a single object, all at once. In this video Sebastian Aigner shows you a selection of things that can be destructured – pairs, lists, maps, and more. And what about your own objects? Kotlin's component functions provide an answer for those as well:

<video width="560" height="315" src="https://youtu.be/zu1PUAvk_Lw" title="Kotlin Tips: Destructuring Declarations"/>

## Operator functions with nullable values

In Kotlin, you can override operators like addition and subtraction for your classes and supply your own logic. But what if you want to allow null values, both on their left and right sides? In this video, Sebastian Aigner answers this question:

<video width="560" height="315" src="https://youtu.be/x2bZJv8i0vw" title="Kotlin Tips: Operator Functions With Nullable Values"/>

## Timing code

Watch Sebastian Aigner give a quick overview of the [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) function, and learn how you can time your code:

<video width="560" height="315" src="https://youtu.be/j_LEcry7Pms" title="Kotlin Tips: Timing Code"/>

## Improving loops

In this video, Sebastian Aigner will demonstrate how to improve [loops](control-flow.md#for-loops) to make your code more readable, understandable, and concise:

<video width="560" height="315" src="https://youtu.be/i-kyPp1qFBA" title="Kotlin Tips: Improving Loops"/>

## Strings

In this episode, Kate Petrova shows three tips to help you work with [Strings](strings.md) in Kotlin:

<video width="560" height="315" src="https://youtu.be/IL3RLKvWJF4" title="Kotlin Tips: Strings"/>

## Doing more with the Elvis operator

In this video, Sebastian Aigner will show how to add more logic to the [Elvis operator](null-safety.md#elvis-operator), such as logging to the right part of the operator:

<video width="560" height="315" src="https://youtu.be/L9wqYQ-fXaM" title="Kotlin Tips: The Elvis Operator"/>

## Kotlin collections

In this episode, Kate Petrova shows three tips to help you work with [Kotlin Collections](collections-overview.md):

<video width="560" height="315" src="https://youtu.be/ApXbm1T_eI4" title="Kotlin Tips: Kotlin Collections"/>

## What's next?

* See the complete list of Kotlin Tips in our [YouTube playlist](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7)
* Learn how to write [idiomatic Kotlin code for popular cases](idioms.md)
