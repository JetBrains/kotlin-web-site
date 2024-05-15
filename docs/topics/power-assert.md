[//]: # (title: Power-assert compiler plugin)

> The Power-assert compiler plugin is [Experimental](components-stability.md).
> It may be dropped or changed at any time. Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-63607).
>
{type="warning"}

The Kotlin Power-assert compiler plugin allows ...

## Apply the plugin

Apply the `kotlin-power-assert` Gradle plugin in the `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.power-assert") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.power-assert' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## Supported assert functions

The power-assert plugin doesn't support the `kotlin.test` library. You can use `assert()` function to ...

### Use the power-assert plugin

