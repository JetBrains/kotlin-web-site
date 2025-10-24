[//]: # (title: No-arg compiler plugin)

<!--TODO: rewrite the intro -->
The `no-arg` compiler plugin generates an additional zero-argument constructor for classes with a specific annotation. 

The generated constructor is synthetic, so it can't be directly called from Java or Kotlin, but it can be called using reflection.

This allows the Java Persistence API (JPA) to instantiate a class, although it doesn't have the zero-parameter constructor
from a Kotlin or Java point of view (see the description of `kotlin-jpa` plugin [below](kotlin-jpa-plugin.md).

> For Spring applications with Kotlin, you can use the [`kotlin-jpa` compiler plugin](kotlin-jpa-plugin.md).
>
{style="note"}

## Declare an annotation

Before enabling the `no-arg` plugin, declare new annotations to mark the code that needs a zero-argument constructor.
For example, `NoArgAnnotation`:

```kotlin
package com.example

annotation class NoArgAnnotation
```

## Apply the plugin

### Gradle

Add the plugin using Gradle's plugins DSL:

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

Then specify the list of no-arg annotations that must lead to generating a no-arg constructor for the annotated classes:

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

Enable `invokeInitializers` option if you want the plugin to run the initialization logic from the synthetic constructor.
By default, it is disabled.

```groovy
noArg {
    invokeInitializers = true
}
```

### Maven

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

<!--
## Command-line compiler

Add the plugin JAR file to the compiler plugin classpath and specify annotations or presets:

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```
-->

## What's next?

<!--TODO: link to the jpa + spring plugins -->
* Explore the source code of the [all-open compiler plugin](https://github.com/JetBrains/kotlin/tree/master/plugins/allopen).