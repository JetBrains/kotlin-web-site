[//]: # (title: What's new in Kotlin %kotlinEapVersion%)

_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

The Kotlin %kotlinEapVersion% release is out!
Here are some details of this EAP release:

* [Kotlin compiler: unified management of compiler warnings](#kotlin-compiler-unified-management-of-compiler-warnings)
* [Kotlin/JVM: changes to default method generation for interface functions](#kotlin-jvm-changes-to-default-method-generation-for-interface-functions)
* [Gradle: integration of Problems API within KGP diagnostics](#integration-of-problems-api-within-kgp-diagnostics)
  and [KGP compatibility with '--warning-mode'](#kgp-compatibility-with-warning-mode)

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is to [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.

## Kotlin compiler: unified management of compiler warnings

<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% introduces a new compiler option, `-Xwarning-level`. It's designed to provide a unified way of managing compiler warnings in Kotlin projects.

Previously, you could only apply general module-wide rules, like disabling all warnings with
`-nowarn`, turning all warnings to compilation errors with `-Werror`, or enabling additional compiler checks with `-Wextra`. The only option to adjust them for specific warnings was the `-Xsuppress-warning` option.

With the new solution, you can override general rules and exclude specific diagnostics in a consistent way.

### How to apply

The new compiler option has the following syntax:

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: raises the specified warning to an error.
* `warning`: emits a warning, and is enabled by default.
* `disabled`: completely suppresses the specified warning module-wide.

Keep in mind that you can only configure the severity level of _warnings_ with the new compiler option.

### Use cases

With the new solution, you can better fine-tune warning reporting in your project by combining general rules with specific ones. Choose your use case:

#### Suppress warnings

| Command                                           | Description                                                                                                             |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | Suppresses all warnings during compilation.                                                                             |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | Suppresses only specified warnings.  Works the same as [`-Xsuppress-warning`](compiler-reference.md#xsuppress-warning). |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | Suppresses all warnings except for the specified ones.                                                                  |

#### Raise warnings to errors

| Command                                           | Description                                                  |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | Raises all warnings to compilation errors.                   |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | Raises only specified warnings to errors.                    |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | Raises all warnings to errors except for the specified ones. |

#### Enable additional compiler warnings

| Command                                            | Description                                                                                          |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | Enables all additional declaration, expression, and type compiler checks that emit warnings if true. |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | Enables only specified additional compiler checks.                                                   |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | Enables all additional checks except for the specified ones.                                         |

#### Warning lists

In case you have many warnings you want to exclude from general rules, you can list them in a separate file through [`@argfile`](compiler-reference.md#argfile).

### Leave feedback

The new compiler option is still [Experimental](components-stability.md#stability-levels-explained). Please report any problems to our issue tracker, [YouTrack](https://kotl.in/issue).

## Kotlin/JVM: changes to default method generation for interface functions

Starting from Kotlin %kotlinEapVersion%, functions declared in interfaces are compiled to JVM default methods unless configured otherwise.
This change affects how Kotlin's interface functions with implementations are compiled to bytecode. 
This behavior is controlled by the new stable compiler option `-jvm-default`, replacing the deprecated `-Xjvm-default` option.

You can control the behavior of the `-jvm-default` option using the following values:

* `enable` (default): generates default implementations in interfaces and includes bridge functions in subclasses and `DefaultImpls` classes. Use this mode to maintain binary compatibility with older Kotlin versions.
* `no-compatibility`: generates only default implementations in interfaces. This mode skips compatibility bridges and `DefaultImpls` classes, making it suitable for new code.
* `disable`: disables default implementations in interfaces. Only bridge functions and `DefaultImpls` classes are generated, matching the behavior before Kotlin %kotlinEapVersion%.

To configure the `-jvm-default` compiler option, set the `jvmDefault` property in your Gradle Kotlin DSL:

```kotlin
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

## Gradle

### Integration of Problems API within KGP diagnostics

Previously, the Kotlin Gradle Plugin (KGP) reported diagnostics—such as warnings and errors—only as plain text output to the console or logs.

Starting with %kotlinEapVersion%, KGP introduces an additional reporting mechanism: it now uses [Gradle's Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html),
a standardized way to report rich, structured problem information during the build process.

KGP diagnostics are now easier to read and more consistently displayed across different interfaces like the Gradle CLI and IntelliJ IDEA.

This integration is enabled by default, starting with Gradle 8.6 or later.
As the API is still evolving, use the most recent Gradle version to benefit from the latest improvements.

### KGP compatibility with '--warning-mode'

The Kotlin Gradle Plugin (KGP) diagnostics reported issues using fixed severity levels, meaning Gradle's [`--warning-mode` command-line option](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) had no effect on how KGP displayed errors.

Now, KGP diagnostics are compatible with the `--warning-mode` option, providing more flexibility. For example,
you can convert all warnings into errors or disable warnings entirely.

With this change, KGP diagnostics adjust the output based on the selected warning mode:
* When you set `--warning-mode=fail`, diagnostics with `Severity.Warning` are now elevated to `Severity.Error`.
* When you set `--warning-mode=none`, diagnostics with `Severity.Warning` are not logged.

This behavior is enabled by default starting with %kotlinEapVersion%.

To ignore the `--warning-mode` option, set `kotlin.internal.diagnostics.ignoreWarningMode=true` in your Gradle properties.

## How to update to Kotlin %kotlinEapVersion%

Starting from IntelliJ IDEA 2023.3 and Android Studio Iguana (2023.2.1) Canary 15, the Kotlin plugin is distributed as a
bundled plugin included in your IDE. This means that you can't install the plugin from JetBrains Marketplace anymore.
The bundled plugin supports upcoming Kotlin EAP releases.

To update to the new Kotlin EAP version, [change the Kotlin version](configure-build-for-eap.md#adjust-the-kotlin-version)
to %kotlinEapVersion% in your build scripts.