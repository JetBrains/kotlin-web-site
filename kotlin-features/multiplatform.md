<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false" data-highlight-only="1">
``` kotlin
// Common
// Declare signatures to use them in the common code
// Provide platform-specific implementations in the platform modules
expect fun randomUUID(): String

expect class PlatformSocket(
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
}
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false" data-highlight-only="1">
``` kotlin
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()

actual class PlatformSocket actual constructor(url: String) {
   // Use okhttp3 in implementation
}
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false" data-highlight-only="1">
``` kotlin
// iOS
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()

actual class PlatformSocket actual constructor(url: String) {
   // Use platform.Foundation in implementation
}

```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" auto-indent="false" data-highlight-only="1">
``` kotlin
// JS
// Use the `uuid` package from npm as dependency
actual fun randomUUID(): String = uuidv4() 

actual class PlatformSocket actual constructor(url: String) {
   // Implementation on top of WebSockets
}
```
</div>
