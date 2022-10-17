[//]: # (title: Using the Gradle Kotlin DSL)

The Gradle Kotlin DSL is a domain specific language to write build scripts in more convenient way.

## Using the Gradle Kotlin DSL

When using [Gradle Kotlin DSL](https://github.com/gradle/kotlin-dsl), apply Kotlin plugins using the `plugins { ... }` block.
If you apply them with `apply { plugin(...) }` instead, you may encounter unresolved references to the extensions generated
by Gradle Kotlin DSL. To resolve that, you can comment out the erroneous usages, run the Gradle task `kotlinDslAccessorsSnapshot`,
then uncomment the usages back and rerun the build or reimport the project into the IDE.

## Triggering configuration actions with the KotlinBasePlugin interface

To trigger some configuration action whenever any Kotlin Gradle plugin (JVM, JS, Multiplatform, Native, and others) is applied,
use the `KotlinBasePlugin` interface that all Kotlin plugins inherit from:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
// Configure your action here
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
// Configure your action here
}
```

</tab>
</tabs>

## What's next?

Learn more about [Gradle basics and specifics](https://docs.gradle.org/current/userguide/getting_started.html).