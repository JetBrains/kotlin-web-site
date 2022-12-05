[//]: # (title: Compiler options in the Kotlin Gradle plugin)

Each release of Kotlin includes compilers for the supported targets:
JVM, JavaScript, and native binaries for [supported platforms](native-overview.md#target-platforms).

These compilers are used by:
* The IDE, when you click the __Compile__ or __Run__ button for your Kotlin project.
* Gradle, when you call `gradle build` in a console or in the IDE.
* Maven, when you call `mvn compile` or `mvn test-compile` in a console or in the IDE.

You can also run Kotlin compilers manually from the command line as described
in the [Working with command-line compiler](command-line.md) tutorial.

## How to define options

Kotlin compilers have a number of options for tailoring the compiling process.

Using a build script, you can specify additional compilation options. Use the `kotlinOptions` property of a Kotlin compilation task for it. 
For example:

```kotlin
compileKotlin.kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
```

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are named according to their `compile<Name>Kotlin` patterns.

The names of the tasks in Android Projects contain [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the `compile<BuildVariant>Kotlin` pattern, for example, `compileDebugKotlin` or `compileReleaseUnitTestKotlin`.

When targeting JavaScript, the tasks are called `compileKotlinJs` for production code and `compileTestKotlinJs` for test code, and `compile<Name>KotlinJs` for custom source sets.

To configure a single task, use its name. Examples:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.suppressWarnings = true
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

//or

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

Note that with the Gradle Kotlin DSL, you should get the task from the project's `tasks` first.

Use the `Kotlin2JsCompile` and `KotlinCompileCommon` types for JS and common targets, respectively.

It is also possible to configure all of the Kotlin compilation tasks in the project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinCompile>().configureEach {
    kotlinOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinCompile).configureEach {
    kotlinOptions { /*...*/ }
}
```
</tab>
</tabs>

Here is a complete list of options for Gradle tasks:

### Attributes specific to JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jdkHome` | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME. Direct setting is not possible, use [other ways to set this option](gradle-configure-project.md#set-custom-jdk-home).  |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode | "1.8", "9", "10", ..., "18" | "%defaultJvmTargetVersion%" |
| `noJdk` | Don't automatically include the Java runtime into the classpath |  | false |
| `useOldBackend` | Use the [old JVM backend](whatsnew15.md#stable-jvm-ir-backend) |  | false |

### Attributes common to JVM, JS, and JS DCE

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `allWarningsAsErrors` | Report an error if there are any warnings |  | false |
| `suppressWarnings` | Don't generate warnings |  | false |
| `verbose` | Enable verbose logging output. Works only when the [Gradle debug log level enabled](https://docs.gradle.org/current/userguide/logging.html) |  | false |
| `freeCompilerArgs` | A list of additional compiler arguments. You can use experimental `-X` arguments here too. See an [example](#example-of-additional-arguments-usage-via-freecompilerargs) |  | [] |

> We are going to deprecate the attribute `freeCompilerArgs` in future releases. If you miss some option in the Kotlin Gradle DSL,
> please, [file an issue](https://youtrack.jetbrains.com/newissue?project=kt).
>
{type="warning"}

#### Example of additional arguments usage via freeCompilerArgs {initial-collapse-state="collapsed"}

Use the attribute `freeCompilerArgs` to supply additional (including experimental) compiler arguments. You can add a single
argument to this attribute or a list of arguments:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.dsl.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

// Single experimental argument
compileKotlin.kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
// Single additional argument, can be a key-value pair
compileKotlin.kotlinOptions.freeCompilerArgs += "-opt-in=org.mylibrary.OptInAnnotation"
// List of arguments
compileKotlin.kotlinOptions.freeCompilerArgs += listOf("-Xno-param-assertions", "-Xno-receiver-assertions", "-Xno-call-assertions")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // Single experimental argument
    kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    // Single additional argument, can be a key-value pair
    kotlinOptions.freeCompilerArgs += "-opt-in=org.mylibrary.OptInAnnotation"
    // List of arguments
    kotlinOptions.freeCompilerArgs += ["-Xno-param-assertions", "-Xno-receiver-assertions", "-Xno-call-assertions"]
}

//or

compileKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xexport-kdoc"
        kotlinOptions.freeCompilerArgs += "-opt-in=org.mylibrary.OptInAnnotation"
        freeCompilerArgs += ["-Xno-param-assertions", "-Xno-receiver-assertions", "-Xno-call-assertions"]
    }
}
```

</tab>
</tabs>

### Attributes common to JVM and JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | Restrict the use of declarations to those from the specified version of bundled libraries | "1.3" (DEPRECATED), "1.4" (DEPRECATED), "1.5", "1.6", "1.7" |  |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin | "1.4" (DEPRECATED), "1.5", "1.6", "1.7" |  |

### Attributes specific to JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `friendModulesDisabled` | Disable internal declaration export |  | false |
| `main` | Define whether the `main` function should be called upon execution | "call", "noCall" | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library |  | true |
| `moduleKind` | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain"  | "umd" |
| `outputFile` | Destination *.js file for the compilation result |  | "\<buildDir>/js/packages/\<project.name>/kotlin/\<project.name>.js" |
| `sourceMap` | Generate source map |  | true |
| `sourceMapEmbedSources` | Embed source files into the source map | "never", "always", "inlining" |  |
| `sourceMapPrefix` | Add the specified prefix to paths in the source map |  |  |
| `target` | Generate JS files for specific ECMA version | "v5" | "v5" |
| `typedArrays` | Translate primitive arrays to JS typed arrays |  | true |

## What's next?

Learn more about:
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/getting_started.html).