---
type: doc
layout: reference
title: "Using kapt"
---

# Using Kotlin annotation processing tool

The Kotlin plugin supports annotation processors like _Dagger_ or _DBFlow_. 
In order for them to work with Kotlin classes, apply the `kotlin-kapt` plugin.

## Gradle configuration

``` groovy
apply plugin: 'kotlin-kapt'
```

Or, starting with Kotlin 1.1.1, you can apply it using the plugins DSL:

``` groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "<version to use>"
}
```

Then add the respective dependencies using the `kapt` configuration in your `dependencies` block:

``` groovy
dependencies {
    kapt 'groupId:artifactId:version'
}
```

If you previously used the [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, remove it from your `build.gradle` file and replace usages of the `apt` configuration with `kapt`. If your project contains Java classes, `kapt` will also take care of them.

If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named `kaptAndroidTest` and `kaptTest`. Note that `kaptAndroidTest` and `kaptTest` extends `kapt`, so you can just provide the `kapt` dependency and it will be available both for production sources and tests.

Some annotation processors (such as `AutoFactory`) rely on precise types in declaration signatures. By default, Kapt replaces every unknown type (including types for the generated classes) to `NonExistentClass`, but you can change this behavior. Add the additional flag to the `build.gradle` file to enable error type inferring in stubs:

``` groovy
kapt {
    correctErrorTypes = true
}
```

Note that this option is experimental and it is disabled by default.


## Maven configuration (since Kotlin 1.1.2)

Add an execution of the `kapt` goal from kotlin-maven-plugin before `compile`: 

```xml
<execution>
    <id>kapt</id>
    <goals>
        <goal>kapt</goal>
    </goals>
    <configuration>
        <sourceDirs>
            <sourceDir>src/main/kotlin</sourceDir>
            <sourceDir>src/main/java</sourceDir>
        </sourceDirs>
        <annotationProcessorPaths>
            <!-- Specify your annotation processors here. -->
            <annotationProcessorPath>
                <groupId>com.google.dagger</groupId>
                <artifactId>dagger-compiler</artifactId>
                <version>2.9</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</execution>
```
 
You can find a complete sample project showing the use of Kotlin, Maven and Dagger in the
[Kotlin examples repository](https://github.com/JetBrains/kotlin-examples/tree/master/maven/dagger-maven-example).
 
Please note that kapt is still not supported for IntelliJ IDEA’s own build system. Launch the build from the “Maven Projects” toolbar whenever you want to re-run the annotation processing.