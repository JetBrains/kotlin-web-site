---
type: tutorial
layout: tutorial
title: "Coroutines under the covers"
description: "This tutorial explains how coroutines work under the covers"
authors: Hadi Hariri
showAuthorInfo: false
---

If you're new to the concept of asynchronous programming, we recommend reading [Asynchronous Programming Techniques](async-programming.md) first. If you want to get up and running with Coroutines in Kotlin, check out [Your first coroutine with Kotlin](coroutines-basic-jvm.md) tutorial. This tutorial explains in more details what a coroutine is and how it works under the covers. 

## Suspendable computations

The idea behind coroutines is that of suspendable computations. In essence what this means is that a function can be suspended and resumed at some point in time. 

