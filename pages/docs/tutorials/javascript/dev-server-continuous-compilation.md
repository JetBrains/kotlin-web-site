---
type: tutorial
layout: tutorial
title:  "Development Server and Continuous Compilation"
description: "How to set up the local development environment for automatic recompilation and reloading."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false
---

Instead of manually compiling and executing our Kotlin/JS project every time we want to see the changes we made, we can make use of the _continuous compilation_ mode. Instead of using the regular `run` command, we instead invoke the Gradle wrapper in _continuous_ mode:

```./gradlew run --continuous```

If we are working from inside IntelliJ IDEA, we can pass the same flag via the _run configuration_. After running the Gradle `run` task for the first time from the IDE, IntelliJ IDEA automatically generates a run configuration for it, which we can edit:

![Editing run configurations in IntelliJ IDEA]({{ url_for('tutorial_img', filename='javascript/dev-server-continuous-compilation/edit-configurations.png')}})

Enabling continuous mode via the __Run/Debug Configurations__ dialog is as easy as adding the `--continuous` flag to the arguments for the run configuration:

![Adding the continuous flag to a run configuration in IntelliJ IDEA]({{ url_for('tutorial_img', filename='javascript/dev-server-continuous-compilation/run-debug-configurations.png')}})

When executing this run configuration, we can note that the Gradle process continues watching for changes to the program:

![Gradle waiting for changes]({{ url_for('tutorial_img', filename='javascript/dev-server-continuous-compilation/waiting-for-changes.png')}})

Once a change has been detected, the program will be recompiled automatically. If we still have the page open in our browser, the development server will trigger an automatic reload of the page, and our changes will become visible. This is thanks to the integrated `webpack-dev-server` that is managed by the Kotlin/JS Gradle plugin.