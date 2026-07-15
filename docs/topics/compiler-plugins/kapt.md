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

To configure the mode of annotation processing, set the [`aptMode`](#annotation-processor-configuration) option in
the `<configuration>` block. For example:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

### CLI

kapt is available as a standalone CLI tool in the binary distribution of the Kotlin compiler.

To run kapt from the command line, use:

```bash
kapt <options> <source files>
```

For example:

```bash
kapt -Kapt-mode=stubsAndApt \
  -Kapt-sources=build/kapt/sources \
  -Kapt-classes=build/kapt/classes \
  -Kapt-stubs=build/kapt/stubs \
  -Kapt-classpath=lib/ap.jar \
  -Kapt-classpath=lib/anotherAp.jar \
  src/main/kotlin
```

* See the full list of [kapt-specific compiler options](#compiler-options).
* You can also pass all valid [Kotlin compiler options](compiler-reference.md). Run `kotlinc -help` to see them.

## Configure annotation processors

kapt provides options to control how annotation processors are discovered, organized, and executed, including managing
the processor classpath, inheriting processors from shared configurations, and keeping javac-specific processors active.

For more configuration options, such as passing options to annotation processors and javac,
see [Annotation processor configuration](#annotation-processor-configuration).

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

kapt offers several Gradle-specific strategies to reduce annotation processing time, including running tasks in parallel,
leveraging the build cache, caching processor classloaders, and using incremental annotation processing.

For more options that affect build behavior, such as error type correction, stub metadata stripping,
and compile classpath scanning, see [Behavioral options](#behavioral-options).

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

Gradle caches kapt annotation processing tasks [by default](https://docs.gradle.org/current/userguide/build_cache_use_cases.html).
However, annotation processors can run arbitrary code. This may result in unnecessary transformations of task inputs into outputs,
or accessing and modifying files that Gradle doesn't track.

When annotation processors used in the build can't be properly cached, you can disable caching to prevent
false-positive hits for kapt tasks. To do this, use the `useBuildCache` property in the build script:

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

With Gradle, kapt supports incremental annotation processing by default so that only the changed files are re-processed.

Currently, incremental annotation processing works only if:

* [Incremental compilation](gradle-compilation-and-caches.md#incremental-compilation) is enabled.
* All annotation processors in the build are incremental.

To disable incremental annotation processing, add this line to your `gradle.properties` file:

```none
kapt.incremental.apt=false
```

> Currently, incremental annotation processing for kapt is not supported in Maven or CLI.
> 
{style="note"}

## Analyze performance

kapt provides built-in diagnostics to help you understand annotation processing performance, including per-processor
execution time reports and generated file counts to identify unused processors.

For more diagnostics options, such as file read history for debugging incremental processing and memory leak detection,
see [Diagnostics and statistics options](#diagnostics-and-statistics-options).

### Measure the performance of annotation processors

To get performance statistics on the annotation processors execution,
use the [`showProcessorStats`](#diagnostics-and-statistics-options) option. An example output:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

You can dump this report into a file with the [`dumpProcessorStats`](#diagnostics-and-statistics-options) option.
For example, the following CLI command runs kapt and dumps the statistics to the `ap-perf-report.file` file:

```bash
kapt -Kapt-mode=stubsAndApt \
  -Kapt-classpath=processor/build/libs/processor.jar \
  -Kapt-dump-processor-stats=ap-perf-report.file \
  sample/src/main/
```

### Track the number of generated files

The kapt plugin can report statistics on the number of generated files for each annotation processor.

This helps track whether any unused annotation processors are included in the build.
You can use the generated report to find modules that trigger unnecessary annotation processors and update the modules to avoid that.

To enable statistics reporting:

1. In your Gradle build file, set the `showProcessorStats` option to `true`:

   ```kotlin
   // build.gradle(.kts)
   kapt {
       showProcessorStats = true
   }
   ```

2. In your `gradle.properties` file, set the `verbose` compiler option to `true`:

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

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

> Currently, tracking the number of generated files with the `showProcessorStats` and `verbose` compiler options is not supported in Maven or CLI.
>
{style="note"}

## Generate Kotlin sources

kapt can generate Kotlin sources. To do that, write the generated Kotlin source files to the specified directory using
`processingEnv.options["kapt.kotlin.generated"]`. Kotlin source files are then compiled together with the main sources.

> kapt doesn't support multiple rounds for the generated Kotlin files.
> 
{style="note"}

## Compiler options

### Annotation processor configuration

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>How to set up</td>
    </tr>
    <tr>
        <td><code>aptMode</code></td>
        <td>
            Controls the execution of kapt workflow stages:
            <list>
                <li><code>stubsAndApt</code> generates stubs and run annotation processing (default)</li>
                <li><code>stubs</code> only generates Java stubs from Kotlin</li>
                <li><code>apt</code> only runs annotation processors (assumes stubs already exist)</li>
            </list>
        </td>
        <td>
            <p><b>Gradle:</b> Not directly available; Gradle runs stubs and apt as separate tasks</p>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<aptMode>stubsAndApt</aptMode>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-mode=stubsAndApt</code></p>
        </td>
    </tr>
    <tr>
        <td><code>classpath</code></td>
        <td>Classpath entries where annotation processors are discovered.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    dependencies {
                        kapt("com.example:processor:1.0")
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessorPaths>
    <annotationProcessorPath>...</annotationProcessorPath>
</annotationProcessorPaths>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-classpath=lib/my-processor.jar</code></p>
        </td>
    </tr>
    <tr>
        <td><code>processors</code></td>
        <td>Comma-separated fully qualified class names of processors to run, bypassing discovery.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        annotationProcessor("com.example.MyProcessor")
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessors>
    <annotationProcessor>com.example.MyProcessor</annotationProcessor>
</annotationProcessors>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-processors=com.example.MyProcessor</code></p>
        </td>
    </tr>
    <tr>
        <td><code>apOption</code></td>
        <td>Key-value options passed to annotation processors.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        arguments {
                            arg("room.schemaLocation", "$projectDir/schemas")
                        }
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessorArgs>
    <annotationProcessorArg>room.schemaLocation=/schemas</annotationProcessorArg>
</annotationProcessorArgs>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-options:room.schemaLocation=/schemas</code></p>
        </td>
    </tr>
    <tr>
        <td><code>javacOption</code></td>
        <td>Key-value options passed to Java compiler.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        javacOptions {
                            option("-source", "11")
                        }
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<javacOptions>
    <javacOption>-source=11</javacOption>
</javacOptions>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-javac-option:-source=11</code></p>
        </td>
    </tr>
    <tr>
        <td><code>processIncrementally</code></td>
        <td>Enables incremental annotation processing; only reprocesses files affected by changes.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    # gradle.properties
                    kapt.incremental.apt=true
                </code-block>
            <p><b>Maven:</b> currently not supported</p>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
</table>

### Output directory options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>How to set up</td>
    </tr>
    <tr>
        <td><code>sources</code></td>
        <td>Directory where annotation processors generate <code>.java</code> source files.</td>
        <td>
            <p><b>Gradle:</b> set automatically to <code>build/generated/source/kapt/main</code></p>
            <p><b>Maven:</b> set automatically to <code>target/generated-sources/kapt/</code></p>
            <p><b>CLI:</b> <code>-Kapt-sources=build/kapt/sources</code></p>
        </td>
    </tr>
    <tr>
        <td><code>classes</code></td>
        <td>Directory for <code>.class</code> files compiled from generated sources.</td>
        <td>
            <p><b>Gradle:</b> managed automatically</p>
            <p><b>Maven:</b> managed automatically</p>
            <p><b>CLI:</b> <code>-Kapt-classes=build/kapt/classes</code></p>
        </td>
    </tr>
    <tr>
        <td><code>stubs</code></td>
        <td>Directory for Java stub files generated from Kotlin sources, used as input to annotation processors.</td>
        <td>
            <p><b>Gradle:</b> managed automatically</p>
            <p><b>Maven:</b> managed automatically</p>
            <p><b>CLI:</b> <code>-Kapt-stubs=build/kapt/stubs</code></p>
        </td>
    </tr>
    <tr>
        <td><code>incrementalData</code></td>
        <td>Stores state for incremental builds.</td>
        <td>
            <p><b>Gradle:</b> managed automatically</p>
            <p><b>Maven:</b> currently not supported</p>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
</table>

### Behavioral options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>How to set up</td>
    </tr>
    <tr>
        <td><code>correctErrorTypes</code></td>
        <td>
            By default, kapt replaces every unknown type (including types for the generated classes) with <code>NonExistentClass</code>.
            You can enable error type inferring in stubs to replace unresolved error types with types from generated sources.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        correctErrorTypes = true
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<correctErrorTypes>true</correctErrorTypes>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-correct-error-types=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>dumpDefaultParameterValues</code></td>
        <td>
            Includes default parameter initializers as field values in generated stubs.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        dumpDefaultParameterValues = true
                    }
                </code-block>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-dump-default-parameter-values=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>mapDiagnosticLocations</code></td>
        <td>
            Maps error messages from stub files back to their original Kotlin source locations.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        mapDiagnosticLocations = true
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<mapDiagnosticLocations>true</mapDiagnosticLocations>
                    ]]>
                </code-block>
            <p><b>CLI:</b> <code>-Kapt-map-diagnostic-locations=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>strict</code></td>
        <td>
            Turns stub generation incompatibilities into errors instead of warnings.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        strictMode = true
                    }
                </code-block>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-strict=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>stripMetadata</code></td>
        <td>
            Removes <code>@kotlin.Metadata</code> annotations from generated stubs, reducing stub size and hiding Kotlin-specific info from processors.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        stripMetadata = true
                    }
                </code-block>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-strip-metadata=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>verbose</code></td>
        <td>
            Enables verbose kapt logging.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    # gradle.properties
                    kapt.verbose=true
                </code-block>
            <p><b>Maven:</b> currently not supported</p>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
    <tr>
        <td><code>infoAsWarnings</code></td>
        <td>
            Promotes info-level kapt messages to warnings.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b> not directly available</p>
            <p><b>Maven:</b> currently not supported</p>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
    <tr>
        <td><code>includeCompileClasspath</code></td>
        <td>
            Scans compile classpath for annotation processors. Set to <code>false</code> for reproducibility.
            <p><code>true</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        includeCompileClasspath = false
                    }
                </code-block>
            <p><b>Maven:</b></p>
                <code-block lang="xml">
                    <![CDATA[
<includeCompileClasspath>false</includeCompileClasspath>
                    ]]>
                </code-block>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
</table>

### Diagnostics and statistics options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>How to set up</td>
    </tr>
    <tr>
        <td><code>showProcessorStats</code></td>
        <td>Prints per-processor execution time to stdout.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        showProcessorStats = true
                    }
                </code-block>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-show-processor-stats=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>dumpProcessorStats</code></td>
        <td>Writes processor timing stats to a file.</td>
        <td>
            <p><b>Gradle:</b> not available</p>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-dump-processor-stats=build/kapt-stats.txt</code></p>
        </td>
    </tr>
    <tr>
        <td><code>dumpFileReadHistory</code></td>
        <td>Writes a list of files read by processors to a file, useful for incremental annotation processor debugging.</td>
        <td>
            <p><b>Gradle:</b> not available</p>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-dump-file-read-history=build/kapt-reads.txt</code></p>
        </td>
    </tr>
    <tr>
        <td><code>detectMemoryLeaks</code></td>
        <td>Memory leak detection mode: <code>none</code>, <code>default</code>, or <code>paranoid</code>.</td>
        <td>
            <p><b>Gradle:</b></p>
                <code-block lang="kotlin">
                    kapt {
                        detectMemoryLeaks = "paranoid"
                    }
                </code-block>
            <p><b>Maven:</b> currently not supported</p>
            <p><b>CLI:</b> currently not supported</p>
        </td>
    </tr>
</table>

## What's next

* [Use kapt with the MapStruct annotation processor](jvm-annotation-processors.md#use-kapt-with-java-annotation-processors)
* [See how to migrate from kapt to KSP](ksp-kapt-migration.md)