[//]: # (title: IDEs for Kotlin development)
[//]: # (description: JetBrains provides official Kotlin IDE support for IntelliJ IDEA, Fleet, and Android Studio.)

JetBrains provides the official Kotlin support for the following IDEs and code editors:
[IntelliJ IDEA](#intellij-idea), [JetBrains Fleet](#fleet), and [Android Studio](#android-studio).

Other IDEs and code editors only have Kotlin community-supported plugins.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) is an IDE designed for JVM languages, such as Kotlin and Java,
to maximize developer productivity.
It does the routine and repetitive tasks for you by providing clever code completion, static code analysis, and refactorings. 
It lets you focus on the bright side of software development, making it not only productive but also an enjoyable experience.

The Kotlin plugin is bundled with each IntelliJ IDEA release.
Each IDEA release introduces new features and upgrades that improve the experience for Kotlin developers in the IDE.
See [What's new in IntelliJ IDEA](https://www.jetbrains.com/idea/whatsnew/) for the latest updates and improvements for Kotlin.

Read more about IntelliJ IDEA in the [official documentation](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Fleet

> JetBrains Fleet is currently in Public Preview. At this stage it is free to use.
> 
{style="note"}

[JetBrains Fleet](https://www.jetbrains.com/fleet/) is a _polyglot code editor_ that offers advanced support for Kotlin,
providing a streamlined experience for Kotlin developers. You can use Fleet for quick, targeted edits,
or enable Smart Mode to transform it into a powerful tool with code intelligence features.

Kotlin plugin is bundled with each Fleet release.

Fleet supports Kotlin Multiplatform projects targeting the Android, iOS, web, and desktop platforms,
including testing and debugging your code. Smart Mode selects the appropriate code-processing engine
and enables navigation between Kotlin Multiplatform code and code written in languages interoperable with Kotlin.

See the [Use Fleet for Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html) tutorial to get started.

## Android Studio

[Android Studio](https://developer.android.com/studio) is the official IDE for Android app development,
based on [IntelliJ IDEA](https://www.jetbrains.com/idea/). 
On top of IntelliJ's powerful code editor and developer tools, Android Studio offers even more features that enhance your productivity when building Android apps.

Kotlin plugin is bundled with each Android Studio release.

Read more about Android Studio in the [official documentation](https://developer.android.com/studio/intro).

## Eclipse

[Eclipse](https://eclipseide.org/release/) allows developers to write their applications in different programming languages,
including Kotlin. It also has the Kotlin plugin: originally developed by JetBrains,
now the Kotlin plugin is supported by the Kotlin community contributors.

You can install the [Kotlin plugin manually from the Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse).

The Kotlin team manages the development and contribution process to the Kotlin plugin for Eclipse.
If you want to contribute to the plugin, send a pull request to its [repository on GitHub](https://github.com/Kotlin/kotlin-eclipse).

## Compatibility with the Kotlin language versions

For IntelliJ IDEA, Fleet, and Android Studio, the Kotlin plugin is bundled with each release.
When the new Kotlin version is released, these tools will suggest updating Kotlin to the latest version automatically.
See the latest supported language version in [Kotlin releases](releases.md#ide-support).

## Other IDEs support

JetBrains doesn't provide Kotlin plugins for other IDEs.
However, some of the other IDEs and source editors, such as Eclipse, Visual Studio Code, and Atom, have their own Kotlin plugins supported by the Kotlin community.

You can use any text editor to write the Kotlin code, but without IDE-related features: code formatting, debugging tools, and so on.
To use Kotlin in text editors, you can download the latest Kotlin command-line compiler (`kotlin-compiler-%kotlinVersion%.zip`) from Kotlin [GitHub Releases](%kotlinLatestUrl%) and [install it manually](command-line.md#manual-install).
Also, you could use package managers, such as [Homebrew](command-line.md#homebrew), [SDKMAN!](command-line.md#sdkman), and [Snap package](command-line.md#snap-package).

## What's next?

* [Start your first project using IntelliJ IDEA IDE](jvm-get-started.md)
* [Create a Multiplatform project with Fleet](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html)
* [Create your first cross-platform mobile app using Android Studio](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* Learn how to [install EAP version of the Kotlin plugin](install-eap-plugin.md)