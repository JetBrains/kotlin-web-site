[//]: # (title: Kotlin/JS frameworks)

Take advantage of available Kotlin/JavaScript frameworks that simplify web development. 
These frameworks provide ready-to-use components, routing, state management, and other tools for building modern web applications.

Here are some Kotlin/JS web frameworks from the community:

## Kobweb

[Kobweb](https://kobweb.varabyte.com/) is a Kotlin framework for creating websites and web applications with [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html). It 
supports live-reloading for fast development. Inspired by [Next.js](https://nextjs.org/), Kobweb promotes a standard structure for adding widgets, layouts,
and pages.

Out of the box, Kobweb provides page routing, light/dark mode, CSS styling, Markdown support, backend APIs, and more.
It also includes [Silk](https://silk-ui.netlify.app/), a UI library with a set of versatile widgets for modern UIs.

Kobweb also supports site export by generating page snapshots
for SEO and automatic search indexing. Additionally, it enables the creation of DOM-based UIs that efficiently update in response to state changes.

For documentation and examples, see the [Kobweb docs](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb) site.

For updates and discussions about the framework, join the [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) and
[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) channels in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Kilua

[Kilua](https://kilua.dev/) is a composable web framework built on the [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime) and
is similar to the [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html)
library. Unlike compose-html, Kilua supports both Kotlin/Wasm and Kotlin/JS targets.

Kilua provides a modular API to create declarative UI components and manage their state.
It also includes a set of
ready-to-use components for common web application use cases.

Kilua is a successor to the [KVision](https://kvision.io) framework. Kilua is designed to be
familiar to both Compose users (`@Composable` functions, state management, coroutines/flow integration) and
KVision users (component-based API that allows some imperative interaction with the UI components).

For documentation and examples, see the [Kilua repository](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples) on GitHub.

For updates and discussions about the framework, join the [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) channel in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Kotlin React

[React](https://react.dev/) is a component-based library, widely used for web and native user interfaces. 
It offers a large ecosystem of components, 
learning materials, and an active community.

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md) is a Kotlin wrapper for React
that combines the React ecosystem with the type-safety and expressiveness of Kotlin.

For updates and discussions about the library, join the [#react](https://kotlinlang.slack.com/messages/react) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## KVision

[KVision](https://kvision.io) is an object-oriented web framework for building Kotlin/JS applications with ready-to-use UI components.
These components can be building blocks for your application's user interface.

With this framework, you can use both reactive and imperative programming models to build your frontend. You can also 
integrate it with your server-side applications by using connectors for Ktor, Spring Boot, and other frameworks. 
In addition, you can share code using [Kotlin Multiplatform](/docs/multiplatform/get-started.html).

For documentation, tutorials, and examples, see the [KVision docs](https://kvision.io/#docs) site.

For updates and discussions about the framework, join the [#kvision](https://kotlinlang.slack.com/messages/kvision) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## fritz2

[fritz2](https://www.fritz2.dev) is a standalone framework for building reactive web user interfaces. It provides its own type-safe DSL for building
and rendering HTML elements, and uses Kotlin's coroutines and flows to define components and their data bindings.

Out of the box, fritz2 offers state management, validation, routing, and more. It also integrates with Kotlin Multiplatform projects.

For documentation, tutorials, and examples, see the [fritz2 docs](https://www.fritz2.dev/docs/) site.

For updates and discussions about the framework, join the [#fritz2](https://kotlinlang.slack.com/messages/fritz2) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Doodle

[Doodle](https://nacular.github.io/doodle/) is a vector-based UI framework for Kotlin/JS. Doodle applications use the browser's graphics capabilities to draw
user interfaces instead of relying on DOM, CSS, or JavaScript. This approach gives you control
over the rendering of arbitrary UI elements, vector shapes, gradients, and custom visualizations.

For documentation, tutorials, and examples, see the [Doodle docs](https://nacular.github.io/doodle/docs/introduction/) site.

For updates and discussions about the framework, join the [#doodle](https://kotlinlang.slack.com/messages/doodle) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).