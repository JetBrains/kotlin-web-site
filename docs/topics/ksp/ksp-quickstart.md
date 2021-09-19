[//]: # (title: KSP quickstart)

Get a [sample processor](https://github.com/google/ksp/releases/download/%kspSupportedKotlinVersion%-%kspVersion%/playground.zip) to check out.

## Create a processor of your own

1. Create an empty gradle project.
2. Specify version `%kspSupportedKotlinVersion%` of the Kotlin plugin in the root project for use in other project modules:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kspSupportedKotlinVersion%" apply false
}

buildscript { 
    dependencies { 
        classpath(kotlin("gradle-plugin", version = "%kspSupportedKotlinVersion%"))
    }
}
 ```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kspSupportedKotlinVersion%' apply false
}

buildscript {
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kspSupportedKotlinVersion%'
    }
}
```

</tab>
</tabs>

3. Add a module for hosting the processor.

4. In the module's build script, apply Kotlin plugin and add the KSP API to the `dependencies` block.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%'
}
```

</tab>
</tabs>

5. You'll need to implement [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 
   and [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt).
   Your implementation of `SymbolProcessorProvider` will be loaded as a service to instantiate the `SymbolProcessor` you implement.
   Note the following:
   * Implement [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)
     to create a `SymbolProcessor`. Pass dependencies that your processor needs (such as `CodeGenerator`, processor options) 
     through the parameters of `SymbolProcessorProvider.create()`.
   * Your main logic should be in the [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) method.
   * Use `resolver.getSymbolsWithAnnotation()` to get the symbols you want to process, given the fully-qualified name of 
     an annotation.
   * A common use case for KSP is to implement a customized visitor (interface `com.google.devtools.ksp.symbol.KSVisitor`) 
     for operating on symbols. A simple template visitor is `com.google.devtools.ksp.symbol.KSDefaultVisitor`.
   * For sample implementations of the `SymbolProcessorProvider` and `SymbolProcessor` interfaces, see the following files
     in the sample project.
     * `src/main/kotlin/BuilderProcessor.kt`
     * `src/main/kotlin/TestProcessor.kt`
   * After writing your own processor, register your processor provider to the package by including its fully-qualified 
     name in `resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`.

## Use your own processor in a project

### Setup

1. Create another module that contains a workload where you want to try out your processor.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
pluginManagement { 
    repositories { 
        gradlePluginPortal()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}
 ```

</tab>
</tabs>

2. In the module's build script, apply the `com.google.devtools.ksp` plugin with the specified version and 
   add your processor to the list of dependencies.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</tab>
</tabs>

3. Run `./gradlew build`. You can find the generated code under
  `build/generated/source/ksp`.

Here's a sample build script to apply the KSP plugin to a workload: 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
    kotlin("jvm") 
}

version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</tab>
</tabs>

## Pass Options to Processors

Processor options in `SymbolProcessorEnvironment.options` are specified in gradle build scripts:

```properties
ksp {
  arg("option1", "value1")
  arg("option2", "value2")
  ...
}
```

## Make IDE aware of generated code

By default, IntelliJ IDEA or other IDEs don't know about the generated code. So they will mark references to generated 
symbols unresolvable. To make, for example, IntelliJ IDEA be able to reason about the generated symbols, mark the 
following paths as generated source roots:

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

If your IDE supports resource directories, also mark the following one:

```text
build/generated/ksp/main/resources/
```

It may also be necessary to configure these directories in your KSP consumer module's build script:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
    sourceSets.test {
        kotlin.srcDir("build/generated/ksp/test/kotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</tab>
</tabs>