---
type: tutorial
layout: tutorial
title:  "Creating a RESTful Web Service with Spring Boot"
description: "This tutorial walks us through the process of creating a simple REST controller with Spring Boot"
authors: Hadi Hariri, Edoardo Vacchi
showAuthorInfo: true
date: 2015-10-31
source: spring-boot-restful
---
Kotlin works quite smoothly with Spring Boot and many of the steps found on the [Spring Guides](https://spring.io/guides) for creating a RESTful service
can be followed verbatim for Kotlin. There are some minor differences however when it comes to defining the Gradle configuration
and the project layout structure, as well as the initialization code.

In this tutorial we'll walk through the steps required. For a more thorough explanation of Spring Boot and RESTful services, please see
[Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/).

Note that all classes in this tutorial are in the `kotlin.demo` package.

### Defining the project and dependencies
{{ site.text_using_gradle }}

The Gradle file is pretty much standard for Spring Boot. The only difference is the structure layout for source folders for Kotlin, and the required Kotlin dependencies

``` groovy
buildscript {
    ext.kotlin_version = '1.0.0' // Required for Kotlin integration
    ext.spring_boot_version = '1.3.0.RELEASE'
    repositories {
        jcenter()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version" // Required for Kotlin integration
        classpath "org.springframework.boot:spring-boot-gradle-plugin:$spring_boot_version"
    }
}

apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'kotlin' // Required for Kotlin integration
apply plugin: 'spring-boot'
apply plugin: 'application'

jar {
    baseName = 'gs-rest-service'
    version = '0.1.0'
}

repositories {
    jcenter()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version" // Required for Kotlin integration
    compile 'org.springframework.boot:spring-boot-starter-web'
    testCompile 'junit:junit'
}

task wrapper(type: Wrapper) {
    gradleVersion = '2.9'
}
```

### Creating a Greeting Data Class and Controller
The next step is to create Greeting Data class that has two properties: *id* and a *content*

``` kotlin
data class Greeting(val id: Long, val content: String)
```

We now define the *GreetingController* which serves requests of the form */greeting?name={value}* and returns a JSON object
representing an instance of *Greeting*

``` kotlin
@RestController
class GreetingController {

    val counter = AtomicLong()

    @RequestMapping("/greeting")
    fun greeting(@RequestParam(value = "name", defaultValue = "World") name: String): Greeting {
        return Greeting(counter.incrementAndGet(), "Hello, $name")
    }
}
```

As can be seen, this is again pretty much a one-to-one translation of Java to Kotlin, with nothing special required for Kotlin.

### Creating the Application class
Finally we need to define an Application class. As Spring Boot looks for a public static main method, we need to define this in Kotlin
using the *@JvmStatic* annotation. For this, we create a standard *Application* class and define a companion object inside where we can then create
a function annotated with *@JvmStatic*

Note: JvmStatic is an annotation in Kotlin which is used for interoperability with Java, so that the resulting method is defined as static when called from Java.

The other change needed for Spring Boot is to mark the class as open. Spring boot *@Configuration* classes cannot be final. Classes in Kotlin are final by default without the *open* modifier.

``` kotlin
@SpringBootApplication
open class Application {
    companion object {
        @JvmStatic fun main(args: Array<String>) {
            SpringApplication.run(Application::class.java, *args)
        }
    }
}
```

### Alternative Application class definition

In Java, the `main()` method of a Spring Boot application is conventionally defined within the annotated application class. This is because Java *does not* support top-level methods.
In Kotlin, however, we *do* have [top-level functions]({{ site.baseurl }}/docs/reference/functions.html). Thus, we can make the Spring main entry point much simpler:

```kotlin
@SpringBootApplication
open class Application

fun main(args: Array<String>) {
	SpringApplication.run(Application::class.java, *args)
}
```

The only requirement for this variant to work is to declare in your `build.gradle` file to look for *this* main function. This is done through the `mainClass` property of the `springBoot` section:


```groovy
springBoot {
    mainClass = 'my.package.YourMainClass'
}
```

In Kotlin, top-level functions are compiled into static members of an automatically-generated class. The name of this class is derived from the name of the source file. For instance, a top-level function in the `Application.kt` file would be defined in a class named `ApplicationKt`. You may add the following lines to your `build.gradle`:

```groovy
springBoot {
    mainClass = 'kotlin.demo.ApplicationKt'
}
```

### Running the application
We can now use the any of the standard Gradle tasks for Spring Boot to run the application. As such, running

        gradle bootRun

the application is compiled, resources bundled and launched, allowing us to access is via the browser (default port is 8080)

![Running App]({{ site.baseurl }}/{{ site.img_tutorial_root }}/spring-boot-restful/running-app.png)


