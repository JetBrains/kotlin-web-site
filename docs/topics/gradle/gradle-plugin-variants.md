[//]: # (title: Support for Gradle plugin variants)

Gradle 7.0 introduced a new feature for Gradle plugin authors
— [plugins with variants](https://docs.gradle.org/7.0/userguide/implementing_gradle_plugins.html#plugin-with-variants).
This feature makes it easier to add support for latest Gradle features while maintaining compatibility with older Gradle versions. 
Learn more about [variant selection in Gradle](https://docs.gradle.org/current/userguide/variant_model.html).

With Gradle plugin variants, the Kotlin team can ship different Kotlin Gradle plugin (KGP) variants for different Gradle versions. 
The goal is to support the base Kotlin compilation in the `main` variant, which corresponds to the oldest supported versions of
Gradle. Each variant will have implementations for Gradle features from a corresponding release. The latest variant will
support the latest Gradle feature set. With this approach, it is possible to extend support for older Gradle versions 
with limited functionality.

Currently, there are the following variants of the Kotlin Gradle plugin:

| Variant's name | Corresponding Gradle versions |
|----------------|-------------------------------|
| `main`         | 6.8.3–6.9.3                   |
| `gradle70`     | 7.0                           |
| `gradle71`     | 7.1-7.3                       |
| `gradle74`     | 7.4                           |
| `gradle75`     | 7.5                           |
| `gradle76`     | 7.6                           |
| `gradle80`     | 8.0                           |
| `gradle81`     | 8.1.1                         |
| `gradle82`     | 8.2.1–8.4                     |
| `gradle85`     | 8.5 and higher                |

In future Kotlin releases, more variants will be added.

To check which variant your build uses, enable
the [`--info` log level](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) and find a
string in the output starting with `Using Kotlin Gradle plugin`, for example, `Using Kotlin Gradle plugin main variant`.

## Troubleshooting

> Here are workarounds for some known issues with variant selection in Gradle:
> * [ResolutionStrategy in pluginManagement is not working for plugins with multivariants](https://github.com/gradle/gradle/issues/20545)
> * [Plugin variants are ignored when a plugin is added as the `buildSrc` common dependency](https://github.com/gradle/gradle/issues/20847)
>
{type="note"}

### Gradle can't select a KGP variant in a custom configuration

This is an expected situation that Gradle can't select a KGP variant in a custom configuration.
If you use a custom Gradle configuration:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
configurations.register("customConfiguration") {
    // ...
}
```

</tab>
</tabs>

And want to add a dependency on the Kotlin Gradle plugin, for example:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    customConfiguration("org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    customConfiguration 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kotlinVersion%'
}
```

</tab>
</tabs>

You need to add the following attributes to your `customConfiguration`:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage.class, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category.class, Category.LIBRARY)
            )
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named("7.0")
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
configurations {
    customConfiguration {
        attributes {
            attribute(
                Usage.USAGE_ATTRIBUTE,
                project.objects.named(Usage, Usage.JAVA_RUNTIME)
            )
            attribute(
                Category.CATEGORY_ATTRIBUTE,
                project.objects.named(Category, Category.LIBRARY)
            )
            // If you want to depend on a specific KGP variant:
            attribute(
                GradlePluginApiVersion.GRADLE_PLUGIN_API_VERSION_ATTRIBUTE,
                project.objects.named('7.0')
            )
        }
    }
}
```

</tab>
</tabs>

Otherwise, you will receive an error similar to this:

```none
 > Could not resolve all files for configuration ':customConfiguration'.
      > Could not resolve org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0.
        Required by:
            project :
         > Cannot choose between the following variants of org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
             - gradle70RuntimeElements
             - runtimeElements
           All of them match the consumer attributes:
             - Variant 'gradle70RuntimeElements' capability org.jetbrains.kotlin:kotlin-gradle-plugin:1.7.0:
                 - Unmatched attributes:
```

## What's next?

Learn more about [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html).
