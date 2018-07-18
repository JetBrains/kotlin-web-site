---
type: doc
layout: reference
title: "Using kapt"
---

# Annotation Processing with Kotlin

Annotation processors (see [JSR 269](https://jcp.org/en/jsr/detail?id=269)) are supported in Kotlin with the *kapt* compiler plugin.

Being short, you can use libraries such as [Dagger](https://google.github.io/dagger/) or [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) in your Kotlin projects.

Please read below about how to apply the *kapt* plugin to your Gradle/Maven build.

## Using in Gradle

Apply the `kotlin-kapt` Gradle plugin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
apply plugin: 'kotlin-kapt'
```
</div>

Or you can apply it using the plugins DSL:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "{{ site.data.releases.latest.version }}"
}
```
</div>

Then add the respective dependencies using the `kapt` configuration in your `dependencies` block:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```
</div>

If you previously used the [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config) for annotation processors, replace usages of the `annotationProcessor` configuration with `kapt`. If your project contains Java classes, `kapt` will also take care of them.

If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extends `kapt`, so you can just provide the `kapt` dependency and it will be available both for production sources and tests.

## Annotation Processor Arguments

Use `arguments {}` block to pass arguments to annotation processors:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```
</div>

## Java Compiler Options

Kapt uses Java compiler to run annotation processors.  
Here is how you can pass arbitrary options to javac:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```
</div>

## Non Existent Type Correction

Some annotation processors (such as `AutoFactory`) rely on precise types in declaration signatures. By default, Kapt replaces every unknown type (including types for the generated classes) to `NonExistentClass`, but you can change this behavior. Add the additional flag to the `build.gradle` file to enable error type inferring in stubs:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
kapt {
    correctErrorTypes = true
}
```
</div>

## Using in Maven

Add an execution of the `kapt` goal from kotlin-maven-plugin before `compile`: 

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here. -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```
 
You can find a complete sample project showing the use of Kotlin, Maven and Dagger in the
[Kotlin examples repository](https://github.com/JetBrains/kotlin-examples/tree/master/maven/dagger-maven-example).
 
Please note that kapt is still not supported for IntelliJ IDEA’s own build system. Launch the build from the “Maven Projects” toolbar whenever you want to re-run the annotation processing.


## Using in CLI

Kapt compiler plugin is available in the binary distribution of the Kotlin compiler.

You can attach the plugin by providing the path to its JAR file using the `Xplugin` kotlinc option:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

Here is a list of the available options:

* `sources` (*required*): An output path for the generated files.
* `classes` (*required*): An output path for the generated class files and resources.
* `stubs` (*required*): An output path for the stub files. In other words, some temporary directory.
* `incrementalData`: An output path for the binary stubs.
* `apclasspath` (*repeatable*): A path to the annotation processor JAR. Pass as many `apclasspath` options as many JARs you have.
* `apoptions`: A base64-encoded list of the annotation processor options. See [AP/javac options encoding](#apjavac-options-encoding) for more information.
* `javacArguments`: A base64-encoded list of the options passed to javac. See [AP/javac options encoding](#apjavac-options-encoding) for more information.
* `processors`: A comma-specified list of annotation processor qualified class names. If specified, kapt does not try to find annotation processors in `apclasspath`.
* `verbose`: Enable verbose output.
* `aptMode` (*required*)
    * `stubs` – only generate stubs needed for annotation processing;
    * `apt` – only run annotation processing;
    * `stubsAndApt` – generate stubs and run annotation processing.
* `correctErrorTypes`: See [below](#using-in-gradle). Disabled by default.

The plugin option format is: `-P plugin:<plugin id>:<key>=<value>`. Options can be repeated.

An example:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```


## Generating Kotlin Sources

Kapt can generate Kotlin sources. Just write the generated Kotlin source files to the directory specified by `processingEnv.options["kapt.kotlin.generated"]`, and these files will be compiled together with the main sources.

You can find the complete sample in the [kotlin-examples](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-code-generation) Github repository.

Note that Kapt does not support multiple rounds for the generated Kotlin files.


## AP/Javac Options Encoding

`apoptions` and `javacArguments` CLI options accept an encoded map of options.  
Here is how you can encode options by yourself:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
fun encodeList(options: Map<String, String>): String {
    val os = ByteArrayOutputStream()
    val oos = ObjectOutputStream(os)

    oos.writeInt(options.size)
    for ((key, value) in options.entries) {
        oos.writeUTF(key)
        oos.writeUTF(value)
    }

    oos.flush()
    return Base64.getEncoder().encodeToString(os.toByteArray())
}
```
</div>
