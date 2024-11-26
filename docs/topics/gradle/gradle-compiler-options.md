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

The Gradle DSL allows comprehensive 
configuration of compiler options. It is available for [Kotlin Multiplatform](multiplatform-dsl-reference.md) and [JVM/Android](#target-the-jvm) projects.

With the Gradle DSL, you can configure compiler options within the build script at three levels: 
* **Extension level**, in the `kotlin {}` block for all targets and shared source sets.
* **Target level**, in the block for a specific target.
* **Compilation unit level,** usually in a specific compilation task.

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

The settings at a higher level are used as a convention (default) for a lower level:

* Compiler options set at the extension level are the default for target-level options, including shared source sets 
  like `commonMain`, `nativeMain`, and `commonTest`.
* Compiler options set at the target level are the default for options at the compilation unit (task) level, 
  like `compileKotlinJvm` and `compileTestKotlinJvm` tasks.

In turn, configurations made at a lower level override related settings at a higher level:

* Task-level compiler options override related configurations at the target or the extension level.
* Target-level compiler options override related configurations at the extension level.

To find out which level of compiler arguments is applied to the compilation, use the `DEBUG` level of Gradle [logging](https://docs.gradle.org/current/userguide/logging.html).
For JVM and JS/WASM tasks, search for the `"Kotlin compiler args:"` string within the logs; for Native tasks,
search for the `"Arguments ="` string.

> If you're a third-party plugin author, it's best to apply your configuration on the project level to avoid
> overriding issues. You can use the new [Kotlin plugin DSL extension types](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions) for this. It's recommended that you document this
> configuration on your side explicitly.
>
{style="tip"}

### Extension level

You can configure common compiler options for all the targets and shared source sets
in the `compilerOptions {}` block at the top level:

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### Target level

You can configure compiler options for the JVM/Android target
in the `compilerOptions {}` block inside the `target {}` block:

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

In Kotlin Multiplatform projects, you can configure compiler options inside the
specific target. For example, `jvm { compilerOptions {}}`. For more information, see [Multiplatform Gradle DSL reference](multiplatform-dsl-reference.md).

### Compilation unit level

You can configure compiler options for a specific compilation unit or task in a `compilerOptions {}` 
block inside the task configuration:

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

You can also access and configure compiler options at a compilation unit level via `KotlinCompilation`:

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

If you want to configure a plugin of a target different from JVM/Android and [Kotlin Multiplatform](multiplatform-dsl-reference.md),
use the `compilerOptions {}` property of the corresponding Kotlin compilation task. The following examples
show how to set this configuration up in both Kotlin and Groovy DSLs:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set("1.8")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set("1.8")
    }
}
```

</tab>
</tabs>

## Target the JVM

As explained before, you can define compiler options for your JVM/Android projects at the extension, target, and compilation unit levels.

Default JVM compilation tasks are called `compileKotlin` for production code and `compileTestKotlin`
for test code. The tasks for custom source sets are named according to their `compile<Name>Kotlin` patterns.

You can see the list of Android compilation tasks by running the `gradlew tasks --all` command in the terminal
and searching for `compile*Kotlin` task names in the `Other tasks` group.

Some important details to be aware of:

* The `android.kotlinOptions` and `kotlin.compilerOptions` configuration blocks override each other. The last (lowest) block takes effect.
* `kotlin.compilerOptions` configures every Kotlin compilation task in the project.
* You can override the configuration applied by `kotlin.compilerOptions` DSL using the `tasks.named<KotlinJvmCompile>("compileKotlin") { }`
  (or `tasks.withType<KotlinJvmCompile>().configureEach { }`) approach.

## Target JavaScript

JavaScript compilation tasks are called `compileKotlinJs` for production code, `compileTestKotlinJs` for test code, and `compile<Name>KotlinJs` for custom source sets.

To configure a single task, use its name:

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
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

Note that with the Gradle Kotlin DSL, you should get the task from the project's `tasks` first.

Use the `Kotlin2JsCompile` and `KotlinCompileCommon` types for JS and common targets, respectively.

## All Kotlin compilation tasks

It is also possible to configure all the Kotlin compilation tasks in the project:

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

## All compiler options

Here is a complete list of options for the Gradle compiler:

### Common attributes

| Name              | Description                                                                                                                              | Possible values           | Default value |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | A property for configuring a list of [opt-in compiler arguments](opt-in-requirements.md)                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | Enables the [progressive compiler mode](whatsnew13.md#progressive-mode)                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | Enables [additional declaration, expression, and type compiler checks](whatsnew21.md#extra-compiler-checks) that emit warnings if true | `true`, `false`           | `false`       |

### Attributes specific to JVM

| Name                      | Description                                                                                                                                                                                                                                   | Possible values                                                                                         | Default value               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | Generate metadata for Java 1.8 reflection on method parameters                                                                                                                                                                                |                                                                                                         | false                       |
| `jvmTarget`               | Target version of the generated JVM bytecode                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23". Also, see [Types for compiler options](#types-for-compiler-options) | "%defaultJvmTargetVersion%" |
| `noJdk`                   | Don't automatically include the Java runtime into the classpath                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>Validation of the [JVM target compatibility](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) between Kotlin and Java</li><li>A property for tasks of the `KotlinCompile` type.</li></list> | `WARNING`, `ERROR`, `INFO`                                                                              | `ERROR`                     |

### Attributes common to JVM and JavaScript

| Name | Description | Possible values                                                |Default value |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | Report an error if there are any warnings |                                                                | false |
| `suppressWarnings` | Don't generate warnings |                                                                | false |
| `verbose` | Enable verbose logging output. Works only when the [Gradle debug log level enabled](https://docs.gradle.org/current/userguide/logging.html) |                                                                | false |
| `freeCompilerArgs` | A list of additional compiler arguments. You can use experimental `-X` arguments here too. See an [example](#example-of-additional-arguments-usage-via-freecompilerargs) |                                                                | [] |
| `apiVersion`      | Restrict the use of declarations to those from the specified version of bundled libraries | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |               |
| `languageVersion` | Provide source compatibility with the specified version of Kotlin                         | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL)  |               |

> We are going to deprecate the attribute `freeCompilerArgs` in future releases. If you miss some option in the Kotlin Gradle DSL,
> please, [file an issue](https://youtrack.jetbrains.com/newissue?project=kt).
>
{style="warning"}

#### Example of additional arguments usage via freeCompilerArgs {initial-collapse-state="collapsed" collapsible="true"}

Use the `freeCompilerArgs` attribute to supply additional (including experimental) compiler arguments.
You can add a single argument to this attribute or a list of arguments:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.%gradleLanguageVersion%
        jvmTarget = JvmTarget.JVM_1_8
        
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

> The `freeCompilerArgs` attribute is available at the [extension](#extension-level), [target](#target-level), and [compilation unit (task)](#compilation-unit-level) levels.
>
{style="tip"} 

#### Example of setting languageVersion {initial-collapse-state="collapsed" collapsible="true"}

To set a language version, use the following syntax:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

Also, see [Types for compiler options](#types-for-compiler-options).

### Attributes specific to JavaScript

| Name | Description | Possible values |Default value |
|---|---|---|---|
| `friendModulesDisabled` | Disable internal declaration export| | false |
| `main` | Define whether the `main` function should be called upon execution | "call", "noCall". Also, see [Types for compiler options](#types-for-compiler-options) | "call" |
| `metaInfo` | Generate .meta.js and .kjsm files with metadata. Use to create a library | | true |
| `moduleKind` | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain", "es". Also, see [Types for compiler options](#types-for-compiler-options) | "umd" |
| `outputFile` | Destination *.js file for the compilation result | | "&lt;buildDir&gt;/js/packages/<project.name>/kotlin/<project.name>.js" |
| `sourceMap` | Generate source map | | true |
| `sourceMapEmbedSources` | Embed source files into the source map | "never", "always", "inlining". Also, see [Types for compiler options](#types-for-compiler-options) |  |
| `sourceMapNamesPolicy` | Add variable and function names that you declared in Kotlin code into the source map. For more information on the behavior, see our [compiler reference](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no). | "simple-names", "fully-qualified-names", "no". Also, see [Types for compiler options](#types-for-compiler-options)                                                              | "simple-names" |
| `sourceMapPrefix` | Add the specified prefix to paths in the source map |  |  |
| `target` | Generate JS files for specific ECMA version  | "v5"  | "v5" |
| `typedArrays` | Translate primitive arrays to JS typed arrays | | true |

### Types for compiler options

Some of the `compilerOptions` use the new types instead of the `String` type:

| Option                             | Type                                                                                                                                                                                                              | Example                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## What's next?

Learn more about:
* [Kotlin Multiplatform DSL reference](multiplatform-dsl-reference.md). 
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html).
* [Support for Gradle plugin variants](gradle-plugin-variants.md).
