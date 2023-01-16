<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" data-highlight-only="1" auto-indent="false">
```kotlin
// Use any existing JVM library or framework
// Call Kotlin code from Java without an issue

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
   runApplication<DemoApplication>(*args)
}

@RestController
class MessageResource {
   @GetMapping
   fun index(): List<Message> = listOf(
      Message("1", "Hello!"),
      Message("2", "Bonjour!"),
      Message("3", "Privet!"),
   )
}

data class Message(val id: String?, val text: String)
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" data-highlight-only="1" auto-indent="false">
```
// Write Kotlin code, compile it to JavaScript, and run it in the browser
// Use existing JavaScript APIs and libraries

import kotlinx.browser.window

fun main() {
   val body = window.document.body

   body?.innerHTML += "<b>Hello, <i>Kotlin</i></b>"

   window.setInterval({
      body?.innerHTML += "!"
   }, 1000)
}
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="kotlin-docs" data-highlight-only="1" auto-indent="false">
```kotlin
// Use Kotlin wrappers to build applications with JavaScript frameworks such as React

import react.*
import react.dom.*
import kotlinx.html.js.onClickFunction

val counter = functionalComponent<Props> {
   val (count, setCount) = useState(0)
   button {
      attrs.onClickFunction = { setCount(count + 1) }
      +count.toString()
   }
}
```
</div>
