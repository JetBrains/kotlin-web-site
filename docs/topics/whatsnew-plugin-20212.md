[//]: # (title: What's new in Kotlin plugin 2021.2)

This release aims to increase productivity and improve the development experience. Version 2021.1 of the Kotlin plugin introduces the following major updates:
* [Performance improvements](#performance-improvements)
* [WSL 2 and Run Targets support for Kotlin projects](#wsl-2-and-run-targets-support-for-kotlin-projects)
* [Debugging improvements](#debugging-improvements)
* [Other IDE experience improvements](#other-ide-experience-improvements)

You can also learn about new features in [this blog post](https://blog.jetbrains.com/kotlin/2021/07/kotlin-plugin-2021-2-released/).

## Performance improvements

This release brings some performance improvements, we want to highlight the major:

* **Faster test files analysis**. Now you can run tests before code analysis finishes: you no longer need to wait until the code analysis finishes to start running them. The **Run test** icon appears in the gutter as soon as you open the file and you can run your test immediately.
  
* **Run and debug your code before the IDE finishes indexing**. The indexing process in the IDE and running code are now autonomous from each other. You can run or debug the project right away without waiting for the IDE to finish its work.
  
* **Improved the speed of rename refactoring**. Rename refactoring for particular cases, like renaming `name` or `id` fields, become faster. Check out this [YouTrack issue](https://youtrack.jetbrains.com/issue/KTIJ-10051) for more details.
  
* **Shared indexes for new Spring Boot projects**. Shared indexes help you to prevent the situations when you open a project and wait for indexing to finish. Learn more about how to download and use shared indexes in the [IntelliJ IDEA documentation](https://www.jetbrains.com/help/idea/shared-indexes.html).

## WSL 2 and Run Targets support for Kotlin projects

WSL 2 support and Run Targets are available for Kotlin projects since the 2021.2 plugin release.
Feel free to run, debug, and test your code in different remote environments without leaving the IDE.

Learn more about Run Targets feature in our [blog post](https://blog.jetbrains.com/idea/2021/01/run-targets-run-and-debug-your-app-in-the-desired-environment/) and [IntelliJ IDEA documentation about WSL 2](https://www.jetbrains.com/help/idea/how-to-use-wsl-development-environment-in-product.html#wsl-general).

## Improved suspend function debugging experience

In this EAP we’ve introduced some useful improvements and updates to our coroutine agent in the debugger.

Previously, when local variables were not used after passing a suspension point, advanced liveness analysis didn’t save these variables in the **Local Variable** table. This was done to avoid memory leaks. As a side effect, such variables used to disappear in the Variables view of the Debugger tool window. We’ve fixed this and now, in most cases, you will see all the local variables. A couple of cases are still not processed, but we’ll address those soon.

The coroutines agent is now available for Java run configurations with a dependency on kotlinx.coroutines. We’ve also supported the agent for Spring and Maven run configurations. You can now see the **Coroutines** tab in the **Debug** tool window.

* **Preserving variables after suspension points**

* **Coroutines extension support in java, maven, spring run-configurations**

* **Evaluate suspend functions**
  Look through these YouTrack tickets for more details: [KT-27974](https://youtrack.jetbrains.com/issue/KT-27974), [KT-31701](https://youtrack.jetbrains.com/issue/KT-31701).
  
## Other IDE experience improvements

Since the plugin and the platform have been moved to the same codebase and now ship simultaneously, this release also brings the following features that improve the Kotlin experience:

* **Package Search integration**. Package Search also lets you upgrade, downgrade, and remove existing dependencies, change their scope, and navigate to their declarations. Use it to find new dependencies and add them automatically. On top of that, Package Search will also add the required repositories to your build script if they’re missing.

* **Advanced settings**. We have good news for those who need to configure IntelliJ IDEA to address particular needs. We’ve added a new node to Preferences | Settings | Advanced Settings. It contains some use-case-specific options conveniently grouped by IDE tool. Most of the settings have been transferred from the Registry, though some of them are new.
  For example, you can add a left margin in Distraction-free mode, or set the caret to move down after you use the Comment with Line Comment action.
  
* **Quick access to Eclipse projects** На него можно навесить кучу всего, например, реформат сделать, оптимизировать импорты при сейве. Можно будет несколько шорткатов объединить в один.

* **VCS improvements**.

See the [What’s new in IntelliJ IDEA 2021.2 blog post](https://www.jetbrains.com/idea/whatsnew/) or watch [this video](https://www.youtube.com/watch?v=YBmR0J3-r3o) to learn more about the platform enhancements.