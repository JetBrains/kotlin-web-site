---
type: tutorial
layout: tutorial
title:  "Creating Web Applications with Http Servlets"
description: "This tutorial walks you through the process of creating a controller using HttpServlet"
authors: Hadi Hariri
showAuthorInfo: false
date: 2014-08-21
source: httpservlets
---
Java EE Http servlets can be used from Kotlin much like any other Java library or framework. We'll see
how to make a simple controller that returns "Hello, World!".

### Defining the project and dependencies

In this tutorial we're going to use Gradle but the same can be accomplished using either IntelliJ IDEA project
 or Maven. For details on setting up Gradle to work with Kotlin, see [Using Gradle](/docs/reference/using-gradle.html).
The main dependency required for using HTTP servlets is the JavaEE API:

``` groovy
dependencies {
    compile group: 'javax', name: 'javaee-api', version: '7.0'

    testCompile group: 'junit', name: 'junit', version: '4.11'
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
}
```

We also need to use the *war* plugin that helps us generate the corresponding WAR artifacts for running/deploying

``` groovy
apply plugin: war
```

To see the full Gradle script check out the source of the project on GitHub.


### Creating a Home Controller

Once we have the build script defined with the correct dependencies, we can now create a controller

``` kotlin
WebServlet(name = "Hello", value = array("/hello"))
public class HomeController: HttpServlet() {
    override fun doGet(req: HttpServletRequest?, resp: HttpServletResponse?) {
        resp?.getWriter()?.write("Hello, World!")
    }
}
```

**Note:** The ? is necessary since these are types imported from Java and can potentially return null. To avoid having to use the ? operator,
we can use KAnnotator to annotate the libraries used (this might become easier in the near future).

### Running the application

Using IntelliJ IDEA we can easily run and debug the application in any of the possible application servers defined such as Tomcat, Glassfish or WildFly. In this case we're going to use Tomcat
which has previously been defined as an application server in IntelliJ IDEA

In order to run, we need the corresponding WAR's for deploying. We can generate these using the *war* task in Gradle

![Gradle Tasks]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/gradle-tasks.png)

We now create a Run Configuration in IntelliJ IDEA under Tomcat / Local

![Run Config]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/tomcat-config.png)

and on successful deployment, should be able to navigate to the browser with the correct url and see the response

![Browser Run]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/browser.png)






