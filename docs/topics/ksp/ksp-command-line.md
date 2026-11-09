[//]: # (title: Running KSP from the command line)

<web-summary>Learn how to run KSP from the command line: which JAR files to add to the classpath, which entry 
point to use for each platform, and which options KSP requires.</web-summary>

Most projects use KSP through the KSP plugin for Gradle, which runs KSP automatically during compilation. You can also
run KSP from the command line, which is typically useful when you're integrating KSP with other build systems,
developing processors, testing, or debugging.

Since KSP is a JVM application, use the `java` command to launch KSP from the command line. Provide the classpath 
and any necessary arguments:

```bash
java -cp <classpath> <mainclass> <options> <processor>
```

| Argument        | Description                                                         |
|:----------------| --------------------------------------------------------------------|
| `<classpath>`   | Path to [KSP runtime JAR files](#classpath) and their dependencies. |
| `<mainclass>`   | One of the platform-specific KSP [entry points](#entry-points).     |
| `<options>`     | Command-line [options](#options) for KSP.                           |
| `<processor>`   | Path to the processor JAR.                                          |

## Classpath

The `java` command doesn't resolve dependencies automatically. You must provide the KSP runtime JAR files and 
their dependencies on the classpath.

Download `artifacts.zip` from the [KSP release page](https://github.com/google/ksp/releases/tag/%kspVersion%) on GitHub.
The archive contains the required KSP JAR files:

* `symbol-processing-aa-%kspVersion%.jar`
* `symbol-processing-common-deps-%kspVersion%.jar`
* `symbol-processing-api-%kspVersion%.jar`

You must also include the following runtime dependencies from the Maven repository:

* [`kotlin-stdlib-%kotlinVersion%.jar`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-stdlib)
* [`kotlinx-coroutines-core-jvm-%coroutinesVersion%.jar`](https://mvnrepository.com/artifact/org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm)

## Main class

Because KSP is a JVM application, you must specify the main class to launch. KSP provides a different entry point for
each supported platform:

| Entry point       | Platforms                                                       |
| ----------------- | --------------------------------------------------------------- |
| `KSPJvmMain`      | Kotlin/JVM and Android                                          |
| `KSPJsMain`       | Kotlin/JS                                                       |
| `KSPNativeMain`   | Kotlin/Native targets, such as iOS, macOS, Linux, and Windows   |
| `KSPCommonMain`   | Common compilations in Kotlin Multiplatform projects            |

When launching KSP with `java`, specify the fully qualified class name. For example:

```bash
java -cp <classpath> com.google.devtools.ksp.cmdline.KSPJvmMain <options> <processor>
```

The following example uses `KSPJvmMain` to run KSP for a JVM target:

```bash
java -cp \
symbol-processing-aa-%kspVersion%.jar:\
symbol-processing-common-deps-%kspVersion%.jar:\
symbol-processing-api-%kspVersion%.jar:\
kotlin-stdlib-%kotlinVersion%.jar:\
kotlinx-coroutines-core-jvm-%coroutinesVersion%.jar \
com.google.devtools.ksp.cmdline.KSPJvmMain \
-language-version=2.0 \
-api-version=2.0 \
-jvm-target=11 \
-module-name=main \
-source-roots=project_dir/src/kotlin/main \
-project-base-dir=project_dir/ \
-output-base-dir=project_dir/build/ \
-caches-dir=project_dir/build/caches/ \
-class-output-dir=project_dir/build/out/main/classes \
-kotlin-output-dir=project_dir/build/out/main/kotlin/ \
-java-output-dir=project_dir/build/out/main/java/ \
-resource-output-dir=project_dir/build/out/main/res/ \
path/to/processor.jar
```

## Options

KSP requires the following options when running from the command line:

| Option                          | Description                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------- |
| `-language-version=<version>`   | The [Kotlin language version](compiler-reference.md#language-version-version) used in the project.  |
| `-api-version=<version>`        | The [Kotlin API version](compiler-reference.md#api-version-version).                                |
| `-jvm-target=<version>`         | The target JVM version.                                                                             |
| `-module-name=<name>`           | The module name.                                                                                    |
| `-source-roots=<paths>`         | The source root directories. Use a colon-separated list for multiple directories.                   |
| `-project-base-dir=<path>`      | The project root directory.                                                                         |
| `-output-base-dir=<path>`       | The base directory for KSP output.                                                                  |
| `-caches-dir=<path>`            | The directory for KSP caches.                                                                       |
| `-java-output-dir=<path>`       | The directory for generated Java files.                                                             |
| `-class-output-dir=<path>`      | The directory for generated class files.                                                            |
| `-kotlin-output-dir=<path>`     | The directory for generated Kotlin files.                                                           |
| `-resource-output-dir=<path>`   | The directory for generated resources.                                                              |
| `<processor>`                   | The processor classpath.                                                                            |

### Other useful options

* `-libraries=<path>` – the classpath used to resolve dependencies referenced by the source files. Typically the
  module's compile classpath.
* `-jdk-home=<path>` – the JDK home directory. Use when the processor resolves Java symbols and
  requires access to the Java standard library.
* `-friends=<path>` – the classpath of the current module's friend modules. For more information, see the
  [`friendPaths` property](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kotlin-compile/friend-paths.html)
  in the Kotlin Gradle plugin API reference.

> KSP also supports the `-Dksp.logging` JVM system property, which sets the logging level. Valid values are `error`,
> `warn` or `warning`, `info`, and `debug`. The default value is `warn`. KSP treats unsupported values as `warn`.
>
{style="note"}

To see the full list of options, run the following command:

```bash
java -cp <classpath> <mainclass> -h
```

## See also

* [Incremental processing](ksp-incremental.md)
* [KSP with Kotlin Multiplatform](ksp-multiplatform.md)
