[//]: # (title: What's new in Kotlin plugin 2021.1)

This release aims to increase productivity and improve the development experience. Kotlin plugin 2021.1 introduces the following major updates:
* [Performance improvements](#performance-improvements)
* [Better debugging experience](#better-debugging-experience)
* [Updated Change Signature refactoring](#updated-change-signature-refactoring)
* [Code completion for type parameters](#code-completion-for-type-parameters)
* [UML diagrams for Kotlin classes](#uml-diagrams-for-kotlin-classes)
* [Other platform enhancements](#other-platform-enhancements)

## Performance improvements

Kotlin Plugin 2021.1 has received a number of performance improvements that speed up the development process.

Here are some major refinements:

* **Faster syntax and error highlighting**. Code highlighting API has been reworked – now you get all the necessary diagnostic information faster.

* **Speed-up code completion**. In the release, the Kotlin plugin provides faster code completion.
  In addition to speed changes, we made other improvements to code completion, especially [Code completion for type parameters](#code-completion-for-type-parameters).

* **Faster IDE responsiveness**. We’ve fixed numerous issues based on your feedback and improve the overall stability of the plugin and IDE responsiveness.

## Better debugging experience

This release expands debugger capabilities. Here are some changes:

* **Variables view shows properties without backing field**

   Now it's possible to get Kotlin properties without backing field in the variables view.
   For example, during the debugging of the following code you can execute the `get()` method to see the value:

   ```kotlin
   class TestClass() {
       val lazyInt: Int by lazy { 10 }
       var ambiguousInt: Int = 10
           get() = 20
           set(value: Int) {field = value}
   }
  
   fun main() {
       val Instance = TestClass()
       println("")
   }
   ```

   In the **Debug** window, you can see the properties value:
  
   ![Variables view](debugging-variables-view.png){width=620}

* **Evaluator and Debugger’s extension for coroutines**.
  
   If you use coroutines and suspend functions in your project, with this release it becomes easier to debug them.

## Updated Change Signature refactoring

This release contains changes in [Change Signature](https://www.jetbrains.com/help/idea/change-signature.html) refactoring. Cross-language refactoring got a lot of attention, here are some of the improvements:

* Support warning messages for more refactoring cases.
* Correct backticks processing.
* Fixes in inheritance refactoring, including cross-language.
* Improved UX of properties processing.
* Added the way to declare default parameter value.

## Code completion for type parameters

From now on, the code completion mechanism offers functions that require type parameters. When you select such a function from the list, the IDE adds the correct type parameter to the preceding code.

In the following example, the IDE automatically adds the `<Int>()` type:

![Now code completion suggest functions](code-completion-type-pararmeters.png){width=800}

After you apply the IDE suggestion you'll get the following code:

```kotlin
class SimpleClass<T>(val f: T) {
   operator fun <U> invoke(): List<U> = TODO()
   val one: List<Int> = SimpleClass("one")<Int>().asReversed()
}
```

## UML diagrams for Kotlin classes

With this release, you can test Kotlin code visualization via UML Class diagrams. To build a diagram, in the **Project View** select **Diagrams | Show Diagram... | Kotlin Classes**.

![Variables view](kotlin-classes-uml-diagram.png){width=620}

Currently, the diagrams only show inheritance and nesting relationships. All other more detailed association connections, like aggregation, construction, dependency, and others will be available in the next releases.

## Other platform enhancements

Since the plugin and the platform have been moved to the same codebase and ship simultaneously, this release also brings the following list of features that improve the Kotlin experience:

* Now you can launch the basic memory profiler that was announced in the [IntelliJ IDEA 2020.3 release](https://www.jetbrains.com/idea/whatsnew/#debugger) via Gradle run.
* To improve the experience of working with coroutines this release provides better thread-blocking call detection.
  Now the inspection warns you about inappropriate blocking method calls correctly.
* We’ve fixed some language injection issues that received the most votes. Now language injection works correctly for the following cases:
   * When you use triple quotes to inject multi-line strings and add the `.trimIndent()`, or `.trimMargin()` functions at the end.
   * When you concatenate strings.

See the What’s new in IntelliJ IDEA 2021.1 blog(TODO: link) post to learn more about platform enhancements.