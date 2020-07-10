---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin for JavaScript"
---

# Kotlin JavaScript Overview

Kotlin provides the ability to target JavaScript. It does so by transpiling Kotlin to JavaScript. The current implementation targets ECMAScript 5.1 but there are plans to eventually target ECMAScript 2015 as well.

When you choose the JavaScript target, any Kotlin code that is part of the project as well as the standard library that ships with Kotlin is transpiled to JavaScript. However, this excludes the JDK and any JVM or Java framework or library used. Any file that is not Kotlin will be ignored during compilation.

The Kotlin compiler tries to comply with the following goals:

* Provide output that is optimal in size
* Provide output that is readable JavaScript
* Provide interoperability with existing module systems
* Provide the same functionality in the standard library whether targeting JavaScript or the JVM (to the largest possible degree).

## How it can be used

You may want to compile Kotlin to JavaScript in the following scenarios:

* Creating Kotlin code that targets client-side JavaScript

    * **Interacting with DOM elements**. Kotlin provides a series of statically typed interfaces to interact with the Document Object Model, allowing creation and update of DOM elements.

    * **Interacting with graphics such as WebGL**. You can use Kotlin to create graphical elements on a web page using WebGL.

* Creating Kotlin code that targets server-side JavaScript

    * **Working with server-side technology**. You can use Kotlin to interact with server-side JavaScript such as Node.js

Kotlin can be used together with existing third-party libraries and frameworks, such as jQuery or React. To access third-party frameworks
with a strongly-typed API, you can convert TypeScript definitions from the [Definitely Typed](http://definitelytyped.org/)
type definitions repository to Kotlin using the [dukat](https://github.com/kotlin/dukat) tool. Alternatively, you can use
the [dynamic type](dynamic-type.html) to access any framework without strong typing.

Kotlin is compatible with CommonJS, AMD and UMD, [making interaction with different](/docs/tutorials/javascript/working-with-modules/working-with-modules.html) module systems straightforward.


## Getting Started with Kotlin/JS

To find out how to start using Kotlin for JavaScript, please refer to the [Setting up a Kotlin/JS project](/docs/reference/js-project-setup.html).


## Hands-on labs for Kotlin/JS

Hands-on labs are long-form tutorials that help you get to know a technology by guiding you through a self-contained project related to a specific topic.

They include sample projects, which can serve as jumping-off points for your own projects, and contain useful snippets and patterns.

For Kotlin/JS, the following hands-on labs are currently available:

* [Building Web Applications with React and Kotlin/JS](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) guides you through the process of building a simple web application using the React framework, shows how a typesafe Kotlin DSL for HTML makes it convenient to build reactive DOM elements, and illustrates how to use third-party React components, and how to obtain information from APIs, while writing the whole application logic in pure Kotlin/JS.

* [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server application that makes use of common code, serialization, and other multiplatform paradigms. It also provides a brief introduction into working with Ktor both as a server- and client-side framework.


## Join Kotlin/JS community
You can also join [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channel in the official [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and chat with the community and the team.
