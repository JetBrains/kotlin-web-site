[//]: # (title: kapt compiler plugin)

<show-structure depth="2"/>

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

> kapt is not supported in IntelliJ IDEA's own build system. Launch the build from the "Maven Projects"
> toolbar whenever you want to re-run the annotation processing.
>
{style="warning"}

## Set up the plugin

### In Gradle

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
       kapt("groupId:artifactId:%kotlinVersion%")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       kapt 'groupId:artifactId:%kotlinVersion%'
   }
   ```

   </tab>
   </tabs>

3. If you previously used the [Android support](https://developer.android.com/studio/build/gradle-plugin-3-0-0-migration.html#annotationProcessor_config)
   for annotation processors, replace usages of the `annotationProcessor` configuration with `kapt`.
   If your project contains Java classes, `kapt` will also take care of them.

   If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named
   `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extend `kapt`, so you can provide the
   `kapt` dependency, and it will be available both for production sources and tests.

### In Maven

#### Automatic configuration

You can simplify kapt configuration by enabling the `<extensions>` option for the Kotlin Maven plugin. In this case,
you don't need to manually set up kapt's `<execution>` section with goals or source directories.

To automatically configure kapt, in your `pom.xml` build file, set the `<extensions>` option to `true` for the `kotlin-maven-plugin`:

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

