[//]: # (title: IDEs for Kotlin development)

<web-summary>JetBrains provides official Kotlin IDE support for IntelliJ IDEA, Android Studio, and Visual Studio Code.</web-summary>

JetBrains provides official Kotlin support for the following IDEs and code editors: [IntelliJ IDEA](#intellij-idea) and [Android Studio](#android-studio).
You can also install the official Kotlin by JetBrains extension for [Visual Studio Code](#visual-studio-code),
which is currently in [Alpha](components-stability.md#stability-levels-explained).

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

## Android Studio

[Android Studio](https://developer.android.com/studio) is the official IDE for Android app development,
based on [IntelliJ IDEA](https://www.jetbrains.com/idea/).
On top of IntelliJ's powerful code editor and developer tools, Android Studio offers even more features that enhance your productivity when building Android apps.

Kotlin plugin is bundled with each Android Studio release.

Read more about Android Studio in the [official documentation](https://developer.android.com/studio/intro).

## Visual Studio Code
<primary-label ref="alpha"/>

[Visual Studio Code](https://code.visualstudio.com/) is a code editor with a wide range of extensions,
including the [official Kotlin by JetBrains extension](https://marketplace.visualstudio.com/items?itemName=JetBrains.kotlin-server).

The Kotlin extension provides code completion, navigation, debugging, and other Kotlin development features through
the Kotlin Language Server.

For more information, see [Kotlin Language Server and Visual Studio Code](kotlin-lsp.md#kotlin-in-visual-studio-code).

## Other IDEs support

JetBrains doesn't provide official Kotlin plugins for other IDEs.
You can use the [Kotlin Language Server](kotlin-lsp.md) with other code editors.

To use Kotlin in text editors without IDE-related features (such as code formatting, debugging tools, refactoring),
you can download the latest Kotlin command-line compiler (`kotlin-compiler-%kotlinVersion%.zip`) from Kotlin [GitHub Releases](%kotlinLatestUrl%)
and [install it manually](command-line.md#manual-install). Also, you could use package managers,
such as [Homebrew](command-line.md#homebrew), [SDKMAN!](command-line.md#sdkman), and [Snap package](command-line.md#snap-package).

## Compatibility with the Kotlin language versions

For IntelliJ IDEA and Android Studio, the Kotlin plugin is bundled with each release.
When the new Kotlin version is released, these tools will suggest updating Kotlin to the latest version automatically.
See the latest supported language version in [Kotlin releases](releases.md#ide-support).

## AI support in IDEs

IntelliJ IDEA and Android Studio support AI-assisted Kotlin development through built-in AI features and integrations 
with AI coding agents. Depending on your workflow, you can use AI directly in the IDE, connect external agents, or 
combine AI tools with Kotlin-specific guidance.

For an overview of the available AI tools and when to use them, see [](ai-for-development.md).

## What's next?

* [Create a console application in IntelliJ IDEA](jvm-get-started.md)
* [Create your first cross-platform mobile app using Android Studio](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)