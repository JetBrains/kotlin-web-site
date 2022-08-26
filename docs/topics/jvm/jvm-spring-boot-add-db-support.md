[//]: # (title: Add database support for Spring Boot project)

<microformat>
    <p>This is the third part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Add a data class to the Spring Boot project</a><br/><img src="icon-3.svg" width="20" alt="Third step"/> <strong>Add database support for Spring Boot project</strong><br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Use Spring Data CrudRepository for database access</p>
</microformat>

## Add database support

In JVM applications, you use JDBC to interact with databases. For convenience, Spring Framework provides `JdbcTemplate` class that simplifies the use of JDBC and helps to avoid common errors.

The common practice in Spring Framework based applications is to implement the database access logic within the so-called _service_ layer – this is where business logic lives.
In Spring, you should mark classes with the `@Service` annotation to imply that the class belongs to the service layer of the application.
In this application, you will create the `MessageService` class for this purpose.

In `DemoApplication.kt` file, create `MessageService` class as follows:

```kotlin
import org.springframework.stereotype.Service

@Service
class MessageService(val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { rs, _ ->
        Message(rs.getString("id"), rs.getString("text"))
    }

    fun save(message: Message){
        db.update("insert into messages values ( ?, ? )",
           message.id, message.text)
    }
}
```

<deflist collapsible="true">
   <def title="Constructor argument and dependency injection – (val db: JdbcTemplate)">
      <p>A class in Kotlin can have a primary constructor and one or more <a href="classes.md#secondary-constructors">secondary constructors</a>.
      The <i>primary constructor</i> is a part of the class header, and it goes after the class name and optional type parameters. In our case, the constructor is <code>(val db: JdbcTemplate)</code>.</p>
      <p><code>val db: JdbcTemplate</code> is the constructor’s argument:</p>
      <code style="block" lang="kotlin">
      @Service
      class MessageService(val db: JdbcTemplate)
      </code>
  </def>
   <def title="Trailing lambda and SAM conversion">
      <p>The <code>findMessages()</code> function calls the <code>query()</code> function of <code>JdbcTemplate</code> class. The <code>query()</code> function takes two arguments: the SQL query as a String instance, and a callback that will map one object per row:</p>
      <code style="block" lang="sql">
      db.query("...", RowMapper { ... } )
      </code><br/>
      <p>The <code>RowMapper</code> interface declares only one method, so it is possible to implement it via lambda expression by omitting the name of the interface. The Kotlin compiler knows the interface that the lambda expression needs to be converted to because you use it as a parameter for the function call. This is known as <a href="java-interop.md#sam-conversions">SAM conversion in Kotlin</a>:</p>
      <code style="block" lang="sql">
      db.query("...", { ... } )
      </code><br/>
      <p>After SAM conversion, the query function ends up with two arguments: a String at the first position, and a lambda expression at the last position. According to the Kotlin convention, if the last parameter of a function is a function, then a lambda expression passed as the corresponding argument can be placed outside the parentheses. Such syntax is also known as <a href="lambdas.md#passing-trailing-lambdas">trailing lambda</a>:</p>
      <code style="block" lang="sql">
      db.query("...") { ... }
      </code>
   </def>
   <def title="Underscore for unused lambda argument">
      <p>For a lambda with multiple parameters, you can use the underscore <code>_</code> character to replace the names of the parameters you don't use.</p>
      <p>Hence, the final syntax for query function call looks like this:</p>
      <code style="block" lang="kotlin">
      db.query("select * from messages") { rs, _ ->
          Message(rs.getString("id"), rs.getString("text"))
      }
      </code>
   </def>
</deflist>

## Update the MessageController class

Update `MessageController` to use the new `MessageService` class:

```kotlin
@RestController
class MessageController(val service: MessageService) {
    @GetMapping
    fun index(): List<Message> = service.findMessages()

    @PostMapping
    fun post(@RequestBody message: Message) {
       service.save(message)
    }
}

```

<deflist collapsible="true">
   <def title="@PostMapping annotation">
      <p>The method responsible for handling HTTP POST requests needs to be annotated with <code>@PostMapping</code> annotation. To be able to convert the JSON sent as HTTP Body content into an object, you need to use the <code>@RequestBody</code> annotation for the method argument. Thanks to having Jackson library in the classpath of the application the conversion happens automatically.</p>
   </def>
</deflist>

## Update the MessageService class

The `id` for `Message` class was declared as a nullable String:

```kotlin
data class Message(val id: String?, val text: String)
```

It would not be correct to store the `null` as an `id` value in the database though: you need to handle this situation gracefully.  

Generate a new value when the `id` is `null` while storing the messages in the database:

```kotlin
@Service
class MessageService(val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { rs, _ ->
        Message(rs.getString("id"), rs.getString("text"))
    }

    fun save(message: Message){
        val id = message.id ?: UUID.randomUUID().toString()
        db.update("insert into messages values ( ?, ? )",
                  id, message.text)
    } 
}
```

<deflist collapsible="true">
   <def title="Elvis operator – ?:">
      <p>The code <code>message.id ?: UUID.randomUUID().toString()</code> uses the <a href="null-safety.md#elvis-operator">Elvis operator (if-not-null-else shorthand) <code>?:</code></a>. If the expression to the left of <code>?:</code> is not <code>null</code>, the Elvis operator returns it, otherwise, it returns the expression to the right. Note that the expression on the right-hand side is evaluated only if the left-hand side is <code>null</code>.</p>
   </def>
</deflist>

The application code is ready to work with the database. It is now required to configure the data source.

## Configure the database

Configure the database in the application:

1. Create `schema.sql` file in the `src/main/resources` directory. It will store the database object definitions:

   ![Create database schema](create-database-schema.png){width=400}

2. Update the `src/main/resources/sql/schema.sql` file with the following code:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   It creates the `messages` table with two columns: `id` and `text`. The table structure matches the structure of the `Message` class.

3. Open the `application.properties` file located in the `src/main/resources` folder and add the following application properties:

   ```properties
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   These settings enable the database for the Spring Boot application.  
   See the full list of common application properties in the [Spring documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html).

## Add messages to database via HTTP request

You should use an HTTP client to work with previously created endpoints. In IntelliJ IDEA, use the embedded HTTP client:

1. Run the application. Once the application is up and running, you can execute POST requests to store messages in the database.
   Create the `requests.http` file and add the following HTTP requests:

   ```http request
   ### Post 'Hello!"
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

2. Execute all POST requests. Use the green **Run** icon in the gutter next to the request declaration.
   These requests write the text messages to the database:

   ![Execute POST request](execute-post-requests.png)

3. Execute the GET request and see the result in the Run tool window:

   ![Execute GET requests](execute-get-requests.png)

### Alternative way to execute requests {initial-collapse-state="collapsed"}

You can also use any other HTTP client or cURL command-line tool. For example, you can run the following commands in
the terminal to get the same result:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## Retrieve messages by id

Extend the functionality of the application to retrieve the individual messages by id.

1. In `MessageService` class, add new function `findMessageById(id: String)` to retrieve the individual messages by id:

    ```kotlin
    import org.springframework.jdbc.core.query
    
    @Service
    class MessageService(val db: JdbcTemplate) {
    
        fun findMessages(): List<Message> = db.query("select * from messages") { rs, _ ->
            Message(rs.getString("id"), rs.getString("text"))
        }
    
        fun findMessageById(id: String): List<Message> = db.query("select * from messages where id = ?", id) { rs, _ ->
            Message(rs.getString("id"), rs.getString("text"))
        }
    
        fun save(message: Message) {
            val id = message.id ?: UUID.randomUUID().toString()
            db.update("insert into messages values ( ?, ? )", 
                      id, message.text)
        }
    }
    ```
   
    > The `query()` function that used to fetch the message by its id is a [Kotlin extension function](extensions.md#extension-functions) provided by the Spring Framework and requires an additional import as in the code above.
    >
    {type="note"}

2. Add new `index(...)` function with `id` parameter to `MessageController` class:

    ```kotlin
    @RestController
    class MessageController(val service: MessageService) {
        @GetMapping
        fun index(): List<Message> = service.findMessages()
    
        @GetMapping("/{id}")
        fun index(@PathVariable id: String): List<Message> =
            service.findMessageById(id)
    
        @PostMapping
        fun post(@RequestBody message: Message) {
            service.save(message)
        }
    }
    ```

    <deflist collapsible="true">
    <def title="Retrieving a value from the context path">
       <p>The message <code>id</code> is retrieved from the context path by the Spring Framework as you annotated the new function by <code>@GetMapping(&quot;/{id}&quot;)</code>. By annotating the function argument with <code>@PathVariable</code> you tell the framework to use the retrieved value as a function argument. The new function makes a call to <code>MessageService</code> to retrieve the individual message by its id.</p>
    </def>
    <def title="vararg argument position in the parameter list">
        <p>The <code>query()</code> function takes 3 arguments:</p>
        <list>
        <ul>
            <li>SQL query string that requires a parameter to run</li>
            <li>The id, which is a parameter of type String</li>
            <li>And the <code>RowMapper</code> instance is implemented by a lambda expression</li>
        </ul>
        </list>
        <p>The second parameter for the <code>query()</code> function is declared as a <i>variable argument</i> (<code>vararg</code>). In Kotlin, the position of the variable arguments parameter is not required to be the last in the parameters list.</p>
    </def>
    </deflist>

## Next step

You ready to upgrade the project: [proceed to the next chapter](jvm-spring-boot-using-crudrepository.md)