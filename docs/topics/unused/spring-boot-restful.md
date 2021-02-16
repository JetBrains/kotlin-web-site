[//]: # (title: Creating a RESTful Web Service with Spring Boot)

Kotlin works quite smoothly with Spring Boot and many of the steps found on the [Spring Guides](https://spring.io/guides) for creating a RESTful service
can be followed verbatim for Kotlin. There are some minor differences however when it comes to defining the Gradle configuration
and the project layout structure, as well as the initialization code.

In this tutorial we'll walk through the steps required. For a more thorough explanation of Spring Boot and Kotlin, please see
[Building web applications with Spring Boot and Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin/).

Note that all classes in this tutorial are in the `org.jetbrains.kotlin.demo` package.

### Defining the project and dependencies
{{ site.text_using_gradle }}

The Gradle file is pretty much standard for Spring Boot. The only differences are the structure layout for source folders for Kotlin, the required Kotlin dependencies and the *kotlin-spring* Gradle plugin (CGLIB proxies used for example for `@Configuration` and `@Bean` processing require `open` classes).

``` groovy
buildscript {
    ext.kotlin_version = '%kotlinVersion%' // Required for Kotlin integration
    ext.spring_boot_version = '2.1.0.RELEASE'
    repositories {
        jcenter()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version" // Required for Kotlin integration
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version" 
        classpath "org.springframework.boot:spring-boot-gradle-plugin:$spring_boot_version"
    }
}

apply plugin: 'kotlin' // Required for Kotlin integration
apply plugin: "kotlin-spring" 
apply plugin: 'org.springframework.boot'
apply plugin: 'io.spring.dependency-management'

jar {
    baseName = 'gs-rest-service'
    version = '0.1.0'
}

repositories {
    jcenter()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version" // Required for Kotlin integration
    compile "org.springframework.boot:spring-boot-starter-web"
    testCompile('org.springframework.boot:spring-boot-starter-test')
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

    @GetMapping("/greeting")
    fun greeting(@RequestParam(value = "name", defaultValue = "World") name: String) =
            Greeting(counter.incrementAndGet(), "Hello, $name")

}
```

As can be seen, this is again pretty much a one-to-one translation of Java to Kotlin, with nothing special required for Kotlin.

### Creating the Application class
Finally we need to define an Application class. As Spring Boot looks for a public static main method, we need to define this in Kotlin. It could be done with the *@JvmStatic* annotation and a companion object but here we prefer using a [top-level function]({{ url_for('page', page_path="docs/reference/functions") defined outside Application class since it leads to more concise and clean code.

No need to mark the Application class as *open* since we are using the *kotlin-spring* Gradle plugin which does that automatically.

``` kotlin
@SpringBootApplication
class Application

fun main(args: Array<String>) {
    SpringApplication.run(Application::class.java, *args)
}
```

### Running the application
We can now use any of the standard Gradle tasks for Spring Boot to run the application. As such, running

    ./gradlew bootRun

the application is compiled, resources bundled and launched, allowing us to access it via the browser (default port is 8080)

![Running App](running-app.png)

