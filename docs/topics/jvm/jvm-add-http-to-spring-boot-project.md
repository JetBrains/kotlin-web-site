[//]: # (title: Add an HTTP request controller to your Spring Boot project)

<microformat>
    <p>This is a part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><strong>Add an HTTP request controller to your Spring Boot project</strong><br/>Add a data class to Spring Boot project<br/>Add database support for Spring Boot project<br/>Wrap up your project</p>
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

<deflist collapsible="true">
   <def title="`@RestController` annotation">
      The first thing we need to do is tell Spring that <code>MessageResource</code> is a REST Controller, so we marked it with the <code>@RestController</code> annotation.
      This annotation means this class will be picked up by the component scan because it's in the same package as our <code>DemoApplication</code>> class.
   </def>
   <def title="`@GetMapping` annotation">
      <p>It marks the functions of the REST controller that implement the endpoints corresponding to HTTP GET calls:</p>
      <code style="block" lang="kotlin">
      @GetMapping
      fun index(@RequestParam("name") name: String) = "Hello, $name!"
      </code>
   </def>
   <def title="`@RequestParam` annotation">
      <p>The function parameter is marked with <code>@RequestParam</code> annotation.</p>
      <list>
         <ul>
            <li>This annotation indicates that a method parameter should be bound to a web request parameter.</li>
            <li>Hence, if we access the application at the root (“/”) and supply a request parameter called “name” the parameter value will be used as an argument for invoking the index function.</li>
         </ul>
      </list>
   </def>
   <def title="Single-expression functions">
      <p>Since the <code>index()</code> function contains only one statement we can declare it as a <a href="functions.md#single-expression-functions">single-expression function</a>.</p>
      <p>This means the curly braces can be omitted and the body is specified after a "=" symbol.</p>
   </def>
   <def title="Type inference for function return types">
      <p>The index function does not declare the return type explicitly.</p>
      <p>Instead, the compiler infers the return type by looking at the result of the statement on the right-hand side from the equals sign (=).</p>
      <p>The type of <code>Hello, $name!</code> expression is String, hence the return type of the function is also String.</p>
   </def>
   <def title="String templates">
      <p><code>Hello, $name!</code> expression is called a <a href="basic-types.md#string-templates"><i>String template</i></a> in Kotlin.</p>
      <p>String templates are String literals that contain embedded expressions.</p>
      <p>This is a convenient replacement for String concatenation operations.</p>
   </def>
</deflist>

## Run the application

The application is now ready to run:

Click the green Run icon in the gutter beside the `main()` method:

![Run Spring Boot application](run-spring-boot-application.png)

> You can also run the ./gradlew bootRun command in the terminal.
> 
{type="tip"}

Once the application starts, open the following URL: [http://localhost:8080?name=John](http://localhost:8080?name=John).   
You should see “Hello, John!” printed as a response.

## What's next

You ready to upgrade the project: [proceed to the next chapter](jvm-spring-boot-add-data-class.md)