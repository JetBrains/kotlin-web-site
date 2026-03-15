[//]: # (title: IDEs for Kotlin development)

<web-summary>JetBrains provides official Kotlin IDE support for IntelliJ IDEA and Android Studio, and an experimental LSP server.</web-summary>

JetBrains provides the official Kotlin support for the following IDEs and code editors:
[IntelliJ IDEA](#intellij-idea) and [Android Studio](#android-studio).

Other IDEs and code editors can try out the experimental [Kotlin LSP](#kotlin-lsp) and [VSCode plugin](#vscode-plugin) and build your project from the command line using [Gradle](gradle/gradle.md), [Maven](maven/maven.md), or the [Kotlin CLI compiler](command-line.md).

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) is an IDE designed for JVM languages, such as Kotlin and Java,
to maximize developer productivity.
It does the routine and repetitive tasks for you by providing clever code completion, static code analysis, and refactorings.
It lets you focus on the bright side of software development, making it not only productive but also an enjoyable experience.

The Kotlin plugin is bundled with each IntelliJ IDEA release.
Each IDEA release introduces new features and upgrades that improve the experience for Kotlin developers in the IDE.
See [What's new in IntelliJ IDEA](https://www.jetbrains.com/idea/whatsnew/) for the latest updates and improvements for Kotlin.

Read more about IntelliJ IDEA in the [official documentation](https://www.jetbrains.com/help/idea/discover-intellij-idea.html).

## Android Studio

[Android Studio](https://developer.android.com/studio) is the official IDE for Android app development,
based on [IntelliJ IDEA](https://www.jetbrains.com/idea/).
On top of IntelliJ's powerful code editor and developer tools, Android Studio offers even more features that enhance your productivity when building Android apps.

Kotlin plugin is bundled with each Android Studio release.

Read more about Android Studio in the [official documentation](https://developer.android.com/studio/intro).

## Compatibility with the Kotlin language versions

For IntelliJ IDEA and Android Studio, the Kotlin IDE plugin is bundled with each release.
When the new Kotlin version is released, these tools will suggest updating Kotlin to the latest version automatically.
See the latest supported language version in [Kotlin releases](releases.md#ide-support).

## Kotlin LSP

<primary-label ref="experimental-general"/>

LSP stands for Language Server Protocol. It is a standardized protocol for communication between a text editor and a language server. LSP brings quality support for Kotlin to any IDE or text editor supporting LSP such as VSCode, emacs, vim, neovim. It currently has an experimental status.

Please note that running your code is not supported yet. Build your project from the command line using [Gradle](gradle/gradle.md) or [Maven](maven/maven.md), or use the [Kotlin CLI compiler](command-line.md).

Try it out and give feedback on [GitHub](https://github.com/Kotlin/kotlin-lsp).

## VSCode plugin

<primary-label ref="experimental-general"/>

There exists an official experimental VSCode plugin for Kotlin based on the Kotlin LSP.

Try it out and give feedback on [GitHub](https://github.com/Kotlin/kotlin-lsp).

## Kotlin CLI compiler

You can use the [Kotlin CLI compiler](command-line.md).

## Other IDEs support

Some IDEs may have community plugins for Kotlin support.

## What's next?

* [Start your first project using IntelliJ IDEA IDE](jvm/jvm-get-started.md)
* [Create your first cross-platform mobile app using Android Studio](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)
