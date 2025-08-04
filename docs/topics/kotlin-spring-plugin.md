[//]: # (title: Kotlin-spring compiler plugin)

If you create a Spring application with Kotlin,
you can enable the `kotlin-spring` compiler plugin to avoid adding certain Spring annotations manually.
This plugin is a preconfigured wrapper around the [`all-open` plugin](all-open-plugin.md) and behaves the same way: 
it markes all classes and methods as `open` if they are annotated with Spring annotations.

You can use both `kotlin-allopen` and `kotlin-spring` in the same project.

The plugin specifies the following Spring annotations:
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

> If you generate a project template using [start.spring.io](https://start.spring.io/#!language=kotlin),
> the `kotlin-spring` plugin is enabled by default.
>
{style="note"}

### Gradle 

Add the `kotlin-spring` plugin to your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.spring") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.spring" version "%kotlinVersion%"
}
```

</tab>
</tabs>

### Maven

In Maven, support for the `kotlin-spring` plugin is provided by the `kotlin-maven-allopen` plugin.
Add it to your pom.xml file:

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
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
</plugin>
```

## What's next?

* [Get started with Spring Boot and Kotlin](jvm-get-started-spring-boot.md) and create a Spring Boot application.