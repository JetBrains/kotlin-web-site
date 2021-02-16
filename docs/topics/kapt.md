[//]: # (title: Using kapt)

Annotation processors (see [JSR 269](https://jcp.org/en/jsr/detail?id=269)) are supported in Kotlin with the *kapt* compiler plugin.

In a nutshell, you can use libraries such as [Dagger](https://google.github.io/dagger/) or
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) in your Kotlin projects.

Please read below about how to apply the *kapt* plugin to your Gradle/Maven build.

## Using in Gradle

Apply the `kotlin-kapt` Gradle plugin:

<tabs>

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
}
```

```kotlin
plugins {
    kotlin("kapt") version "%kotlinVersion%"
}
```

</tabs>

Alternatively, you can use the `apply plugin` syntax:

```groovy
apply plugin: 'kotlin-kapt'
```

Then add the respective dependencies using the `kapt` configuration in your `dependencies` block:

<tabs>

```groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```

```kotlin
dependencies {
    kapt("groupId:artifactId:version")
}
```

</tabs>

If you previously used the [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
for annotation processors, replace usages of the `annotationProcessor` configuration with `kapt`.
If your project contains Java classes, `kapt` will also take care of them.

If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named
`kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extends `kapt`, so you can just provide the
`kapt` dependency and it will be available both for production sources and tests.

## Annotation processor arguments

Use `arguments {}` block to pass arguments to annotation processors:

```groovy
kapt {
    arguments {
        arg("key", "value")
    }
}
```

## Gradle build cache support

The kapt annotation processing tasks are [cached in Gradle](https://guides.gradle.org/using-build-cache/) by default.
However,  annotation processors run arbitrary code that may not necessarily transform the task inputs into the outputs,
might access and modify the files that are not tracked by Gradle etc. If the annotation processors used in the build cannot
be properly cached, it is possible to disable caching for kapt entirely by adding the following lines to the build script,
in order to avoid false-positive cache hits for the kapt tasks:

```groovy
kapt {
    useBuildCache = false
}
```

## Running kapt tasks in parallel (since 1.2.60)

To improve the speed of builds that use kapt, you can enable the [Gradle worker API](https://guides.gradle.org/using-the-worker-api/)
for kapt tasks. Using the worker API lets Gradle run independent annotation processing tasks from a single project in parallel,
which in some cases significantly decreases the execution time. 
However, running kapt with Gradle worker API enabled can result in increased memory consumption due to parallel execution. 

To use the Gradle worker API for parallel execution of kapt tasks, add this line to your `gradle.properties` file:

```
kapt.use.worker.api=true
```

## Compile avoidance for kapt (since 1.3.20)

To improve the times of incremental builds with kapt, it can use the Gradle [compile avoidance](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance).
With compile avoidance enabled, Gradle can skip annotation processing when rebuilding a project. Particularly, annotation
processing is skipped when:

* The project's source files are unchanged.
* The changes in dependencies are [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) compatible.
   For example, the only changes are in method bodies. 

However, compile avoidance can't be used for annotation processors discovered in the compile classpath since _any changes_
in them require running the annotation processing tasks. 

To run kapt with compile avoidance:
* Add the annotation processor dependencies to the `kapt*` configurations manually as described [above](#using-in-gradle).
* Turn off the discovery of annotation processors in the compile classpath by adding this line to your `gradle.properties` file:

```
kapt.include.compile.classpath=false
```

## Incremental annotation processing

Kapt supports incremental annotation processing that is enabled by default. 
Currently, annotation processing can be incremental only if all annotation processors being used are incremental. 

To disable incremental annotation processing, add this line to your `gradle.properties` file:

```
kapt.incremental.apt=false
```

Note that incremental annotation processing requires [incremental compilation](gradle.md#incremental-compilation)
to be enabled as well.
 
## Java compiler options

Kapt uses Java compiler to run annotation processors.  
Here is how you can pass arbitrary options to javac:

```groovy
kapt {
    javacOptions {
        // Increase the max count of errors from annotation processors.
        // Default is 100.
        option("-Xmaxerrs", 500)
    }
}
```

## Non-existent type correction

Some annotation processors (such as `AutoFactory`) rely on precise types in declaration signatures.
By default, Kapt replaces every unknown type (including types for the generated classes) to `NonExistentClass`,
but you can change this behavior. Add the additional flag to the `build.gradle` file to enable error type inferring in stubs:

```groovy
kapt {
    correctErrorTypes = true
}
```

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
 
Please note that kapt is still not supported for IntelliJ IDEA’s own build system. Launch the build from the “Maven Projects”
toolbar whenever you want to re-run the annotation processing.

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
* `apoptions`: A base64-encoded list of the annotation processor options. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
* `javacArguments`: A base64-encoded list of the options passed to javac. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
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

## Generating Kotlin sources

Kapt can generate Kotlin sources. Just write the generated Kotlin source files to the directory specified by `processingEnv.options["kapt.kotlin.generated"]`,
and these files will be compiled together with the main sources.

You can find the complete sample in the [kotlin-examples](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/kotlin-code-generation)
Github repository.

Note that Kapt does not support multiple rounds for the generated Kotlin files.

## AP/Javac options encoding

`apoptions` and `javacArguments` CLI options accept an encoded map of options.  
Here is how you can encode options by yourself:

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

