[//]: # (title: Kotlin-jpa compiler plugin)

The `kotlin-jpa` compiler plugin configures Kotlin projects for the Java Persistence API (JPA).
JPA has two requirements that conflict with Kotlin's defaults:

* **A zero-argument constructor.** JPA instantiates entities through reflection (a process called _hydration_),
  which requires a zero-argument constructor. Kotlin classes don't declare one by default.
* **Non-final classes.** JPA providers create proxy subclasses of your entities to support lazy loading
  (for example, for `@ManyToOne` and `@OneToOne` associations). Kotlin classes and their members are `final` by default,
  which prevents this. If entities aren't `open`, lazy loading won't work.

The `kotlin-jpa` plugin addresses both. It's a preconfigured wrapper that applies:

* The [`no-arg` plugin](no-arg-plugin.md) to generate a synthetic zero-argument constructor for JPA-annotated classes.
* The [`all-open` plugin](all-open-plugin.md) to make JPA-annotated classes and their members `open`.

The generated constructor is synthetic, so you can't call it directly from Java or Kotlin, but JPA can call it through reflection.

> Applying `all-open` together with `no-arg` is available since Kotlin 2.3.20. In earlier versions, `kotlin-jpa` configured
> only `no-arg`, so you had to add `all-open` (or [`kotlin-spring`](kotlin-spring-plugin.md)) with a JPA preset manually
> to make lazy loading work.
>
{style="note"}

> If you generate a project template using [start.spring.io](https://start.spring.io/#!language=kotlin) with the JPA dependency,
> the `kotlin-jpa` plugin is enabled by default.
>
{style="note"}

## Supported JPA annotations

JPA annotations exist in two package namespaces: the older `javax.persistence` (Java EE) and the newer
`jakarta.persistence` (Jakarta EE 9 and later, used by Spring Boot 3.x and later). The `kotlin-jpa` plugin recognizes
both namespaces and specifies the following annotations automatically for the underlying `no-arg` and `all-open` plugins:

* `javax.persistence.Entity` and `jakarta.persistence.Entity`
* `javax.persistence.Embeddable` and `jakarta.persistence.Embeddable`
* `javax.persistence.MappedSuperclass` and `jakarta.persistence.MappedSuperclass`

Use the annotations from the namespace that matches your framework version. You don't need to configure the plugin
for either namespace: both are enabled by default.

## Apply the plugin

### Gradle

Add the `kotlin-jpa` plugin in the `plugins {}` block of your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"  // The version of Kotlin to use
    kotlin("plugin.jpa") version "%kotlinVersion%" // The Kotlin JPA plugin
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
    id "org.jetbrains.kotlin.plugin.jpa" version "%kotlinVersion%"
}
```

</tab>
</tabs>

### Maven

In Maven, support for the `kotlin-jpa` plugin is provided by the `kotlin-maven-noarg` plugin.
Add it to your `pom.xml` file:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <configuration>
        <compilerPlugins>
            <plugin>jpa</plugin>
        </compilerPlugins>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

> Since Kotlin 2.3.20, `kotlin-maven-noarg` implicitly includes `kotlin-maven-allopen`,
> so you no longer need to add the `all-open` dependency explicitly.
> 
{style="note"}

## Use the kotlin-jpa plugin

When the plugin is applied, classes annotated with common JPA annotations become `open` and get a synthetic
zero-argument constructor at compile time. You can write entities as regular classes without adding the `open`
keyword or declaring a zero-argument constructor manually.

The following example uses the `jakarta.persistence` namespace. If your framework still uses Java EE,
import the same annotations from `javax.persistence` instead and the plugin handles both:

```kotlin
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
class Message(
    var text: String,
) {
    // The kotlin-jpa plugin makes this class open and generates a synthetic
    // zero-argument constructor that JPA uses to instantiate it
    @Id
    @GeneratedValue
    var id: Long? = null
}
```

## Best practices for JPA entities

Applying the plugin makes entities `open` and gives them a zero-argument constructor, but a few Kotlin idioms still
conflict with how JPA providers manage entities. Follow these guidelines to avoid common issues:

* **Use a regular class, not a `data class`.** Data classes are `final`, favor immutable `val` properties, and derive
  `equals()`, `hashCode()`, and `toString()` from all properties. For entities, this breaks proxies, and `toString()`
  or `equals()` can trigger extra queries on lazy associations. Model entities as regular classes (the plugin makes
  them `open`) and reserve data classes for DTOs and query results.
* **Declare mapped properties as `var`.** JPA sets fields when hydrating an entity, so mapped properties must be mutable.
* **Make generated identifiers nullable and mutable.** A `@GeneratedValue` identifier is `null` until the entity is
  persisted, so declare it as `var id: Long? = null`.
* **Base `equals()` and `hashCode()` only on the identifier and type**, not on all properties. This keeps them stable
  across the entity lifecycle and avoids loading lazy fields.
* **Add the `kotlin-reflect` dependency**, which JPA providers rely on to work with Kotlin classes.

For a detailed discussion of these pitfalls, see the
[How to avoid common pitfalls with JPA and Kotlin](https://blog.jetbrains.com/idea/2026/01/how-to-avoid-common-pitfalls-with-jpa-and-kotlin/) blog post.

## Cover classes without JPA annotations

The plugin configures only JPA annotations. To generate a zero-argument constructor or make classes `open` for types
that aren't annotated with a JPA annotation, declare your own annotation and register it with the underlying plugins
through the `noArg {}` and `allOpen {}` configuration blocks. For details, see [`no-arg`](no-arg-plugin.md) and
[`all-open`](all-open-plugin.md).

## What's next?

* Learn how to avoid common entity-mapping issues in the
  [How to avoid common pitfalls with JPA and Kotlin](https://blog.jetbrains.com/idea/2026/01/how-to-avoid-common-pitfalls-with-jpa-and-kotlin/) blog post.
* For Spring applications that require classes to be `open`, use the [`kotlin-spring` plugin](kotlin-spring-plugin.md),
  which configures the `all-open` plugin with Spring annotations such as `@Component`, `@Transactional`, and `@Configuration`.
* Create your first Spring Boot application using the [Get started with Spring Boot and Kotlin](jvm-get-started-spring-boot.md) tutorial.
