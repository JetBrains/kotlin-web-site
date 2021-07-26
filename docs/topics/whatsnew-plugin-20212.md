[//]: # (title: What's new in Kotlin plugin 2021.2)

This release aims to increase productivity and improve the development experience. Version 2021.2 of the Kotlin plugin introduces the following major updates:

* [Kotlin plugin in the IntelliJ IDEA repository](#kotlin-plugin-in-the-intellij-idea-repository)
* [Performance improvements](#performance-improvements)
* [WSL 2 and Run Targets support for Kotlin projects](#wsl-2-and-run-targets-support-for-kotlin-projects)
* [Improved debugging experience](#improved-debugging-experience)
* [Other IDE experience improvements](#other-ide-experience-improvements)

You can also learn about new features in [this blog post](https://blog.jetbrains.com/kotlin/2021/07/kotlin-plugin-2021-2-released/).

## Kotlin plugin in the IntelliJ IDEA repository

Finally, the Kotlin plugin code has been moved to the [IntelliJ IDEA repository](https://github.com/JetBrains/intellij-community/tree/master/plugins/kotlin).
That means that every stable IDE release improves your Kotlin experience and brings you all debugging, refactoring and other IDE-related features.

Since the Kotlin plugin and Kotlin have separate release cycles there are also limitations:

* The **EAP** version of Kotlin works only with the **stable** version of the IDE. That means that you can't install the Kotlin EAP version to the EAP IDEA release.
* Kotlin plugin works only with the **previous stable version** of the Kotlin compiler. We are working on stabilizing the process so that the next versions of the plugin work with the latest version of the compiler.

Learn more about EAP programs: [Kotlin](https://kotlinlang.org/docs/eap.html) and [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/)

## Performance improvements

This release brings some performance improvements, we want to highlight the major:

* **Faster test files analysis**. Now you can run tests before code analysis finishes. The **Run test** icon appears in the gutter as soon as you open the file and you can run your test immediately.
  
* **Run and debug your code before the IDE finishes indexing**. The indexing process in the IDE and running code are now autonomous from each other. You can run or debug the project right away without waiting for the IDE to finish its work.
  
* **Improved the speed of rename refactoring**. Rename refactoring for particular cases, like renaming `name` or `id` fields, become faster. Check out this [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-10051) for more details.
  
* **Shared indexes for new Spring Boot projects**. Shared indexes help you to prevent the situations when you open a project and wait for indexing to finish. Learn more about how to download and use shared indexes in the [IntelliJ IDEA documentation](https://www.jetbrains.com/help/idea/shared-indexes.html).

## WSL 2 and Run Targets support for Kotlin projects

WSL 2 support and Run Targets are available for Kotlin projects since the 2021.2 plugin release.
Feel free to run, debug, and test your code in different remote environments without leaving the IDE.

Learn more about Run Targets feature in our [blog post](https://blog.jetbrains.com/idea/2021/01/run-targets-run-and-debug-your-app-in-the-desired-environment/) and [IntelliJ IDEA documentation about WSL 2](https://www.jetbrains.com/help/idea/how-to-use-wsl-development-environment-in-product.html#wsl-general).

## Improved debugging experience

Kotlin 2021.2 brings useful improvements and updates to the coroutine agent in the debugger:

* **Evaluate suspend functions**

   Now you can evaluate suspend function calls during the debugging process. You can put a breakpoint and evaluate the suspend function:
  
   ```kotlin
   import kotlinx.coroutines.runBlocking

   fun main(): Unit = runBlocking {
       foo() // Put a breakpoint here and evaluate `foo()`
       Unit
   }

   suspend fun foo(): Int {
       return 42
   }
   ```
  
   Look through these YouTrack tickets for more details: [KT-27974](https://youtrack.jetbrains.com/issue/KT-27974), [KT-31701](https://youtrack.jetbrains.com/issue/KT-31701).

* **Preserving variables after suspension points**

   Previously, when local variables were not used after passing a suspension point, you can't see their values in the **Local Variable** table.
   This was done to avoid memory leaks. As a side effect, such variables used to disappear in the **Variables** view of the Debugger tool window.
  
   Starting from Kotlin plugin 2021.2 you can see the values of such variables.

* **Coroutines extension support in Java, Maven, Spring run-configurations**

   The coroutines agent is now available for Java, Maven, and Spring run configurations with a dependency on `kotlinx.coroutines`.

## Other IDE experience improvements

Since the plugin and the platform have been moved to the same codebase and now ship simultaneously, this release also brings the following features that improve the Kotlin experience:

* **Package Search integration**. Package Search now works with `build.gradle.kts` files. This feature allows you to upgrade, downgrade, and remove existing dependencies. Use it to find new dependencies and add them automatically. Also, Package Search will add the required repositories to your build script if they’re missing.

* **Advanced settings**. There is a new node **Advanced Settings** in the **Preferences | Settings** window. It contains some use-case-specific options conveniently grouped by IDE tool.
  For example, you can add a left margin in Distraction-free mode, or set the maximum number of recent projects which are displayed in the **File | Open Recent** menu.
  
* **Quick access to Eclipse projects**. На него можно навесить кучу всего, например, реформат сделать, оптимизировать импорты при сейве. Можно будет несколько шорткатов объединить в один.

* **VCS improvements**.

See the [What’s new in IntelliJ IDEA 2021.2 blog post](https://www.jetbrains.com/idea/whatsnew/) or watch [this video](https://www.youtube.com/watch?v=YBmR0J3-r3o) to learn more about the platform enhancements.