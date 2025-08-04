[//]: # (title: Kotlin-jpa compiler plugin)

The `no-arg` compiler plugin generates an additional zero-argument constructor for classes with a specific annotation. 

The generated constructor is synthetic, so it can't be directly called from Java or Kotlin, but it can be called using reflection.

This allows the Java Persistence API (JPA) to instantiate a class although it doesn't have the zero-parameter constructor
from Kotlin or Java point of view.

## JPA support

As with the `kotlin-spring` plugin wrapped on top of `all-open`, `kotlin-jpa` is wrapped on top of `no-arg`. The plugin specifies 
[`@Entity`](https://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html), [`@Embeddable`](https://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html),
and [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) 
`no-arg` annotations automatically.

Add the plugin using the Gradle plugins DSL:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.jpa") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.jpa" version "%kotlinVersion%"
}
```

</tab>
</tabs>

In Maven, enable the `jpa` plugin:

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

## What's next?

* [Get started with Spring Boot and Kotlin](jvm-get-started-spring-boot.md) and create a Spring Boot application.