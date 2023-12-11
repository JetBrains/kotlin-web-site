[//]: # (title: kapt compiler plugin)

> kapt is in maintenance mode. We are keeping it up-to-date with recent Kotlin and Java releases 
> but have no plans to implement new features. Please use the [Kotlin Symbol Processing API (KSP)](ksp-overview.md) for annotation processing.
> [See the list of libraries supported by KSP](ksp-overview.md#supported-libraries).
>
{type="warning"}

Annotation processors (see [JSR 269](https://jcp.org/en/jsr/detail?id=269)) are supported in Kotlin with the _kapt_ compiler plugin.

In a nutshell, you can use libraries such as [Dagger](https://google.github.io/dagger/) or
[Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html) in your Kotlin projects.

Please read below about how to apply the *kapt* plugin to your Gradle/Maven build.

## Use in Gradle

Follow these steps:
1. Apply the `kotlin-kapt` Gradle plugin:

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

2. Add the respective dependencies using the `kapt` configuration in your `dependencies` block:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       kapt("groupId:artifactId:version")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:version'
   }
   ```

   </tab>
   </tabs>

3. If you previously used the [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
   for annotation processors, replace usages of the `annotationProcessor` configuration with `kapt`.
   If your project contains Java classes, `kapt` will also take care of them.

   If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named
   `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extends `kapt`, so you can just provide the
   `kapt` dependency and it will be available both for production sources and tests.

## Try Kotlin K2 compiler

> Support for K2 in the kapt compiler plugin is [Experimental](components-stability.md). Opt-in is required (see details below),
> and you should use it only for evaluation purposes.
>
{type="warning"}

From Kotlin 1.9.20, you can try using the kapt compiler plugin with the [K2 compiler](https://blog.jetbrains.com/kotlin/2021/10/the-road-to-the-k2-compiler/),
which brings performance improvements and many other benefits. To use the K2 compiler in your project, add the following
options to your `gradle.properties` file:

```kotlin
kotlin.experimental.tryK2=true
kapt.use.k2=true
```
Alternatively, you can enable K2 for kapt by completing the following steps:
1. In your `build.gradle.kts` file, [set the language version](gradle-compiler-options.md#example-of-setting-a-languageversion) to `2.0`.
2. In your `gradle.properties` file, add `kapt.use.k2=true`.

If you encounter any issues when using kapt with the K2 compiler, please report them to our
[issue tracker](http://kotl.in/issue).

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

## Improve the speed of builds that use kapt

### Run kapt tasks in parallel

To improve the speed of builds that use kapt, you can enable the [Gradle Worker API](https://guides.gradle.org/using-the-worker-api/)
for kapt tasks. Using the Worker API lets Gradle run independent annotation processing tasks from a single project in parallel,
which in some cases significantly decreases the execution time.

When you use the [custom JDK home](gradle-configure-project.md#gradle-java-toolchains-support) feature in the Kotlin Gradle plugin,
kapt task workers use only [process isolation mode](https://docs.gradle.org/current/userguide/worker_api.html#changing_the_isolation_mode).
Note that the `kapt.workers.isolation` property is ignored.

If you want to provide additional JVM arguments for a kapt worker process, use the input `kaptProcessJvmArgs` of the `KaptWithoutKotlincTask`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask>()
    .configureEach {
        kaptProcessJvmArgs.add("-Xmx512m")
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask.class)
    .configureEach {
        kaptProcessJvmArgs.add('-Xmx512m')
    }
```

</tab>
</tabs>

### Caching for annotation processors' classloaders

> Caching for annotation processors' classloaders in kapt is [Experimental](components-stability.md).
> It may be dropped or changed at any time. Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901).
>
{type="warning"}

Caching for annotation processors' classloaders helps kapt perform faster if you run many Gradle tasks consecutively.

To enable this feature, use the following properties in your `gradle.properties` file:

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

If you run into any problems with caching for annotation processors, disable caching for them:

```none
# specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

### Measure performance of annotation processors

Get a performance statistics on the annotation processors execution using the `-Kapt-show-processor-timings` plugin option. 
An example output:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

You can dump this report into a file with the plugin option [`-Kapt-dump-processor-timings` (`org.jetbrains.kotlin.kapt3:dumpProcessorTimings`)](https://github.com/JetBrains/kotlin/pull/4280). 
The following command will run kapt and dump the statistics to the `ap-perf-report.file` file:

```bash
kotlinc -cp $MY_CLASSPATH \
-Xplugin=kotlin-annotation-processing-SNAPSHOT.jar -P \
plugin:org.jetbrains.kotlin.kapt3:aptMode=stubsAndApt,\
plugin:org.jetbrains.kotlin.kapt3:apclasspath=processor/build/libs/processor.jar,\
plugin:org.jetbrains.kotlin.kapt3:dumpProcessorTimings=ap-perf-report.file \
-Xplugin=$JAVA_HOME/lib/tools.jar \
-d cli-tests/out \
-no-jdk -no-reflect -no-stdlib -verbose \
sample/src/main/
```

### Measure the number of files generated with annotation processors

The `kotlin-kapt` Gradle plugin can report statistics on the number of generated files for each annotation processor.

This is useful to track if there are unused annotation processors as a part of the build. 
You can use the generated report to find modules that trigger unnecessary annotation processors and update the modules to prevent that.

Enable the statistics in two steps:
* Set the `showProcessorStats` flag to `true` in your `build.gradle(.kts)`:

  ```kotlin
  kapt {
      showProcessorStats = true
  }
  ```

* Set the `kapt.verbose` Gradle property to `true` in your `gradle.properties`:

  ```none
  kapt.verbose=true
  ```

> You can also enable verbose output via the [command line option `verbose`](#use-in-cli).
>
> {type="note"}

The statistics will appear in the logs with the `info` level. You'll see the `Annotation processor stats:` line followed by 
statistics on the execution time of each annotation processor. After these lines, there will be the `Generated files report:` line 
followed by statistics on the number of generated files for each annotation processor. For example:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

## Compile avoidance for kapt

To improve the times of incremental builds with kapt, it can use the Gradle [compile avoidance](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance).
With compile avoidance enabled, Gradle can skip annotation processing when rebuilding a project. Particularly, annotation
processing is skipped when:

* The project's source files are unchanged.
* The changes in dependencies are [ABI](https://en.wikipedia.org/wiki/Application_binary_interface) compatible.
   For example, the only changes are in method bodies. 

However, compile avoidance can't be used for annotation processors discovered in the compile classpath since _any changes_
in them require running the annotation processing tasks. 

To run kapt with compile avoidance:
* Add the annotation processor dependencies to the `kapt*` configurations manually as described [above](#use-in-gradle).
* Turn off the discovery of annotation processors in the compile classpath by adding this line to your `gradle.properties` file:

```none
kapt.include.compile.classpath=false
```

## Incremental annotation processing

kapt supports incremental annotation processing that is enabled by default. 
Currently, annotation processing can be incremental only if all annotation processors being used are incremental. 

To disable incremental annotation processing, add this line to your `gradle.properties` file:

```none
kapt.incremental.apt=false
```

Note that incremental annotation processing requires [incremental compilation](gradle-compilation-and-caches.md#incremental-compilation)
to be enabled as well.
 
## Java compiler options

kapt uses Java compiler to run annotation processors.  
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
By default, kapt replaces every unknown type (including types for the generated classes) to `NonExistentClass`,
but you can change this behavior. Add the option to the `build.gradle(.kts)` file to enable error type inferring in stubs:

```groovy
kapt {
    correctErrorTypes = true
}
```

## Use in Maven

Add an execution of the `kapt` goal from kotlin-maven-plugin before `compile`: 

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal> <!-- You can skip the <goals> element 
        if you enable extensions for the plugin -->
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

To configure the level of annotation processing, set one of the following as the `aptMode` in the `<configuration>` block:

   * `stubs` – only generate stubs needed for annotation processing.
   * `apt` – only run annotation processing.
   * `stubsAndApt` – (default) generate stubs and run annotation processing.

For example:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

## Use in IntelliJ build system

kapt is not supported for IntelliJ IDEA's own build system. Launch the build from the "Maven Projects"
toolbar whenever you want to re-run the annotation processing.

## Use in CLI

kapt compiler plugin is available in the binary distribution of the Kotlin compiler.

You can attach the plugin by providing the path to its JAR file using the `Xplugin` kotlinc option:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

Here is a list of the available options:

* `sources` (*required*): An output path for the generated files.
* `classes` (*required*): An output path for the generated class files and resources.
* `stubs` (*required*): An output path for the stub files. In other words, some temporary directory.
* `incrementalData`: An output path for the binary stubs.
* `apclasspath` (*repeatable*): A path to the annotation processor JAR. Pass as many `apclasspath` options as the number of JARs that you have.
* `apoptions`: A base64-encoded list of the annotation processor options. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
* `javacArguments`: A base64-encoded list of the options passed to javac. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
* `processors`: A comma-specified list of annotation processor qualified class names. If specified, kapt does not try to find annotation processors in `apclasspath`.
* `verbose`: Enable verbose output.
* `aptMode` (*required*)
    * `stubs` – only generate stubs needed for annotation processing.
    * `apt` – only run annotation processing.
    * `stubsAndApt` – generate stubs and run annotation processing.
* `correctErrorTypes`: See [below](#use-in-gradle). Disabled by default.
* `dumpFileReadHistory`: An output path to dump for each file a list of classes used during annotation processing.

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

## Generate Kotlin sources

kapt can generate Kotlin sources. Just write the generated Kotlin source files to the directory specified by `processingEnv.options["kapt.kotlin.generated"]`,
and these files will be compiled together with the main sources.

Note that kapt does not support multiple rounds for the generated Kotlin files.

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

## Keep Java compiler's annotation processors

By default, kapt runs all annotation processors and disables annotation processing by javac.
However, you may need some of javac's annotation processors working (for example, [Lombok](https://projectlombok.org/)).

In the Gradle build file, use the option `keepJavacAnnotationProcessors`:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

If you use Maven, you need to specify concrete plugin settings.
See this [example of settings for the Lombok compiler plugin](lombok.md#using-with-kapt).