[//]: # (title: Kotlin for JavaScript)

Kotlin/JS provides the ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies
to JavaScript. The current implementation of Kotlin/JS targets [ES5](https://www.ecma-international.org/ecma-262/5.1/).

The recommended way to use Kotlin/JS is via the `kotlin.js` and `kotlin.multiplatform` Gradle plugins. They provide a
central and convenient way to set up and control Kotlin projects targeting JavaScript. This includes essential functionality
such as controlling the bundling of your application, adding JavaScript dependencies directly from npm, and more. To get
an overview of the available options, check out the [Kotlin/JS project setup](js-project-setup.md) documentation.

## Use cases for Kotlin/JS

There are numerous ways that Kotlin/JS can be used. To provide you some inspiration, here's a non-exhaustive list of
scenarios in which you can use Kotlin/JS.

* **Write frontend web applications using Kotlin/JS**
    * Kotlin/JS allows you to **leverage powerful browser and web APIs** in a type-safe fashion. Create, modify and interact
    with elements in the Document Object Model (DOM), use Kotlin code to control the rendering of `canvas` or WebGL components,
    and enjoy access to many more of the features supported in modern browsers.
    * Write **full, type-safe React applications with Kotlin/JS** using the [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers)
    provided by JetBrains, which provide convenient abstractions and deep integrations for one of the most popular
    JavaScript frameworks. `kotlin-wrappers` also provides support for a select number of adjacent technologies like
    `react-redux`, `react-router`, or `styled-components`. Interoperability with the JavaScript ecosystem also means that
    you can also use third-party React components and component libraries.
    * Use the **[Kotlin/JS frameworks](#kotlin-js-frameworks)** that take full advantage of Kotlin concepts, its expressive power
    and conciseness. 

* **Write server-side and serverless applications using Kotlin/JS**
    * The Node.js target provided by Kotlin/JS enables you to create applications that **run on a server** or get
    **executed on serverless infrastructure**. You benefit from the same advantages as other applications executing in a
    JavaScript runtime, such as **faster startup speed** and a **reduced memory footprint**. With [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs),
    you have typesafe access to the [Node.js API](https://nodejs.org/docs/latest/api/) directly from your Kotlin code.

*  **Use Kotlin's [multiplatform](multiplatform.md) projects to share code with other Kotlin targets**
    * All Kotlin/JS functionality can also be accessed when using the Kotlin `multiplatform` Gradle plugin.
    * If you have a backend written in Kotlin, you can **share common code** such as data models or validation logic
    with a frontend written in Kotlin/JS, allowing you to **write and maintain full-stack web applications**.
    * You could also **share business logic between your web interface and mobile apps** for Android and iOS, and avoid
    duplicating commonly used functionality like providing abstractions around REST API endpoints, user authentication,
    or your domain models.
    
* **Create libraries for use with JavaScript and TypeScript**
    * You don't have to write your whole application in Kotlin/JS, either – you can also **generate libraries from your
    Kotlin code** that can be consumed as modules from any code base written in JavaScript or TypeScript, regardless of
    other frameworks or technologies used. This approach of **creating hybrid applications** allows you to leverage the
    competencies that you and your team might already have around web development, while helping you **reduce the amount
    of duplicated work**, and making it easier to keep your web target consistent with other targets of your application.
    
Of course, this is not a complete list of how you can use Kotlin/JS to your advantage, but merely a selection of cherry-picked
cases. We invite you to experiment with combinations of these use cases, and find out what works best for your project. 

Regardless of your specific use case, Kotlin/JS projects can use compatible **libraries from the Kotlin ecosystem**,
as well as third-party **libraries from the JavaScript and TypeScript ecosystems**. To use the latter from Kotlin code,
you can either provide your own typesafe wrappers, use community-maintained wrappers, or let [Dukat](js-external-declarations-with-dukat.md)
automatically generate Kotlin declarations for you. Using the Kotlin/JS-exclusive [dynamic type](dynamic-type.md) allows
you to loosen the constraints of Kotlin's type system, allowing you to skip creating detailed library wrappers -
at the expense of type safety.

Kotlin/JS is also compatible with the most common module systems: UMD, CommonJS, and AMD. Being able to [produce and consume modules](js-modules.md)
means that you can interact with the JavaScript ecosystem in a structured manner.

## Kotlin/JS frameworks

Modern web development benefits significantly from frameworks that simplify building web applications.
Here are examples of popular web frameworks for Kotlin/JS written by different authors:

### KVision

_KVision_ is an object-oriented web framework that makes it possible to write applications in Kotlin/JS with ready-to-use components
that can be used as building blocks for your application’s user interface. You can use both reactive and imperative programming
models to build your frontend, use connectors for Ktor, Spring Boot, and other frameworks to integrate it with your server-side
applications, and share code using [Kotlin Multiplatform](multiplatform.md).

Visit [https://kvision.io](https://kvision.io) for documentation, tutorials, and examples.

For updates and discussions about the framework, join [#kvision](https://kotlinlang.slack.com/messages/kvision) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### fritz2

_fritz2_ is a standalone framework for building reactive web user interfaces. It provides its own type-safe DSL for building
and rendering HTML elements, and it makes use of Kotlin’s coroutines and flows to express components and their data bindings.
It provides state management, validation, routing, and more out of the box, and integrates with Kotlin Multiplatform projects.

Visit [https://www.fritz2.dev](https://www.fritz2.dev) for documentation, tutorials, and examples.

For updates and discussions about the framework, join the [#fritz2](https://kotlinlang.slack.com/messages/fritz2) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Doodle

_Doodle_ is a vector-based UI framework for Kotlin/JS. Doodle applications use the browser’s graphics capabilities to draw
user interfaces instead of relying on DOM, CSS, or Javascript. By using this approach, Doodle gives you precise control
over the rendering of arbitrary UI elements, vector shapes, gradients, and custom visualizations.

Visit [https://nacular.github.io/doodle/](https://nacular.github.io/doodle/) for documentation, tutorials, and examples.

For updates and discussions about the framework, join [#doodle](https://kotlinlang.slack.com/messages/doodle) and
[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels in the [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

### Compose for Web

_Compose for Web_ brings [Google’s Jetpack Compose UI toolkit](https://developer.android.com/jetpack/compose) to your browser.
It allows you to build reactive web user interfaces using the concepts introduced by Jetpack Compose. It provides a DOM API
to describe your website, as well as an experimental set of multiplatform layout primitives. Compose for Web also gives
you the option to share parts of your UI code and logic across Android, desktop, and web.

Compose for Web is in _Technology Preview_, which means it is ready for experiments but not yet ready for production use.

You can find more information about Compose for Web on its [landing page](https://jb.gg/compose-web).

Join the [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) channel on [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
to discuss Compose for Web, or [#compose](https://kotlinlang.slack.com/archives/CJLTWPH7S) for general Compose discussions.

## Kotlin/JS, Today and Tomorrow

**Want to know more about Kotlin/JS?**

In [this video](https://www.youtube.com/watch?v=fZUL8_kgHXg), Kotlin Developer Advocate Sebastian Aigner will explain the
main Kotlin/JS benefits to you, share some tips and use cases, and also tell you about the plans and upcoming features for Kotlin/JS.

<video width="560" height="315" href="fZUL8_kgHXg" title="Kotlin/JS, Today and Tomorrow"/>

## Get started with Kotlin/JS

If you're new to Kotlin, a good first step would be to familiarize yourself with the [basic syntax](basic-syntax.md) of the language.

To start using Kotlin for JavaScript, please refer to the [Set up a Kotlin/JS project](js-project-setup.md), or pick a
hands-on lab from the next section to work through.

## Hands-on labs for Kotlin/JS

Hands-on labs are long-form tutorials that help you get to know a technology by guiding you through a self-contained
project related to a specific topic.

They include sample projects, which can serve as jumping-off points for your own projects, and contain useful snippets and patterns.

For Kotlin/JS, the following hands-on labs are currently available:

* [Building Web Applications with React and Kotlin/JS](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) guides you through the process of building a simple web application using the React framework, shows how a typesafe Kotlin DSL for HTML makes it convenient to build reactive DOM elements, and illustrates how to use third-party React components, and how to obtain information from APIs, while writing the whole application logic in pure Kotlin/JS.

* [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server application that makes use of common code, serialization, and other multiplatform paradigms. It also provides a brief introduction into working with Ktor both as a server- and client-side framework.

## New Kotlin/JS IR compiler

The [new Kotlin/JS IR compiler](js-ir-compiler.md) (currently with [Alpha](components-stability.md) stability) comes with
a number of improvements over the current default compiler. For example, it improves the size of generated executables
via dead code elimination and makes it smoother to interoperate with the JavaScript ecosystem and its tooling.
By generating TypeScript declaration files (d.ts) from Kotlin code, the new compiler makes it easier to create “hybrid”
applications that mix TypeScript and Kotlin code, and leverage code-sharing functionality using Kotlin Multiplatform.

To learn more about the available features in the new Kotlin/JS IR compiler and how to try it for your project, visit the
[Kotlin/JS IR compiler documentation](js-ir-compiler.md).

## Join the Kotlin/JS community

You can also join [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel in the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
and chat with the community and the team.