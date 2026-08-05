[//]: # (title: Kotlin-spring compiler plugin)

The `kotlin-spring` compiler plugin configures Kotlin projects for Spring
by automatically making certain Spring-annotated classes and members `open` at compile time.

This plugin is a preconfigured wrapper around the [`all-open` plugin](all-open-plugin.md) and behaves the same way:
it makes a class and its members `open` when they have a Spring annotation.
You can use both `all-open` and `kotlin-spring` in the same project.

> If you generate a project template using [start.spring.io](https://start.spring.io/#!language=kotlin),
> the `kotlin-spring` plugin is enabled by default.
>
{style="note"}

## Supported Spring annotations

The plugin makes a class and its members `open` when the class has any of the following Spring annotations:
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

The plugin also supports meta-annotations. Classes annotated with [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html),
or [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
also become `open`, because Spring meta-annotates these annotations with
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html).

## Apply the plugin

### Gradle

Add the `kotlin-spring` plugin in the `plugins {}` block of your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%springBootSupportedKotlinVersion%"  // The version of Kotlin to use
    kotlin("plugin.spring") version "%springBootSupportedKotlinVersion%" // The Kotlin Spring plugin
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%springBootSupportedKotlinVersion%"
    id "org.jetbrains.kotlin.plugin.spring" version "%springBootSupportedKotlinVersion%"
}
```

</tab>
</tabs>

### Maven

In Maven, support for the `kotlin-spring` plugin is provided by the `kotlin-maven-allopen` plugin.
Add it to your `pom.xml` file:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <configuration>
        <args>
            <arg>-Xjsr305=strict</arg>
        </args>
        <compilerPlugins>
            <plugin>spring</plugin>
        </compilerPlugins>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>%springBootSupportedKotlinVersion%</version>
        </dependency>
    </dependencies>
</plugin>
```

## Use the kotlin-spring plugin

When you apply the plugin, the compiler treats classes with common Spring annotations as `open` at compile time.
You can write these classes without adding the `open` keyword:

```kotlin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
    // This class and all its members are open
    @GetMapping
    fun listMessages() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}
```

## What's next?

* For JPA entities that require a zero-argument constructor, use the [`kotlin-jpa` plugin](kotlin-jpa-plugin.md),
  which configures the `no-arg` plugin with JPA annotations such as `@Entity`, `@Embeddable`, and `@MappedSuperclass`.
* Create your first Spring Boot application using the [Get started with Spring Boot and Kotlin](jvm-get-started-spring-boot.md) tutorial.