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
type definitions repository to Kotlin using the [ts2kt](https://github.com/kotlin/ts2kt) tool. Alternatively, you can use
the [dynamic type](dynamic-type.html) to access any framework without strong typing.

JetBrains develops and maintains several tools specifically for the React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) as well as [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). The latter helps you start building React apps with Kotlin with no build configuration.

Kotlin is compatible with CommonJS, AMD and UMD, [making interaction with different](/docs/tutorials/javascript/working-with-modules/working-with-modules.html) module systems straightforward.


## Getting Started with Kotlin to JavaScript

To find out how to start using Kotlin for JavaScript, please refer to the [tutorials](/docs/tutorials/javascript/kotlin-to-javascript/kotlin-to-javascript.html).
