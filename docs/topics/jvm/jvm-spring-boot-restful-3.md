[//]: # (title: Add an HTTP request controller to your Spring Boot project)

<microformat>
    <p>This is a part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><a href="jvm-spring-boot-restful-2.md">Create a Spring Boot project with Kotlin</a><br/><strong>Add an HTTP request controller to your Spring Boot project</strong><br/>Add a data class to Spring Boot project<br/>Add database support for Spring Boot project<br/>Wrap up your project</p>
</microformat>

## Create a controller

In the Spring application, a controller is used to handle the web requests.

In the `DemoApplication.kt` file, create the `MessageResource` class as follows:

```kotlin
@RestController
class MessageResource {
    @GetMapping
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```

* **`@RestController` annotation**  
  The first thing we need to do is tell Spring that `MessageResource` is a REST Controller, so we marked it with the `@RestController` annotation.
  This annotation means this class will be picked up by the component scan because it's in the same package as our `DemoApplication` class.

* **`@GetMapping` annotation**
  It marks the functions of the REST controller that implement the endpoints corresponding to HTTP GET calls:

  ```kotlin
  @GetMapping
  fun index(@RequestParam("name") name: String) = "Hello, $name!"
  ```

* **`@RequestParam` annotation**
  The function parameter is marked with @RequestParam annotation.
* This annotation indicates that a method parameter should be bound to a web request parameter.
* Hence, if we access the application at the root (“/”) and supply a request parameter called “name” the parameter value will be used as an argument for invoking the index function.

* **Single-expression functions**
  Since the `index()` function contains only one statement we can declare it as a single-expression function.
  This means the curly braces can be omitted and the body is specified after a "=" symbol.

* **Type inference for function return types**
  The index function does not declare the return type explicitly.
  Instead, the compiler infers the return type by looking at the result of the statement on the right-hand side from the equals sign (=).
  The type of `Hello, $name!` expression is String, hence the return type of the function is also String.

* **String templates**
  `Hello, $name!` expression is called a _String template_ in Kotlin.
  String templates are String literals that contain embedded expressions.
  This is a convenient replacement for String concatenation operations.

## Run the application

The application is now ready to run:

Click the green Run icon in the gutter beside the `main()` method.

It works!

## What's next

You ready to upgrade the project: [proceed to the next chapter](jvm-spring-boot-restful-4.md)