[//]: # (title: Build a full-stack web app with Kotlin Multiplatform)

This tutorial demonstrates how to build a connected full-stack application with IntelliJ IDEA. You will create a simple
JSON API and learn how to use the API from a web app using Kotlin and React.

The application consists of a server part using Kotlin/JVM and a web client using Kotlin/JS. Both parts will be one
Kotlin Multiplatform project. Since the whole app will be in Kotlin, you can share libraries and programming paradigms
(such as using Coroutines for concurrency) on both the frontend and backend.

Using Kotlin throughout the whole stack also makes it possible to write classes and functions that can be used from both
the JVM and JS targets of your application. In this tutorial, you'll primarily utilize this functionality to share a
type-safe representation of the data between client and server.

You will also use popular Kotlin multiplatform libraries and frameworks:

* [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)
* [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)
* The [Ktor](https://ktor.io/) framework

Serialization and deserialization to and from type-safe objects is delegated to the `kotlinx.serialization`
multiplatform library. This helps you make data communication safe and easy to implement.

The output will be a simple shopping list application that allows you to plan your grocery shopping.

* The user interface will be simple: a list of planned purchases and a field to enter new shopping items.
* If a user clicks on an item in the shopping list, it will be removed.
* The user can also specify a priority level for list entries by adding an exclamation point `!`. This information will
  help order the shopping list.

> For this tutorial, you are expected to have an understanding of Kotlin. Some knowledge about basic concepts in React
> and Kotlin coroutines may help understand some sample code, but it is not strictly required.
>
{type="tip"}

## Create the project

Clone the [project repository](https://github.com/kotlin-hands-on/jvm-js-fullstack) from GitHub and open it in IntelliJ
IDEA. This template already includes all of the configuration and required dependencies for all of the project parts: JVM, JS, and
the common code.

You don't need to change the Gradle configuration throughout this tutorial. If you want to get right to programming,
feel free to move on directly to the [next section](#build-the-backend).

Alternatively, you can get an understanding of the configuration and project setup in the `build.gradle.kts` file to
prepare for other projects. Check out the sections about the Gradle structure below.

#### Plugins {initial-collapse-state="collapsed"}

Like all Kotlin projects targeting more than one platform, your project uses the Kotlin Multiplatform Gradle plugin. It
provides a single point of configuration for the application targets (in this case, Kotlin/JVM and Kotlin/JS) and
exposes several lifecycle tasks for them.

Additionally, you'll need two more plugins:

* The [`application`](https://docs.gradle.org/current/userguide/application_plugin.html) plugin runs the server part of
  the application that uses JVM.
* The [`serialization`](https://github.com/Kotlin/kotlinx.serialization#gradle) plugin provides multiplatform
  conversions between Kotlin objects and their JSON text representation.

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    application // to run the JVM part
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

#### Targets {initial-collapse-state="collapsed"}

The target configuration inside the `kotlin` block is responsible for setting up the platforms you want to support with
your project. Configure two targets: `jvm` (server) and `js` (client). Here you'll make further adjustments to target
configurations.

```kotlin
jvm {
    withJava()
}
js {
    browser {
        binaries.executable()
    }
}
```

For more detailed information on targets, see [Understand Multiplatform project structure](multiplatform-discover-project.md#targets).

#### Source sets {initial-collapse-state="collapsed"}

Kotlin source sets are a collection of Kotlin sources and their resources, dependencies, and language settings that
belong to one or more targets. You use them to set up platform-specific and common dependency blocks.

```kotlin
sourceSets {
    val commonMain by getting {
        dependencies {
            // ...
        }
    }
    val jvmMain by getting {
        dependencies {
            // ...
        }
    }
    val jsMain by getting {
        dependencies {
            // ...
        }
    }
}
```

Each source set also corresponds to a folder in the `src` directory. In your project, there are three
folders, `commonMain`, `jsMain`, and `jvmMain`, which contain their own `resources` and `kotlin` folders.

For detailed information on source sets, see [Understand Multiplatform project structure](multiplatform-discover-project.md#source-sets).

## Build the backend

Let's begin by writing the server side of the application. The typical API server implements
the [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) – create, read, update, and delete.
For the simple shopping list, you can focus solely on:

* Creating new entries in the list
* Reading entries using the API
* Deleting entries

To create the backend, you can use the Ktor framework, designed to build asynchronous servers and clients in connected
systems. It can be set up quickly and grow as systems become more complex.

You can find more information about Ktor in its [documentation](https://ktor.io/docs/welcome.html).

### Run the embedded server

Instantiate a server with Ktor. You need to tell
the [embedded server](https://ktor.io/docs/create-server.html#embedded-server) that ships with Ktor to use the `Netty`
engine on a port, in this case, `9090`.

1. To define the entry point for the app, add the following code to `src/jvmMain/kotlin/Server.kt`:

    ```kotlin
    import io.ktor.http.*
    import io.ktor.serialization.kotlinx.json.*
    import io.ktor.server.engine.*
    import io.ktor.server.netty.*
    import io.ktor.server.application.*
    import io.ktor.server.plugins.compression.*
    import io.ktor.server.plugins.contentnegotiation.*
    import io.ktor.server.plugins.cors.routing.*
    import io.ktor.server.request.*
    import io.ktor.server.response.*
    import io.ktor.server.http.content.*
    import io.ktor.server.routing.*
    
    fun main() {
        embeddedServer(Netty, 9090) {
            routing {
                get("/hello") {
                    call.respondText("Hello, API!")
                }
            }
        }.start(wait = true)
    }
    ```

    * The first API endpoint is an HTTP method, `get`, and the route under which it should be reachable, `/hello`.
    * All imports that are needed for the rest of the tutorial have already been added.

2. To start the application and see that everything works, execute the Gradle `run` task. You can use
   the `./gradlew run` command in the terminal or run from the Gradle tool window:

    ![Execute the Gradle run task](gradle-run-task.png){width=700}

3. Once the application has finished compiling and the server has started up, use a web browser to navigate
   to [`http://localhost:9090/hello`](http://localhost:9090/hello) to see the first route in action:

    ![Hello, API output](hello-api-output.png){width=500}

Later, like with the endpoint for GET requests to `/hello`, you'll be able to configure all of the endpoints for the API inside
the [`routing`](https://ktor.io/docs/routing-in-ktor.html) block.

### Install Ktor plugins

Before continuing with the application development, install the required [plugins](https://ktor.io/docs/plugins.html) for the
embedded servers. Ktor uses plugins to enable support for more features in the application like encoding, compression,
logging, and authentication.

Add the following lines to the top of the `embeddedServer` block in `src/jvmMain/kotlin/Server.kt`:

```kotlin
install(ContentNegotiation) {
    json()
}
install(CORS) {
    allowMethod(HttpMethod.Get)
    allowMethod(HttpMethod.Post)
    allowMethod(HttpMethod.Delete)
    anyHost()
}
install(Compression) {
    gzip()
}
routing {
    // ...
}
```

Each call to `install` adds one feature to the Ktor application:

* [`ContentNegotiation`](https://ktor.io/docs/serialization.html) provides automatic content conversion of requests
  based on their `Content-Type` and `Accept` headers. Together with the `json()` setting, this enables automatic
  serialization and deserialization to and from JSON, allowing you to delegate this task to the framework.
* [`CORS`](https://ktor.io/docs/cors.html)
  configures [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). CORS is needed to
  make calls from arbitrary JavaScript clients and helps prevent issues later.
* [`Compression`](https://ktor.io/docs/compression.html) greatly reduces the amount of data to be sent to the client
  by gzipping outgoing content when applicable.

#### Related Gradle configuration for Ktor {initial-collapse-state="collapsed"}

The artifacts required to use Ktor are a part of the `jvmMain` `dependencies` block in the `build.gradle.kts` file. This
includes the server, logging, and supporting libraries for providing type-safe serialization support
through `kotlinx.serialization`.

```kotlin
val jvmMain by getting {
    dependencies {
        implementation("io.ktor:ktor-serialization:$ktorVersion")
        implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
        implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        implementation("io.ktor:ktor-server-cors:$ktorVersion")
        implementation("io.ktor:ktor-server-compression:$ktorVersion")
        implementation("io.ktor:ktor-server-core-jvm:$ktorVersion")
        implementation("io.ktor:ktor-server-netty:$ktorVersion")
        implementation("ch.qos.logback:logback-classic:$logbackVersion")
        implementation("org.litote.kmongo:kmongo-coroutine-serialization:$kmongoVersion")
    }
}
```

`kotlinx.serialization` and its integration with Ktor also requires a few common artifacts to be present, which you can
find in the `commonMain` source set:

```kotlin
val commonMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:$serializationVersion")
        implementation("io.ktor:ktor-client-core:$ktorVersion")
    }
}
```

### Create a data model

Thanks to Kotlin Multiplatform, you can define the data model once as a common abstraction and refer to it from both the
backend and frontend.

The data model for `ShoppingListItem` should have:

* A textual description of an item
* A numeric priority for an item
* An identifier

In `src/commonMain/`, create a `kotlin/ShoppingListItem.kt` file with the following content:

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class ShoppingListItem(val desc: String, val priority: Int) {
    val id: Int = desc.hashCode()

    companion object {
        const val path = "/shoppingList"
    }
}
```

* The `@Serializable` annotation comes from the multiplatform `kotlinx.serialization` library, which allows you to define
  models directly in common code.
* Once you use this serializable `ShoppingListItem` class from the JVM and JS platforms, code for each platform will be
  generated. This code takes care of serialization and deserialization.
* The `companion object` stores additional information about the model − in this case, the `path` under which you will
  be able to access it in the API. By referring to this variable instead of defining routes and requests as strings, you
  can change the `path` to model operations. Any changes to the endpoint name only need to be made here - the client and
  server are adjusted automatically.

> This sample computes a simple `id` from the `hashCode()` of its description. In this case, that's enough, but when working
> with real data, it would be preferable to include tried and tested mechanisms to generate identifiers for your objects –
> from [UUIDs](https://en.wikipedia.org/wiki/Universally_unique_identifier) to auto-incrementing IDs backed by the database of your choice.
>
{type="tip"}

### Add items to store

You can now use the `ShoppingListItem` model to instantiate some sample items and keep track of any additions or
deletions made through the API.

Because there's currently no database, create a `MutableList` to temporarily store the `ShoppingListItem`s. For that,
add the following file-level declaration to `src/jvmMain/kotlin/Server.kt`:

```kotlin
val shoppingList = mutableListOf(
    ShoppingListItem("Cucumbers 🥒", 1),
    ShoppingListItem("Tomatoes 🍅", 2),
    ShoppingListItem("Orange Juice 🍊", 3)
)
```

The `common` classes are referred to as any other class in Kotlin – they are shared between all of the targets.

### Create routes for the JSON API

Add the routes that support the creation, retrieval, and deletion of `ShoppingListItem`s.

1. Inside `src/jvmMain/kotlin/Server.kt`, change your `routing` block to look as follows:

    ```kotlin
    routing {
        route(ShoppingListItem.path) {
            get {
                call.respond(shoppingList)
            }
            post {
                shoppingList += call.receive<ShoppingListItem>()
                call.respond(HttpStatusCode.OK)
            }
            delete("/{id}") {
                val id = call.parameters["id"]?.toInt() ?: error("Invalid delete request")
                shoppingList.removeIf { it.id == id }
                call.respond(HttpStatusCode.OK)
            }
        }
    }
    ```

    Routes are grouped based on a common path. You don't have to specify the `route` path as a `String`. Instead,
    the `path` from the `ShoppingListItem` model is used. The code behaves as follows:
    * A `get` request to the model's path (`/shoppingList`) responds with the whole shopping list.
    * A `post` request to the model's path (`/shoppingList`) adds an entry to the shopping list.
    * A `delete` request to the model's path and a provided `id` (`shoppingList/47`) removes an entry from the
      shopping list.

    > You can receive objects directly from requests and respond to requests with objects (and even lists of
    > objects) directly. Because you've set up `ContentNegotiation` with `json()` support earlier, the objects marked
    > as `@Serializable` are automatically turned into JSON before being sent (in case of a GET request) or received
    > (in case of a POST request).
    >
    {type="note"}

2. Check to ensure that everything is working as planned. Restart the application, head
   to [`http://localhost:9090/shoppingList`](http://localhost:9090/shoppingList), and validate that the data is properly
   served. You should see the example items in JSON formatting:

    ![Shopping list in JSON formatting](shopping-list-json.png){width=500}

To test the `post` and `delete` requests, use an HTTP client that supports `.http` files. If you're
using IntelliJ IDEA Ultimate Edition, you can do this right from the IDE.

1. In the project root, create a file called `AddShoppingListElement.http` and add a declaration of the HTTP POST request as follows:

    ```http
    POST http://localhost:9090/shoppingList
    Content-Type: application/json
    
    {
      "desc": "Peppers 🌶",
      "priority": 5
    }
    ```

2. With the server running, execute the request using the run button in the gutter.

   If everything goes well, the "run" tool window should show `HTTP/1.1 200 OK`, and you can
   visit [`http://localhost:9090/shoppingList`](http://localhost:9090/shoppingList) again to validate that the entry has been
   added properly:

    ![Successful connection to localhost](connection-to-localhost.png){width=700}

3. Repeat this process for a file called `DeleteShoppingListElement.http`, which contains the following:

    ```http
    DELETE http://localhost:9090/shoppingList/AN_ID_GOES_HERE
    ```

   To try this request, replace `AN_ID_GOES_HERE` with an existing ID.

Now you have a backend that can support all of the necessary operations for a functional shopping list. Move on to building a
JavaScript frontend for the application, which will allow users to easily inspect, add, and check off elements from
their shopping list.

## Set up the frontend

To make your version of the server usable, build a small Kotlin/JS web app that can query the server's API, display them
in the form of a list, and allow the user to add and remove elements.

### Serve the frontend

Unless explicitly configured otherwise, a Kotlin Multiplatform project just means that you can build the application for
each platform, in this case JVM and JavaScript. However, for the application to function properly, you need to have
both the backend and the frontend compiled. In fact, you want the backend to also serve all of the assets belonging to the
frontend – an HTML page and the corresponding `.js` file.

In the template project, the adjustments to the Gradle file have already been made.
Whenever you run the server with the `run` Gradle task, the frontend is also built and included in the resulting
artifacts. To learn more about how this works, see the [Relevant Gradle configuration](#relevant-gradle-configuration-for-the-frontend)
section.

The template already comes with a boilerplate `index.html` file in the `src/commonMain/resources` folder. It has
a `root` node for rendering components and a `script` tag that includes the application:

```xml
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Full Stack Shopping List</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="shoppinglist.js"></script>
    </body>
</html>
```
{validate="false"}

This file is placed in the `common` resources instead of a `jvm` source set to make tasks for running the JS application
in the browser (`jsBrowserDevelopmentRun` and `jsBrowserProductionRun`) accessible to the file as well. It's helpful if
you need to run only the browser application without the backend.

While you don't need to make sure that the file is properly available on the server, you still need to instruct Ktor to
provide the `.html` and `.js` files to the browser when requested.

#### Relevant Gradle configuration for the frontend {initial-collapse-state="collapsed"}

The Gradle configuration for the application contains a snippet that makes the execution and packaging of the
server-side JVM application dependent on the build of your frontend application while respecting the settings
regarding `development` and `production` from the environment variable. It makes sure that whenever a `jar` file is
built from the application, it includes the Kotlin/JS code:

```kotlin
// include JS artifacts in any generated JAR
tasks.getByName<Jar>("jvmJar") {
    val taskName = if (project.hasProperty("isProduction")
        || project.gradle.startParameter.taskNames.contains("installDist")
    ) {
        "jsBrowserProductionWebpack"
    } else {
        "jsBrowserDevelopmentWebpack"
    }
    val webpackTask = tasks.getByName<KotlinWebpack>(taskName)
    dependsOn(webpackTask) // make sure JS gets compiled first
    from(File(webpackTask.destinationDirectory, webpackTask.outputFileName)) // bring output file along into the JAR
}
```

The `jvmJar` task modified here is called by the `application` plugin, which is responsible for the `run` task, and
the `distributions` plugin, which is responsible for the `installDist` task, amongst others. This means that the
combined build will work when you `run` your application, and also when you prepare it for deployment to another target
system or cloud platform.

To ensure that the `run` task properly recognizes the JS artifacts, the classpath is adjusted as follows:

```kotlin
tasks.getByName<JavaExec>("run") {
    classpath(tasks.getByName<Jar>("jvmJar")) // so that the JS artifacts generated by `jvmJar` can be found and served
}
```

### Serve HTML and JavaScript files from Ktor

For simplicity, the `index.html` file will be served on the root route `/` and expose the JavaScript artifact in the
root directory.

1. In `src/jvmMain/kotlin/Server.kt`, add the corresponding routes to the `routing` block:

    ```kotlin
    get("/") {
        call.respondText(
            this::class.java.classLoader.getResource("index.html")!!.readText(),
            ContentType.Text.Html
        )
    }
    staticResources("/", "static")
    route(ShoppingListItem.path) {
        // ...
    }
    ```

2. To confirm that everything went as planned, run the application again with the Gradle `run` task.
3. Navigate to [`http://localhost:9090/`](http://localhost:9090/). You should see a page saying "Hello, Kotlin/JS":

    ![Hello, Kotlin/JS output](hello-kotlin-js-output.png){width=500}

### Edit configuration

While you are developing, the build system generates _development_ artifacts. This means that no optimizations are
applied when the Kotlin code is turned into JavaScript. That makes compile times faster but also results in larger JS
files. When you deploy your application to the web, this is something you want to avoid.

To instruct Gradle to generate optimized production assets, set the necessary environment
variable. If you are running your application on a deployment system, you can
configure it to set this environment variable during the build. If you want to try out production mode locally, you can
do it in the terminal or by adding the variable to the run configuration:

1. In IntelliJ IDEA, select the **Edit Configurations** action:

    ![Edit run configuration in IntelliJ IDEA](edit-run-configurations.png){width=700}

2. In the **Run/Debug Configurations** menu, set the environment variable:

    ```none
    ORG_GRADLE_PROJECT_isProduction=true
    ```

    ![Set the environment variable](set-environment-variable.png){width=700}

Subsequent builds with this run configuration will perform all available optimizations for the frontend part of the
application, including eliminating dead code. They will still be slower than development builds, so it would be good to
remove this flag again while you are developing.

## Build the frontend

To render and manage user interface elements, use the popular framework [React](https://reactjs.org/) together with the
available [wrappers](https://github.com/JetBrains/kotlin-wrappers/) for Kotlin. Setting up a full project with React
will allow you to re-use it and its configuration as a starting point for more complex multiplatform
applications.

For a more in-depth view of typical workflows and how apps are developed with React and Kotlin/JS, see
the [Build a web application with React and Kotlin/JS](js-react.md) tutorial.

### Write the API client

To display data, you need to obtain it from the server. For this, build a small API client.

This API client will use the [`ktor-clients`](https://ktor.io/clients/index.html) library to send requests to HTTP
endpoints. Ktor clients use Kotlin's coroutines to provide non-blocking networking and support plugins like the Ktor
server.

In this configuration, the `JsonFeature` uses `kotlinx.serialization` to provide a way to create typesafe HTTP requests.
It takes care of automatically converting between Kotlin objects and their JSON representation and vice versa.

By leveraging these properties, you can create an API wrapper as a set of suspending functions that either accept or
return `ShoppingItems`. Create a file called `Api.kt` and implement them in `src/jsMain/kotlin`:

```kotlin
import io.ktor.http.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*

val jsonClient = HttpClient {
    install(ContentNegotiation) {
        json()
    }
}

suspend fun getShoppingList(): List<ShoppingListItem> {
    return jsonClient.get(ShoppingListItem.path).body()
}

suspend fun addShoppingListItem(shoppingListItem: ShoppingListItem) {
    jsonClient.post(ShoppingListItem.path) {
        contentType(ContentType.Application.Json)
        setBody(shoppingListItem)
    }
}

suspend fun deleteShoppingListItem(shoppingListItem: ShoppingListItem) {
    jsonClient.delete(ShoppingListItem.path + "/${shoppingListItem.id}")
}
```

### Build the user interface

You've laid the groundwork on the client and have a clean API to access the data provided by the server. Now you can
work on displaying the shopping list on the screen in a React application.

#### Configure an entry point for the application

Instead of rendering a simple "Hello, Kotlin/JS" string, make the application render a functional `App` component. For
that, replace the content inside `src/jsMain/kotlin/Main.kt` with the following:

```kotlin
import web.dom.document
import react.create
import react.dom.client.createRoot

fun main() {
    val container = document.getElementById("root") ?: error("Couldn't find container!")
    createRoot(container).render(App.create())
}
```

#### Build and render the shopping list

Next, implement the `App` component. For the shopping list application, it needs to:

* Keep the "local state" of the shopping list to understand which elements to display.
* Load the shopping list elements from the server and set the state accordingly.
* Provide React with instructions on how to render the list.

Based on these requirements, you can implement the `App` component as follows:

1. Create and fill the `src/jsMain/kotlin/App.kt` file:

    ```kotlin
    import react.*
    import kotlinx.coroutines.*
    import react.dom.html.ReactHTML.h1
    import react.dom.html.ReactHTML.li
    import react.dom.html.ReactHTML.ul
    
    private val scope = MainScope()
    
    val App = FC<Props> {
        var shoppingList by useState(emptyList<ShoppingListItem>())
    
        useEffectOnce {
            scope.launch {
                shoppingList = getShoppingList()
            }
        }
    
        h1 {
            +"Full-Stack Shopping List"
        }
        ul {
            shoppingList.sortedByDescending(ShoppingListItem::priority).forEach { item ->
                li {
                    key = item.toString()
                    +"[${item.priority}] ${item.desc} "
                }
            }
        }
    }
    ```

    * Here, the Kotlin DSL is used to define the HTML representation of the application.
    * `launch` is used to obtain the list of `ShoppingListItem`s from the API when the component is first initialized.
    * The React hooks `useEffectOnce` and `useState` help you use React's functionality concisely. For more information on how
      React hooks work, check out the [official React documentation](https://reactjs.org/docs/hooks-overview.html). To learn
      more about React with Kotlin/JS, see the [Build a web application with React and Kotlin/JS](js-react.md) tutorial.
2. Start the application using the Gradle `run` task.
3. Navigate to [`http://localhost:9090/`](http://localhost:9090/) to see the list:

    ![New shopping list rendering](new-shopping-list-rendering.png){width=500}

#### Add an input field component

Next, allow users to add new entries to the shopping list using a text input field. You'll need an input component that
provides a callback when users submit their entry to the shopping list to receive input.

1. Create the `src/jsMain/kotlin/InputComponent.kt` file and fill it with the following definition:

    ```kotlin
    import web.html.HTMLFormElement
    import react.*
    import web.html.HTMLInputElement
    import react.dom.events.ChangeEventHandler
    import react.dom.events.FormEventHandler
    import web.html.InputType
    import react.dom.html.ReactHTML.form
    import react.dom.html.ReactHTML.input
    
    external interface InputProps : Props {
        var onSubmit: (String) -> Unit
    }
    
    val inputComponent = FC<InputProps> { props ->
        val (text, setText) = useState("")
    
        val submitHandler: FormEventHandler<HTMLFormElement> = {
            it.preventDefault()
            setText("")
            props.onSubmit(text)
        }
    
        val changeHandler: ChangeEventHandler<HTMLInputElement> = {
            setText(it.target.value)
        }
    
        form {
            onSubmit = submitHandler
            input {
                type = InputType.text
                onChange = changeHandler
                value = text
            }
        }
    }
    ```

   The `inputComponent` keeps track of its internal state (what the user has typed so far) and exposes an `onSubmit`
   handler that gets called when the user submits the form (usually by pressing the `Enter` key).

2. To use this `inputComponent` from the application, add the following snippet to `src/jsMain/kotlin/App.kt` at the
   bottom of the `FC` block (after the closing brace for the `ul` element):

    ```kotlin
    inputComponent {
        onSubmit = { input ->
            val cartItem = ShoppingListItem(input.replace("!", ""), input.count { it == '!' })
            scope.launch {
                addShoppingListItem(cartItem)
                shoppingList = getShoppingList()
            }
        }
    }
    ```

    * When users submit text, a new `ShoppingListItem` is created. Its priority is set to be the number of exclamation
      points in the input, and its description is the input with all exclamation points removed. This turns `Peaches!! 🍑`
      into a `ShoppingListItem(desc="Peaches 🍑", priority=2)`.
    * The generated `ShoppingListItem` gets sent to the server with the client you've built before.
    * Then, the UI is updated by obtaining the new list of `ShoppingListItem`s from the server, updating the application
      state, and letting React re-render the contents.

#### Implement item removal

Add the ability to remove the finished items from the list so that it doesn't get too long.
Instead of adding another UI element (like a "delete" button), you can allow users to delete an item by clicking it.

To achieve this, pass a corresponding handler to `onClick` of the list elements:

1. In `src/jsMain/kotlin/App.kt`, update the `li` block (inside the `ul` block):

    ```kotlin
    li {
        key = item.toString()
        onClick = {
            scope.launch {
                deleteShoppingListItem(item)
                shoppingList = getShoppingList()
            }
        }
        +"[${item.priority}] ${item.desc} "
    }
    ```

    The API client is invoked along with the element that should be removed. The server updates the shopping list, which
    re-renders the user interface.

2. Start the application using the Gradle `run` task.
3. Navigate to [`http://localhost:9090/`](http://localhost:9090/), and try adding and removing elements from the list:

    ![Final shopping list](finished-shopping-list.gif){width=500}

## Include a database to store data

Currently, the application doesn't save data, meaning that the shopping list vanishes when you terminate
the server process. To fix that, use the MongoDB database to store and retrieve shopping list items even when
the server shuts down.

MongoDB is simple, fast to set up, has library support for Kotlin, and provides simple, [NoSQL](https://en.wikipedia.org/wiki/NoSQL)
document storage, which is more than enough for a basic application. You are free to equip your application with a different
mechanism for data storage.

To provide all of the functionality used in this section, you'll need to include several libraries from the Kotlin and
JavaScript (npm) ecosystems. See the `jsMain` dependency block in the `build.gradle.kts` file with the full setup.

### Set up MongoDB

Install MongoDB Community Edition on your local machine from the [official MongoDB website](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).
Alternatively, you can use a containerization tool like [podman](https://podman.io/) to run a containerized instance of MongoDB.

After installation, ensure that you are running the `mongodb-community` service for the rest of the tutorial. You'll use
it to store and retrieve list entries.

### Include KMongo in the process

[KMongo](https://litote.org/kmongo/) is a community-created Kotlin framework that makes it easy to work with MongoDB
from Kotlin/JVM code. It also works nicely with `kotlinx.serialization`, which is used to facilitate communication
between client and server.

By making the code use an external database, you no longer need to keep a collection of `shoppingListItems` on the
server. Instead, set up a database client and obtain a database and a collection from it.

1. Inside `src/jvmMain/kotlin/Server.kt`, remove the declaration for `shoppingList` and add the following three
   top-level variables:

    ```kotlin
    val client = KMongo.createClient().coroutine
    val database = client.getDatabase("shoppingList")
    val collection = database.getCollection<ShoppingListItem>()
    ```

2. In `src/jvmMain/kotlin/Server.kt`, replace definitions for the GET, POST, and DELETE routes to a `ShoppingListItem`
   to make use of the available collection operations:

    ```kotlin
    get {
        call.respond(collection.find().toList())
    }
    post {
        collection.insertOne(call.receive<ShoppingListItem>())
        call.respond(HttpStatusCode.OK)
    }
    delete("/{id}") {
        val id = call.parameters["id"]?.toInt() ?: error("Invalid delete request")
        collection.deleteOne(ShoppingListItem::id eq id)
        call.respond(HttpStatusCode.OK)
    }
    ```

    In the DELETE request, KMongo's [type-safe queries](https://litote.org/kmongo/typed-queries/) are used to
    obtain and remove the correct `ShoppingListItem` from the database.

3. Start the server using the `run` task, and navigate to [`http://localhost:9090/`](http://localhost:9090/). On the first
   start, you'll be greeted by an empty shopping list as is expected when querying an empty database.
4. Add some items to your shopping list. The server will save them to the database.
5. To check this, restart the server and reload the page.

### Inspect MongoDB

To see what kind of information is actually saved in the database, you can inspect the database using external tools.

If you have IntelliJ IDEA Ultimate Edition or DataGrip, you can inspect the database contents with these tools.
Alternatively, you can use the [`mongosh`](https://www.mongodb.com/docs/mongodb-shell/) command-line client.

1. To connect to the local MongoDB instance, in IntelliJ IDEA Ultimate or
   DataGrip, go to the **Database** tab and select **+** | **Data Source** | **MongoDB**:

    ![Create a MongoDB data source](mongodb-data-source.png){width=700}

2. If it's your first time connecting to a MongoDB database this way, you might be prompted to download missing drivers:

    ![Download missing drivers for MongoDB](download-missing-drivers.png){width=700}

3. When working with a local MongoDB installation that uses the default settings, no adjustments to the
   configuration are necessary.
   You can test the connection with the **Test Connection** button, which should output the MongoDB version and some
   additional information.

4. Click **OK**. Now you can use the **Database** window to navigate to your collection and look at everything stored in it:

    ![Use the Database tool for collection analysis](database-tool.png){width=700}

#### Relevant Gradle configuration for Kmongo {initial-collapse-state="collapsed"}

Kmongo is added with a single dependency to the project, a specific version that includes coroutine and serialization
support out of the box:

```kotlin
val jvmMain by getting {
    dependencies {
        // ...
        implementation("org.litote.kmongo:kmongo-coroutine-serialization:$kmongoVersion")
    }
}
```

## Deploy to the cloud

Instead of opening your app on `localhost`, you can bring it onto the web by deploying it to the cloud.

To get the application running on managed infrastructure (such as cloud providers), you need to integrate it with the
environment variables provided by the selected platform and add any required configurations to the project. Specifically,
pass the application port and MongoDB connection string.

> During application deployment, you might need to change the firewall rules to allow the application to access the
> database. For more details, see the [MongoDB documentation](https://docs.atlas.mongodb.com/security/ip-access-list/).
>
{type="note"}

### Specify the PORT variable

On managed platforms, the port on which the application should run is often determined externally and exposed through
the `PORT` environment variable. If present, you can respect this setting by configuring `embeddedServer`
in `src/jvmMain/kotlin/Server.kt`:

```kotlin
fun main() {
    val port = System.getenv("PORT")?.toInt() ?: 9090
    embeddedServer(Netty, port) {
        // ...
    }
}
```

Ktor also supports configuration files that can respect environment variables. To learn more about how to use them,
check out the [official documentation](https://ktor.io/docs/configurations.html#hocon-overview).

### Specify the MONGODB_URI variable

Managed platforms often expose connection strings through environment variables – for MongoDB, this might be
the `MONGODB_URI` string, which needs to be used by the client to connect to the database. Depending on the specific
MongoDB instance you're trying to connect to, you might need to append the `retryWrites=false` parameter to the connection
string.

To properly satisfy these requirements, instantiate the `client` and `database` variables
in `src/jvmMain/kotlin/Server.kt`:

```kotlin
val connectionString: ConnectionString? = System.getenv("MONGODB_URI")?.let {
    ConnectionString("$it?retryWrites=false")
}

val client =
    if (connectionString != null) KMongo.createClient(connectionString).coroutine else KMongo.createClient().coroutine
val database = client.getDatabase(connectionString?.database ?: "shoppingList")
```

This ensures that the `client` is created based on this information whenever the environment variables are set.
Otherwise (for instance, on `localhost`), the database connection is instantiated as before.

### Create the Procfile

Managed cloud platforms like Heroku or PaaS implementations like [Dokku](https://github.com/dokku/dokku) also handle
the lifecycle of your application. To do so, they require an "entry point" definition. These two platforms use
a file called `Procfile` that you have in the project root directory. It points to the output generated by the `stage` task
(which is included in the Gradle template already):

```shell
web: ./build/install/shoppingList/bin/shoppingList
```

### Turn on production mode

To turn on a compilation with optimizations for the JavaScript assets, pass another flag to the build
process. In the **Run/Debug Configurations** menu, set the environment variable `ORG_GRADLE_PROJECT_isProduction` to `true`.
You can set this environment variable when you deploy the application to the target environment.

> You can find the finished application on GitHub on the [`final` branch](https://github.com/kotlin-hands-on/jvm-js-fullstack/tree/final).
>
{type="note"}

#### Relevant Gradle configuration {initial-collapse-state="collapsed"}

The `stage` task is an alias for `installDist`:

```kotlin
// Alias "installDist" as "stage" (for cloud providers)
tasks.create("stage") {
    dependsOn(tasks.getByName("installDist"))
}

// only necessary until https://youtrack.jetbrains.com/issue/KT-37964 is resolved
distributions {
    main {
        contents {
            from("$buildDir/libs") {
                rename("${rootProject.name}-jvm", rootProject.name)
                into("lib")
            }
        }
    }
}
```

## What's next

#### Add more features {initial-collapse-state="collapsed"}

See how your application can be expanded and improved:

* **Improve the design**. You could make use of `styled-components`, one of the libraries that have Kotlin wrappers
  provided. If you want to see `styled-components` in action, look at
  the [Build a web application with React and Kotlin/JS](js-react.md) tutorial.
* **Add crossing out list items**. For now, list items just vanish with no record of them existing. Instead of deleting
  an element, use ~~crossing out~~.
* **Implement editing**. So far, an entry in the shopping list can't be edited. Consider adding an edit button.

#### Join the community and get help {initial-collapse-state="collapsed"}

You can join the official Kotlin Slack channels, [#ktor](https://slack-chats.kotlinlang.org/c/ktor), [#javascript](https://slack-chats.kotlinlang.org/c/javascript),
and others to get help with Kotlin related problems from the community.

#### Learn more about Kotlin/JS {initial-collapse-state="collapsed"}

You can find additional learning materials targeting
Kotlin/JS: [Set up a Kotlin/JS project](js-project-setup.md) and [Run Kotlin/JS](running-kotlin-js.md).

#### Learn more about Ktor {initial-collapse-state="collapsed"}

For in-depth information about the Ktor framework, including demo projects, check out [ktor.io](https://ktor.io/).

If you run into trouble, check out the [Ktor issue tracker](https://youtrack.jetbrains.com/issues/KTOR) on YouTrack –
and if you can't find your problem, don't hesitate to file a new issue.

#### Learn more about Kotlin Multiplatform {initial-collapse-state="collapsed"}

Learn more about how [multiplatform code works in Kotlin](multiplatform.md).
