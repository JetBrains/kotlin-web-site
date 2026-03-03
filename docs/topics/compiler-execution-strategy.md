[//]: # (title: Compiler execution strategy)

The _Kotlin compiler execution strategy_ defines where the Kotlin compiler runs.
Build tools such as [Gradle](gradle.md) or [Maven](maven.md) configure the strategy. Some strategies are faster than others.

There are three compiler execution strategies:

| Strategy                          | Where the Kotlin compiler is executed      | Other characteristics and notes                                                                                        |
|-----------------------------------|--------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| [Kotlin daemon](kotlin-daemon.md) | Inside its own daemon process              | _The default and fastest strategy_. Can be shared between different Gradle daemons and multiple parallel compilations. |
| In process                        | Inside the build tool's daemon process     | The "In process" execution strategy is _slower_ than the "Kotlin daemon" execution strategy.                           |
| Out of process                    | In a separate process for each compilation | The slowest execution strategy. Not supported by the Kotlin Maven plugin.                                              |

## Configure in Gradle

You can define the Kotlin compiler execution strategy using one of the following properties:
* The `kotlin.compiler.execution.strategy` Gradle property.
* The `compilerExecutionStrategy` compile task property.

The `compilerExecutionStrategy` task property takes priority over the `kotlin.compiler.execution.strategy` Gradle property.

The possible values for the `kotlin.compiler.execution.strategy` property are:

* `daemon` (default)
* `in-process`
* `out-of-process`

Set the `kotlin.compiler.execution.strategy` property in `gradle.properties`:

```none
kotlin.compiler.execution.strategy=out-of-process
```

The possible values for the `compilerExecutionStrategy` task property are:

* `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.DAEMON` (default)
* `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.IN_PROCESS`
* `org.jetbrains.kotlin.gradle.tasks.KotlinCompilerExecutionStrategy.OUT_OF_PROCESS`

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

If the Kotlin daemon fails, the compiler falls back to another strategy.
If the Gradle daemon is available, the compiler uses the "In process" strategy.
If it's not, the compiler uses the "Out of process" strategy.

When this fallback happens, Gradle prints the following warning in the build output:

```none
Failed to compile with Kotlin daemon: java.lang.RuntimeException: Could not connect to Kotlin compile daemon
[exception stacktrace]
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.
```

A silent fallback can consume a lot of system resources or lead to non-deterministic builds.
For more information, see this [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy).

To prevent fallback, set the `kotlin.daemon.useFallbackStrategy` Gradle property to `false`. The default value is `true`.
When set to `false`, builds fail if there are problems with the daemon's startup or communication. Declare this property in
`gradle.properties`:

```none
kotlin.daemon.useFallbackStrategy=false
```

There is also a `useDaemonFallbackStrategy` property in Kotlin compile tasks. If you use both properties, the `useDaemonFallbackStrategy` property
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

By default, Maven uses the Kotlin daemon strategy. To switch to the "in process" strategy, set the following
property in your `pom.xml` file:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Maven uses the Build tools API, which doesn't support the "out of process" strategy. As a result, you can't configure this strategy in Maven.