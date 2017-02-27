---
type: doc
layout: reference
category: "JavaScript"
title: "Kotlin JavaScript Overview"
---

# Kotlin JavaScript Overview

Kotlin provides the ability to target JavaScript. It does so by transpiling Kotlin to JavaScript. The current implementation targets ECMAScript 5.1 but there are plans to eventually
 target ECMAScript 6 also.

When you choose the JavaScript target, any Kotlin code that is part of the project as well as the standard library that ships with Kotlin is transpiled to JavaScript.
However, this excludes the JDK and any JVM or Java framework or library used. Any file that is not Kotlin will be ignored during compilation.

The Kotlin compiler tries to comply with the following goals:

* Provide output that is optimal in size
* Provide output that is readable JavaScript
* Provide interoperability with existing module systems
* Provide the same functionality in the standard library whether targeting JavaScript or the JVM (to the largest possible degree).

## How can it be used

You may want to compile Kotlin to JavaScript in the following scenarios:

* Creating Kotlin code that targets client-side JavaScript

    * **Interacting with DOM elements**. Kotlin provides a series of statically typed interfaces to interact with the Document Object Model, allowing creation and update of DOM elements.

    * **Interacting with graphics such as WebGL**. You can use Kotlin to create graphical elements on a web page using WebGL.

* Creating Kotlin code that targets server-side JavaScript

    * **Working with server-side technology**. You can use Kotlin to interact with server-side JavaScript such as node.js

* Using Kotlin as a wrapper for third-party libraries or frameworks

    * **Statically typed wrapper around common libraries such as jQuery or ReactJS**. We ship a series of statically-typed wrappers common libraries such as jQuery, but there are also
     third-party projects that do the same with frameworks such as AngularJS or ReactJS. Kotlin will eventually be able to use the [Definitely Typed TypeScript](http://definitelytyped.org/) type definitions repository.


Kotlin is also compatible with CommonJS, AMD and UMD, [making interaction with different](/docs/tutorials/javascript/working-with-modules/working-with-modules.html) module systems straightforward.


## Getting Started with Kotlin to JavaScript

To find out how to start using Kotlin for JavaScript, please refer to the [tutorials](/docs/tutorials/javascript/kotlin-to-javascript/kotlin-to-javascript.html).
