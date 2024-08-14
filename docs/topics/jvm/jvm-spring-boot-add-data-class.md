[//]: # (title: Add a data class to Spring Boot project)
[//]: # (description: Add a Kotlin data class to Spring Boot project.)

<microformat>
    <p>This is the second part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Add a data class to the Spring Boot project</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Add database support for Spring Boot project<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Use Spring Data CrudRepository for database access</p>
</microformat>

In this part of the tutorial, you'll add some more functionality to the application and discover more Kotlin language features, such as data classes.
It requires changing the `MessageController` class to respond with a JSON document containing a collection of serialized objects.

## Update your application

1. In the same package, create a `Message` data class with two properties: `id` and `text`:

    ```kotlin
    data class Message(val id: String?, val text: String)
    ```

   `Message` class will be used for data transfer: a list of serialized `Message` objects will make up the JSON document that the controller is going to respond to the browser request.

   <deflist collapsible="true">
       <def title="Data classes – data class Message">
          <p>The main purpose of <a href="data-classes.md">data classes</a> in Kotlin is to hold data. Such classes are marked with the <code>data</code> keyword, and some standard functionality and some utility functions are often mechanically derivable from the class structure.</p>
          <p>In this example, you declared <code>Message</code> as a data class as its main purpose is to store the data.</p>
       </def>
       <def title="val and var properties">
          <p><a href="properties.md">Properties in Kotlin</a> classes can be declared either as:</p>
          <list>
             <li><i>mutable</i>, using the <code>var</code> keyword</li>
             <li><i>read-only</i>, using the <code>val</code> keyword</li>
          </list>
          <p>The <code>Message</code> class declares two properties using <code>val</code> keyword, the <code>id</code> and <code>text</code>.
          The compiler will automatically generate the getters for both of these properties.
          It will not be possible to reassign the values of these properties after an instance of the <code>Message</code> class is created.
          </p>
       </def>
       <def title="Nullable types – String?">
          <p>Kotlin provides <a href="null-safety.md#nullable-types-and-non-nullable-types">built-in support for nullable types</a>. In Kotlin, the type system distinguishes between references that can hold <code>null</code> (<i>nullable references</i>) and those that cannot (<i>non-nullable references</i>).<br/>
          For example, a regular variable of type <code>String</code> cannot hold <code>null</code>. To allow nulls, you can declare a variable as a nullable string by writing <code>String?</code>.
          </p>
          <p>The <code>id</code> property of the <code>Message</code> class is declared as a nullable type this time.
          Hence, it is possible to create an instance of <code>Message</code> class by passing <code>null</code> as a value for <code>id</code>:
          </p>
          <code style="block" lang="kotlin">
          Message(null, "Hello!")
          </code>
       </def>
   </deflist>
2. In the same file, instead of the `index()` function, let's create add `listMessages()` function returning a list of `Message` objects:

    ```kotlin
    @RestController
    @RequestMapping("/")
    class MessageController {
        @GetMapping
        fun listMessages() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="Collections – listOf()">
          <p>The Kotlin Standard Library provides implementations for basic collection types: sets, lists, and maps.<br/>
          A pair of interfaces represents each collection type:</p>
          <list>
              <li>A <i>read-only</i> interface that provides operations for accessing collection elements.</li>
              <li>A <i>mutable</i> interface that extends the corresponding read-only interface with write operations: adding, removing, and updating its elements.</li>
          </list>
          <p>The corresponding factory functions are also provided by the Kotlin Standard Library to create instances of such collections.
          </p>
          <p>In this tutorial, you use the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> function to create a list of <code>Message</code> objects.
          This is the factory function to create a <i>read-only</i> list of objects: you can't add or remove elements from the list.<br/>
          If it is required to perform write operations on the list, call the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> function to create a mutable list instance.
          </p>
       </def>
       <def title="Trailing comma">
          <p>A <a href="coding-conventions.md#trailing-commas">trailing comma</a> is a comma symbol after the <b>last item</b> of a series of elements:
            <code style="block" lang="kotlin">
            Message("3", "Privet!"),
            </code>
          This is a convenient feature of Kotlin syntax and is entirely optional – your code will still work without them.
          </p>
          <p>In the example above, creating a list of <code>Message</code> objects includes the trailing comma after the last <code>listOf()</code> function argument.</p>
       </def>
    </deflist>

The response from `MessageController` will now be a JSON document containing a collection of `Message` objects.

> Any controller in the Spring application renders JSON response by default if Jackson library is on the classpath.
> As you [specified the `spring-boot-starter-web` dependency in the `build.gradle.kts` file](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file), you received Jackson as a _transitive_ dependency.
> Hence, the application responds with a JSON document if the endpoint returns a data structure that can be serialized to JSON.
>
{type="note"}

Here is the complete code of your application:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
   runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed"}

```kotlin
package demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
   @GetMapping
   fun listMessages() = listOf(
      Message("1", "Hello!"),
      Message("2", "Bonjour!"),
      Message("3", "Privet!"),
   )
}
```
{initial-collapse-state="collapsed"}

```kotlin
package demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed"}

## Run the application

The Spring application is ready to run:

1. Run the application again.

2. Once the application starts, open the following URL:

    ```text
    http://localhost:8080
    ```

    You will see a page with a collection of messages in JSON format:

    ![Run the application](messages-in-json-format.png){width=800}

## Next step

In the next part of the tutorial, you'll add and configure a database to your project, and make HTTP requests.

**[Proceed to the next chapter](jvm-spring-boot-add-db-support.md)**