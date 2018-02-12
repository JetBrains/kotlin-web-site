---
type: tutorial
layout: tutorial
title:  "Kotlin/Native with CLion"
description: "Using CLion for Kotlin/Native development"
authors: Hadi Hariri 
date: 2018-01-23
showAuthorInfo: false
---


In this tutorial we'll see how to

* [Configure Kotlin/Native in CLion](#configuring-clion-for-kotlinnative-development)
* [Build and run a sample application](#building-an-running-the-application)


## Configuring CLion for Kotlin/Native development

While it is certainly possible to use any editor to write Kotlin/Native code, JetBrains provides 
a fully-fledged IDE experience for Kotlin/Native via [CLion](https://www.jetbrains.com/clion). CLion is a C/C++ IDE built on the
IntelliJ platform. 

Kotlin support in CLion is provided via a couple of plugins, namely the Kotlin plugin which provides core support for the language, and the Kotlin/Native plugin which 
adds functionality for native support. Both of these plugins are provided by JetBrains and can be installed using the the `Plugins` configuration dialog


![Plugins]({{ url_for('tutorial_img', filename='native/kotlin-native-with-clion/plugins.png')}})


Once installed (which requires a restart of the IDE), we should now have Kotlin support enabled. We can now create a new project using the 
`New Project` wizard

![New Project]({{ url_for('tutorial_img', filename='native/kotlin-native-with-clion/new-project.png') }})


Additionally we can also create a new project based on an exiting sample template, by choosing one of the available ones

![New Project Template]({{ url_for('tutorial_img', filename='native/kotlin-native-with-clion/new-project-hello.png') }})

In our case we're going to use the `Hello World` template to generate a sample application. 

## Building an running the application

Once we have created the application, we can build and run it by using the `Run` menu and selecting `Build`, or alternatively
pressing the assigned keyboard shortcut (which depends on our keyboard mapping)

![Build and Run]({{ url_for('tutorial_img', filename='native/kotlin-native-with-clion/build-run.png') }}) 

To run the application, we merely select `Run` from the same `Build` menu and see the output

![Run]({{ url_for('tutorial_img', filename='native/kotlin-native-with-clion/run.png') }})

