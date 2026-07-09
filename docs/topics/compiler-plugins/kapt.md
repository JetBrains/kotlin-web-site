[//]: # (title: kapt compiler plugin)

<tldr>

* Use **kapt** if:
   * You have a Maven project.
   * You have a Gradle project, but the required Java annotation processor doesn't support KSP yet. [See the list of supported libraries](ksp-overview.md#supported-libraries).
* Use **[KSP](ksp-overview.md)** if:
   * You have a Gradle project, and the required Java annotation processor supports KSP.
   * You want to create your own annotation processors.

</tldr>

The kapt compiler plugin allows you to use existing Java annotation processors in Kotlin and works with both Maven and Gradle.
It generates stub files from Kotlin source code and then runs the Java annotation processors on those stubs.

This enables Java-based annotation processing in your Kotlin projects for libraries like [MapStruct](https://mapstruct.org/)
and [Data Binding](https://developer.android.com/topic/libraries/data-binding/index.html).

> kapt is not supported in the IntelliJ build system. To re-run annotation processing in IntelliJ IDEA, launch the build
> from the **Maven** tool window.
>
{style="warning"}

## Set up the plugin

You can configure the kapt plugin for [Gradle](#set-up-in-gradle), [Maven](#set-up-in-maven), or use it from the [command line](#cli).

### Gradle {id="set-up-in-gradle"}

To use kapt in Gradle, follow these steps:

1. Apply the `kapt` Gradle plugin in your build script file `build.gradle(.kts)`:

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

2. Add the respective dependencies using the `kapt` configuration in the `dependencies {}` block:

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

3. If you previously used the [Android support](https://developer.android.com/build/annotation-processors)
   for annotation processors, replace usages of the `annotationProcessor` configuration with `kapt`.
   If your project contains Java classes, the kapt plugin processes them as well.

   If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named
   `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extend `kapt`, so you can provide the
   `kapt` dependency, and it will be available both for production sources and tests.

### Maven {id="set-up-in-maven"}

You can set up kapt using either the [`<extensions>` option](#automatic-configuration) to simplify setup or
[manually](#manual-configuration) to get full control over kapt's execution.

#### Automatic configuration

You can simplify kapt configuration by enabling the `<extensions>` option for the Kotlin Maven plugin. In this case,
you don't need to manually set up kapt's `<execution>` section with goals or source directories.

To automatically configure kapt, set the `<extensions>` option to `true` for the `kotlin-maven-plugin` in your `pom.xml` build file:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions>
    <configuration>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.6.3</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

For more information on the `<extensions>` option, see [Automatic configuration](maven-configure-project.md#automatic-configuration).

#### Manual configuration

To manually set up kapt in your Kotlin Maven project, add an execution of the `kapt` goal from `kotlin-maven-plugin` before the `compile` execution:

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
            <!-- Specify your annotation processors here -->
            <annotationProcessorPath>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.6.3</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```

##### Configure kapt annotation processing

To configure the mode of annotation processing, set the `<aptMode>` option in the `<configuration>` block:

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

### CLI

The kapt compiler plugin is available in the binary distribution of the Kotlin compiler.

You can attach the plugin by providing the path to its JAR file using the `-Xplugin` Kotlin compiler option:

```bash
-Xplugin=$KOTLIN_HOME/lib/kotlin-annotation-processing.jar
```

Here is the list of the available options:

* `sources` (*required*): An output path for the generated files.
* `classes` (*required*): An output path for the generated class files and resources.
* `stubs` (*required*): A temporary output path for the stub files.
* `incrementalData`: An output path for the binary stubs.
* `apclasspath` (*repeatable*): A path to the annotation processor JAR. Pass one `apclasspath` option for each JAR.
* `apoptions`: A Base64-encoded list of the annotation processor options. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
* `javacArguments`: A Base64-encoded list of the options passed to javac. See [AP/javac options encoding](#ap-javac-options-encoding) for more information.
* `processors`: A comma-separated list of annotation processor qualified class names. If specified, kapt does not try to find annotation processors in `apclasspath`.
* `verbose`: Enable verbose output.
* `aptMode` (*required*)
    * `stubs` – only generate stubs needed for annotation processing.
    * `apt` – only run annotation processing.
    * `stubsAndApt` – generate stubs and run annotation processing.
* `correctErrorTypes`: For more information, see [Non-existent type correction](#non-existent-type-correction). Disabled by default.
* `dumpFileReadHistory`: An output path to dump for each file a list of classes used during annotation processing.

The plugin option format is: `-P plugin:<plugin id>:<key>=<value>`. Options can be repeated.

Here's an example:

```bash
-P plugin:org.jetbrains.kotlin.kapt3:sources=build/kapt/sources
-P plugin:org.jetbrains.kotlin.kapt3:classes=build/kapt/classes
-P plugin:org.jetbrains.kotlin.kapt3:stubs=build/kapt/stubs

-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/ap.jar
-P plugin:org.jetbrains.kotlin.kapt3:apclasspath=lib/anotherAp.jar

-P plugin:org.jetbrains.kotlin.kapt3:correctErrorTypes=true
```

## Configure annotation processors

### Pass arguments to annotation processors

Use the `arguments {}` block in your build script file `build.gradle(.kts)` to pass arguments to annotation processors:

```kotlin
kapt {
    arguments {
        arg("key", "value")
    }
}
```

### Configure processor classpath and discovery

You can disable the discovery of annotation processors that aren't included in kapt's processor path.
This excludes unnecessary annotation processors from the compile classpath.

#### Gradle {id="classpath-discovery-gradle"}

Gradle uses [compile avoidance](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)
to skip annotation processing during project rebuild, improving incremental build times with kapt. Particularly,
annotation processing is skipped when:

* The project's source files are unchanged.
* The changes in dependencies are [ABI](https://en.wikipedia.org/wiki/Application_binary_interface)-compatible.
  For example, when only function bodies change.

However, compile avoidance can't be used for annotation processors discovered on the compile classpath, since changes
in their internal implementation require running the annotation processing tasks, even if the processors' ABI remains unchanged.

That's why we don't recommend using annotation processors from the compile classpath. To exclude these processors from
kapt processing, add the `kapt.include.compile.classpath` property to your `gradle.properties` file:

```none
# gradle.properties
kapt.include.compile.classpath=false
```

With the option set to `false`, annotation processor dependencies that aren't included in the processor path
(the `kapt*` configurations) are excluded from kapt processing.

#### Maven {id="classpath-discovery-maven"}

To exclude annotation processors that aren't included in the kapt's processor path, set the `includeCompileClasspath`
option to `false` in the `<execution>` section of the kapt plugin:

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
    </goals>
    <configuration>
        <includeCompileClasspath>false</includeCompileClasspath>
        <sourceDirs>...</sourceDirs>
        <annotationProcessorPaths>...</annotationProcessorPaths>
    </configuration>
</execution>
```

Alternatively, you can use the `kapt.include.compile.classpath` property in the `<properties>` section of your `pom.xml`:

```xml
<properties>
    <kapt.include.compile.classpath>false</kapt.include.compile.classpath>
</properties>
```

With the option set to `false`, annotation processors that aren't included in the `<annotationProcessorPaths>` section are
excluded from kapt processing.

If the `includeCompileClasspath` option isn't set and kapt detects an annotation processor on the compile classpath that isn't
explicitly defined in the processor path, you'll see a deprecation warning:

```none
[WARNING] Annotation processors discovery from compile classpath is deprecated.
Set 'kapt.include.compile.classpath=false' to disable discovery.
```

> To see the list of annotation processors that aren't included on the kapt classpath, run the build with the `--info` log
> level option.
>
{style="tip"}

### Inherit annotation processors from superconfigurations

You can define a common set of annotation processors in a separate Gradle configuration as a
superconfiguration and extend it further in kapt-specific configurations for your subprojects.

As an example, for a subproject using [MapStruct](https://mapstruct.org/), in your `build.gradle(.kts)` file, use the following configuration:

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("org.mapstruct:mapstruct:1.6.3")
    commonAnnotationProcessors("org.mapstruct:mapstruct-processor:1.6.3")
}
```

In this example, the `commonAnnotationProcessors` Gradle configuration is the common superconfiguration for annotation processing
that you want to be used for all your projects. You use the [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
method to add `commonAnnotationProcessors` as a superconfiguration. kapt sees that the `commonAnnotationProcessors`
Gradle configuration has a dependency on the MapStruct annotation processor. Therefore, kapt includes the MapStruct annotation processor
in its configuration for annotation processing.

### Keep Java compiler's annotation processors

By default, kapt runs all annotation processors and disables annotation processing by javac.
However, you may need javac to run some annotation processors, such as [Lombok](https://projectlombok.org/).

In the Gradle build file, use the option `keepJavacAnnotationProcessors`:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

If you use Maven, configure the plugin explicitly.
See this [example of setting up the Lombok compiler plugin](lombok.md#using-with-kapt).

## Optimize kapt builds

### Run kapt tasks in parallel

kapt uses the [Gradle Worker API](https://docs.gradle.org/current/userguide/worker_api.html) to run annotation processing tasks.
Using the Worker API lets Gradle run independent annotation processing tasks from a single project in parallel,
which in some cases significantly decreases the execution time.

If you set the [custom JDK version](gradle-configure-project.md#gradle-java-toolchains-support) in the Kotlin Gradle plugin,
kapt task workers use only the [`processIsolation()`](https://docs.gradle.org/current/userguide/worker_api.html#step_3_change_the_isolation_mode) mode.

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

### Use Gradle build cache safely

The kapt annotation processing tasks are [cached in Gradle](https://guides.gradle.org/using-build-cache/) by default.
However, annotation processors can run arbitrary code, which may not reliably transform task inputs into outputs,
or may access and modify files that Gradle doesn't track.
If the annotation processors used in the build cannot be properly cached,
you can disable caching for kapt entirely by specifying the `useBuildCache` property in the build script.
This helps prevent false-positive cache hits for the kapt tasks:

```groovy
kapt {
    useBuildCache = false
}
```

### Cache annotation processors' classloaders

<primary-label ref="experimental-general"/>

Caching for annotation processors' classloaders helps kapt perform faster if you run many Gradle tasks consecutively.

To enable this feature, use the following properties in your `gradle.properties` file:

```none
# gradle.properties
#
# Any positive value enables caching
# Use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# Disable for caching to work
kapt.include.compile.classpath=false
```

If you run into any problems with caching for annotation processors, disable caching for them:

```none
# Specify annotation processors' full names to disable caching for them
kapt.classloaders.cache.disableForProcessors=[annotation processors full names]
```

> If you encounter any issues with the feature,
> we would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901).
>
{style="note"}

### Use incremental annotation processing

kapt supports incremental annotation processing by default.
Currently, annotation processing can be incremental only if all annotation processors being used are incremental.

To disable incremental annotation processing, add this line to your `gradle.properties` file:

```none
kapt.incremental.apt=false
```

Note that incremental annotation processing requires [incremental compilation](gradle-compilation-and-caches.md#incremental-compilation)
to be enabled as well.

## Analyze performance

### Measure the performance of annotation processors

To get performance statistics on the annotation processors execution,
use the `-Kapt-show-processor-timings` plugin option.
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

### Track the number of generated files

The `kapt` Gradle plugin can report statistics on the number of generated files for each annotation processor.

This helps track whether any unused annotation processors are included in the build.
You can use the generated report to find modules that trigger unnecessary annotation processors and update the modules to avoid that.

To enable statistics reporting:

1. Set the `showProcessorStats` property value to `true` in your `build.gradle(.kts)`:

   ```kotlin
   // build.gradle.kts
   kapt {
       showProcessorStats = true
   }
   ```

2. Set the `kapt.verbose` Gradle property to `true` in your `gradle.properties`:

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

> You can also enable verbose output with the [command line option `verbose`](#cli).
>
{style="note"}

The statistics appear in the logs with the `info` level.
You can see the `Annotation processor stats:` line followed by statistics on the execution time of each annotation processor.
After these lines, there is the `Generated files report:` line followed by statistics on the number of
generated files for each annotation processor. For example:

```text
[INFO] Annotation processor stats:
[INFO] org.mapstruct.ap.MappingProcessor: total: 290 ms, init: 1 ms, 3 round(s): 289 ms, 0 ms, 0 ms
[INFO] Generated files report:
[INFO] org.mapstruct.ap.MappingProcessor: total sources: 2, sources per round: 2, 0, 0
```

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

## What's next

* [See how to migrate from kapt to KSP](ksp-kapt-migration.md)