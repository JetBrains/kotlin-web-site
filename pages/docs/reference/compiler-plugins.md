---
type: doc
layout: reference
title: "Compiler Plugins"
---

# Compiler Plugins

## All-open compiler plugin

Kotlin has classes and their members `final` by default, which makes it inconvenient to use frameworks and libraries such as Spring AOP that require classes to be `open`. The *all-open* compiler plugin adapts Kotlin to the requirements of those frameworks and makes classes annotated with a specific annotation and their members open without the explicit `open` keyword.

For instance, when you use Spring, you don't need all the classes to be open, but only classes annotated with specific annotations like `@Configuration` or `@Service`. *All-open* allows to specify such annotations.

We provide *all-open* plugin support both for Gradle and Maven with the complete IDE integration.

:point_up: For Spring you can use the `kotlin-spring` compiler plugin ([see below](compiler-plugins.html#spring-support)).

### Using in Gradle

Add the plugin artifact to the buildscript dependencies and apply the plugin:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-allopen"
```

As an alternative, you can enable it using the `plugins` block:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.allopen" version "{{ site.data.releases.latest.version }}"
}
```

Then specify the list of annotations that will make classes open:

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

If the class (or any of its superclasses) is annotated with `com.my.Annotation`, the class itself and all its members will become open.

It also works with meta-annotations:

``` kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // will be all-open
```

`MyFrameworkAnnotation` is annotated with the all-open meta-annotation `com.my.Annotation`, so it becomes an all-open annotation as well.

### Using in Maven

Here's how to use all-open with Maven:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "spring" for the Spring support -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- Each annotation is placed on its own line -->
            <option>all-open:annotation=com.my.Annotation</option>
            <option>all-open:annotation=com.their.AnotherAnnotation</option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

Please refer to the "Using in Gradle" section above for the detailed information about how all-open annotations work.

### Spring support

If you use Spring, you can enable the *kotlin-spring* compiler plugin instead of specifying Spring annotations manually. The kotlin-spring is a wrapper on top of all-open, and it behaves exactly the same way.

As with all-open, add the plugin to the buildscript dependencies:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-spring" // instead of "kotlin-allopen"
```

Or using the Gradle plugins DSL:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.spring" version "{{ site.data.releases.latest.version }}"
}
```

In Maven, enable the `spring` plugin:

```xml
<compilerPlugins>
    <plugin>spring</plugin>
</compilerPlugins>
```

The plugin specifies the following annotations: 
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html), [`@Async`](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html), [`@Transactional`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), [`@Cacheable`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html) and [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html). Thanks to meta-annotations support classes annotated with [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html), [`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html), [`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html), [`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html) or [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html) are automatically opened since these annotations are meta-annotated with [`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html).
 
Of course, you can use both `kotlin-allopen` and `kotlin-spring` in the same project.

Note that if you use the project template generated by the [start.spring.io](http://start.spring.io/#!language=kotlin) service, the `kotlin-spring` plugin will be enabled by default.

### Using in CLI

All-open compiler plugin JAR is available in the binary distribution of the Kotlin compiler. You can attach the plugin by providing the path to its JAR file using the `Xplugin` kotlinc option:

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

You can specify all-open annotations directly, using the `annotation` plugin option, or enable the "preset". The only preset available now for all-open is `spring`.

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

## No-arg compiler plugin

The *no-arg* compiler plugin generates an additional zero-argument constructor for classes with a specific annotation. 

The generated constructor is synthetic so it can’t be directly called from Java or Kotlin, but it can be called using reflection.

This allows the Java Persistence API (JPA) to instantiate the `data` class although it doesn't have the zero-parameter constructor from Kotlin or Java point of view (see the description of `kotlin-jpa` plugin [below](compiler-plugins.html#jpa-support)).

### Using in Gradle

The usage is pretty similar to all-open.

Add the plugin and specify the list of annotations that must lead to generating a no-arg constructor for the annotated classes.
 
```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-noarg"
```

Or using the Gradle plugins DSL:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.noarg" version "{{ site.data.releases.latest.version }}"
}
```

Then specify the list of no-arg annotations:

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

Enable `invokeInitializers` option if you want the plugin to run the initialization logic from the synthetic constructor. Starting from Kotlin 1.1.3-2, it is disabled by default because of [`KT-18667`](https://youtrack.jetbrains.com/issue/KT-18667) and [`KT-18668`](https://youtrack.jetbrains.com/issue/KT-18668) which will be addressed in the future.

```groovy
noArg {
    invokeInitializers = true
}
```

### Using in Maven

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "jpa" for JPA support -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- Call instance initializers in the synthetic constructor -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
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

### JPA support

As with the *kotlin-spring* plugin, *kotlin-jpa* is a wrapped on top of *no-arg*. The plugin specifies 
[`@Entity`](http://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html), [`@Embeddable`](http://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) and [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html) 
*no-arg* annotations automatically.

That's how you add the plugin in Gradle: 

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-jpa"
```

Or using the Gradle plugins DSL:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.jpa" version "{{ site.data.releases.latest.version }}"
}
```

In Maven, enable the `jpa` plugin:

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

### Using in CLI

As with all-open, add the plugin JAR file to the compiler plugin classpath and specify annotations or presets:

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```
