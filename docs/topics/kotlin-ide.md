[//]: # (title: IDEs for Kotlin development)
[//]: # (description: JetBrains provides Kotlin plugin support for IntelliJ IDEA, Fleet and Android Studio. Eclipse has the community supported Kotlin plugin.)

JetBrains provides the official Kotlin plugin [IntelliJ IDEA](#intellij-idea), [JetBrains Fleet](https://www.jetbrains.com/fleet/) and [Android Studio](#android-studio).

Other IDEs and source editors, such as [Eclipse](#eclipse), Visual Studio Code, and Atom, have Kotlin community-supported plugins.

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) is an IDE for JVM languages designed to maximize developer productivity.
It does the routine and repetitive tasks for you by providing clever code completion, static code analysis, and refactorings,
and lets you focus on the bright side of software development, making it not only productive but also an enjoyable experience.

Kotlin plugin is bundled with each IntelliJ IDEA release.

Read more about IntelliJ IDEA in the [official documentation](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Fleet

> JetBrains Fleet is currently in Public Preview, and at this stage is free to use.
{type="note"}

[JetBrains Fleet](https://www.jetbrains.com/fleet/) is a polyglot IDE and code editor that provides advanced support for Kotlin
and a streamlined experience for Kotlin developers. You can use Fleet as a code editor to quickly make targeted edits,
or turn on Smart Mode and transform it into a full-fledged IDE with code intelligence features.

On top of that, with Fleet, you can quickly open and run Kotlin Multiplatform projects targeting the Android, iOS, and desktop
platforms (Fleet's Smart Mode selects the appropriate code-processing engine). The IDE supports testing and debugging your code
on all the platforms your project targets. You can also navigate between Kotlin Multiplatform code and code written in other
languages interoperable with Kotlin.

See the [Use Fleet for Multiplatform development](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html) tutorial to get started.

## Android Studio

[Android Studio](https://developer.android.com/studio) is the official IDE for Android app development,
based on [IntelliJ IDEA](https://www.jetbrains.com/idea/). 
On top of IntelliJ's powerful code editor and developer tools, Android Studio offers even more features that enhance your productivity when building Android apps.

Kotlin plugin is bundled with each Android Studio release.

Read more about Android Studio in the [official documentation](https://developer.android.com/studio/intro).

## Eclipse

[Eclipse](https://eclipseide.org/release/) is an IDE that is used to develop applications in different programming languages, including Kotlin.
Eclipse also has the Kotlin plugin: originally developed by JetBrains, now the Kotlin plugin is supported by the Kotlin community contributors.

You can install the [Kotlin plugin manually from the Eclipse Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse).

The Kotlin team manages the development and contribution process to the Kotlin plugin for Eclipse.
If you want to contribute to the plugin, send a pull request to the [Kotlin for Eclipse repository on GitHub](https://github.com/Kotlin/kotlin-eclipse).

## Compatibility with the Kotlin language versions

For IntelliJ IDEA, Fleet and Android Studio the Kotlin plugin is bundled with each IDE release.
When the new Kotlin version is released, these IDEs will suggest updating Kotlin to the latest version automatically.
See the latest supported language version for each IDE in [Kotlin releases](releases.md#ide-support).

## Other IDEs support

JetBrains doesn't provide the Kotlin plugin for other IDEs.
However, some of the other IDEs and source editors, such as Eclipse, Visual Studio Code, and Atom, have their own Kotlin plugins supported by the Kotlin community.

You can use any text editor to write the Kotlin code, but without IDE-related features: code formatting, debugging tools, and so on.
To use Kotlin in text editors, you can download the latest Kotlin command-line compiler (`kotlin-compiler-%kotlinVersion%.zip`) from Kotlin [GitHub Releases](%kotlinLatestUrl%) and [install it manually](command-line.md#manual-install).
Also, you could use package managers, such as [Homebrew](command-line.md#homebrew), [SDKMAN!](command-line.md#sdkman), and [Snap package](command-line.md#snap-package).

## What's next?

* [Start your first project using IntelliJ IDEA IDE](jvm-get-started.md)
* [Create a Multiplatform project with Fleet](https://www.jetbrains.com/help/kotlin-multiplatform-dev/fleet.html)
* [Create your first cross-platform mobile app using Android Studio](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
* Learn how to [install EAP version of the Kotlin plugin](install-eap-plugin.md)