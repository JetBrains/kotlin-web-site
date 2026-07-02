[//]: # (title: Running KSP from command line)

Most projects use KSP through the Gradle plugin, which runs KSP automatically during compilation. Command-line 
invocation is primarily intended for integration with other build systems, processor development, testing and debugging.

KSP is implemented as a JVM application. When running KSP from the command line, use the `java` command to launch the KSP 
entry point and provide the required classpath and arguments.

```Bash
java -cp <classpath> <mainclass> <options> <processor>
```

Where:

* `<classpath>` contains the KSP runtime JARs and their dependencies.

* `<mainclass>` is one of the platform-specific KSP entry points.

* `<options>` are the command-line options for KSP.

* `<processor>` specifies the path to the processor JAR.

## Classpath

Download `artifacts.zip` from the [KSP release page](https://github.com/google/ksp/releases/tag/%kspVersion%). The 
archive contains the required KSP JAR files:

* `symbol-processing-aa-%kspVersion%.jar`

* `symbol-processing-common-deps-%kspVersion%.jar`

* `symbol-processing-api-%kspVersion%.jar`

You must also include the following runtime dependencies:

* `kotlin-stdlib-%kotlinVersion%.jar`, available from the [Maven Repository](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-stdlib)

* `kotlinx-coroutines-core-jvm-%coroutinesVersion%.jar`, available from the [Maven Repository](https://mvnrepository.com/artifact/org.jetbrains.kotlinx/kotlinx-coroutines-core-jvm)


## Mainclass

KSP provides the following platform-specific entry points:

* `KSPJvmMain`

* `KSPJsMain`

* `KSPNativeMain`

* `KSPCommonMain`

The following example runs KSP for a JVM target by using KSPJvmMain:

```Bash
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

A full list of options can be obtained with the following command:

```Bash
java -cp <classpath> <mainclass> -h
```

### Required options

| Option                     | Description                                                                                 |
|----------------------------|---------------------------------------------------------------------------------------------|
| `-language-version=String` | Specifies the Kotlin language version used in the project.                                  |
| `-api-version=String`      | Specifies the Kotlin API version.                                                           |
| `-jvm-target=String`       | Specifies the target JVM version.                                                           |
| `-module-name=String`      | Specifies the module name.                                                                  |
| `-source-roots=List<File>` | Specifies the source root directories. Use a colon-separated list for multiple directories. |
| `-project-base-dir=File`   | Specifies the project root directory.                                                       |
| `-output-base-dir=File`    | Specifies the base directory for KSP output.                                                |
| `-caches-dir=File`         | Specifies the directory for KSP caches.                                                     |
| `-java-output-dir=File`    | Specifies the directory for generated Java files.                                           |
| `-class-output-dir=File`   | Specifies the directory for generated class files.                                          |
| `-kotlin-output-dir=File`  | Specifies the directory for generated Kotlin files.                                         |
| `-resource-output-dir=File`| Specifies the directory for generated resources.                                            |
| `<processor>`              | Specifies the processor classpath.                                                          |

### Other notable options

* `-libraries=File`: Specifies the classpath used to resolve dependencies referenced by the source files. This is 
typically the module's compile classpath.

* `-jdk-home=File`: Specifies the JDK home directory. Use this option when the processor resolves Java symbols and 
requires access to the Java standard library.

* `-friends=File`: Specifies the classpath of the current module's friend modules. This is typically the module's friend 
classpath. For more information, see [Friend modules](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kotlin-compile/friend-paths.html).

### JVM parameters

* `-Dksp.logging`: Specifies the logging level. Valid values are `error`, `warn` or `warning`, `info`, and `debug`. The 
default value is `warn`. Unsupported values are treated as `warn`.
