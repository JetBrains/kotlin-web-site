[//]: # (title: Add database support for Spring Boot project)
[//]: # (description: Add a database support for Sprint Boot project written in Kotlin using JDBC template.)

<tldr>
    <p>This is the third part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Add a data class to the Spring Boot project</a><br/><img src="icon-3.svg" width="20" alt="Third step"/> <strong>Add database support for Spring Boot project</strong><br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Use Spring Data CrudRepository for database access</p>
</tldr>

In this part of the tutorial, you'll add and configure a database to your project using _Java Database Connectivity_ (JDBC).
In JVM applications, you use JDBC to interact with databases.
For convenience, the Spring Framework provides the `JdbcTemplate` class that simplifies the use of JDBC and helps to avoid common errors.

## Add database support

The common practice in Spring Framework based applications is to implement the database access logic within the so-called _service_ layer – this is where business logic lives.
In Spring, you should mark classes with the `@Service` annotation to imply that the class belongs to the service layer of the application.
In this application, you will create the `MessageService` class for this purpose.

In the same package, create the `MessageService.kt` file and the `MessageService` class as follows:

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        db.update(
            "insert into messages values ( ?, ? )",
            message.id, message.text
        )
        return message
    }
}
```

<deflist collapsible="true">
   <def title="Constructor argument and dependency injection – (private val db: JdbcTemplate)">
      <p>A class in Kotlin has a primary constructor. It can also have one or more <a href="classes.md#secondary-constructors">secondary constructors</a>.
      The <i>primary constructor</i> is a part of the class header, and it goes after the class name and optional type parameters. In our case, the constructor is <code>(val db: JdbcTemplate)</code>.</p>
      <p><code>val db: JdbcTemplate</code> is the constructor's argument:</p>
      <code-block lang="kotlin">
      @Service
      class MessageService(private val db: JdbcTemplate)
      </code-block>
  </def>
   <def title="Trailing lambda and SAM conversion">
      <p>The <code>findMessages()</code> function calls the <code>query()</code> function of the <code>JdbcTemplate</code> class. The <code>query()</code> function takes two arguments: an SQL query as a String instance, and a callback that will map one object per row:</p>
      <code-block lang="sql">
      db.query("...", RowMapper { ... } )
      </code-block><br/>
      <p>The <code>RowMapper</code> interface declares only one method, so it is possible to implement it via lambda expression by omitting the name of the interface. The Kotlin compiler knows the interface that the lambda expression needs to be converted to because you use it as a parameter for the function call. This is known as <a href="java-interop.md#sam-conversions">SAM conversion in Kotlin</a>:</p>
      <code-block lang="sql">
      db.query("...", { ... } )
      </code-block><br/>
      <p>After the SAM conversion, the query function ends up with two arguments: a String at the first position, and a lambda expression at the last position. According to the Kotlin convention, if the last parameter of a function is a function, then a lambda expression passed as the corresponding argument can be placed outside the parentheses. Such syntax is also known as <a href="lambdas.md#passing-trailing-lambdas">trailing lambda</a>:</p>
      <code-block lang="sql">
      db.query("...") { ... }
      </code-block>
   </def>
   <def title="Underscore for unused lambda argument">
      <p>For a lambda with multiple parameters, you can use the underscore <code>_</code> character to replace the names of the parameters you don't use.</p>
      <p>Hence, the final syntax for query function call looks like this:</p>
      <code-block lang="kotlin">
      db.query("select * from messages") { response, _ ->
          Message(response.getString("id"), response.getString("text"))
      }
      </code-block>
   </def>
</deflist>

## Update the MessageController class

Update `MessageController.kt` to use the new `MessageService` class:

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = service.findMessages()

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }
}
```

<deflist collapsible="true">
   <def title="@PostMapping annotation">
      <p>The method responsible for handling HTTP POST requests needs to be annotated with <code>@PostMapping</code> annotation. To be able to convert the JSON sent as HTTP Body content into an object, you need to use the <code>@RequestBody</code> annotation for the method argument. Thanks to having Jackson library in the classpath of the application, the conversion happens automatically.</p>
   </def>
   <def title="ResponseEntity">
      <p><code>ResponseEntity</code> represents the whole HTTP response: status code, headers, and body.</p>
      <p> Using the <code>created()</code> method you configure the response status code (201) and set the location header indicating the context path for the created resource.</p>
   </def>
