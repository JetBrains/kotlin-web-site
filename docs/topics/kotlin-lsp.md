[//]: # (title: Kotlin LSP support)
<primary-label ref="alpha"/>

[Kotlin LSP](https://github.com/Kotlin/kotlin-lsp) is JetBrains' official implementation of the
[Language Server Protocol (LSP)](https://microsoft.github.io/language-server-protocol/) for Kotlin.

The server is based on IntelliJ IDEA, the IntelliJ IDEA Kotlin Plugin, JetBrains AIR, and Fleet. 
It is designed to work with any code editor that supports LSP.

> [IntelliJ IDEA](https://www.jetbrains.com/idea/) and [Android Studio](https://developer.android.com/studio) 
> remain the most complete environments for Kotlin development.
>
{style="note"}

## Kotlin in Visual Studio Code

Kotlin LSP provides official Kotlin language support for [Visual Studio Code](https://code.visualstudio.com/).

If you use Visual Studio Code for Kotlin development,
install the official [Kotlin by JetBrains]((https://marketplace.visualstudio.com/items?itemName=org.jetbrains.kotlin-server)
extension from the Visual Studio Marketplace.

To activate the Kotlin LSP extension, open a Kotlin project in Visual Studio Code and then open any Kotlin file.

## Supported features

Kotlin LSP includes core language features such as:

* Support for up-to-date Kotlin language versions
* IntelliJ-powered code completion
* IntelliJ-powered diagnostics and quick fixes for Kotlin and `kotlinx.` libraries
* Build system support for Gradle and Maven, with experimental Android Gradle Plugin (AGP) support
* Semantic highlighting
* Organize imports
* Rename refactoring
* Code formatting
* Documentation navigation and hover support
* Call hierarchy
* Code folding

## Feedback

Kotlin LSP is under active development, and feedback is especially valuable during the Alpha stage.

If you run into problems or want to suggest improvements, report them in the [Kotlin LSP repository](https://github.com/Kotlin/kotlin-lsp).

## What's next?

* Explore the [Kotlin LSP repository on GitHub](https://github.com/Kotlin/kotlin-lsp)