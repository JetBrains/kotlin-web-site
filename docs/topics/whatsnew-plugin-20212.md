[//]: # (title: What's new in Kotlin plugin 2021.2)

Enjoy improved performance, a better coroutines debugging experience, WSL 2 and Run Targets support, and more improvements for Kotlin in [IntelliJ IDEA 2021.2](https://www.jetbrains.com/idea/download/):

* [Performance improvements](#performance-improvements)
* [Better debugging experience](#better-debugging-experience)
* [Remote development support](#remote-development-support)
* [Kotlin plugin in the IntelliJ IDEA repository](#kotlin-plugin-in-the-intellij-idea-repository)
* [Other IDE improvements](#other-ide-improvements)

## Performance improvements

IntelliJ IDEA 2021.2 brings some major performance improvements for Kotlin:

* **Faster test files analysis**. Now you can run tests before code analysis finishes. The **Run test** icon appears in the gutter as soon as you open the file and you can run your test immediately.

* **Run and debug your code before the IDE finishes indexing**. The indexing process in the IDE and running code are now autonomous from each other. You can run or debug the project right away without waiting for the IDE to finish its work.

* **Improved speed of rename refactoring**. Rename refactoring for particular cases, like for fields with common names `name` or `id`, became faster. Check out this [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-10051) for more details.

* **Shared indexes for new Spring Boot projects**. Shared indexes help you to prevent situations where you open a project and need to wait for indexing to finish. In the previous version of IntelliJ IDEA you can download the JDK shared indexes that save time during every project import. Now shared indexes are available for Spring Boot projects. Learn more about how to download and use shared indexes in the [IntelliJ IDEA documentation](https://www.jetbrains.com/help/idea/shared-indexes.html).

## Better debugging experience

IntelliJ IDEA 2021.2 brings useful improvements and updates to the coroutine agent in the debugger:

* **Evaluate suspend functions**

  Now you can evaluate suspend function calls during the debugging process. You can put a breakpoint and evaluate the suspend function:

  ```kotlin
  import kotlinx.coroutines.async
  import kotlinx.coroutines.delay
  import kotlinx.coroutines.runBlocking

  suspend fun longRunningFun(): Int {
      delay(2000)
      return 10
  }

  suspend fun fastFun(): Int {
     delay(100)
     return 32
  }

  fun main() = runBlocking {
      val deferred = async { longRunningFun() }
      // Put a breakpoint here and evaluate `the fastFun() + deferred.await()` expression:
      val sum = deferred.await() + fastFun()
      println(sum)
  }
  ```

  Look through these YouTrack tickets for more details: [KT-27974](https://youtrack.jetbrains.com/issue/KT-27974), [KT-31701](https://youtrack.jetbrains.com/issue/KT-31701).

* **Preserving variables after suspension points**

  Previously, when local variables were not used after passing a suspension point, you couldn’t see their values in the **Local Variable** table.
  This helped avoid memory leaks, but as a side effect such variables disappeared in the **Variables** view of the Debugger tool window.

  Now you can see the values of such variables for common cases. IntelliJ IDEA also handles other specific cases properly and notifies you when it is impossible to obtain the value.

  For example, when you debug through the following code, the debugger shows the message that the `x1`, `x2`, `x3` variables have been optimized out:

  ```kotlin
  import kotlinx.coroutines.runBlocking

  suspend fun foo() {

  }
  fun main() = runBlocking {
      // Set a breakpoint here:
      val x1 = 1  
      println(x1)
      foo()
      val x2 = 2
      println(x2)
      foo()
      val x3 = 3
      println(x3)
      foo()
      println()
  }
  ```

  Check out these YouTrack issues for more details: [KTIJ-18499 ](https://youtrack.jetbrains.com/issue/KTIJ-18499), [KTIJ-18630](https://youtrack.jetbrains.com/issue/KTIJ-18630).

* **Coroutines extension support in Java, Maven, and Spring run configurations**

  The coroutines agent is now available for Java, Maven, and Spring run configurations with a dependency on `kotlinx.coroutines`.

## Remote development support

Some popular remote-development scenarios are now available for Kotlin projects: [WSL 2 (Windows Subsystem for Linux) support](https://www.jetbrains.com/help/idea/how-to-use-wsl-development-environment-in-product.html) and the [Run Targets](https://www.jetbrains.com/help/idea/run-targets.html) feature.  
Run, debug, and test your code in different remote environments without leaving the IDE.

## Kotlin plugin in the IntelliJ IDEA repository

The Kotlin plugin code has been moved to the [IntelliJ IDEA repository](https://github.com/JetBrains/intellij-community/tree/master/plugins/kotlin).
That means that every stable IDE release improves your Kotlin experience and brings you more debugging, refactoring, and IDE-related features.
To contribute to the Kotlin plugin, clone the [IntelliJ IDEA repository](https://github.com/JetBrains/intellij-community/).

Since the [Kotlin plugin and Kotlin have separate release cycles](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/), this creates some limitations that are important to emphasize:

* The EAP version of Kotlin works only with the **stable version** of the IDE. That means that you can't install the Kotlin EAP version to the EAP IDEA release.
* The Kotlin plugin is based on the **previous stable version** of the Kotlin compiler. You can still update the Kotlin version in your project, but some IDE-related features might not be available. We are working on stabilizing the process so that the next versions of the plugin will be based on the latest stable version of the compiler.

Learn more about the EAP for [Kotlin](eap.md) and [IntelliJ IDEA](https://www.jetbrains.com/idea/nextversion/).

## Other IDE improvements

IntelliJ IDEA 2021.2 also brings more IDE features that improve the Kotlin experience:

* **Automatic ML code completion**. Kotlin code completion works based on a machine learning mechanism by default. Code suggestions are prioritized more carefully as IntelliJ IDEA considers the choices of thousands of real users in similar situations.
  You can configure ML-assisted completion in **Preferences/Settings | Editor | Code Completion**.

* **Clickable inlay hints**. Now you can click the type in the inlay hint and look through the declaration of the type, including generics types. Just hold **Cmd + click** the type in the hint:

  ![Clickable types in inlay hints](inlay-hints.png)

  You can customize the inlay hints’ appearance in **Preferences | Editor | Inlay hints | Kotlin**.

* **Package Search integration**. Package Search now works with `build.gradle.kts` files. This feature allows you to upgrade, downgrade, and remove existing dependencies. You can use it to find new dependencies and add them automatically.
  Package Search will add the required repositories to your build script if they’re missing.

* **Advanced settings**. There is a new node **Advanced Settings** in the **Preferences | Settings** window. It contains some use-case-specific options conveniently grouped by the IDE tool.
  For example, you can add a left margin in Distraction-free mode, or set the maximum number of recent projects which are displayed in the **File | Open Recent** menu.
  
* **Quick access to Eclipse projects**. IntelliJ IDEA detects existing Eclipse projects automatically and adds them to the Welcome screen. To try this feature, select **Open existing Eclipse projects** on your first IDE launch.

See the [What’s new in IntelliJ IDEA 2021.2 blog post](https://www.jetbrains.com/idea/whatsnew/) to learn more about the platform enhancements.