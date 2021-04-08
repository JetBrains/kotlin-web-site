[//]: # (title: What's new in Kotlin plugin 2021.1)

This release aims to increase productivity and improve the development experience. Version 2021.1 of the Kotlin plugin introduces the following major updates:
* [Performance improvements](#performance-improvements)
* [Evaluation of custom getters during debugging](#evaluation-of-custom-getters-during-debugging)
* [Improved Change Signature refactoring](#improved-change-signature-refactoring)
* [Code completion for type arguments](#code-completion-for-type-arguments)
* [UML diagrams for Kotlin classes](#uml-diagrams-for-kotlin-classes)
* [Other platform enhancements](#other-platform-enhancements)

You can also learn about new features in [this blog post](https://blog.jetbrains.com/kotlin/2021/04/kotlin-plugin-2021-1-released/).

## Performance improvements

With 2021.1, the Kotlin plugin has received a number of performance improvements that speed up the development process.

Here are some major refinements:

* **Faster syntax and error highlighting**. The code highlighting API has been reworked, so you now get all the necessary diagnostic information faster. See the benchmark results and share your feedback in this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-37702#focus=Comments-27-4775165.0-0).

* **Code completion speed improvements**. The Kotlin plugin provides faster code completion. Check out this [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-1015#focus=Comments-27-4775642.0-0) to see the benchmark results.

  This version also introduces other improvements for code completion, particularly [code completion for type arguments](#code-completion-for-type-arguments).

* **Improved IDE responsiveness**. We’ve fixed numerous issues based on your feedback, and we’ve improved the overall stability of the plugin, as well as IDE responsiveness.

## Evaluation of custom getters during debugging

This release expands the capabilities of the debugger. One of the most notable features is the ability to display Kotlin properties without a [backing field](properties.md#backing-fields) in the **Variables** view.

Previously, during a debug session, you could only see the properties without a custom getter and those with a backing field. Properties with a custom getter didn't appear because they are represented as regular methods on the JVM. Starting with version 2021.1 of the Kotlin plugin, you can see all such properties and evaluate them on demand by clicking on `get() near the property name.

For example, when debugging of the following code, you can execute the `get()` method to see the value:

```kotlin
class LanguageVersion(val major: Int, val minor: Int) {
    val isStable: Boolean
        get() = major <= 1 && minor <= 4
    val isExperimental: Boolean
        get() = !isStable
    val versionString: String
        get() = "$major.$minor"
    
    override fun toString() = versionString
}

fun main() {
    val version = LanguageVersion(1, 4)
}
```

In the **Debug** window, you can see the values of the properties:

![Variables view](debugging-variables-view.png){width=620}

## Improved Change Signature refactoring

This release contains changes to the [Change Signature](https://www.jetbrains.com/help/idea/change-signature.html) refactoring. We’ve fixed more than [40 issues](https://youtrack.jetbrains.com/issue/KTIJ-685) to make the refactoring process better.

Here are some of the important improvements:
* Support for warning messages for more refactoring cases.
* Fixes to inheritance refactoring, including cross-language refactoring.
  See the [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-966) for details.* Improved UX of properties processing.
* Improved UX for processing properties.
* Addition of a way to declare the default parameter value.
  See the [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-903) for details.
* Correct backticks processing.

## Code completion for type arguments

From now on, code completion will offer functions and properties after generic functions and will restore type arguments where needed. When you select such a function from the list, the IDE adds the correct type argument to the preceding code.

In the following example, there is a list of strings to be reversed:

```kotlin
fun typeArgumentsAtCodeCompletion() {
   // Function definition from stdlib:
   // public fun <T> emptyList(): List<T>

   val list: List<String> = emptyList() // T is inferred from the context (explicit variable type)
}
```

To reverse this list, start typing the name of the `reversed()` function:

![Now code completion suggests functions](code-completion-type-arguments.png){width=800}

After you apply the code completion suggestion, the IDE automatically adds the `<String>` type:

```kotlin
fun typeArgumentsAtCodeCompletion() {
   // Function definition from stdlib:
   // public fun <T> emptyList(): List<T>

   val list: List<String> = emptyList<String>().reversed()
}
```

The type argument for `emptyList()` is required to evaluate the expression type. Otherwise, the code will not compile.

## UML diagrams for Kotlin classes

With this release, you can test Kotlin code visualization via UML Class diagrams. To build a diagram, select **Diagrams | Show Diagram... | Kotlin Classes** in the **Project View**.

![UML diagram for Kotlin classes](kotlin-classes-uml-diagram.png){width=620}

Currently, the diagrams only show inheritance and nesting relationships. All other more detailed association connections, like aggregation, composition, dependency, and others will be available in the future releases.

## Other platform enhancements

Since the plugin and the platform have been moved to the same codebase and now ship simultaneously, this release also brings the following features that improve the Kotlin experience:

* You can now launch the basic memory profiler that was announced in the [IntelliJ IDEA 2020.3 release](https://www.jetbrains.com/idea/whatsnew/#debugger) via Gradle run.
* To improve the experience of working with coroutines, this release provides [better thread-blocking call detection](https://youtrack.jetbrains.com/issue/KTIJ-826).
  The inspection now correctly warns you about inappropriate blocking method calls.
* We’ve fixed some of the language injection issues that received the most votes. Language injection now works correctly for the following cases:
  * When you use triple quotes to inject multi-line strings and add the `.trimIndent()`, or `.trimMargin()` functions at the end. See the [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-679) for details.
  * When you concatenate strings. See the [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-855) for details.

See the [What’s new in IntelliJ IDEA 2021.1 blog post](https://www.jetbrains.com/idea/whatsnew/) or watch [this video](https://www.youtube.com/watch?v=YBmR0J3-r3o) to learn more about the platform enhancements.