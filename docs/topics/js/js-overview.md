[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS) lets you transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies
to JavaScript. As a result, your Kotlin applications can run in any environment that supports JavaScript.

The current implementation of Kotlin/JS targets the [ES5](https://www.ecma-international.org/ecma-262/5.1/) and [ES2015](https://262.ecma-international.org/6.0/) standards.

The recommended way to use Kotlin/JS is through the [Kotlin Multiplatform Gradle plugin](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) (`kotlin.multiplatform`). 
It allows you to configure and manage Kotlin projects targeting JavaScript from a single place. 

Using Kotlin/JS through the Kotlin Multiplatform Gradle plugin gives you access to features
such as controlling your application's bundling, adding JavaScript dependencies directly from npm, and more.
To get an overview of the available configuration options, check out the [Set up a Kotlin/JS project](js-project-setup.md) guide.

## Use cases for Kotlin/JS

There are many ways to use Kotlin/JS. Here are some common scenarios:

*  **Sharing common logic between frontend and JVM backend**
    
      If your backend is written in a JVM language (especially in Kotlin),
      you can share common code between your web application and the backend.
      This includes data-transfer objects (DTOs), validation and authentication rules, abstractions for REST API endpoints, and more.

*  **Sharing common logic between Android, iOS, and web clients**
 
     You can share business logic between your web interface and mobile applications for Android and iOS. In this use case, you keep all the clients with a native user interface (UI)
     while avoiding duplication of common functionality such as REST API abstractions, user authentication, form validations,
     and domain models.

* **Building frontend web applications using Kotlin/JS**

     Use Kotlin to develop traditional web frontends while integrating with existing tools and libraries:

     * If you are familiar with Android development, you can build web applications with
       Compose-based frameworks like [Kobweb](https://kobweb.varabyte.com/) or [Kilua](https://kilua.dev/).
     * Build fully type-safe React applications with Kotlin/JS using the available [Kotlin wrappers for common JavaScript libraries](https://github.com/JetBrains/kotlin-wrappers)
       provided by JetBrains. The Kotlin wrappers (`kotlin-wrappers`) offer abstractions and integrations for React and other JavaScript frameworks.
       
       These wrappers also support complementary libraries, like
       [React Redux](https://react-redux.js.org/), [React Router](https://reactrouter.com/), and [styled-components](https://styled-components.com/). 
       Besides these libraries, you can also use third-party React components and component libraries through interoperability with the JavaScript ecosystem.
  
     * You can use any available [Kotlin/JS frameworks](#kotlin-js-frameworks),
       which integrate with the Kotlin ecosystem and support concise and expressive code.

*  **Building multiplatform applications that support older browsers**

      With Compose Multiplatform, you can use Kotlin to build applications and reuse mobile and desktop user interfaces in your web projects.
      While [Kotlin/Wasm](wasm-overview.md) is the primary target for this purpose, you can extend support to older browsers by also targeting Kotlin/JS.

* **Building server-side and serverless applications using Kotlin/JS**
  
    The Node.js target in Kotlin/JS lets you create applications for server-side or serverless environments,
    running in a JavaScript runtime with benefits like fast startup and low memory footprint. The [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs) library
    provides typesafe access to the [Node.js API](https://nodejs.org/docs/latest/api/) from Kotlin.

Depending on your use case, Kotlin/JS projects can use compatible libraries from the Kotlin ecosystem and 
third-party libraries from the JavaScript and TypeScript ecosystems. 

To use third-party libraries from your Kotlin code, you can create your own typesafe wrappers or use community-maintained wrappers. 
Additionally, you can use the Kotlin/JS [dynamic type](dynamic-type.md), which lets you skip strict typing and library wrappers, at the cost of type safety.

Kotlin/JS is also compatible with the most common module systems: [ESM](https://tc39.es/ecma262/#sec-modules), [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules), 
[UMD](https://github.com/umdjs/umd), and [AMD](https://github.com/amdjs/amdjs-api).
This allows you to [produce and consume modules](js-modules.md) and interact with the JavaScript ecosystem in a structured manner.

### Share your use cases

The list from the previous section includes common Kotlin/JS use cases but is not exhaustive. Feel free to experiment with different approaches
and find the best fit for your project.

Share your use cases, experiences, and questions with the Kotlin/JS community in the [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel on [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).

## Get started with Kotlin/JS

Explore the fundamentals and initial steps to start working with Kotlin/JS:

* If you're new to Kotlin, start by reviewing the [basic syntax](basic-syntax.md).
* To start using Kotlin for JavaScript, see [Set up a Kotlin/JS project](js-project-setup.md). 
* Check out the list of [Kotlin/JS sample projects](#sample-projects-for-kotlin-js) for inspiration. These samples contain 
  useful code snippets and patterns that can help you get started with your projects.

### Sample projects for Kotlin/JS

The following table lists a set of sample projects demonstrating various Kotlin/JS use cases, architectures, and code-sharing strategies:

| Project                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                  |
|-----------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Petclinic with common code between Spring and Angular](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                   | Demonstrates how to avoid code duplication in enterprise applications by sharing data-transfer objects, validation and authentication rules, and abstractions for REST API endpoints. The code is shared between [Spring Boot](https://spring.io/projects/spring-boot) backend and [Angular](https://angular.dev/) frontend. |
| [Fullstack Conference CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                                        | Showcases multiple code-sharing approaches, ranging from the simplest to all-in code sharing between [Ktor](https://ktor.io/), [Jetpack Compose](https://developer.android.com/compose), and [Vue.js](https://vuejs.org/) applications.                                                                                      |
| [Todo App on a Compose-HTML-based Kobweb framework](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | Shows how to create a to-do list application by reusing an approach familiar to Android developers. It builds a client UI application powered by the [Kobweb framework](https://kobweb.varabyte.com/).                                                                                                                       |
| [Simple logic sharing between Android, iOS, and web](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)          | Contains a template for building a project with common logic in Kotlin, which is consumed in platform-native UI applications on Android ([Jetpack Compose](https://developer.android.com/compose)), iOS ([SwiftUI](https://developer.apple.com/tutorials/swiftui/)), and web ([React](https://react.dev/)).                  |
| [Full-stack collaborative to-do list](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                | Shows how to create a to-do list application for collaborative work using Kotlin Multiplatform with JS and JVM targets, [Ktor](https://ktor.io/) for the backend, and Kotlin/JS with React for the frontend.                                                                                                                 |

## Kotlin/JS frameworks

Kotlin/JS can rely on frameworks to simplify building web applications. 
These frameworks provide ready-to-use components, routing, state management, and other tools for building modern web applications.

[Check the available frameworks for Kotlin/JS written by different authors](js-frameworks.md).

## Join the Kotlin/JS community

You can join the [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel in the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
to chat with the community and the Kotlin/JS team.

## What's next

* [Set up a Kotlin/JS project](js-project-setup.md)
* [Run Kotlin/JS projects](running-kotlin-js.md)
* [Debug Kotlin/JS code](js-debugging.md)
* [Run tests in Kotlin/JS](js-running-tests.md)
