[//]: # (title: Kotlin for JavaScript)

Kotlin/JS provides the ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies
to JavaScript. The current implementation of Kotlin/JS targets [ES5](https://www.ecma-international.org/ecma-262/5.1/).

The recommended way to use Kotlin/JS is via the `kotlin.multiplatform` Gradle plugin. It lets you easily set up and control
Kotlin projects targeting JavaScript in one place. This includes essential functionality
such as controlling the bundling of your application, adding JavaScript dependencies directly from npm, and more.
To get an overview of the available options, check out [Set up a Kotlin/JS project](js-project-setup.md).

## Kotlin/JS IR compiler

The [Kotlin/JS IR compiler](js-ir-compiler.md) comes with a number of improvements over the old default compiler.
For example, it reduces the size of generated executables
via dead code elimination and provides smoother interoperability with the JavaScript ecosystem and its tooling.

> The old compiler has been deprecated since the Kotlin 1.8.0 release.
> 
{style="note"}

By generating TypeScript declaration files (`d.ts`) from Kotlin code, the IR compiler makes it easier to create "hybrid"
applications that mix TypeScript and Kotlin code and to leverage code-sharing functionality using Kotlin Multiplatform.

To learn more about the available features in the Kotlin/JS IR compiler and how to try it for your project, visit the
[Kotlin/JS IR compiler documentation page](js-ir-compiler.md) and the [migration guide](js-ir-migration.md).

## Kotlin/JS frameworks

Modern web development benefits significantly from frameworks that simplify building web applications.
Here are a few examples of popular web frameworks for Kotlin/JS written by different authors:

### KVision

_KVision_ is an object-oriented web framework that makes it possible to write applications in Kotlin/JS with ready-to-use components
that can be used as building blocks for your application's user interface. You can use both reactive and imperative programming
models to build your frontend, use connectors for Ktor, Spring Boot, and other frameworks to integrate it with your server-side
applications, and share code using [Kotlin Multiplatform](multiplatform.md).

[Visit KVision site](https://kvision.io) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#kvision](https://kotlinlang.slack.com/messages/kvision) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### fritz2

_fritz2_ is a standalone framework for building reactive web user interfaces. It provides its own type-safe DSL for building
and rendering HTML elements, and it makes use of Kotlin's coroutines and flows to express components and their data bindings.
It provides state management, validation, routing, and more out of the box, and integrates with Kotlin Multiplatform projects.

[Visit fritz2 site](https://www.fritz2.dev) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#fritz2](https://kotlinlang.slack.com/messages/fritz2) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Doodle

_Doodle_ is a vector-based UI framework for Kotlin/JS. Doodle applications use the browser's graphics capabilities to draw
user interfaces instead of relying on DOM, CSS, or Javascript. By using this approach, Doodle gives you precise control
over the rendering of arbitrary UI elements, vector shapes, gradients, and custom visualizations.

[Visit Doodle site](https://nacular.github.io/doodle/) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#doodle](https://kotlinlang.slack.com/messages/doodle) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Join the Kotlin/JS community

You can join the [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel in the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
to chat with the community and the team.