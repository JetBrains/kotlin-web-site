[//]: # (title: Kotlin-spring compiler plugin)

The `kotlin-spring` compiler plugin configures Kotlin projects for Spring
by automatically making certain Spring-annotated classes and members `open` at compile time.

This plugin is a preconfigured wrapper around the [`all-open` plugin](all-open-plugin.md) and behaves the same way: 
it marks all classes and methods as `open` if they are annotated with Spring annotations.
You can use both `all-open` and `kotlin-spring` in the same project.

> If you generate a project template using [start.spring.io](https://start.spring.io/#!language=kotlin),
> the `kotlin-spring` plugin is enabled by default.
>
{style="note"}

### Supported Spring annotations

The plugin specifies classes and its members as open for the following Spring annotations:
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

Thanks to meta-annotations support, classes annotated with [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
or [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
are automatically opened because these annotations are meta-annotated with
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html).

## Apply the plugin

> Spring Framework 6.2 and Spring Boot 3.x officially support Kotlin 1.9.x
> (see [Spring Boot reference: Kotlin support](https://docs.spring.io/spring-boot/reference/features/kotlin.html)).  
> Kotlin 2.x.x is **not** supported in current Spring releases and may cause build or tooling issues.  
> Support for Kotlin 2.x.x is [planned for Spring Framework 7 and Spring Boot 4](https://spring.io/blog/2024/10/01/from-spring-framework-6-2-to-7-0).
>
{style="note"}

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

When the plugin is applied, classes annotated with common Spring annotations are treated as `open` at compile time.
You can create classes with Spring annotations without adding the `open` keyword:

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