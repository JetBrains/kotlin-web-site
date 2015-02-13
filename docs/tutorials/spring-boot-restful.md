---
type: tutorial
layout: tutorial
title:  "Creating a RESTful Web Service with Spring Boot"
description: "This tutorial walks us through the process of creating a simple REST controller with Spring Boot"
authors: Hadi Hariri, Edoardo Vacchi
showAuthorInfo: true
date: 2015-01-28
source: spring-boot-restful
---
Kotlin works quite smoothly with Spring Boot and many of the steps found on the [Spring Guides](https://spring.io/guides) for creating a RESTful service
can be followed verbatim for Kotlin. There are some minor differences however when it comes to defining the Gradle configuration
and the project layout structure, as well as the initialization code.

In this tutorial we'll walk through the steps required. For a more thorough explanation of Spring Boot and RESTful services, please see
[Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/).

### Defining the project and dependencies
{{ site.text_using_gradle }}

The Gradle file is pretty much standard for Spring Boot. The only difference is the structure layout for source folders for Kotlin, and the required Kotlin dependencies

``` groovy
buildscript {
    ext.kotlin_version = '0.10.195'  // New
    repositories {
        maven { url "https://repo.spring.io/libs-release" }
        mavenLocal()
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"  // New
        classpath("org.springframework.boot:spring-boot-gradle-plugin:1.1.10.RELEASE")
    }
}

apply plugin: 'java'
apply plugin: 'eclipse'
apply plugin: 'idea'
apply plugin: 'kotlin' // New
apply plugin: 'spring-boot'

jar {
    baseName = 'gs-rest-service'
    version =  '0.1.0'
}

repositories {
    mavenLocal()
    mavenCentral()
    maven { url "https://repo.spring.io/libs-release" }
}

// New entire sourceSets
sourceSets {
    main {
        kotlin {
            srcDir "src/main/kotlin"
        }
    }
    test {
        kotlin {
            srcDir "test/main/kotlin"
        }
    }
}

dependencies {
    compile("org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version") // New
    compile("org.springframework.boot:spring-boot-starter-web")
    testCompile("junit:junit")
}

task wrapper(type: Wrapper) {
    gradleVersion = '1.11'
}
```

### Creating a Greeting Data Class and Controller
The next step is to create Greeting Data class that has two properties: *id* and a *content*

``` kotlin
data public class Greeting(val id: Long, val content: String)
```

We now define the *GreetingController* which serves requests of the form */greeting?name={value}* and returns a JSON object
representing an instance of *Greeting*

``` kotlin
RestController
public class GreetingController {

    val counter = AtomicLong()

    RequestMapping(array("/greeting"))
    public fun greeting(RequestParam(value = "name", defaultValue = "World") name: String): Greeting {
        return Greeting(counter.incrementAndGet(), "Hello, $name")
    }
}
```

As can be seen, this is again pretty much a one-to-one translation of Java to Kotlin, with nothing special required for Kotlin.

### Creating the Application class
Finally we need to define an Application class. As Spring Boot looks for a public static main method, we need to define this in Kotlin
using the *platformStatic* attribute. For this, we create a standard *Application* class and define a class object inside where we can then create
a function decorated with *platformStatic*

Note: platformStatic is an annotation in Kotlin which is used for interoperability with Java, so that the resulting method is defined as static when called from Java.

``` kotlin
ComponentScan
EnableAutoConfiguration
public class Application {
    class object {
        platformStatic public fun main(args: Array<String>) {
            SpringApplication.run(javaClass<Application>(), *args)
        }
    }
}
```

### Alternative Application class definition

In Java, the `main()` method of a Spring Boot application is conventionally defined within the annotated application class. This is because Java *does not* support top-level methods.
In Kotlin, however, we *do* have [top-level functions]({{ site.baseurl }}/docs/reference/functions.html). Thus, we can make the Spring main entry point much simpler:

```kotlin
ComponentScan
EnableAutoConfiguration
public class Application

public fun main(args: Array<String>) {
	SpringApplication.run(javaClass<Application>(), *args)
}
```

The only requirement for this variant to work is to declare in your `build.gradle` file to look for *this* main function. This is done through the `mainClass` property of the `springBoot` section:


```groovy
springBoot {
    mainClass = 'my.package.YourMainClass'
}
```

In Kotlin, top-level functions are compiled into static members of an automatically-generated class. The name of this class is derived from the name of the package. For instance, a top-level function in the `com.example` package would be defined in a class named `com.example.ExamplePackage`. In our case, because we did not declare a package explicitly, the function is defined in the so-called *default* package; thus, the special  class `_DefaultPackage`  is defined. You may add the following lines to your `build.gradle`:

```groovy
springBoot {
    mainClass = '_DefaultPackage'
}
```

### Running the application
We can now use the any of the standard Gradle tasks for Spring Boot to run the application. As such, running

        gradle bootRun

the application is compiled, resources bundled and launched, allowing us to access is via the browser (default port is 8080)

![Running App]({{ site.baseurl }}/{{ site.img_tutorial_root }}/spring-boot-restful/running-app.png)


