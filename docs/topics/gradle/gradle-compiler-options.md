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

Using a build script, you can specify additional compilation options. Use the `compilerOptions` property of a Kotlin compilation task for it. 
For example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        freeCompilerArgs.add("-Xexport-kdoc")
    }
}
```

</tab>
</tabs>

When targeting the JVM, the tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are named according to their `compile<Name>Kotlin` patterns.

The names of the tasks in Android Projects contain [build variant](https://developer.android.com/studio/build/build-variants.html) names and follow the `compile<BuildVariant>Kotlin` pattern, for example, `compileDebugKotlin` or `compileReleaseUnitTestKotlin`.

For both JVM and Android Projects it's possible since 1.9.0 to define options in a following way:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        apiVersion.set(KotlinVersion.KOTLIN_1_9)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        apiVersion = org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
    }
}
```

</tab>
</tabs>

Some important things to be aware of:

- `android.kotlinOptions` and `kotlin.compilerOptions` interfere: one below will overwrite the one above
- `kotlin.compilerOptions` work module-wise, not project-wise
- `android.kotlinOptions.moduleName` might be overwritten by `kotlin.compilerOptions.moduleName` if the latter one goes below the first one
- The separate configuration of `tasks.withType(KotlinCompile::class.java)` will overwrite the configuration inside `kotlinOptions`


When targeting JavaScript, the tasks are called `compileKotlinJs` for production code and `compileTestKotlinJs` for test code, and `compile<Name>KotlinJs` for custom source sets.

To configure a single task, use its name. Examples:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings.set(true)
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
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

Here is a complete list of options for Gradle tasks:

### Common attributes

| Name              | Description                                     | Possible values           | Default value |
|-------------------|-------------------------------------------------|---------------------------|---------------|
| `optIn`           | Property to configure opt-in compiler arguments | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | Enable progressive compiler mode                | `true`, `false`           | `false`       |

### Attributes specific to JVM

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `javaParameters` | Generate metadata for Java 1.8 reflection on method parameters |  | false |
| `jvmTarget` | Target version of the generated JVM bytecode | "1.8", "9", "10", ..., "19". Also, see [Types for compiler options](#types-for-compiler-options) | "%defaultJvmTargetVersion%" |
| `noJdk` | Don't automatically include the Java runtime into the classpath |  | false |
| `jvmTargetValidationMode` | Validation of compatibility of Kotlin and Java targets.<br/>Is a property of tasks of type `KotlinCompile`, see an [example](#example-of-setting-of-jvm-target-validation-mode) | `WARNING`, `ERROR`, `INFO` | `ERROR` |

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
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

// Single experimental argument
compileKotlin.compilerOptions.freeCompilerArgs.add("-Xexport-kdoc")
// Single additional argument, can be a key-value pair
compileKotlin.compilerOptions.freeCompilerArgs.add("-Xno-param-assertions")
// List of arguments
compileKotlin.compilerOptions.freeCompilerArgs.addAll(listOf("-Xno-receiver-assertions", "-Xno-call-assertions"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")
        // Single additional argument, can be a key-value pair
        freeCompilerArgs.add("-Xno-param-assertions")
        // List of arguments
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</tab>
</tabs>

### Attributes common to JVM and JS

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | Restrict the use of declarations to those from the specified version of bundled libraries | "1.3" (DEPRECATED), "1.4" (DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (EXPERIMENTAL) |  |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin | "1.3" (DEPRECATED), "1.4" (DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (EXPERIMENTAL) |  |

#### Example of setting a languageVersion

To set a language version, use the following syntax:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks
    .withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask<*>>()
    .configureEach {
        compilerOptions
            .languageVersion
            .set(
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
            )
    }
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion = 
                org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9
}
```

</tab>
</tabs>

#### Example of setting of JVM target validation mode

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile::class.java).configureEach {
    jvmTargetValidationMode.set(JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>


Also, see [Types for compiler options](#types-for-compiler-options).

### Attributes specific to JS

| Name | Description | Possible values |Default value |
|---|---|---|---|
| `friendModulesDisabled` | Disable internal declaration export| | false |
| `main` | Define whether the `main` function should be called upon execution | "call", "noCall". Also, see [Types for compiler options](#types-for-compiler-options) | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library | | true |
| `moduleKind` | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain", "es". Also, see [Types for compiler options](#types-for-compiler-options) | "umd" |
| `outputFile` | Destination *.js file for the compilation result | | "\<buildDir>/js/packages/\<project.name>/kotlin/\<project.name>.js" |
| `sourceMap` | Generate source map | | true |
| `sourceMapEmbedSources` | Embed source files into the source map | "never", "always", "inlining". Also, see [Types for compiler options](#types-for-compiler-options) |  |
| `sourceMapNamesPolicy` | Add variable and function names that you declared in Kotlin code into the source map. For more information on the behavior, see our [compiler reference](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no). | "simple-names", "fully-qualified-names", "no". Also, see [Types for compiler options](#types-for-compiler-options)                                                              | "simple-names" |
| `sourceMapPrefix` | Add the specified prefix to paths in the source map |  |  |
| `target` | Generate JS files for specific ECMA version  | "v5"  | "v5" |
| `typedArrays` | Translate primitive arrays to JS typed arrays | | true |

### Types for compiler options

Some of the `compilerOptions` use the new types instead of the `String` type:

| Option | Type | Example |
|--------|------|---------|
| `jvmTarget` | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt) | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) | `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_1_9)` |
| `main` | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)` |
| `moduleKind` | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt) | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)` |
| `sourceMapEmbedSources` | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt) | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy` | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/1.8.20/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt) | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)` |

## What's next?

Learn more about:
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/getting_started.html).
* [Support for Gradle plugin variants](gradle-plugin-variants.md).