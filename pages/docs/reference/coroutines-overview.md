---
type: doc
layout: reference
category: "Introduction"
title: "Coroutines Overview"
---

# Coroutines for asynchronous programming and more

Asynchronous or non-blocking programming is the new reality. Whether we're creating server-side, desktop or mobile applications, it's important 
that we provide an experience that is not only fluid from the user's perspective, but scalable when needed.

There are many approaches to this problem, and in Kotlin we take a very flexible one by providing [Coroutine](https://en.wikipedia.org/wiki/Coroutine) support at the language 
level and delegating most of the functionality to libraries, much in line with Kotlin's philosophy. 

As a bonus, coroutines not only open the doors to asynchronous programming, but also provide a wealth of other possibilities such as concurrency, actors, etc.


## How to Start

<div style="display: flex; align-items: center; margin-bottom: 20px">
    <img src="{{ url_for('asset', path='images/landing/native/book.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Tutorials and Documentation</b>
</div>

New to Kotlin? Take a look at the [Getting Started](/docs/reference/basic-syntax.html) page.

Selected documentation pages:
- [Coroutines Guide](/docs/reference/coroutines/coroutines-guide.html)
- [Basics](/docs/reference/coroutines/basics.html)
- [Channels](/docs/reference/coroutines/channels.html)
- [Coroutine Context and Dispatchers](/docs/reference/coroutines/coroutine-context-and-dispatchers.html)
- [Shared Mutable State and Concurrency](/docs/reference/coroutines/shared-mutable-state-and-concurrency.html)
- [Asynchronous Flow](/docs/reference/coroutines/flow.html)

Recommended tutorials:
- [Your first coroutine with Kotlin](../tutorials/coroutines/coroutines-basic-jvm.html)
- [Asynchronous Programming](../tutorials/coroutines/async-programming.html)
- [Introduction to Coroutines and Channels](https://play.kotlinlang.org/hands-on/Introduction%20to%20Coroutines%20and%20Channels/01_Introduction) hands-on lab

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img src="{{ url_for('asset', path='images/landing/native/try.png') }}" height="38p" width="55" style="margin-right: 10px;">
    <b>Example Projects</b>
</div>

- [kotlinx.coroutines Examples and Sources](https://github.com/Kotlin/kotlin-coroutines/tree/master/examples)
- [KotlinConf app](https://github.com/JetBrains/kotlinconf-app) 

Even more examples are on [GitHub](https://github.com/JetBrains/kotlin-examples)
