[//]: # (title: Introduction)

A good library has several features:
* Backward compatibility
* Understandable and complete documentation
* As low [cognitive complexity](#cognitive-complexity) as possible
* A consistent API

This guide contains a summary of best practices as well as some ideas to consider when writing an API for your library. 
The chapters are:
* [Readability](jvm-api-guidelines-readability.md)
* [Predictability](jvm-api-guidelines-predictability.md)
* [Debuggability](jvm-api-guidelines-debuggability.md)
* [Backward compatibility](jvm-api-guidelines-backward-compatibility.md)

A considerable number of the following best practices provide advice on how to reduce API cognitive complexity. As such, 
this guide provides an explanation of cognitive complexity before proceeding to best practices.

### Cognitive complexity {initial-collapse-state="collapsed"}

Cognitive complexity is the amount of mental effort you need to spend to understand a piece of code. If a codebase has 
high cognitive complexity, then it is more difficult to understand and maintain, which can lead to bugs and delays in development.

An example of high cognitive complexity is a class or module that has many responsibilities and does not follow 
the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle). 
A class or module that does too many things is hard to understand and modify. In contrast, a class or module that has 
a clear and well-defined responsibility is easier to work with.

Functions can also have high cognitive complexity. Some traits of a "badly written" function are:
* Too many arguments, variables, or loops.
* Complex logic with many nested if-else statements.

A function like this is harder to work with than a function with clear and simple logic – with a few parameters 
and an easy-to-understand control flow.
An example of high cognitive complexity:

```kotlin
fun processData(
    data: List<String>,
    delimiter: String,
    ignoreCase: Boolean,
    sort: Boolean,
    maxLength: Int
) {
    // Some complex processing logic
}
```

Decomposing this functionality lowers cognitive complexity:

```kotlin
fun delimit(data: List<String>, delimiter: String) { … }
fun ignoreCase(data: List<String>) { … }
fun sortAscending(data: List<String>) { … }
fun sortDescending(data: List<String>) { … }
fun maxLength(data: List<String>, maxLength: Int) { … }
```

You can simplify the code above even more with the help of [extension functions](https://kotlinlang.org/docs/extensions.html):
```kotlin
fun List<String>.delimit(delimiter: String): List<String> { … }
fun List<String>.sortAscending(): List<String> { … }
fun List<String>.sortDescending(): List<String> { … }
fun List<String>.maxLength(maxLength: Int): List<String> { … }
…
```
