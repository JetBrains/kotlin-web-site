[//]: # (title: Running KSP from the command line)

Most projects use KSP through the Gradle plugin, which runs KSP automatically during compilation. You can use
KSP from the command line but it's normally only used when you're integrating with other build systems, developing 
processors, testing, or debugging.

Since KSP is a JVM application, use the `java` command to launch KSP from the command line.
Make sure to provide the classpath and any necessary arguments:

```bash
java -cp <classpath> <mainclass> <options> <processor>
```

Where:

| Argument      | Description                                    |
|---------------|------------------------------------------------|
| `<classpath>` | KSP runtime JARs and their dependencies.       |
| `<mainclass>` | One of the platform-specific KSP entry points. |
| `<options>`   | Command-line options for KSP.                  |
| `<processor>` | Path to the processor JAR.                     |

## Classpath

Unlike the Gradle plugin, the `java` command does not resolve dependencies automatically. You must provide the KSP 
runtime JARs and their dependencies on the classpath.

Download `artifacts.zip` from the [KSP release page](https://github.com/google/ksp/releases/tag/%kspVersion%). The archive contains the required KSP JAR files:

* `symbol-processing-aa-%kspVersion%.jar`

* `symbol-processing-common-deps-%kspVersion%.jar`

* `symbol-processing-api-%kspVersion%.jar`

You must also include the following runtime dependencies:

* `kotlin-stdlib-%kotlinVersion%.jar`, available from the [Maven Repository](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-stdlib)

* `kotlinx-coroutines-core-jvm-%coroutinesVersion%.jar`, available from the [Maven Repository](https://mvnrepository.com/artifact/org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm)


## Mainclass

Because KSP is a JVM application, you must specify the main class to launch. KSP provides a different entry point for 
each supported platform:

| Entrypoint      | Platforms                                                     |
|-----------------|---------------------------------------------------------------|
| `KSPJvmMain`    | JVM and Android                                               |
| `KSPJsMain`     | Kotlin/JS                                                     |
| `KSPNativeMain` | Kotlin/Native targets, such as iOS, macOS, Linux, and Windows |
| `KSPCommonMain` | Common compilations in Kotlin Multiplatform projects          |


When launching KSP with `java`, specify the fully qualified class name. For example:

```bash
java -cp <classpath> com.google.devtools.ksp.cmdline.KSPJvmMain <options> <processor>
```

The following example runs KSP for a JVM target by using `KSPJvmMain`:

```bash
java -cp \
symbol-processing-aa-%kspVersion%.jar:symbol-processing-common-deps-%kspVersion%.jar:symbol-processing-api-%kspVersion%.jar:kotlin-stdlib-2.3.20.jar:kotlinx-coroutines-core-jvm-1.10.2.jar \
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

To see the full list of options, run the following command:

```bash
java -cp <classpath> <mainclass> -h
```

### Required KSP options

| Option                        | Description                                                                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `-language-version=<version>` | The [Kotlin language version](https://kotlinlang.org/docs/compiler-reference.html#language-version-version) used in the project.     |
| `-api-version=<version>`      | The [Kotlin API version](https://kotlinlang.org/docs/compiler-reference.html#api-version-version).                               git |
| `-jvm-target=<version>`       | The target JVM version.                                                                                                              |
| `-module-name=<name>`         | The module name.                                                                                                                     |
| `-source-roots=<paths>`       | The source root directories. Use a colon-separated list for multiple directories.                                                    |
| `-project-base-dir=<path>`    | The project root directory.                                                                                                          |
| `-output-base-dir=<path>`     | The base directory for KSP output.                                                                                                   |
| `-caches-dir=<path>`          | The directory for KSP caches.                                                                                                        |
| `-java-output-dir=<path>`     | The directory for generated Java files.                                                                                              |
| `-class-output-dir=<path>`    | The directory for generated class files.                                                                                             |
| `-kotlin-output-dir=<path>`   | The directory for generated Kotlin files.                                                                                            |
| `-resource-output-dir=<path>` | The directory for generated resources.                                                                                               |
| `<processor>`                 | The processor classpath.                                                                                                             |

### Other useful options

* `-libraries=File`: Specifies the classpath used to resolve dependencies referenced by the source files. This is 
typically the module's compile classpath.

* `-jdk-home=File`: Specifies the JDK home directory. Use this option when the processor resolves Java symbols and 
requires access to the Java standard library.

* `-friends=File`: Specifies the classpath of the current module's friend modules. This is typically the module's friend 
classpath. For more information, see [Friend modules](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kotlin-compile/friend-paths.html).

> KSP also supports the following JVM system property:
> * `-Dksp.logging`: Specifies the logging level. Valid values are `error`, `warn` or `warning`, `info`, and `debug`. The 
default value is `warn`. Unsupported values are treated as `warn`.
>
{style="tip"}
