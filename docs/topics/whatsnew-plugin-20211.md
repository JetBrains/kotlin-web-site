[//]: # (title: What's new in Kotlin plugin 2021.1)

This plugin release introduces the following features:
* [Performance improvements](#performance-improvements)
* [Better debugging experience](#better-debugging-experience)
* [Code completion for type parameters](#code-completion-for-type-parameters)
* [Change signature refactoring](#change-signature-refactoring)
* [UML diagrams for Kotlin classes](#uml-diagrams-for-kotlin-classes)
* [Other platform enhancements](#other-platform-enhancements)

## Performance improvements

Kotlin Plugin 2021.1 has received a number of performance improvements that speed up both the development process and execution. 

Here are some major refinements:

* **Faster syntax and error highlighting**. Previously, the compiler parses everything before throwing an error message. Now it processes the code gradually, which makes the code analysis much faster. Once the compiler finds the error, it instantly passes it to the IDE to show the error or warning message.
  
* **Speed-up code completion**. In the release, the Kotlin plugin provides faster code completion 
  В этом релизе мы много поработали над code completion и он стал намного быстрее. Кроме того, мы внесли и другие улучшение в CC, отдельно стоит отметить [Code completion for type parameters](#code-completion-for-type-parameters).

* **Faster IDE responsiveness**. We’ve fixed numerous issues based on your feedback and improve the overall stability of the plugin and IDE responsiveness.

## Better debugging experience

This release expands debugger capabilities. Here are some changes:

* **Variables view shows properties without backing field**
Можно смотреть. Kotlin executes the get() method and returns the value. Все просчитывать очень дорого, но можно делать это в дебаггере.
  
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

* **Suspend functions evaluation (not in 2021.1 yet)** MAYBE POSTPONED
KT-27974 Allow to evaluate expression with suspended function from non-coroutine context
KT-31701 Evaluate: "IllegalStateException: Can not generate outer receiver value for class" with suspend function

* **Capability to change top-level variables in stack-frames**

   Менять топ-левел переменные в стек-фрейме.

## Code completion for type parameters

From now on, the code completion mechanism offers functions that require type parameters. When you select such a function from the list, the IDE adds the correct type parameter to the preceding code.
Важно, что раньше в комплишене не предлагались варианты, если ты не указывал тип, то теперь IDE автоматически дописывает его.

## Change signature refactoring

Change signature refactoring intro.

Мы тут сделали значительные улучшения, очень много кейсов, где Change Signature ломает код, теперь IDE скажет об этом.

Here some refactoring improvements:
* Correct rendering in IDE
* Support warning messages for more cases
* Correct backticks processing
* Fixes in inheritance refactoring, including cross-language // (for demo: KTIJ-966)

* --drop of dialog for properties (in progress)--
* --default arguments (in progress)--
* --imports management (in progress)--


## UML diagrams for Kotlin classes

With this release you can test Kotlin code visualization via UML Class diagrams. You can build a diagram either from the **Project view** via **Diagrams | Show Diagram... | Java Classes**.
Currently, the diagrams only show inheritance and nesting relationships, but we plan to support more detailed association connections, like aggregation, construction, dependency, and others.

![Variables view](kotlin-classes-uml-diagram.png){width=620}

## Other platform enhancements

Since the plugin and the platform have been moved to the same codebase and ship simultaneously, this release also brings the following list of features that improve the Kotlin experience:

* Now you can launch the basic memory profiler that was announced in the [IntelliJ IDEA 2020.3 release](https://www.jetbrains.com/idea/whatsnew/#debugger) via Gradle run.
* To improve the experience of working with coroutines this release provides better thread-blocking call detection.
  Now the inspection warns you about inappropriate blocking method calls correctly.
* We’ve fixed some of the language injections issues that received the most votes: 
    * First, when you use triple quotes to inject multi-line strings and add the `.trimIndent()`, or `.trimMargin()` functions at the end, the lines inside the triple quotes are highlighted correctly, and the mentioned functions work as expected.
    * Second, language injection works correctly when you concatenate strings.