---
type: doc
layout: reference
category: "JavaScript"
title: "Creating a Kotlin/JS Project from a template"
---
# Creating a Kotlin/JS Project from a template

You can create a Kotlin/JS project from a template in [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html):

* Frontend application or library that targets only JS for browser
* Full-stack web application that besides JS for browser targets also JVM for server side

To get started with Kotlin/JS, you can pass through a [tutorial on creating a frontend application for React](../tutorials/javascript/setting-up.html).
If you want to set up the project manually, [learn how to do this](js-project-setup.html).

Before creating a project, install a recent version of [IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html)

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name and select **Frontend Application** as the project template.
    >You can also use the project template **Full-stack web application** if you need both frontend and backend.
    {:.note}
    ![Select a project template]({{ url_for('asset', path='images/reference/js-project-setup/js-create-project.png') }})

4. Select the Gradle DSL – Kotlin or Groovy.
5. Click **Next**.  
You can finish creating the project by clicking **Finish** on the next screen or configure it if necessary.

6. Configure target settings, such as the target template, test framework, and target kind - application or library.   
    ![Configure the project]({{ url_for('asset', path='images/reference/js-project-setup/js-configure-project.png') }})

7. Select a rendering engine:
    *   **Statically-typed Kotlinx.html DSL** provides an easy way to write simple web applications without relying on a 
    framework. It allows you to write typesafe HTML, but remains unopinionated about how your application should behave 
    or render.
    *   **Kotlin-wrapped React library** allows you to leverage one of the most popular web frameworks, React, to build 
    reactive web frontend in Kotlin.
    By using interoperability with JavaScript, you can also re-use third-party components in your application.
    *   **Kotlin-wrapped React library with Styled Components** in addition to allowing you to write reactive apps, also 
    allows you to define your style sheets in a typesafe Kotlin DSL. [Styled-components](https://styled-components.com/) 
    make it easy to add (even dynamic) stylesheets to components in your React application.

9. Click **Finish**.

The new project opens. Learn more about the [Kotlin/JS project and its manual configuration](js-project-setup.html). 
