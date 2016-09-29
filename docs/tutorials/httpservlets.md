---
type: tutorial
layout: tutorial
title:  "Creating Web Applications with Http Servlets"
description: "This tutorial walks us through the process of creating a simple controller using HttpServlet to display Hello World."
authors: Hadi Hariri
showAuthorInfo: false
date: 2015-11-01
source: servlet-web-applications
---
Java EE Http servlets can be used from Kotlin much like any other Java library or framework. We'll see
how to make a simple controller that returns "Hello, World!".

### Defining the project and dependencies
{{ site.text_using_gradle }}
The main dependency required for using HTTP servlets is the JavaEE API:

``` groovy
dependencies {
    compile group: 'javax', name: 'javaee-api', version: '7.0'
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
@WebServlet(name = "Hello", value = "/hello")
class HomeController : HttpServlet() {
    override fun doGet(req: HttpServletRequest, res: HttpServletResponse) {
        res.writer.write("Hello, World!")
    }
}
```

### Running the application

Using IntelliJ IDEA we can easily run and debug the application in any of the possible application servers defined such as Tomcat, Glassfish or WildFly. In this case we're going to use Tomcat
which has previously [been defined as an application server in IntelliJ IDEA](http://www.jetbrains.com/idea/webhelp/defining-application-servers-in-intellij-idea.html)

In order to run, we need the corresponding WAR(s) for deploying. We can generate these using the *war* task in Gradle which can easily be executed via the Gradle tool window in IntelliJ IDEA.


![Gradle Tasks]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/gradle-tasks.png)

Alternatively, we can build it using the command line:

    gradle war

The next step is to create a Run Configuration in IntelliJ IDEA under Tomcat / Local which deploys the WAR and starts up Tomcat.

![Run Config]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/tomcat-config.png)

Once we run the application (using this previous run configuration), and on successful deployment, we should be able to navigate to the browser with the correct url and see the response:

![Browser Run]({{ site.baseurl }}/{{ site.img_tutorial_root }}/httpservlets/browser.png)






