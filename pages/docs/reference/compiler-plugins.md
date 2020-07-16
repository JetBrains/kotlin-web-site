---
type: doc
layout: reference
title: "Compiler Plugins"
---

# Compiler Plugins

* [All-open compiler plugin](#all-open-compiler-plugin)
* [No-arg compiler plugin](#no-arg-compiler-plugin)
* [SAM-with-receiver compiler plugin](#sam-with-receiver-compiler-plugin)
* [`Parcelable` implementations generator](#parcelable-implementations-generator)

## All-open compiler plugin

Kotlin has classes and their members `final` by default, which makes it inconvenient to use frameworks and libraries such as Spring AOP that require classes to be `open`. The *all-open* compiler plugin adapts Kotlin to the requirements of those frameworks and makes classes annotated with a specific annotation and their members open without the explicit `open` keyword.

For instance, when you use Spring, you don't need all the classes to be open, but only classes annotated with specific annotations like `@Configuration` or `@Service`. *All-open* allows to specify such annotations.

We provide *all-open* plugin support both for Gradle and Maven with the complete IDE integration.

Note: For Spring you can use the `kotlin-spring` compiler plugin ([see below](compiler-plugins.html#spring-support)).

### Using in Gradle

Add the plugin artifact to the buildscript dependencies and apply the plugin:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-allopen"
```

</div>

As an alternative, you can enable it using the `plugins` block:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.allopen" version "{{ site.data.releases.latest.version }}"
}
```

</div>

Then specify the list of annotations that will make classes open:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</div>

If the class (or any of its superclasses) is annotated with `com.my.Annotation`, the class itself and all its members will become open.

It also works with meta-annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

</div>

`MyFrameworkAnnotation` is annotated with the all-open meta-annotation `com.my.Annotation`, so it becomes an all-open annotation as well.

### Using in Maven

Here's how to use all-open with Maven:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "spring" for the Spring support -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- Each annotation is placed on its own line -->
            <option>all-open:annotation=com.my.Annotation</option>
            <option>all-open:annotation=com.their.AnotherAnnotation</option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

</div>

Please refer to the "Using in Gradle" section above for the detailed information about how all-open annotations work.

### Spring support

If you use Spring, you can enable the *kotlin-spring* compiler plugin instead of specifying Spring annotations manually. The kotlin-spring is a wrapper on top of all-open, and it behaves exactly the same way.

As with all-open, add the plugin to the buildscript dependencies:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-spring" // instead of "kotlin-allopen"
```

</div>

Or using the Gradle plugins DSL:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.spring" version "{{ site.data.releases.latest.version }}"
}
```

</div>

In Maven, the `spring` plugin is provided by the `kotlin-maven-allopen` plugin dependency, so to enable it:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<configuration>
    <compilerPlugins>
        <plugin>spring</plugin>
    </compilerPlugins>
</configuration>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-allopen</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

</div>

The plugin specifies the following annotations: 
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html), [`@Async`](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html), [`@Transactional`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), [`@Cacheable`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html) and [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html). Thanks to meta-annotations support classes annotated with [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html), [`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html), [`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html) or [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html) are automatically opened since these annotations are meta-annotated with [`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html).
 
Of course, you can use both `kotlin-allopen` and `kotlin-spring` in the same project.

Note that if you use the project template generated by the [start.spring.io](http://start.spring.io/#!language=kotlin) service, the `kotlin-spring` plugin will be enabled by default.

### Using in CLI

All-open compiler plugin JAR is available in the binary distribution of the Kotlin compiler. You can attach the plugin by providing the path to its JAR file using the `Xplugin` kotlinc option:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

</div>

You can specify all-open annotations directly, using the `annotation` plugin option, or enable the "preset". The only preset available now for all-open is `spring`.

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

</div>

## No-arg compiler plugin

The *no-arg* compiler plugin generates an additional zero-argument constructor for classes with a specific annotation. 

The generated constructor is synthetic so it can’t be directly called from Java or Kotlin, but it can be called using reflection.

This allows the Java Persistence API (JPA) to instantiate a class although it doesn't have the zero-parameter constructor from Kotlin or Java point of view (see the description of `kotlin-jpa` plugin [below](compiler-plugins.html#jpa-support)).

### Using in Gradle

The usage is pretty similar to all-open.

Add the plugin and specify the list of annotations that must lead to generating a no-arg constructor for the annotated classes.

 <div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-noarg"
```

</div>

Or using the Gradle plugins DSL:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.noarg" version "{{ site.data.releases.latest.version }}"
}
```

</div>

Then specify the list of no-arg annotations:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

</div>

Enable `invokeInitializers` option if you want the plugin to run the initialization logic from the synthetic constructor. Starting from Kotlin 1.1.3-2, it is disabled by default because of [`KT-18667`](https://youtrack.jetbrains.com/issue/KT-18667) and [`KT-18668`](https://youtrack.jetbrains.com/issue/KT-18668) which will be addressed in the future.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
noArg {
    invokeInitializers = true
}
```

</div>

### Using in Maven

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "jpa" for JPA support -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- Call instance initializers in the synthetic constructor -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

</div>

### JPA support

As with the *kotlin-spring* plugin, *kotlin-jpa* is a wrapped on top of *no-arg*. The plugin specifies 
[`@Entity`](http://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html), [`@Embeddable`](http://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) and [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) 
*no-arg* annotations automatically.

That's how you add the plugin in Gradle: 

<div class="sample" markdown="1" theme="idea" mode="groovy">

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-jpa"
```

</div>

Or using the Gradle plugins DSL:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.jpa" version "{{ site.data.releases.latest.version }}"
}
```

</div>

In Maven, enable the `jpa` plugin:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

</div>

### Using in CLI

As with all-open, add the plugin JAR file to the compiler plugin classpath and specify annotations or presets:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```

</div>


## SAM-with-receiver compiler plugin

The *sam-with-receiver* compiler plugin makes the first parameter of the annotated Java "single abstract method" (SAM) interface method a receiver in Kotlin. This conversion only works when the SAM interface is passed as a Kotlin lambda, both for SAM adapters and SAM constructors (see the [documentation](https://kotlinlang.org/docs/reference/java-interop.html#sam-conversions) for more details).

Here is an example:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
public @interface SamWithReceiver {}

@SamWithReceiver
public interface TaskRunner {
    void run(Task task);
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun test(context: TaskContext) {
    val runner = TaskRunner { 
        // Here 'this' is an instance of 'Task'
        
        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

</div>

### Using in Gradle

The usage is the same to all-open and no-arg, except the fact that sam-with-receiver does not have any built-in presets, and you need to specify your own list of special-treated annotations.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-sam-with-receiver:$kotlin_version"
    }
}

apply plugin: "kotlin-sam-with-receiver"
```

</div>

Then specify the list of SAM-with-receiver annotations:

<div class="sample" markdown="1" theme="idea"  mode="groovy">

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

</div>

### Using in Maven

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <plugin>sam-with-receiver</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>
                sam-with-receiver:annotation=com.my.SamWithReceiver
            </option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-sam-with-receiver</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

</div>

### Using in CLI

Just add the plugin JAR file to the compiler plugin classpath and specify the list of sam-with-receiver annotations:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```

</div>

## `Parcelable` implementations generator

Android Extensions plugin provides [`Parcelable`](https://developer.android.com/reference/android/os/Parcelable) implementation generator.

Annotate the class with `@Parcelize`, and a `Parcelable` implementation will be generated automatically.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinx.android.parcel.Parcelize

@Parcelize
class User(val firstName: String, val lastName: String, val age: Int): Parcelable
```
</div>

`@Parcelize` requires all serialized properties to be declared in the primary constructor. Android Extensions will issue a warning on each property 
with a backing field declared in the class body. Also, `@Parcelize` can't be applied if some of the primary constructor parameters are not properties.

If your class requires more advanced serialization logic, write it inside a companion class:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Parcelize
data class User(val firstName: String, val lastName: String, val age: Int) : Parcelable {
    private companion object : Parceler<User> {
        override fun User.write(parcel: Parcel, flags: Int) {
            // Custom write implementation
        }

        override fun create(parcel: Parcel): User {
            // Custom read implementation
        }
    }
}
```
</div>


### Supported types

`@Parcelize` supports a wide range of types:

- primitive types (and their boxed versions);
- objects and enums;
- `String`, `CharSequence`;
- `Exception`;
- `Size`, `SizeF`, `Bundle`, `IBinder`, `IInterface`, `FileDescriptor`;
- `SparseArray`, `SparseIntArray`, `SparseLongArray`, `SparseBooleanArray`;
- all `Serializable` (yes, `Date` is supported too) and `Parcelable` implementations;
- collections of all supported types: `List` (mapped to `ArrayList`), `Set` (mapped to `LinkedHashSet`), `Map` (mapped to `LinkedHashMap`);
    + Also a number of concrete implementations: `ArrayList`, `LinkedList`, `SortedSet`, `NavigableSet`, `HashSet`, `LinkedHashSet`, `TreeSet`, `SortedMap`, `NavigableMap`, `HashMap`, `LinkedHashMap`, `TreeMap`, `ConcurrentHashMap`;
- arrays of all supported types;
- nullable versions of all supported types.


### Custom `Parceler`s

Even if your type is not supported directly, you can write a `Parceler` mapping object for it.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class ExternalClass(val value: Int)

object ExternalClassParceler : Parceler<ExternalClass> {
    override fun create(parcel: Parcel) = ExternalClass(parcel.readInt())

    override fun ExternalClass.write(parcel: Parcel, flags: Int) {
        parcel.writeInt(value)
    }
}
```
</div>

External parcelers can be applied using `@TypeParceler` or `@WriteWith` annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// Class-local parceler
@Parcelize
@TypeParceler<ExternalClass, ExternalClassParceler>()
class MyClass(val external: ExternalClass)

// Property-local parceler
@Parcelize
class MyClass(@TypeParceler<ExternalClass, ExternalClassParceler>() val external: ExternalClass)

// Type-local parceler
@Parcelize
class MyClass(val external: @WriteWith<ExternalClassParceler>() ExternalClass)
```
</div>
