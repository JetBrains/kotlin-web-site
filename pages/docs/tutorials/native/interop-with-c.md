---
type: tutorial
layout: tutorial
title:  "Interoperability with C"
description: "Creating a Kotlin/Native application that calls C libraries"
authors: Hadi Hariri 
date: 2017-12-04
showAuthorInfo: false
---


One of the main goals of Kotlin has always been to provide interoperability with the underlying platform. This has been the case when targeting JVM, as well as JavaScript. And it is also 
the case for native, and in this tutorial we'll see how we can call C libraries from our Kotlin applications.
  
* [](#)

## Creating definition files for C libraries

Before calling C libraries, we need to create h