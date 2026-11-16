[//]: # (title: Lombok compiler plugin)
<primary-label ref="alpha"/>

The Kotlin Lombok compiler plugin allows the generation and use of Java's Lombok declarations by Kotlin code
in the same mixed Java/Kotlin module. Besides Java code, the plugin also processes the linked annotations when
you apply them to Kotlin classes.

The Lombok plugin supports the following annotations:

* `@Getter`, `@Setter`
* [`@NoArgsConstructor`](#constructors), `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`
* [`@EqualsAndHashCode`](#equals-and-hash-codes)
* [`@ToString`](#string-representations)
* [`@Slf4j`, `@Log`, and other logger annotations from the `lombok.extern` package](#loggers)

Currently, we don't have plans to support the `@Tolerate` annotation. However, we can consider this if you vote
for it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-53564/).

The Kotlin Lombok compiler plugin cannot replace the [Lombok](https://projectlombok.org/) library, but the plugin helps
it work in mixed Java/Kotlin projects. You still need to [configure the Lombok library](#configure-lombok)
as usual when using this plugin.

## Apply the plugin

Apply the plugin in every module that has sources with Lombok annotations. A module that only calls the generated
declarations doesn't need the plugin, because these declarations are already present in the compiled classes of the
module.

### Gradle

Apply the `kotlin-plugin-lombok` Gradle plugin in the `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "%lombokVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '%lombokVersion%'
}
```

</tab>
</tabs>

See this [test project with examples of the Lombok compiler plugin in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt).

If you use a [Lombok configuration file](#configure-lombok) `lombok.config`, set the file's path in your
`build.gradle(.kts)` file so that the plugin can find it. The path must be relative to the module's directory:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">


```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

See this [test project with examples of the Lombok compiler plugin and `lombok.config` in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig).

### Maven

To use the Lombok compiler plugin, add the plugin `lombok` to the `compilerPlugins` section and the dependency
`kotlin-maven-lombok` to the `dependencies` section.

If you use a [Lombok configuration file](#configure-lombok) `lombok.config`,
provide a path to it to the plugin in the `pluginOptions` in your `pom.xml` file:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
            <plugin>lombok</plugin>
        </compilerPlugins>
        <pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

See this [test project example of the Lombok compiler plugin and `lombok.config` in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt).

### Command-line compiler

Lombok compiler plugin JAR is available in the binary distribution of the Kotlin compiler. You can attach the plugin
by providing the path to its JAR file using the `Xplugin` kotlinc option:

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

If you use a [Lombok configuration file](#configure-lombok) `lombok.config`, replace `<PATH_TO_CONFIG_FILE>` with a path
to your `lombok.config`:

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```

## Configure Lombok

The plugin reads the [`lombok.config` file](https://projectlombok.org/features/configuration) so that Kotlin code sees
the same declarations that Lombok generates for Java code. The plugin supports the configuration keys that affect these
declarations, as well as the keys that report the usage of Lombok annotations.

For example, adding the `lombok.fieldDefaults.defaultPrivate` key to `lombok.config` makes every field without an explicit
visibility modifier `private`:

```none
lombok.fieldDefaults.defaultPrivate = true
```

With this key, Lombok applies private visibility to every field, so Kotlin code uses the generated accessors instead of
accessing the field directly:

```java
// MessageDto.java
@Getter
@Setter
public class MessageDto {
    int id = 0;
}
```

```kotlin
// Main.kt
fun main() {
    val message = MessageDto()

    // Calls the generated setter
    message.id = 123
}
```

## Use Lombok annotations on Kotlin classes

Besides Java declarations, the plugin also processes Lombok annotations that you apply to Kotlin classes and generates
the corresponding declarations for them. Lombok generates some of these declarations as static members in Java. Since
Kotlin has no static members, the plugin generates them in the companion object of the annotated class.

> If the annotated class already contains a nested class named `Companion`, the plugin can't generate the companion
> object. In this case, the compiler reports a warning.
> 
{type="note"}

### Access levels

Lombok annotations such as `@Log` and `@NoArgsConstructor` accept an access level that defines the visibility of the
generated declarations. On Kotlin classes, the plugin maps `AccessLevel.PROTECTED` to Kotlin's `protected` visibility,
so the generated declaration is only visible inside the annotated class and its subclasses:

```kotlin
import lombok.AccessLevel
import lombok.extern.java.Log

@Log(access = AccessLevel.PROTECTED)
open class Message {
    fun send() {
        // Uses the logger inside the class
        log.info("Sending a message")
    }
}

fun main() {
    // Error: the logger is protected and isn't visible here
    Message.log.info("Sending a message")
}
```

In Java, `AccessLevel.PROTECTED` also allows access from the same package. The plugin keeps this behavior for
declarations generated for Java classes.

Kotlin has no package-private visibility, so `AccessLevel.MODULE` and `AccessLevel.PACKAGE` aren't supported on Kotlin
classes. If you use them, the compiler reports the `UNSUPPORTED_ACCESS_LEVEL` error.

### Loggers

The Lombok plugin supports logger annotations from the `lombok.extern` package, namely:

* `@Slf4j`
* `@Log`
* `@CommonsLog`
* `@Flogger`
* `@JBossLog`
* `@Log4j`
* `@Log4j2`
* `@XSlf4j`

They generate a logger property in the companion object of the annotated class. The plugin names the logger after
the annotated class, not after its companion object:

```kotlin
import lombok.extern.slf4j.Slf4j

@Slf4j
class Message {
    fun send() {
        // Uses the logger named after the Message class
        log.info("Sending a message")
    }
}
```

To use another name for the logger, set the `topic` argument of the annotation:

```kotlin
import lombok.extern.java.Log

@Log(topic = "messages")
class Message
```

If the annotated class already declares a property with the same name as the generated logger, the compiler reports a warning.
You also can't apply the logger annotations to a companion object.

The plugin also supports the [Lombok configuration keys](#configure-lombok) that configure the generated property:

* `lombok.log.fieldName` sets the name of the generated property.
* `lombok.log.fieldIsStatic` defines where the plugin generates the property: with the default `true` value, the property
  belongs to the companion object of the annotated class, and with `false`, it becomes a property of the class itself.

### Constructors

The `@NoArgsConstructor` annotation generates a constructor without parameters for the annotated class. If you set the
`staticName` argument, the plugin also generates a factory function with this name in the companion object:

```kotlin
import lombok.NoArgsConstructor

@NoArgsConstructor(force = true)
class Message(val id: Int, val text: String)

@NoArgsConstructor(staticName = "make", force = true)
class Note(val id: Int, val text: String)

fun main() {
    // Calls the generated constructor
    val message = Message()

    // Calls the generated factory function
    val note = Note.make()
}
```

The `force = true` argument lets the generated constructor leave the properties without a value. The plugin assigns
them the default JVM values, namely `0` for numbers, `false` for `Boolean`, and `null` for references. Property
initializers and `init` blocks don't run, so a property with a non-nullable type can hold `null` after the
constructor returns:

```kotlin
import lombok.NoArgsConstructor

@NoArgsConstructor(force = true)
class Message(val id: Int, val text: String) {
    init {
        println("Creating a message")
    }
}

fun main() {
    // Doesn't print anything: the init block doesn't run
    val message = Message()

    println(message.id)
    // 0
}
```

You can't apply `@NoArgsConstructor` in the following cases:

* On an interface, a value class, or an inner class. The annotation has no effect: the plugin generates nothing,
  and the compiler reports a warning.
* On a class that already declares a constructor without parameters. Similarly, if the name in `staticName` clashes
  with a function in the class or in its companion object.
* On a class whose superclass has no constructor without parameters. The compiler reports an error.

The plugin also supports the [Lombok configuration keys](#configure-lombok) that track where your project uses 
the constructor annotations:

* `lombok.noArgsConstructor.flagUsage`
* `lombok.anyConstructor.flagUsage`

With these keys, the compiler reports a warning or an error for every usage of the corresponding annotations,
depending on the key value.

### String representations

The `@ToString` annotation generates a `toString()` function that returns the name of the annotated class with the
names and values of its properties:

```kotlin
import lombok.ToString

@ToString
class Message(val id: Int, val text: String)

fun main() {
    println(Message(1, "Hello"))
    // Message(id=1, text=Hello)
}
```

The generated function uses only the properties that have a backing field, so it skips a property that has only a
custom getter.

Just like Lombok in Java, the generated function prints a property of an array type by content, including nested
arrays:

```kotlin
import lombok.ToString

@ToString
class Message(val tags: Array<String>)

fun main() {
    println(Message(arrayOf("news", "sports")))
    // Message(tags=[news, sports])
}
```

To choose the properties that the generated function uses, annotate them with `@ToString.Include` or
`@ToString.Exclude`:

```kotlin
import lombok.ToString

@ToString
class Message(val id: Int, @ToString.Exclude val text: String)

fun main() {
    println(Message(1, "Hello"))
    // Message(id=1)
}
```

The generated function also skips the properties whose names start with `$`, just like Lombok in Java. To use such properties:

* Mark them with the `@ToString.Include` annotaiton.
* Set the `onlyExplicitlyIncluded` argument of the annotation to `true` to use only the properties with `@ToString.Include`.

In these cases, the `@ToString.Exclude` annotation is redundant, and the compiler reports a warning.

You can't apply `@ToString` to a class whose superclass declares `toString()` as `final`. In this case, the compiler
reports an error.

### Equals and hash codes

The `hashCode()` function that the plugin generates for a class annotated with `@EqualsAndHashCode` follows the same
algorithm as Lombok in Java. A property with the `null` value contributes a dedicated constant to the resulting hash
code, so instances with a `null` property don't share a hash code with instances whose property has a hash code of `0`,
for example, an `Int` equal to `0` or an empty string:

```kotlin
import lombok.EqualsAndHashCode

@EqualsAndHashCode
class Message(val id: Int?)

fun main() {
    val withoutId = Message(null)
    val withZeroId = Message(0)

    println(withoutId == withZeroId) // false
    println(withoutId.hashCode() == withZeroId.hashCode()) // false
}
```

The generated functions compare properties of an array type by content, just like Lombok in Java does. For this
reason, `@EqualsAndHashCode` is also useful on a data class, where the `equals()` function compares arrays only by
reference:

```kotlin
import lombok.EqualsAndHashCode

@EqualsAndHashCode
class Message(val tags: Array<String>)

fun main() {
    println(Message(arrayOf("news")) == Message(arrayOf("news"))) // true
}
```

Like Lombok in Java, the plugin generates a `canEqual()` function next to `equals()` and `hashCode()` for every class
annotated with `@EqualsAndHashCode` that a subclass can extend or that already has a supertype, namely:

* `open`, `abstract`, and `sealed` classes.
* Classes with a supertype other than `Any`.

The generated `equals()` function calls `canEqual()` on the other instance, so a superclass doesn't accept a subclass
that doesn't accept it back, and the comparison gives the same result in both directions:

```kotlin
import lombok.EqualsAndHashCode

@EqualsAndHashCode
open class Message(val id: Int)

@EqualsAndHashCode(callSuper = true)
class TextMessage(id: Int, val text: String) : Message(id)

fun main() {
    val message = Message(1)
    val textMessage = TextMessage(1, "Hello")

    println(message == textMessage) // false
    println(textMessage == message) // false
}
```

The `callSuper = true` argument makes the generated functions take the superclass into account. If you
annotate a class that has a supertype other than `Any` and don't set `callSuper` explicitly, the compiler reports a
warning. On a class without such a supertype, `callSuper = true` is an error, because there's nothing to call.

To choose the properties that the generated functions use, annotate them with `@EqualsAndHashCode.Include` or
`@EqualsAndHashCode.Exclude`. Like Lombok in Java, the generated functions skip the properties whose names start with
`$`. To use such properties:

* Mark them with `@EqualsAndHashCode.Include`.
* Set the `onlyExplicitlyIncluded` argument of the annotation to `true` to use only the properties with `@EqualsAndHashCode.Include`. 

In such cases, the `@EqualsAndHashCode.Exclude` annotation is redundant, and the compiler reports a warning.

You can't apply `@EqualsAndHashCode` in the following cases:

* On an enum class, because `java.lang.Enum` declares `equals()` and `hashCode()` as `final`. The compiler reports an
  error.
* On a class whose superclass declares `equals()` or `hashCode()` as `final`. The compiler reports an error.
* On a named object or a companion object, which has a single instance. The annotation has no effect: the plugin
  generates nothing, and the compiler reports a warning.

> If a class annotated with `@EqualsAndHashCode` already declares `equals()` or `hashCode()`, the compiler reports an error
> and generates neither function. Lombok in Java reports a warning in the same case.
>
> To write these functions yourself, remove the annotation from the class.
> 
{style="note"}

### Multiple annotations

You can apply several Lombok annotations to the same Kotlin class, including annotations that each contribute a
declaration to the companion object:

```kotlin
import lombok.AccessLevel
import lombok.NoArgsConstructor
import lombok.extern.java.Log

@Log(access = AccessLevel.PUBLIC)
@NoArgsConstructor(staticName = "make", force = true)
class Message(val id: Int, val text: String)

fun main() {
    // Uses the logger generated by @Log
    Message.log.info("Creating a message")

    // Uses the factory method generated by @NoArgsConstructor
    val message = Message.make()

    println(message.id) // 0
}
```

In this example, both `@Log` and `@NoArgsConstructor` generate declarations in the companion object of the `Message`
class, and the plugin generates a single companion object that contains both of them.

## Using with kapt

By default, the [kapt](kapt.md) compiler plugin runs all annotation processors and disables annotation processing by javac.
To run [Lombok](https://projectlombok.org/) along with kapt, set up kapt to keep javac's annotation processors working.

If you use Gradle, add the option to the `build.gradle(.kts)` file:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

In Maven, use the following settings to launch Lombok with Java's compiler:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>    
```

The Lombok compiler plugin works correctly with [kapt](kapt.md) if annotation processors don't depend on the code generated by Lombok.

Look through the test project examples of kapt and the Lombok compiler plugin in use:

* Using [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt).
* Using [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

## What's next

For more information on the Lombok library configuration, see the [official documentation](https://projectlombok.org/features/configuration).