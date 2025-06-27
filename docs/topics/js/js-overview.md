[//]: # (title: Kotlin/JavaScript)

Kotlin/JS provides the ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies
to JavaScript, which opens doors to any environment that supports JavaScript.
The current implementation of Kotlin/JS targets [ES5](https://www.ecma-international.org/ecma-262/5.1/) and [ES2015](https://262.ecma-international.org/6.0/).

The recommended way to use Kotlin/JS is via the `kotlin.multiplatform` Gradle plugin. It lets you easily set up and control
Kotlin projects targeting JavaScript in one place. This includes essential functionality
such as controlling the bundling of your application, adding JavaScript dependencies directly from npm, and more.
To get an overview of the available options, check out [Set up a Kotlin/JS project](js-project-setup.md).

## Use cases for Kotlin/JS

There are numerous ways to use Kotlin/JS. Here is a non-exhaustive list of scenarios in which you can use Kotlin/JS:

*  **Sharing common logic between frontend and JVM backend**
    
      If your backend is written in a JVM language (and especially in Kotlin),
      you can **share common parts between your web application and the backend**.
      It could be data-transfer objects, validation rules, authentication rules, abstractions around REST API endpoints, etc.


*  **Sharing common logic between Android, iOS and Web clients**
 
     You can also **share business logic between your web interface and mobile apps** for Android and iOS, and avoid
     duplicating commonly used functionality, like providing abstractions around REST API endpoints, user authentication, form validations,
     or your domain models, while keeping all the clients with a native UI.


* **Write frontend web applications using Kotlin/JS**
 
     You can re-use your Kotlin expertise and bring a powerful ecosystem to build a classical web frontend:
    * If you are familiar with Android development, you can use your knowledge to build modern web applications with
      Compose-based frameworks like [Kobweb](https://kobweb.varabyte.com/) or [Kilua](https://kilua.dev/)
    * Or Write **full, type-safe React applications with Kotlin/JS** using the [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)
      provided by JetBrains, which provide convenient abstractions and deep integrations for React and other popular JavaScript frameworks.
      `kotlin-wrappers` also provides support for a select number of adjacent technologies, like
      `react-redux`, `react-router`, and `styled-components`. Interoperability with the JavaScript ecosystem means that
      you can also use third-party React components and component libraries.
    * Or use any other of many **[Kotlin/JS frameworks](#kotlin-js-frameworks)**,
      which take full advantage of the Kotlin ecosystem and its expressive power
      and conciseness.


*  **Write a multiplatform application using Compose Multiplatform for older browsers**

      With Kotlin, you have the power to build applications and reuse mobile and desktop user interfaces (UIs) in your web projects through Compose Multiplatform.
      While the [Kotlin/Wasm](../wasm/wasm-overview.md) is mainly used for such a scenario, to cover more users, you can easily add support of your application
      for older browsers with Kotlin/JS.

* **Write server-side and serverless applications using Kotlin/JS**
  
    The Node.js target provided by Kotlin/JS enables you to create applications that **run on a server** or are
    **executed on serverless infrastructure**. This gives you all the advantages of executing in a
    JavaScript runtime, such as **faster startup** and a **reduced memory footprint**. With [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs),
    you have typesafe access to the [Node.js API](https://nodejs.org/docs/latest/api/) directly from your Kotlin code.


Of course, this is not a complete list of all the ways you can use Kotlin/JS to your advantage, but merely some cherry-picked
use cases. We invite you to experiment with different combinations and find out what works best for your project 
(and share it with the community in [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel of the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up))

Whatever your specific use case, Kotlin/JS projects can use compatible **libraries from the Kotlin ecosystem**,
as well as third-party **libraries from the JavaScript and TypeScript ecosystems**. To use the latter from Kotlin code,
you can either provide your own typesafe wrappers, use community-maintained wrappers. Using the Kotlin/JS-exclusive [dynamic type](dynamic-type.md) allows
you to loosen the constraints of Kotlin's type system and skip creating detailed library wrappers, though this comes at the expense of type safety.

Kotlin/JS is also compatible with the most common module systems: ESM, CommonJS, UMD, and AMD.
The ability to [produce and consume modules](js-modules.md) means that you can interact with the JavaScript ecosystem in a structured manner.

## Get started with Kotlin/JS

If you're new to Kotlin, a good first step is to familiarize yourself with the [basic syntax](basic-syntax.md) of the language.

To start using Kotlin for JavaScript, please refer to [Set up a Kotlin/JS project](js-project-setup.md). You can also
check out the list of [Kotlin/JS sample projects](#sample-projects-for-kotlin-js) for inspiration. They contain useful snippets and patterns and can serve as nice jump-off points for your own projects.

### Sample projects for Kotlin/JS

* [Petclinic with common code between Spring and Angular](https://github.com/Kotlin/kmp-spring-petclinic/#readme) shows
  how to escape code duplication in enterprise applications by sharing data-transfer objects, validation rules, authentication rules,
  and abstractions around REST API endpoints, between [Spring Boot]() backend and [Angular](https://angular.dev/) frontend.
* [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme) is a detailed example 
  showing multiple approaches of code sharing from the simplest to all-in code sharing between [Ktor](https://ktor.io/), [Jetpack Compose](https://developer.android.com/compose) 
  and [Vue.js](https://vuejs.org/) applications. 
* [Todo App on a Compose-HTML-based Kobweb framework](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme)
  shows how to create a to-do list app by re-using the familiar for Android developers approach 
  to build a client UI application powered by [Kobweb framework](https://kobweb.varabyte.com/).
* [Simple logic sharing between Android, iOS, and Web](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme) 
  is a template to build a project with a common logic in Kotlin,
  which is consumed in platform-native UI applications on Android ([Jetpack Compose](https://developer.android.com/compose)),
  iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/)) and web ([React](https://react.dev/)).
* [Full-stack collaborative to-do list](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme))
  shows how to create a to-do list for collaborative work using `kotlin-multiplatform` with JS and JVM targets, [Ktor](https://ktor.io/)
  for the backend, Kotlin/JS with React for the frontend.

## Kotlin/JS frameworks

Modern web development benefits significantly from frameworks that simplify building web applications.
Here are a few examples of popular web frameworks for Kotlin/JS written by different authors:

### Kobweb

_Kobweb_ is an opinionated Kotlin framework for creating websites and web apps. It leverages [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) and
live-reloading for fast development. Inspired by [Next.js](https://nextjs.org/), Kobweb promotes a standard structure for adding widgets, layouts,
and pages.

Out of the box, Kobweb provides page routing, light/dark mode, CSS styling, Markdown support, backend APIs, and more features.
It also includes a UI library called Silk, a set of versatile widgets for modern UIs. 

Kobweb also supports site export, generating page snapshots
for SEO and automatic search indexing. Additionally, Kobweb makes it easy to create DOM-based UIs that efficiently update in response to state changes.

Visit the [Kobweb site](https://kobweb.varabyte.com/) for documentation and examples.

For updates and discussions about the framework, join the [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) and
[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Kilua

_Kilua_ is a Composable web framework for Kotlin/Wasm and Kotlin/JS.

It is powered by the Compose Runtime and is similar to the [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html)
library. It gives you clean, modular API to create declarative UI components and manage their state.
Unlike compose-html, Kilua supports both Kotlin/Wasm and Kotlin/JS targets. It also provides a lot
of ready to use components for many typical web application use cases.

Kilua is a kind of successor to [KVision](https://kvision.io) framework. Writing Kilua applications should be
familiar to both Compose users (`@Composable` functions, state management, coroutines/flow integration) and
KVision users (component based API, allowing some imperative, direct ways to interact with the UI components).

For updates and discussions about the framework, join the [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) channel in the Kotlin Slack.

### KVision

_KVision_ is an object-oriented web framework that makes it possible to write applications in Kotlin/JS with ready-to-use components
that can be used as building blocks for your application's user interface. You can use both reactive and imperative programming
models to build your frontend, use connectors for Ktor, Spring Boot, and other frameworks to integrate it with your server-side
applications, and share code using [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html).

Visit the [KVision site](https://kvision.io) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#kvision](https://kotlinlang.slack.com/messages/kvision) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### fritz2

_fritz2_ is a standalone framework for building reactive web user interfaces. It provides its own type-safe DSL for building
and rendering HTML elements, and it makes use of Kotlin's coroutines and flows to express components and their data bindings.
It provides state management, validation, routing, and more out of the box, and integrates with Kotlin Multiplatform projects.

Visit the [fritz2 site](https://www.fritz2.dev) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#fritz2](https://kotlinlang.slack.com/messages/fritz2) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Doodle

_Doodle_ is a vector-based UI framework for Kotlin/JS. Doodle applications use the browser's graphics capabilities to draw
user interfaces instead of relying on DOM, CSS, or Javascript. By using this approach, Doodle gives you precise control
over the rendering of arbitrary UI elements, vector shapes, gradients, and custom visualizations.

Visit the [Doodle site](https://nacular.github.io/doodle/) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#doodle](https://kotlinlang.slack.com/messages/doodle) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Join the Kotlin/JS community

You can join the [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel in the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
to chat with the community and the team.