</deflist>

## Update the MessageService class

The `id` for `Message` class was declared as a nullable String:

```kotlin
data class Message(val id: String?, val text: String)
```

It would not be correct to store the `null` as an `id` value in the database though: you need to handle this situation gracefully.

Update your code of the `MessageService.kt` file to generate a new value when the `id` is `null`
while storing the messages in the database:

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.UUID

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id) // Return a copy of the message with the new id
    }
}
```

<deflist collapsible="true">
   <def title="Elvis operator – ?:">
      <p>The code <code>message.id ?: UUID.randomUUID().toString()</code> uses the <a href="null-safety.md#elvis-operator">Elvis operator (if-not-null-else shorthand) <code>?:</code></a>. If the expression to the left of <code>?:</code> is not <code>null</code>, the Elvis operator returns it; otherwise, it returns the expression to the right. Note that the expression on the right-hand side is evaluated only if the left-hand side is <code>null</code>.</p>
   </def>
</deflist>

The application code is ready to work with the database. It is now required to configure the data source.

## Configure the database

Configure the database in the application:

1. Create `schema.sql` file in the `src/main/resources` directory. It will store the database object definitions:

   ![Create database schema](create-database-schema.png){width=400}

2. Update the `src/main/resources/schema.sql` file with the following code:

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   It creates the `messages` table with two columns: `id` and `text`. The table structure matches the structure of the `Message` class.

3. Open the `application.properties` file located in the `src/main/resources` folder and add the following application properties:

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   These settings enable the database for the Spring Boot application.  
   See the full list of common application properties in the [Spring documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## Add messages to database via HTTP request

You should use an HTTP client to work with previously created endpoints. In IntelliJ IDEA, use the embedded HTTP client:

1. Run the application. Once the application is up and running, you can execute POST requests to store messages in the database.

2. Create the `requests.http` file in the project root folder and add the following HTTP requests:

   ```http request
   ### Post "Hello!"
   POST http://localhost:8080/
   Content-Type: application/json
   
   {
     "text": "Hello!"
   }
   
   ### Post "Bonjour!"
   
   POST http://localhost:8080/
   Content-Type: application/json
   
   {
     "text": "Bonjour!"
   }
   
   ### Post "Privet!"
   
   POST http://localhost:8080/
   Content-Type: application/json
   
   {
     "text": "Privet!"
   }
   
   ### Get all the messages
   GET http://localhost:8080/
   ```

3. Execute all POST requests. Use the green **Run** icon in the gutter next to the request declaration.
   These requests write the text messages to the database:

   ![Execute POST request](execute-post-requests.png)

4. Execute the GET request and see the result in the **Run** tool window:

   ![Execute GET requests](execute-get-requests.png)

### Alternative way to execute requests {initial-collapse-state="collapsed" collapsible="true"}

You can also use any other HTTP client or the cURL command-line tool. For example, run the following commands in
the terminal to get the same result:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## Retrieve messages by id

Extend the functionality of the application to retrieve the individual messages by id.

1. In the `MessageService` class, add the new function `findMessageById(id: String)` to retrieve the individual messages by id:

    ```kotlin
    // MessageService.kt
    package com.example.demo

    import org.springframework.stereotype.Service
    import org.springframework.jdbc.core.JdbcTemplate
    import org.springframework.jdbc.core.query
    import java.util.*
    
    @Service
    class MessageService(private val db: JdbcTemplate) {
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }.singleOrNull()
    
        fun save(message: Message): Message {
            val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
            db.update(
                "insert into messages values ( ?, ? )",
                id, message.text
            )
            return message.copy(id = id) // Return a copy of the message with the new id
        }
    }
    ```
    
    <deflist collapsible="true">
    <def title="vararg argument position in the parameter list">
        <p>The <code>query()</code> function takes three arguments:</p>
        <list>
            <li>SQL query string that requires a parameter to run</li>
            <li><code>id</code>, which is a parameter of type String</li>
            <li><code>RowMapper</code> instance is implemented by a lambda expression</li>
        </list>
        <p>The second parameter for the <code>query()</code> function is declared as a <i>variable argument</i> (<code>vararg</code>). In Kotlin, the position of the variable arguments parameter is not required to be the last in the parameters list.</p>
    </def>
    <def title="singleOrNull() function">
       <p>The <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html"><code>singleOrNull()</code></a> function returns a single element, or <code>null</code> if the array is empty or has more than one element.</p>
    </def>
   </deflist>
    
    > The `.query()` function that is used to fetch the message by its id is a [Kotlin extension function](extensions.md#extension-functions)
    > provided by the Spring Framework. It requires an additional import `import org.springframework.jdbc.core.query` as demonstrated in the code above.
    >
    {style="warning"}

2. Add the new `index(...)` function with the `id` parameter to the `MessageController` class:

    ```kotlin
    // MessageController.kt
    package com.example.demo

    import org.springframework.http.ResponseEntity
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PathVariable
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestBody
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController
    import java.net.URI
    
    @RestController
    @RequestMapping("/")
    class MessageController(private val service: MessageService) {
        @GetMapping
        fun listMessages() = ResponseEntity.ok(service.findMessages())
        
        @PostMapping
        fun post(@RequestBody message: Message): ResponseEntity<Message> {
            val savedMessage = service.save(message)
            return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
        }
        
        @GetMapping("/{id}")
        fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
            service.findMessageById(id).toResponseEntity()
        
        private fun Message?.toResponseEntity(): ResponseEntity<Message> =
            // If the message is null (not found), set response code to 404
            this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build() 
    }
    ```

    <deflist collapsible="true">
    <def title="Retrieving a value from the context path">
       <p>The message <code>id</code> is retrieved from the context path by the Spring Framework as you annotated the new function by <code>@GetMapping(&quot;/{id}&quot;)</code>. By annotating the function argument with <code>@PathVariable</code>, you tell the framework to use the retrieved value as a function argument. The new function makes a call to <code>MessageService</code> to retrieve the individual message by its id.</p>
    </def>
    <def title="Extension function with nullable receiver">
         <p>Extensions can be defined with a nullable receiver type. If the receiver is <code>null</code>, then <code>this</code> is also <code>null</code>. So when defining an extension with a nullable receiver type, it is recommended performing a <code>this == null</code> check inside the function body.</p>
         <p>You can also use the null-safe invocation operator (<code>?.</code>) to perform the null check as in the <code>toResponseEntity()</code> function above:</p>
         <code-block lang="kotlin">
         this?.let { ResponseEntity.ok(it) }
         </code-block>
    </def>
    <def title="ResponseEntity">
        <p><code>ResponseEntity</code> represents the HTTP response, including the status code, headers, and body. It is a generic wrapper that allows you to send customized HTTP responses back to the client with more control over the content.</p>
    </def>
    </deflist>

Here is a complete code of the application:

```kotlin
// DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }.singleOrNull()

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString()
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = ResponseEntity.ok(service.findMessages())

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }

    @GetMapping("/{id}")
    fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
        service.findMessageById(id).toResponseEntity()

    private fun Message?.toResponseEntity(): ResponseEntity<Message> =
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## Run the application

The Spring application is ready to run:

1. Run the application again.

2. Open the `requests.http` file and add the new GET request:

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. Execute the GET request to retrieve all the messages from the database.

4. In the **Run** tool window copy one of the ids and add it to the request, like this:

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f910aa7e-11ee-4215-93ed-1aeeac822707
    ```
    
    > Put your message id instead of the mentioned above.
    >
    {style="note"}

5. Execute the GET request and see the result in the **Run** tool window:

    ![Retrieve message by its id](retrieve-message-by-its-id.png){width=706}

## Next step

The final step shows you how to use more popular connection to database using Spring Data. 

**[Proceed to the next chapter](jvm-spring-boot-using-crudrepository.md)**
