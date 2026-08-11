[//]: # (title: No-arg compiler plugin)

The `no-arg` compiler plugin generates a zero-argument constructor for classes with a specific annotation.

The generated constructor is synthetic, so you can't call it directly from Java or Kotlin, but frameworks can call it through [reflection](reflection.md).

This lets the Java Persistence API (JPA) instantiate a class that doesn't declare a zero-argument constructor in Kotlin or Java.

> For JPA entities with Kotlin, you can use the [`kotlin-jpa` compiler plugin](kotlin-jpa-plugin.md).
> It specifies JPA annotations such as `@Entity`, `@Embeddable`, and `@MappedSuperclass` automatically.
>
{style="note"}

## Declare an annotation

Before enabling the `no-arg` plugin, declare an annotation to mark the classes that need a zero-argument constructor.
For example, `NoArgAnnotation`:

```kotlin
package com.example

annotation class NoArgAnnotation
```

## Apply the plugin

### Gradle

Add the `no-arg` plugin in the `plugins {}` block of your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"  // The version of Kotlin to use
    kotlin("plugin.noarg") version "%kotlinVersion%" // The Kotlin no-arg plugin
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
    id "org.jetbrains.kotlin.plugin.noarg" version "%kotlinVersion%"
}
```

</tab>
</tabs>

Then specify the annotations that make the plugin generate a zero-argument constructor for the annotated classes:

```groovy
noArg {
    annotation("com.example.NoArgAnnotation")
}
```

Enable the `invokeInitializers` option if you want the plugin to run the class initialization logic
from the synthetic constructor. This option is disabled by default:

```groovy
noArg {
    invokeInitializers = true
}
```

### Maven

Add the plugin to your `pom.xml` file:

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.example.NoArgAnnotation</option>
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

## Use the no-arg plugin

When the plugin is applied, classes annotated with a registered annotation get a synthetic zero-argument constructor
at compile time. You don't need to declare the constructor manually:

```kotlin
package com.example

// The no-arg plugin generates a synthetic zero-argument constructor for this class
@NoArgAnnotation
class MyEntity(val id: Int)
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

* For JPA entities, use the [`kotlin-jpa` plugin](kotlin-jpa-plugin.md), which configures the `no-arg` and `all-open`
  plugins with JPA annotations such as `@Entity`, `@Embeddable`, and `@MappedSuperclass`.
* Explore the source code of the [no-arg compiler plugin](https://github.com/JetBrains/kotlin/tree/master/plugins/noarg).