[//]: # (title: Add database support for Spring Boot project)

<microformat>
    <p>This is a part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><a href="jvm-spring-boot-restful-2.md">Create a Spring Boot project with Kotlin</a><br/><a href="jvm-spring-boot-restful-3.md">Add an HTTP request controller to your Spring Boot project</a><br/><a href="jvm-spring-boot-restful-4.md">Add a data class to Spring Boot project</a><br/><strong>Add database support for Spring Boot project</strong><br/>Wrap up your project</p>
</microformat>

## Add database support

In JVM applications, we use JDBC to interact with databases. For convenience, Spring Framework provides `JdbcTemplate` class that simplifies the use of JDBC and helps to avoid common errors.

The common practice in Spring Framework based applications is to implement the database access logic within the so-called “service” layer – this is where business logic lives.
In Spring, we mark classes with the `@Service` annotation to imply that the class belongs to the service layer of the application.
In our application, we are going to create `MessageService` class for this purpose.

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
Constructor argument and dependency injection. A class in Kotlin can have a primary constructor and one or more secondary constructors. The primary constructor is a part of the class header, and it goes after the class name and optional type parameters. In our case, the constructor is `(val db: JdbcTemplate)`. `val db: JdbcTemplate` is the constructor’s argument:

```kotlin
@Service
class MessageService(val db: JdbcTemplate) {
```
Note: todo: note on using var, val, or no modifier for the parameter in the constructor

Trailing lambda and SAM conversion.  The findMessages function calls the query function of JdbcTemplate class. The query function takes two arguments, the SQL query as a String instance and a callback that will map one object per row:

db.query("...", RowMapper { ... } )

The RowMapper interface declares only one method, so it is possible to implement it via lambda expression by omitting the name of the interface. The Kotlin compiler knows the interface that the lambda expression needs to be converted to because we use it as a parameter for the function call. This is known as SAM conversion in Kotlin.

db.query("...", { ... } )

After SAM conversion, the query function ends up with two arguments: a String at the first position, and a lambda expression at the last position. According to the Kotlin convention, if the last parameter of a function is a function, then a lambda expression passed as the corresponding argument can be placed outside the parentheses. Such syntax is also known as trailing lambda.

db.query("...") { ... }

Underscore for unused lambda argument. For a lambda with multiple parameters, you can use the ‘_‘ character to replace the names of the parameters you don't use. Hence, the final syntax for query function call looks like this:

db.query("select * from messages") { rs, _ ->
Message(rs.getString("id"), rs.getString("text"))
}

Update MessageResource to use the new MessageService class:

@RestController
class MessageResource(val service: MessageService) {
@GetMapping
fun index(): List<Message> = service.findMessages()

@PostMapping
fun post(@RequestBody message: Message) {
service.save(message)
}
}

@PostMapping. Notice that the method responsible for handling HTTP POST requests needs to be annotated with @PostMapping annotation. To be able to convert the JSON sent as HTTP Body content into an object we need to use the @RequestBody annotation for the method argument. Thanks to having Jackson library in the classpath of the application the conversion happens automatically.

The id for Message class was declared as a nullable String:

data class Message(val id: String?, val text: String)

It would not be correct to store the null as an id value in the database though. Hence, we need to handle this situation gracefully. Let’s generate a new value when the id is null while storing the messages in the database.

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

Elvis operator. The code `message.id ?: UUID.randomUUID().toString()` uses the [Elvis operator (If-not-null-else shorthand﻿)](null-safety.md#elvis-operator) `?:`. If the expression to the left of `?:` is not `null`, the Elvis operator returns it, otherwise, it returns the expression to the right. Note that the expression on the right-hand side is evaluated only if the left-hand side is `null`.

The application code is ready to work with the database. It is now required to configure the data source.

## Configure the database

Configure the database in the application:

1. Create `schema.sql` file in the `src/main/resources` directory. It will store the database object definitions:

2. Update the `src/main/resources/sql/schema.sql` file with the following code:

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   It creates the `messages` table with two columns: `id` and `text`. The table structure matches the structure of the `Message` class.

3. Open the application.properties file located in the src/main/resources folder and add the following application properties:

   ```properties
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   These settings enable the database for the Spring Boot application.
   See the full list of common application properties in the Spring documentation.

## Add messages to database via HTTP request

You should use an HTTP client to work with previously created endpoints. In IntelliJ IDEA, you can use the embedded HTTP client:

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

2. Execute all POST requests. Use the green Run icon in the gutter next to the request declaration.
   These requests write the text messages to the database.

3. Execute the GET request and see the result in the Run tool window:

### Alternative way to execute requests {initial-collapse-state="collapsed"}

You can also use any other HTTP client or cURL command-line tool. For example, you can run the following commands in
the terminal to get the same result:

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```


## Run the application

The application is now ready to run:

Click the green Run icon in the gutter beside the `main()` method.

It works!

## What's next

