---
type: doc
layout: reference
title: "Compiler Plugins"
---

# Compiler Plugins

## All-open compiler plugin

Kotlin has classes and their members `final` by default, which makes it inconvenient to use frameworks and libraries such as Spring AOP or Mockito that require classes to be `open`. 
The `all-open` compiler plugin fixes this problem and makes classes annotated with a specific annotation and their members open without the explicit `open` keyword.
For instance, when you use Spring, you don't need all the classes to be open, but only classes annotated with specific annotations like
`@Configuration` or `@Service`.
The `all-open` plugin allows to specify these annotations.

We provide all-open plugin support both for Gradle and Maven, as well as the IDE integration.
For Spring you can use the `kotlin-spring` compiler plugin ([see below](compiler-plugins.html#the-kotlin-spring-compiler-plugin)).

### How to use all-open plugin

You add the plugin in `build.gradle` and specify the annotations that will make the class open: 

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-allopen"

allOpen {
    annotation("com.my.Annotation")
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

`MyFrameworkAnnotation` is also the annotation that makes the class open, because it's annotated with `com.my.Annotation`. 

Here's how to use all-open with Maven:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "kotlin-spring" for the Spring support -->
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


### The `kotlin-spring` compiler plugin
 
You don't need to specify Spring annotations by hand, the `kotlin-spring` plugin already has all the required annotations for the Spring framework:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-spring"
```

The maven example is similar to the one above.

The plugin specifies the following annotations: 
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html), 
[`@Async`](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html), 
[`@Transactional`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), 
[`@Cacheable`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html).
Thanks to meta-annotations support classes annotated with `@Configuration`, `@Controller`, `@RestController`, `@Service` or `@Repository` are automatically opened since these annotations are meta-annotated with `@Component`.
 
Of course, you can use both `kotlin-allopen` and `kotlin-spring` in the same project.
Note that if you use [start.spring.io](http://start.spring.io/#!language=kotlin) the `kotlin-spring` plugin will be enabled by default.


## No-arg compiler plugin

The no-arg compiler plugin generates an additional zero-argument constructor for classes with a specific annotation. 
The generated constructor is synthetic so it can’t be directly called from Java or Kotlin, but it can be called using reflection. 
This allows the Java Persistence API (JPA) to instantiate the `data` class although it doesn't have the no-arg constructor from Kotlin or Java point of view (see the description of `kotlin-jpa` plugin [below]()).
 
### How to use no-arg plugin

The usage is pretty similar to all-open.
You add the plugin and specify the list of annotations that must lead to generating a no-arg constructor for the annotated classes.

How to use no-arg in Gradle:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-noarg"

noArg {
    annotation("com.my.Annotation")
}
```

How to use no-arg in Maven:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- Or "kotlin-jpa" for JPA support -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
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

### The `kotlin-jpa` compiler plugin

The plugin specifies 
[`@Entity`](http://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html) 
and [`@Embeddable`](http://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html) 
annotations as markers that no-arg constructor should be generated for a class.
That's how you add the plugin in gradle: 

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-jpa"
```

The maven example is similar to the one above.