[//]: # (title: What's new in Kotlin plugin 2020.3)

This plugin release introduces the following features:
* [New types of inline refactorings](#new-types-of-inline-refactorings)
* [Structural search and replace](#structural-search-and-replace)
* [EditorConfig support](#editorconfig-support)
* [Project templates for Jetpack Compose for Desktop](#project-templates-for-jetpack-compose-for-desktop)

## New types of inline refactorings

Cross-language conversion is possible starting with version 2020.3 of the Kotlin plugin. You can now use the inline refactoring actions for Kotlin elements defined in Java.

The Kotlin plugin can inline code from libraries with attached sources. That means you can [inline refactor](https://www.jetbrains.com/help/idea/inline.html) all the [Kotlin scope functions](https://kotlinlang.org/docs/reference/scope-functions.html):  _also_, _let_, _run_, _apply_, and _with_.

Also, this release brings refactoring improvements for lambda expressions. Now the IDE analyzes their syntax more thoroughly and formats them correctly.

## Structural search and replace

[Structural search and replace (SSR)](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) actions are now available for Kotlin. The SSR feature allows you to find and replace code patterns, taking the syntax and semantics of the source code into account.

To start using the feature, open the **Structural Search** dialog for your `.kt` file and select one of the [templates](https://www.jetbrains.com/help/idea/search-templates.html) or create your own.

## EditorConfig support

From 2020.3, the Kotlin API has the full support of [.editorconfig](https://editorconfig.org/) files for [managing code style on a directory level](https://www.jetbrains.com/help/idea/configuring-code-style.html#editorconfig). 

## Project templates for Jetpack Compose for Desktop

The new experimental Jetpack Compose for Desktop templates are now available in the Kotlin Project Wizard. You can create a project using the following templates:
* **Desktop** –  a Compose project targeting the desktop JVM platform: Windows, Linux, or macOS.
* **Multiplatform** – a Multiplatform Compose project targeting the desktop JVM platform  (Windows, Linux, macOS) and Android with shared code in common modules. 

![Kotlin Project Wizard – Jetpack Compose project](jetpack-compose.png)

To create a project, select one of the templates while creating a new project and specify the Gradle build system. The Kotlin plugin creates all the configuration files automatically. You can try out this experimental feature by working through [Getting Started with Compose for Desktop tutorial](https://github.com/JetBrains/compose-jb/tree/master/tutorials/Getting_Started).

Read more about Jetpack Compose features in this [blog post](https://blog.jetbrains.com/cross-post/jetpack-compose-for-desktop-milestone-1-released/) and look through the [examples of Compose applications](https://github.com/JetBrains/compose-jb/tree/master/examples).