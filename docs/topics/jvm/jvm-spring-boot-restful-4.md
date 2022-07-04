[//]: # (title: Add a data class to Spring Boot project)

<microformat>
    <p>This is a part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><a href="jvm-spring-boot-restful-2.md">Create a Spring Boot project with Kotlin</a><br/><a href="jvm-spring-boot-restful-3.md">Add an HTTP request controller to your Spring Boot project</a><br/><strong>Add a data class to Spring Boot project</strong><br/>Add database support for Spring Boot project<br/>Wrap up your project</p>
</microformat>

## Create a data class

Let’s add some more functionality to the application and discover more Kotlin language features. We are going to change the `MessageResource` controller class to respond with a JSON document containing a collection of serialized objects.

In the `DemoApplication.kt` file, create a `Message` data class with two properties: `id` and `text`:

```kotlin
data class Message(val id: String?, val text: String)
```

We are going to use the `Message` class for data transfer. A list of serialized `Message` objects will make up the JSON document that the controller is going to respond to the browser request.
In the same file, amend the `index()` function of a `MessageResource` class to return a list of `Message` objects.

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

* **Data classes**  
  The main purpose of data classes in Kotlin is to hold data. Such classes are marked with data keyword and some standard functionality and some utility functions are often mechanically derivable from the class structure.
  
  In our example, we declared `Message` as a data class as its main purpose is to store the data.

* **Properties**
  Properties in Kotlin classes can be declared either as mutable, using the `var` keyword, or as read-only, using the `val` keyword.
  
  The `Message` class declares two properties using `val` keyword, the `id` and `text`.
  The compiler will automatically generate the getters for both these properties.
  However, it will not be possible to reassign the values of those properties after an instance of the `Message` class is created.

* **Nullable types**
  Kotlin provides built-in support for nullable types. In Kotlin, the type system distinguishes between references that can hold `null` (nullable references) and those that cannot (non-null references).
  For example, a regular variable of type `String` cannot hold `null`. To allow nulls, you can declare a variable as a nullable string by writing `String?`.

  The `id` property of the `Message` class is declared as a nullable type this time.
  Hence, it is possible to create an instance of `Message` class by passing `null` as a value for `id`:

  ```kotlin
  Message(null, "Hello!")
  ```
  
* **Collections**
  The Kotlin Standard Library provides implementations for basic collection types: sets, lists, and maps.
  A pair of interfaces represent each collection type.
  A read-only interface that provides operations for accessing collection elements.
  A mutable interface that extends the corresponding read-only interface with write operations: adding, removing, and updating its elements.
  The corresponding factory functions are also provided by the Kotlin Standard Library to create instances of such collections.

  In our example, we use `listOf()` function to create a list of `Message` objects.
  This is a factory function to create an read-only list of objects.
  Hence we can’t add or remove elements from the list.
  If it is required to perform write operations on the list, `mutableListOf()` function should be called to create a mutable list instance.

* **Trailing comma**
  A trailing comma is a comma symbol after the last item of a series of elements.
  This is a convenient feature of Kotlin syntax and is entirely optional – your code will still work without them.

  In the example above, creating a list of `Message` objects includes the trailing comma after the `listOf()` function argument.

## Write a JSON response

The response from `MessageResource` will now be a JSON document containing a collection of `Message` objects.
Any controller in the Spring application renders JSON response by default if Jackson library is on the classpath.
We received Jackson as a transitive dependency via `spring-boot-starter-web` dependency specified in `build.gradle.kts` file.
Hence the application responds with a JSON document if the endpoint returns a data structure that can be serialized to JSON.

## Run the application

The application is now ready to run:

Click the green Run icon in the gutter beside the `main()` method.

It works!

## What's next

You ready to upgrade the project: [proceed to the next chapter](jvm-spring-boot-restful-5.md)