To configure the level of annotation processing, set the [`aptMode`](#annotation-processor-configuration) option in
the `<configuration>` block. For example:

```xml
<configuration>
   ...
   <aptMode>stubs</aptMode>
</configuration>
```

### In CLI

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
  -Kapt-apclasspath=lib/ap.jar \
  -Kapt-apclasspath=lib/anotherAp.jar \
  src/main/kotlin
```

You can also pass all valid Kotlin compiler options. Run `kotlinc -help` to see them.

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
This effectively excludes unnecessary annotation processors from the compile classpath.

#### For Gradle

Gradle uses [compile avoidance](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java_compile_avoidance)
to skip annotation processing during project rebuild, improving incremental build times with kapt. Particularly,
annotation processing is skipped when:

* The project's source files are unchanged.
* The changes in dependencies are [ABI](https://en.wikipedia.org/wiki/Application_binary_interface)-compatible.
  For example, the only changes are in method bodies.

However, compile avoidance can't be used for annotation processors discovered on the compile classpath, since changes
in their internal implementation require running the annotation processing tasks, even if the ABI remains unchanged.

That's why we don't recommend using annotation processors from the compile classpath. To exclude these annotations
from processing, add the `kapt.include.compile.classpath` property to your `gradle.properties` file:

```none
# gradle.properties
kapt.include.compile.classpath=false
```

With the option set to `false`, annotation processor dependencies that aren't included in the processor path
(the `kapt*` configurations) are excluded from kapt processing.

#### For Maven

To exclude annotation processors that are missing from kapt's processor path, set the `includeCompileClasspath`
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

> To see the list of annotation processors that aren't present on the kapt classpath, run the build with the `--info` log
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

In this example, the `commonAnnotationProcessors` Gradle configuration is your common superconfiguration for annotation processing
that you want to be used for all your projects. You use the [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom)
method to add `commonAnnotationProcessors` as a superconfiguration. kapt sees that the `commonAnnotationProcessors`
Gradle configuration has a dependency on the MapStruct annotation processor. Therefore, kapt includes the MapStruct annotation processor
in its configuration for annotation processing.

### Keep Java compiler's annotation processors

By default, kapt runs all annotation processors and disables annotation processing by javac.
However, you may need some of javac's annotation processors working (for example, [Lombok](https://projectlombok.org/)).

In the Gradle build file, use the option `keepJavacAnnotationProcessors`:

```gradle
kapt {
    keepJavacAnnotationProcessors = true
}
```

If you use Maven, configure the plugin explicitly.
See this [example of setting up the Lombok compiler plugin](lombok.md#using-with-kapt).

## Optimize kapt builds

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

### Use Gradle build cache safely

The kapt annotation processing tasks are [cached in Gradle](https://guides.gradle.org/using-build-cache/) by default.
However, annotation processors can run arbitrary code, which may not reliably transform task inputs into outputs,
or may access and modify files that Gradle doesn't track.

If the annotation processors used in the build cannot be properly cached,
you can disable caching for kapt entirely by specifying the `useBuildCache` property in the build script.
This helps prevent false-positive cache hits for the kapt tasks:

```gradle
kapt {
    useBuildCache = false
}
```

### Cache annotation processor classloaders
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

### Enable incremental annotation processing

You can enable incremental annotation processing, so that only the changed files are re-processed.
Currently, annotation processing can be incremental only if all annotation processors being used are incremental.

To enable incremental annotation processing, use the `processIncrementally` compiler option:

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

Add `kapt.incremental.apt=true` in your `gradle.properties` file:

```none
# gradle.properties
kapt.incremental.apt=true
```

> Incremental annotation processing requires [incremental compilation](gradle-compilation-and-caches.md#incremental-compilation)
> to be enabled as well.
>
{style="note"}

</tab>
<tab title="Maven" group-key="maven">

Pass `-Dkapt.incremental.apt=true` as a JVM argument when running Maven:

```bash
mvn compile -Dkapt.incremental.apt=true
```

</tab>
<tab title="CLI" group-key="cli">

Use the `-Kapt-processIncrementally=true` option:

```bash
-Kapt-processIncrementally=true
```

</tab>
</tabs>

## Analyze performance

### Measure annotation processor performance

To get performance statistics on the annotation processors execution,
use the [`showProcessorStats`](#diagnostics-and-statistics-options) option. An example output:

```text
Kapt Annotation Processing performance report:
com.example.processor.TestingProcessor: total: 133 ms, init: 36 ms, 2 round(s): 97 ms, 0 ms
com.example.processor.AnotherProcessor: total: 100 ms, init: 6 ms, 1 round(s): 93 ms
```

You can dump this report into a file with the [`dumpProcessorStats`](#diagnostics-and-statistics-options) option.
The following command will run kapt and dump the statistics to the `ap-perf-report.file` file:

```bash
kapt -Kapt-mode=stubsAndApt \
  -Kapt-apclasspath=processor/build/libs/processor.jar \
  -Kapt-dump-processor-stats=ap-perf-report.file \
  sample/src/main/
```

### Track the number of generated files

The `kapt` Gradle plugin can report statistics on the number of generated files for each annotation processor.

This helps track whether any unused annotation processors are included in the build.
You can use the generated report to find modules that trigger unnecessary annotation processors and update the modules to avoid that.

To enable statistics reporting:

1. Set the `showProcessorStats` option to `true`:

   <tabs group="build-script">
   <tab title="Gradle" group-key="kotlin">

   ```kotlin
   // build.gradle(.kts)
   kapt {
       showProcessorStats = true
   }
   ```

   </tab>
   <tab title="Maven" group-key="maven">

   This option is not available for Maven.

   </tab>
   <tab title="CLI" group-key="cli">

   ```bash
   -Kapt-show-processor-stats=true
   ```

   </tab>
   </tabs>

2. Set the `verbose` compiler option to `true`:

   <tabs group="build-script">
   <tab title="Gradle" group-key="kotlin">

   ```none
   # gradle.properties
   kapt.verbose=true
   ```

   </tab>
   <tab title="Maven" group-key="maven">

   ```bash
   mvn compile -Dkapt.verbose=true
   ```

   </tab>
   <tab title="CLI" group-key="cli">

   ```bash
   -Kapt-verbose=true
   ```

   </tab>
   </tabs>

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

## Generate Kotlin sources

kapt can generate Kotlin sources. Just write the generated Kotlin source files to the directory specified by `processingEnv.options["kapt.kotlin.generated"]`,
and these files will be compiled together with the main sources.

Note that kapt does not support multiple rounds for the generated Kotlin files.

## Compiler options

### Annotation processor configuration

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
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
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<aptMode>stubsAndApt</aptMode>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-mode=stubsAndApt</code></p>
        </td>
    </tr>
    <tr>
        <td><code>apclasspath</code></td>
        <td>Classpath entries where annotation processors are discovered.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    dependencies {
                        kapt("com.example:processor:1.0")
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessorPaths>
    <annotationProcessorPath>...</annotationProcessorPath>
</annotationProcessorPaths>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-apclasspath=lib/my-processor.jar</code></p>
        </td>
    </tr>
    <tr>
        <td><code>processors</code></td>
        <td>Comma-separated fully qualified class names of processors to run, bypassing discovery.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        annotationProcessor("com.example.MyProcessor")
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessors>
    <annotationProcessor>com.example.MyProcessor</annotationProcessor>
</annotationProcessors>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-processors=com.example.MyProcessor</code></p>
        </td>
    </tr>
    <tr>
        <td><code>apOption</code></td>
        <td>Key-value options passed to annotation processors.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        arguments {
                            arg("room.schemaLocation", "$projectDir/schemas")
                        }
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<annotationProcessorArgs>
    <annotationProcessorArg>room.schemaLocation=/schemas</annotationProcessorArg>
</annotationProcessorArgs>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-apOption:room.schemaLocation=/schemas</code></p>
        </td>
    </tr>
    <tr>
        <td><code>javacOption</code></td>
        <td>Key-value options passed to Java compiler.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        javacOptions {
                            option("-source", "11")
                        }
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<javacOptions>
    <javacOption>-source=11</javacOption>
</javacOptions>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-javacOption:-source=11</code></p>
        </td>
    </tr>
    <tr>
        <td><code>processIncrementally</code></td>
        <td>Enables incremental annotation processing; only reprocesses files affected by changes.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    # gradle.properties
                    kapt.incremental.apt=true
                </code-block>
            </p>
            <p><b>Maven:</b> <code>-Dkapt.incremental.apt=true</code></p>
            <p><b>CLI:</b> <code>-Kapt-processIncrementally=true</code></p>
        </td>
    </tr>
</table>

### AP/Javac encoding options

When using kapt via the Gradle or Maven build tools, the `apOption` and `javacOption` compiler options
accept an encoded map of options. Here is how you can encode options by yourself:

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

When using kapt from the CLI, use the `-Kapt-apOption:<key>=<value>` and `-Kapt-javacOption:<key>=<value>` options directly instead.

### Output directory options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
    </tr>
    <tr>
        <td><code>sources</code></td>
        <td>Directory where annotation processors generate <code>.java</code> source files.</td>
        <td>
            <p><b>Gradle:</b> set automatically to <code>build/generated/source/kapt/main</code></p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
                        <sourceDirs>
                           <sourceDir>...</sourceDir>
                        </sourceDirs>
                    ]]>
                </code-block>
            </p>
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
            <p><b>Maven:</b> managed automatically</p>
            <p><b>CLI:</b> <code>-Kapt-incrementalData=build/kapt/incremental</code></p>
        </td>
    </tr>
</table>

### Behavioral options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
    </tr>
    <tr>
        <td><code>correctErrorTypes</code></td>
        <td>
            By default, kapt replaces every unknown type (including types for the generated classes) with <code>NonExistentClass</code>.
            You can enable error type inferring in stubs to replace unresolved error types with types from generated sources.
            <p><code>false</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        correctErrorTypes = true
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<correctErrorTypes>true</correctErrorTypes>
                    ]]>
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        dumpDefaultParameterValues = true
                    }
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        mapDiagnosticLocations = true
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<mapDiagnosticLocations>true</mapDiagnosticLocations>
                    ]]>
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        strictMode = true
                    }
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        stripMetadata = true
                    }
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                     # gradle.properties
                     kapt.verbose=true
                </code-block>
            </p>
            <p><b>Maven:</b> <code>-Dkapt.verbose=true</code></p>
            <p><b>CLI:</b> <code>-Kapt-verbose=true</code></p>
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
            <p><b>Maven:</b> <code>-Dkapt.info.as.warnings=true</code></p>
            <p><b>CLI:</b> <code>-Kapt-infoAsWarnings=true</code></p>
        </td>
    </tr>
    <tr>
        <td><code>includeCompileClasspath</code></td>
        <td>
            Scans compile classpath for annotation processors. Set to <code>false</code> for reproducibility.
            <p><code>true</code> by default</p>
        </td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        includeCompileClasspath = false
                    }
                </code-block>
            </p>
            <p><b>Maven:</b>
                <code-block lang="xml">
                    <![CDATA[
<includeCompileClasspath>false</includeCompileClasspath>
                    ]]>
                </code-block>
            </p>
            <p><b>CLI:</b> <code>-Kapt-includeCompileClasspath=false</code></p>
        </td>
    </tr>
</table>

### Diagnostics and statistics options

<table>
    <tr>
        <td>Option</td>
        <td>Description</td>
        <td>Example</td>
    </tr>
    <tr>
        <td><code>showProcessorStats</code></td>
        <td>Prints per-processor execution time to stdout.</td>
        <td>
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        showProcessorStats = true
                    }
                </code-block>
            </p>
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
            <p><b>Gradle:</b>
                <code-block lang="kotlin">
                    kapt {
                        detectMemoryLeaks = "paranoid"
                    }
                </code-block>
            </p>
            <p><b>Maven:</b> not available</p>
            <p><b>CLI:</b> <code>-Kapt-detectMemoryLeaks=paranoid</code></p>
        </td>
    </tr>
</table>

## What's next

[See how to migrate from kapt to KSP](ksp-kapt-migration.md)