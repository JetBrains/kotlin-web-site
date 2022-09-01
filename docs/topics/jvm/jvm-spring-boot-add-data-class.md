[//]: # (title: Add a data class to Spring Boot project)

<microformat>
    <p>This is the second part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>Add a data class to the Spring Boot project</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Add database support for Spring Boot project<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Use Spring Data CrudRepository for database access</p>
</microformat>

Let’s add some more functionality to the application and discover more Kotlin language features. It requires changing the `MessageResource` controller class to respond with a JSON document containing a collection of serialized objects.

## Update your application

1. In the `DemoApplication.kt` file, create a `Message` data class with two properties: `id` and `text`:

    ```kotlin
    data class Message(val id: String?, val text: String)
    ```

   `Message` class will be used for data transfer: a list of serialized `Message` objects will make up the JSON document that the controller is going to respond to the browser request.

   <deflist collapsible="true">
       <def title="Data classes – data class Message">
          <p>The main purpose of <a href="data-classes.md">data classes</a> in Kotlin is to hold data. Such classes are marked with <code>data</code> keyword and some standard functionality and some utility functions are often mechanically derivable from the class structure.</p>
          <p>In this example, you declared <code>Message</code> as a data class as its main purpose is to store the data.</p>
       </def>
       <def title="val and var properties">
          <p><a href="properties.md">Properties in Kotlin</a> classes can be declared either as:</p>
          <list>
              <ul>
                <li><i>mutable</i>, using the <code>var</code> keyword</li>
                <li><i>read-only</i>, using the <code>val</code> keyword</li>
              </ul>
          </list>
          <p>The <code>Message</code> class declares two properties using <code>val</code> keyword, the <code>id</code> and <code>text</code>.
          The compiler will automatically generate the getters for both these properties.
          However, it will not be possible to reassign the values of those properties after an instance of the <code>Message</code> class is created.
          </p>
       </def>
       <def title="Nullable types – String?">
          <p>Kotlin provides <a href="null-safety.md#nullable-types-and-non-null-types">built-in support for nullable types</a>. In Kotlin, the type system distinguishes between references that can hold <code>null</code> (<i>nullable references</i>) and those that cannot (<i>non-null references</i>).<br/>
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
2. In the same file, amend the `index()` function of a `MessageResource` class to return a list of `Message` objects:

    ```kotlin
    @RestController
    class MessageResource {
        @GetMapping
        fun index() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="Collections – listOf()">
          <p>The Kotlin Standard Library provides implementations for basic collection types: sets, lists, and maps.<br/>
          A pair of interfaces represent each collection type:</p>
          <list>
            <ul>
              <li>A <i>read-only</i> interface that provides operations for accessing collection elements.</li>
              <li>A <i>mutable</i> interface that extends the corresponding read-only interface with write operations: adding, removing, and updating its elements.</li>
            </ul>
          </list>
          <p>The corresponding factory functions are also provided by the Kotlin Standard Library to create instances of such collections.
          </p>
          <p>In this tutorial, you use <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> function to create a list of <code>Message</code> objects.
          This is a factory function to create a <i>read-only</i> list of objects: you can’t add or remove elements from the list.<br/>
          If it is required to perform write operations on the list, call the <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> function to create a mutable list instance.
          </p>
       </def>
       <def title="Trailing comma">
          <p>A <a href="coding-conventions.md#trailing-commas">trailing comma</a> is a comma symbol after the <strong>last item</strong> of a series of elements:
            <code style="block" lang="kotlin">
            Message("3", "Privet!"),
            </code>
          This is a convenient feature of Kotlin syntax and is entirely optional – your code will still work without them.
          </p>
          <p>In the example above, creating a list of <code>Message</code> objects includes the trailing comma after the <code>listOf()</code> function argument.</p>
       </def>
    </deflist>

The response from `MessageResource` will now be a JSON document containing a collection of `Message` objects.

Any controller in the Spring application renders JSON response by default if Jackson library is on the classpath.
As you specified `spring-boot-starter-web` dependency specified in `build.gradle.kts` file, you received Jackson as a _transitive_ dependency.
Hence the application responds with a JSON document if the endpoint returns a data structure that can be serialized to JSON.

Here is a complete code of the `DemoApplication.kt`:

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping
    fun index() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

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

## What's next

[Proceed to the next chapter](jvm-spring-boot-add-db-support.md)