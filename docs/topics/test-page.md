[//]: # (title: Testing page)
[//]: # (description: This page is for testing purposes only.)

<microformat>
   <p>This is a microformat block with images (taken from <strong>Getting started with Compose Multiplatform</strong> tutorial).</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="compose-multiplatform-setup.md">Set up an environment</a><br/>
      <img src="icon-2.svg" width="20" alt="Second step"/> <strong>Create your multiplatform project</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="Third step"/> Explore composable code<br/>      
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Modify the project<br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Create your own application<br/>
  </p>
</microformat>

## Synchronized tabs

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("kapt") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
}
```

</tab>
</tabs>

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.noarg") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "%kotlinVersion%"
}
```

</tab>
</tabs>

## Sections

### Collapsed section {initial-collapse-state="collapsed"}

Some text here and a codeblock:

```kotlin
plugins {
    kotlin("plugin.noarg") version "%kotlinVersion%"
}
```

## Codeblocks

Just a codeblock: 

```kotlin
    import java.util.*

@Service
class MessageService(val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): List<Message> = db.findById(id).toList()

    fun save(message: Message) {
        db.save(message)
    }

    fun <T : Any> Optional<out T>.toList(): List<T> =
        if (isPresent) listOf(get()) else emptyList()
}
```

### Expandable codeblock

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```
{initial-collapse-state="collapsed"}

### Runnable codeblock

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Tables

### Markdown table

| Primitive-type array                                                                  | Equivalent in Java |
|---------------------------------------------------------------------------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XML table

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>December 2023</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>June 2024</strong></td>
    </tr>
</table>

### XML table with codeblocks inside

Simple table:

<table header-style="top">
    <tr>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

More complex table:

<table header-style="top">
    <tr>
        <td></td>
        <td>Before</td>
        <td>Now</td>
    </tr>
    <tr>
        <td rowspan="2">Dependencies of the <code>jvmMain</code> compilation</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmMain</code> source set</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmTest</code> compilation</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td>Dependencies of the <code>jvmTest</code> source set</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

## Lists

### Ordered list

1. One
2. Two
3. Three
   1. Three point 1
   2. Three point 2
   3. Three point 3
      1. Three point 1 and 1
4. With a codeblock inside:

   ```kotlin
   jvmTest<Scope>
   ```

### Non-ordered list

* First bullet
* Second bullet
* Third bullet
  * One more
  * Another one
    * Wow, one more
* With a codeblock inside:
   
   ```kotlin
   jvmTest<Scope>
   ```

### Definition list

<deflist collapsible="true">
   <def title="Collapsible item #1">
      <p>The return type of the <code>findById()</code> function in the <code>CrudRepository</code> interface is an instance of the <code>Optional</code> class. However, it would be convenient to return a <code>List</code> with a single message for consistency. For that, you need to unwrap the <code>Optional</code> value if it’s present, and return a list with the value. This can be implemented as an <a href="extensions.md#extension-functions">extension function</a> to the <code>Optional</code> type.</p>
      <p>In the code, <code>Optional&lt;out T&gt;.toList()</code>, <code>.toList()</code> is the extension function for <code>Optional</code>. Extension functions allow you to write additional functions to any classes, which is especially useful when you want to extend functionality of some library class.</p>
   </def>
   <def title="Collapsible item #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">This function works</a> with an assumption that the new object doesn’t have an id in the database. Hence, the id <b>should be null</b> for insertion.</p>
      <p> If the id isn’t <i>null</i>, <code>CrudRepository</code> assumes that the object already exists in the database and this is an <i>update</i> operation as opposed to an <i>insert</i> operation. After the insert operation, the <code>id</code> will be generated by the data store and assigned back to the <code>Message</code> instance. This is why the <code>id</code> property should be declared using the <code>var</code> keyword.</p>
      <p></p>
   </def>
</deflist>

## Text elements

* **Bold text**
* _italic text_
* `inline code`
* [internal anchor](#lists)
* [internal link](roadmap.md)
* [external link](jetbrains.com)
* emojis ❌✅🆕
* variable using: lastest Kotlin version is %kotlinVersion% 

## Embedded elements

### Video from YouTube

<video href="Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

### Pictures

Regular (Markdown):

![Create a test](create-test.png){width="700"}

Regular (XML):

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

Inline:

![YouTrack](youtrack-logo.png){width=30}{type="joined"}

Zoomable:

![class diagram](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

Button-style:

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project"/>
</a>

## Notes

Warning:

> Support for K2 in the kapt compiler plugin is [Experimental](components-stability.md).
> Opt-in is required (see details below), and you should use it only for evaluation purposes.
>
{type="warning"}

Note: 

> As for native platform libraries shipped with Kotlin/Native (like Foundation, UIKit, and POSIX),  only some of their 
> APIs need an opt-in with `@ExperimentalForeignApi`. In such cases, you get a warning with an opt-in requirement.
>
{type="note"}

<img src="multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="Create a project"/>
</a>