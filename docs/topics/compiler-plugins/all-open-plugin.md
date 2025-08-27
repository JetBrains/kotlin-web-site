[//]: # (title: All-open compiler plugin)

In Kotlin, classes and their members are `final` by default. This can cause issues with frameworks and libraries that rely on
subclassing and runtime proxies, which require classes to be `open`.

The `all-open` compiler plugin makes classes and their members open without using the `open` keyword at the compile time. 
To use it, create an annotation, add it in the plugin options, and annotate the classes you want to make open:

```kotlin
@YourAnnotation
class MyService {
    // This class and all its members are open now
    fun doWork() { /* ... */ }
}
```

If a class or any of its superclasses is annotated with a configured annotation, the class and its members become `open`.

> For Spring applications with Kotlin, you can use the [`kotlin-spring` compiler plugin](kotlin-spring-plugin.md).
>
{style="note"}

## Create an annotation

Before enabling the `all-open` plugin, create an annotation to mark the classes you want to make open:

```kotlin
package com.example

annotation class AllOpenMarker()
```


## Apply the plugin

### Gradle

To enable the plugin, add it to the `plugins {}` block of your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("plugin.allopen") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id "org.jetbrains.kotlin.plugin.allopen" version "%kotlinVersion%"
}
```

</tab>
</tabs>

Then specify an annotation or a list of annotations that make classes open:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allOpen {
    annotation("com.example.AllOpenMarker")
    // You can specify multiple annotations:
    // annotations("com.example.AllOpenMarker", "com.anotherPackage.OtherAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allOpen {
    annotation("com.example.AllOpenMarker")
    // You can specify multiple annotations:
    // annotations("com.example.AllOpenMarker", "com.anotherPackage.OtherAnnotation")
}
```

</tab>
</tabs>


### Maven

Add the plugin in your `pom.xml` file:

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- Add multiple lines for multiple annotations  -->
            <option>all-open:annotation=com.example.AllOpenMarker</option>
            <option>all-open:annotation=com.anotherPackage.OtherAnnotation</option>
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

## Use the all-open plugin

If the class (or any of its superclasses) is annotated with created `com.example.AllOpenMarker`,
the class itself and all its members become open:

```kotlin
// Use the AllOpenMarker annotation in your project
package com.example

fun main() {
    // 
}

@AllOpenMarker
class TestClass {
    // This class and all its members are open
}
```

It also works with meta-annotations. If you mark another annotation with `AllOpenMarker`,
all classes and members annotated with it become open:

```kotlin
package com.example

// An annotation marked with a previously created annotation
@AllOpenMarker
annotation class AnotherAllOpenMarker()

@AllOpenMarker
class NewClass {
    // This class and all its members are open
}

@AnotherAllOpenMarker
class AnotherClass {
    // This class and all its members are open as well
}
```

<!-- 
## Command-line compiler

All-open compiler plugin JAR is available in the binary distribution of the Kotlin compiler. You can attach the plugin
by providing the path to its JAR file using the `-Xplugin` kotlinc option:

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

You can specify all-open annotations directly, using the `annotation` plugin option, or enable the _preset_:

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

Presets that available for the `all-open` plugin are: `spring`, `micronaut`, and `quarkus`.
-->

## What's next?

* Explore the source code of the [all-open compiler plugin](https://github.com/JetBrains/kotlin/tree/master/plugins/allopen)