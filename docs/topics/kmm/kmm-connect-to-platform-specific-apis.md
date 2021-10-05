[//]: # (title: Connect to platform-specific APIs)

If you’re developing mobile applications for different platforms with Kotlin Multiplatform Mobile and need to access 
platform-specific APIs that implement required functionality (for example, generating a UUID), 
you can use the Kotlin mechanism of [expected and actual declarations](mpp-connect-to-apis.md).

With this mechanism, a common module defines an _expected declaration_, and platform modules must provide _actual declarations_ 
that correspond to the expected one. This works for most Kotlin declarations, such as functions, classes, interfaces, enums, 
properties, and annotations.

![Expect/actual declarations in common and platform-specific modules](expect-actual-general.png){width=700}

The compiler ensures that every declaration marked with the `expect` keyword in the common module has the corresponding 
declarations marked with the `actual` keyword in all platform modules. The IDE provides tools that help you create the missing actual declarations.

>We recommend that you use expected and actual declarations only for Kotlin declarations that have platform-specific 
> dependencies. It is better to implement all possible functionality in the common module even if doing so takes more time.
>    
>Don’t overuse expected and actual declarations – in some cases, an interface may be a better choice because it is more 
>flexible and easier to test.
>
{type="note"}

Learn how to [add dependencies on platform-specific libraries](kmm-add-dependencies.md).

## Examples

For simplicity, the following examples use the intuitive target names iOS and Android. However, in your Gradle build files, 
you need to use a specific target name from [the list of supported targets](mpp-supported-platforms.md).

* [Generate a UUID](#example-generate-a-uuid)
* [Send and receive messages from a WebSocket](#example-send-and-receive-messages-from-a-websocket)

### Example: Generate a UUID

Let's assume that you are developing iOS and Android applications using Kotlin Multiplatform Mobile and you want to 
generate a universally unique identifier (UUID).

![Expect/actual declarations for getting the UUID](expect-actual-example.png){width=700}

For this purpose, declare the expected function `randomUUID()` with the `expect` keyword in the common module. 
Don’t include any implementation code.

```kotlin
//Common
expect fun randomUUID(): String
```

In each platform-specific module (iOS and Android), provide the actual implementation for the function `randomUUID()` 
expected in the common module. Use the `actual` keyword to mark the actual implementation. 

The following examples show the implementation of this for Android and iOS. 
Platform-specific code uses the actual keyword and the expected name for the function.

```kotlin
//Android
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
//iOS
import platform.Foundation.NSUUID
        
actual fun randomUUID(): String = NSUUID().UUIDString()
```

### Example: Send and receive messages from a WebSocket

Finally, let’s assume that you are developing a chat platform for iOS and Android using Kotlin Multiplatform Mobile. 
Let's see how you can implement sending and receiving messages from a WebSocket.

For this purpose, define a common logic that you don’t need to duplicate in all platform modules – 
just add it once to the common module. However, the actual implementation of the WebSocket class differs
 from platform to platform. That’s why you should use `expect`/`actual` declarations for this class. 

In the common module, declare the expected class `PlatformSocket()` with the `expect` keyword. Don’t include any implementation code.

```kotlin
//Common
internal expect class PlatformSocket(
        url: String
) {
    fun openSocket(listener: PlatformSocketListener)
    fun closeSocket(code: Int, reason: String)
    fun sendMessage(msg: String)
}
interface PlatformSocketListener {
    fun onOpen()
    fun onFailure(t: Throwable)
    fun onMessage(msg: String)
    fun onClosing(code: Int, reason: String)
    fun onClosed(code: Int, reason: String)
}
```

In each platform-specific module (iOS and Android), provide the actual implementation for the class `PlatformSocket()` 
expected in the common module. Use the `actual` keyword to mark the actual implementation.

The following examples show the implementation of this for Android and iOS.

```kotlin
//Android
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket

internal actual class PlatformSocket actual constructor(url: String) {
    private val socketEndpoint = url
    private var webSocket: WebSocket? = null
    actual fun openSocket(listener: PlatformSocketListener) {
        val socketRequest = Request.Builder().url(socketEndpoint).build()
        val webClient = OkHttpClient().newBuilder().build()
        webSocket = webClient.newWebSocket(
                socketRequest,
                object : okhttp3.WebSocketListener() {
                    override fun onOpen(webSocket: WebSocket, response: Response) = listener.onOpen()
                    override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) = listener.onFailure(t)
                    override fun onMessage(webSocket: WebSocket, text: String) = listener.onMessage(text)
                    override fun onClosing(webSocket: WebSocket, code: Int, reason: String) = listener.onClosing(code, reason)
                    override fun onClosed(webSocket: WebSocket, code: Int, reason: String) = listener.onClosed(code, reason)
                }
        )
    }
    actual fun closeSocket(code: Int, reason: String) {
        webSocket?.close(code, reason)
        webSocket = null
    }
    actual fun sendMessage(msg: String) {
        webSocket?.send(msg)
    }
}
```

Android implementation uses the third-party library [OkHttp](https://square.github.io/okhttp/). Add the corresponding dependency to `build.gradle(.kts)` in the shared module:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets {
    val androidMain by getting {
        dependencies {
            implementation("com.squareup.okhttp3:okhttp:$okhttp_version")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
commonMain {
    dependencies {
        implementation "com.squareup.okhttp3:okhttp:$okhttp_version"
    }
}
```

</tab>
</tabs>

iOS implementation uses `NSURLSession` from the standard Apple SDK and doesn't require additional dependencies. 

```kotlin
//iOS
import platform.Foundation.*
import platform.darwin.NSObject

internal actual class PlatformSocket actual constructor(url: String) {
    private val socketEndpoint = NSURL.URLWithString(url)!!
    private var webSocket: NSURLSessionWebSocketTask? = null
    actual fun openSocket(listener: PlatformSocketListener) {
        val urlSession = NSURLSession.sessionWithConfiguration(
                configuration = NSURLSessionConfiguration.defaultSessionConfiguration(),
                delegate = object : NSObject(), NSURLSessionWebSocketDelegateProtocol {
                    override fun URLSession(
                            session: NSURLSession,
                            webSocketTask: NSURLSessionWebSocketTask,
                            didOpenWithProtocol: String?
                    ) {
                        listener.onOpen()
                    }
                    override fun URLSession(
                            session: NSURLSession,
                            webSocketTask: NSURLSessionWebSocketTask,
                            didCloseWithCode: NSURLSessionWebSocketCloseCode,
                            reason: NSData?
                    ) {
                        listener.onClosed(didCloseWithCode.toInt(), reason.toString())
                    }
                },
                delegateQueue = NSOperationQueue.currentQueue()
        )
        webSocket = urlSession.webSocketTaskWithURL(socketEndpoint)
        listenMessages(listener)
        webSocket?.resume()
    }
    private fun listenMessages(listener: PlatformSocketListener) {
        webSocket?.receiveMessageWithCompletionHandler { message, nsError ->
            when {
                nsError != null -> {
                    listener.onFailure(Throwable(nsError.description))
                }
                message != null -> {
                    message.string?.let { listener.onMessage(it) }
                }
            }
            listenMessages(listener)
        }
    }
    actual fun closeSocket(code: Int, reason: String) {
        webSocket?.cancelWithCloseCode(code.toLong(), null)
        webSocket = null
    }
    actual fun sendMessage(msg: String) {
        val message = NSURLSessionWebSocketMessage(msg)
        webSocket?.sendMessage(message) { err ->
            err?.let { println("send $msg error: $it") }
        }
    }
}
```

And here is the common logic in the common module that uses the platform-specific class `PlatformSocket().`

```kotlin
//Common
class AppSocket(url: String) {
    private val ws = PlatformSocket(url)
    var socketError: Throwable? = null
        private set
    var currentState: State = State.CLOSED
        private set(value) {
            field = value
            stateListener?.invoke(value)
        }
    var stateListener: ((State) -> Unit)? = null
        set(value) {
            field = value
            value?.invoke(currentState)
        }
    var messageListener: ((msg: String) -> Unit)? = null
    fun connect() {
        if (currentState != State.CLOSED) {
            throw IllegalStateException("The socket is available.")
        }
        socketError = null
        currentState = State.CONNECTING
        ws.openSocket(socketListener)
    }
    fun disconnect() {
        if (currentState != State.CLOSED) {
            currentState = State.CLOSING
            ws.closeSocket(1000, "The user has closed the connection.")
        }
    }
    fun send(msg: String) {
        if (currentState != State.CONNECTED) throw IllegalStateException("The connection is lost.")
        ws.sendMessage(msg)
    }
    private val socketListener = object : PlatformSocketListener {
        override fun onOpen() {
            currentState = State.CONNECTED
        }
        override fun onFailure(t: Throwable) {
            socketError = t
            currentState = State.CLOSED
        }
        override fun onMessage(msg: String) {
            messageListener?.invoke(msg)
        }
        override fun onClosing(code: Int, reason: String) {
            currentState = State.CLOSING
        }
        override fun onClosed(code: Int, reason: String) {
            currentState = State.CLOSED
        }
    }
    enum class State {
        CONNECTING,
        CONNECTED,
        CLOSING,
        CLOSED
    }
}
```
