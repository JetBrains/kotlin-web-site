[//]: # (title: Use Ktor for networking)
[//]: # (auxiliary-id: Use_Ktor_for_networking)

Conventionally, modern applications with client-server architecture use the HTTP protocol for transferring data between the server and the client. If your mobile app has a server to exchange data with, an HTTP client is an essential part of this app that enables its interaction with the server.

For Kotlin projects, we recommend [**Ktor**](https://ktor.io/) - a framework for building asynchronous clients and servers. It’s written in Kotlin and leverages its core features such as coroutines or targeting multiple platforms. For more detailed information, see the [Ktor website](https://ktor.io/).

In Kotlin Multiplatform Mobile (KMM) projects, you can use the [**Ktor Http Client**](https://ktor.io/clients/index.html) for interactions with servers. On this page, we’ll take a brief tour on how to connect the Ktor client to a KMM project, create and configure an HTTP client, and perform network requests with it.

## Connect Ktor

To use the Ktor HTTP client in your project, connect the client as a Gradle dependency: add the corresponding entries in the `dependencies` block of a module’s build file (`build.gradle` or `build.gradle.kts`).

Ktor provides separate artifacts for using the HTTP client: a common module and different engines that process the network request. 

To use Ktor KMM module in the common code, add the dependency to io.ktor:ktor-client-core to the `commonMain` source set in the `build.gradle` or `build.gradle.kts` file of the KMM module:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val commonMain by getting {
    dependencies {
        implementation("io.ktor:ktor-client-core:$ktor_version")
    }
}
```

</tab>

<tab title="Groovy" group-key="groovy">

```groovy
commonMain {
    dependencies {
        implementation "io.ktor:ktor-client-core:$ktor_version"
    }
}
```

</tab>
</tabs>

Then connect the platform engines by adding the dependencies on them. For Android, add the `ktor-client-android` dependency to the corresponding source set:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val androidMain by getting {
    dependencies {
        implementation("io.ktor:ktor-client-android:$ktor_version")
    }
}
```

</tab>

<tab title="Groovy" group-key="groovy">

```groovy
androidMain {
    dependencies {
        implementation "io.ktor:ktor-client-android:$ktor_version"
    }
}
```

</tab>
</tabs>

For iOS, add the `ktor-client-ios` dependency to the corresponding source set:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val iosMain by getting {
    dependencies {
        implementation("io.ktor:ktor-client-ios:$ktor_version")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
iosMain {
    dependencies {
        implementation "io.ktor:ktor-client-ios:$ktor_version"
    }
}
```

</tab>
</tabs>

Instead of `$ktor_version`, use the required version of the library.

For more information about connecting the Ktor client to the multiplatform project, see the [Ktor documentation](https://ktor.io/clients/http-client/multiplatform.html).

## Set up an HTTP client

In Ktor, HTTP clients are represented by the `HttpClient` class. To create an HTTP client with default settings, call the `HttpClient()` constructor:

```kotlin
val httpClient: HttpClient = HttpClient(CIO)
```

`CIO` here is the class that represents an _HTTP engine_ that the client will use. Let’s take a closer look at the available HTTP engines.

### Select an engine

Ktor offers you multiple HTTP engines to use in your project: Apache, CIO, Android, iOS, and others. Engines differ by sets of supported features or platforms they work on. For the full list of supported HTTP engines, refer to the [Ktor documentation](https://ktor.io/clients/http-client/engines.html).

To use a specific HTTP engine, connect the corresponding Ktor artifact as a dependency, for example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("io.ktor:ktor-client-cio:$ktor_version")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "io.ktor:ktor-client-cio:$ktor_version"
}
```

</tab>
</tabs>

Now you can create an HTTP client with this engine: just pass the engine class as an argument of the `HttpClient()` constructor.

```kotlin
val client = HttpClient(CIO)
```
If you call the `HttpClient()` constructor without an argument, then one of the engines available to Ktor will be automatically selected at compile time.

```kotlin
val httpClient: HttpClient = HttpClient()
```

#### Mock engine

Ktor offers a special HTTP engine for testing purposes -  `MockEngine`, which simulates HTTP calls without an actual connection to an API endpoint.

There are several platform-specific implementations of `MockEngine`. To use them in your KMM project, connect the corresponding dependencies:
`io.ktor:ktor-client-mock-jvm` for Android
`io.ktor:ktor-client-mock-native` for iOS

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation("io.ktor:ktor-client-mock:$ktor_version")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    api "io.ktor:ktor-client-mock:$ktor_version"
}
```

</tab>
</tabs>

Then create an `HttpClient` instance with `MockEngine`:

```kotlin
val httpClient: HttpClient = HttpClient(MockEngine)
```

For detailed information about testing with Ktor, refer to the [Ktor documentation](https://ktor.io/clients/http-client/testing.html).

### Configure the client

Client configuration can be done through a lambda expression with the receiver. In other words, the receiver object of the `HttpClientConfig` class for a specific HTTP engine through which the entire configuration is performed will be transferred to the lambda, which is transferred as an argument to the `HttpClient()` function.

To configure the client, pass a lambda expression to the `HttpClient()` call. 

```kotlin
val httpClient = HttpClient {
    expectSuccess = false
    ResponseObserver { response ->
        println("HTTP status: ${response.status.value}")
    }
}
```

In this example, the following configuration is used:
Receiving HTTP errors in response don’t cause exceptions
A `ResponseObserver` is created that prints response statuses to the standard output.

#### Engine configuration 

When you create an HTTP client with a specific engine, pass the engine configuration in the same lambda in the `engine` block.

```kotlin
val client = HttpClient(Android) {
    engine {
        connectTimeout = 100_000
        socketTimeout = 100_000
        proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("localhost", serverPort))
    }
}
```

For more information on engines configuration, see the [Ktor documentation](https://ktor.io/clients/http-client/engines.html).

#### Features

Ktor lets you use additional HTTP client functionality (_features_) that is not available by default, for example, logging, authorization, or serialization. Most of them are distributed in separate artifacts. To use them, you should connect them as dependencies to the common source set. For example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val commonMain by getting {
    dependencies {
        implementation("io.ktor:ktor-client-auth:$ktor_version")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
commonMain {
    dependencies {
        implementation "io.ktor:ktor-client-auth:$ktor_version"
    }
}
```

</tab>
</tabs>

Then, add  the required features in the client configuration using the `install()` function.

```kotlin
val client = HttpClient() {
    install(Auth) {
        // providers config
        ...
    }
}
```

For example, you can use the `ResponseObserver` class to set up an observer for responses. At the beginning of the article, an observer was added using the `ResponseObserver{}` builder function, which internally calls up the `install` function. An observer as additional functionality can be explicitly added as follows:

```kotlin
val httpClient = HttpClient {
    install(ResponseObserver) {
        onResponse { response ->
            println("HTTP status: ${response.status.value}")
        }
    }
}
```

For the full list of available HTTP client features and instructions on their configuration, see the [Ktor documentation](https://ktor.io/clients/http-client/features.html).

## Create HTTP requests

The main function for creating HTTP requests is `request` - an extension function for the `HttpClient` class. All the request settings are generated using the `HttpRequestBuilder` class. The `request` function has the `suspend` modifier, so requests can be executed in coroutines. For detailed information about creating and sending requests with the Ktor client, see the [Ktor documentation](https://ktor.io/clients/http-client/quick-start/requests.html).

### Method

To define an HTTP method (for example, `GET` or `POST`) for a request, provide a value for the `method` property: 
a `GET` request whose result comes as a string:

```kotlin
val htmlContent = httpClient.request<String> {
    url("https://en.wikipedia.org/wiki/Main_Page")
    method = HttpMethod.Get
}
```

a `POST` request:

```kotlin
val response = httpClient.post<HttpResponse>("http://127.0.0.1:8080/") {
    headers {
        append("Authorization", "token")
    }
    body = "Command"
}
```

Ktor provides extension functions for the `HttpClient` class for using basic HTTP methods: `get`, `post`, `put`, `patch`, `delete`, `options`, `head`. This is how you use them to send a `GET` request:

```kotlin
val response = httpClient.get<HttpResponse>("http://127.0.0.1:8080/") {
    headers {
        append("Accept", "application/json")
    }
}
```

### Headers

To add headers to the request, use the `headers` extension function.

```kotlin
val htmlContent = httpClient.request<String> {
    url("https://en.wikipedia.org/wiki/Main_Page")
    method = HttpMethod.Get

    headers {
        append("Accept", "application/json")
        append("Authorization", "oauth token")
    }
}
```

### Body

To set the body of a request, assign a value to the `body` property in the `HttpRequestBuilder` class. You can assign a string or an `OutgoingContent` object to this property. For example, sending data with a `text/plain` text MIME type can be implemented as follows:

```kotlin
val htmlContent = httpClient.request<String> {
    url("http://127.0.0.1:8080/")
    method = HttpMethod.Post

    body = TextContent(
        text = "Body content",
        contentType = ContentType.Text.Plain
    )
}
```

### Response type 

To obtain more information in the response, such as HTTP status, you can use the `HttpResponse` type as the request result:

```kotlin
val response = httpClient.request<HttpResponse> {
    url("https://en.wikipedia.org/wiki/Main_Page")
    method = HttpMethod.Get
}
if (response.status == HttpStatusCode.OK) {
    // HTTP-200
}
```

For more information about the `HttpResponse`, refer to the [Documentation](https://ktor.io/clients/http-client/quick-start/responses.html).

You can also obtain the request results in the form of a byte array:

```kotlin
val response = httpClient.request<ByteArray> {
    url("https://en.wikipedia.org/wiki/Main_Page")
    method = HttpMethod.Get
}
```

### Multipart requests

To send a multipart request, pass a `MultiPartFormDataContent` object to the `body` property. 
Create this object by calling the `MultiPartFormDataContent()` constructor with the argument
`parts: List<PartData>`. To create this list, use the `FormBuilder` builder class. It provides multiple variations of the `append` function for adding the data. There is also `formData` builder function, which accepts a lambda with the `FormBuilder` receiver.

An example of creating a POST request with Multipart data may look as follows:

```kotlin
val request: String = httpClient.post("http://127.0.0.1:8080/") {
    body = MultiPartFormDataContent(
        formData {
            append("key", "value")
        }
    )
}
```

## Concurrency

The Ktor API is based on `suspend` functions, so Kotlin coroutines are used when working with asynchronous requests. Therefore, all requests must be executed in coroutines, which will suspend their execution while awaiting a response.

For concurrent execution of two or more requests, you can use coroutine builders: `launch` or `async`. For example, sending two concurrent requests using `async` might look as follows:

```kotlin
suspend fun parallelRequests() = coroutineScope<Unit> {
    val httpClient = HttpClient()

    val firstRequest = async { httpClient.get<ByteArray>("https://127.0.0.1:8080/a") }
    val secondRequest = async { httpClient.get<ByteArray>("https://127.0.0.1:8080/b") }

    val bytes1 = firstRequest.await()    // Suspension point.
    val bytes2 = secondRequest.await()   // Suspension point.

    httpClient.close()
}
```

## Close the HTTP client

After you finish working with the HTTP client, don’t forget to free up the resources that it uses: threads, connections, and `CoroutineScope` for coroutines. To do this, call up the `close()` function in `HttpClient`:

```kotlin
httpClient.close()
```

If you need to use `HttpClient` for a single request, call the extension function `use()` that will automatically calls `close()` after executing the code block:

```kotlin
val status = HttpClient().use { httpClient ->
    // ...
}
```

Note that the `close` function prohibits the creation of new requests, but doesn’t terminate currently active ones. Resources will only be released after all client requests are completed

_We'd like to thank the [IceRock team](http://icerockdev.com/) for helping us write this article._
