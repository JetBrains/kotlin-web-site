[//]: # (title: Compiler execution strategy)

The _Kotlin compiler execution strategy_ defines where the Kotlin compiler runs.
Build tools such as [Gradle](gradle.md) or [Maven](maven.md) configure the strategy.

There are two compiler execution strategies:

| Strategy                          | Where the Kotlin compiler runs  | Other characteristics and notes                                                                                                                                                              |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Kotlin daemon](kotlin-daemon.md) | Inside its own daemon process   | _The default and fastest strategy_ in Gradle and Maven. The daemon process can be shared between different build system processes and multiple parallel compilations.                        |
| In process                        | Inside the build tool's process | The simplest strategy from the perspective of memory management, but it's less isolated from other logic running in the same process because it shares state, such as JVM system properties. |

## Configure in Gradle

You can define the Kotlin compiler execution strategy using one of the following properties:

* The `kotlin.compiler.execution.strategy` Gradle property.
* The `compilerExecutionStrategy` compile task property.

### Use the Gradle property

The possible values for the `kotlin.compiler.execution.strategy` property are:

* `daemon` (default)
* `in-process`

Set the `kotlin.compiler.execution.strategy` property in `gradle.properties`:

```none
kotlin.compiler.execution.strategy=in-process
```

### Use the compile task property

The `compilerExecutionStrategy` task property takes priority over the `kotlin.compiler.execution.strategy` Gradle property.

The possible values for the `compilerExecutionStrategy` task property are:

* [`DAEMON`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-d-a-e-m-o-n/) (default)
* [`IN_PROCESS`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compiler-execution-strategy/-i-n_-p-r-o-c-e-s-s/)

Set the `compilerExecutionStrategy` task property in your build scripts:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType<CompileUsingKotlinDaemon>().configureEach {
    compilerExecutionStrategy.set(KotlinCompilerExecutionStrategy.IN_PROCESS)
} 
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.CompileUsingKotlinDaemon
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy

// ...

tasks.withType(CompileUsingKotlinDaemon)
        .configureEach {
            compilerExecutionStrategy = KotlinCompilerExecutionStrategy.IN_PROCESS
        }
```

</tab>
</tabs>

### Fallback strategy

If communication with the Kotlin daemon fails, the compiler falls back to the "In process" strategy.

When this fallback happens, Gradle prints the following warning in the build output:

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

A silent fallback can consume a lot of system resources or lead to non-deterministic builds.
For more information, see
this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).

To prevent fallback, use the `kotlin.daemon.useFallbackStrategy` Gradle property. The default value is `true`.
When set to `false`, builds fail if there are problems with the daemon's startup or communication.
Declare this property in `gradle.properties`:

```none
kotlin.daemon.useFallbackStrategy=false
```

There is also a `useDaemonFallbackStrategy` property in Kotlin compile tasks. If you use both
properties, the `useDaemonFallbackStrategy` property
takes priority.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks {
    compileKotlin {
        useDaemonFallbackStrategy.set(false)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named("compileKotlin").configure {
    useDaemonFallbackStrategy = false
}
```

</tab>
</tabs>

If there is not enough memory to run the compilation, the logs show a related message.

## Configure in Maven

<include from ="maven-compile-package.md" element-id="maven-configure-execution-strategy"/>