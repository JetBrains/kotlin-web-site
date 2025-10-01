[//]: # (title: Kotlin daemon)

The Kotlin daemon is a background process that build systems can use to improve build times by keeping the compiler 
and its environment ready to compile. This approach avoids starting a new Java Virtual Machine (JVM)
instance and reinitializing the compiler for every compilation, leading to reduced build times for incremental builds 
or frequent small changes.

Some build systems have their own daemons that help reduce startup costs, such as the [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html) and the [Maven daemon](https://maven.apache.org/tools/mvnd.html).
Using the Kotlin daemon instead reduces startup costs while also completely isolating the build system process from the compiler.
This separation is useful in dynamic environments where system settings might change at runtime.

Although the Kotlin daemon has no direct user-facing interface, you can use it through build systems or the [build tools API](build-tools-api.md).

## Kotlin daemon configuration

There are ways to configure some settings for the Kotlin daemon for Gradle or Maven.

### Memory management

The Kotlin daemon is a separate process that has its own memory space, isolated from the client.
By default, the Kotlin daemon tries to inherit the heap size (`-Xmx`) of the launching JVM process.

To configure specific memory limits, like `-Xmx` and `-XX:MaxMetaspaceSize`, use the following property:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

For more information, see [`kotlin.daemon.jvmargs` property](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property).

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### Lifetime

There are two common lifetime strategies for the Kotlin daemon:

* **Attached daemon**: Shut down the daemon shortly after the client process shuts down or the daemon hasn't been used for a while. Use when the client is long-running. 
* **Detached daemon**: Keep the daemon alive longer to await potential follow-up requests. Use when the client is short-lived. 

To configure the lifetime strategy, you can use the following options:

| Option                      | Description                                                                                        | Default value |
|-----------------------------|----------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | How long the daemon should stay alive after the last compilation when a client is still connected. | 2 hours       |
| `autoshutdownUnusedSeconds` | How long a newly started daemon waits for a first client before shutting down if unused.           | 1 minute      |
| `shutdownDelayMilliseconds` | How long the daemon waits to shut down after all clients disconnect.                               | 1 second      |

To configure an attached daemon lifetime strategy, set `autoshutdownIdleSeconds` to a **high** value and `shutdownDelayMilliseconds` to a **low** value.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

Add the following to your `gradle.properties` file:

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

Use the following command:

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

To configure a detached daemon lifetime strategy, set `shutdownDelayMilliseconds` to a **high** value.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

Add the following to your `gradle.properties` file:

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

Add the following property to your `pom.xml` file:

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>
