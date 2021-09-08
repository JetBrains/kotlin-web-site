[//]: # (title: KSP quickstart)

Get a [sample processor](https://github.com/google/ksp/releases/download/1.5.30-1.0.0-beta09/playground.zip) to check out.

## Create a processor of your own

1. Create an empty gradle project.
2. Specify version `1.5.30` of the Kotlin plugin in the root project for use in other project modules:

  ```kotlin
  plugins {
      kotlin("jvm") version "1.5.30" apply false
  }

  buildscript {
      dependencies {
          classpath(kotlin("gradle-plugin", version = "1.5.30"))
      }
  }
  ```

3. Add a module for hosting the processor.

4. In the module's `build.gradle.kts` file, do the following:
    * Apply Kotlin plugin
    * Add the KSP API to the `dependencies` block.

  ```kotlin
  plugins {
      kotlin("jvm")
  }

  repositories {
      mavenCentral()
  }

  dependencies {
      implementation("com.google.devtools.ksp:symbol-processing-api:1.5.30-1.0.0-beta09")
  }
  ```

5. You'll need to implement [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) and
 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt).
 Your implementation of `SymbolProcessorProvider` will be loaded as a service to instantiate the `SymbolProcessor` you implement.
  Note the following:
  * Implement [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) to create a `SymbolProcessor`. Dependencies your processor needs (e.g. `CodeGenerator`, processor options) are passed through the parameters of `SymbolProcessorProvider.create()`.
  * Your main logic should be in the [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) method.
  * Use `resolver.getSymbolsWithAnnotation()` to get the symbols you want to process, given
    the fully-qualified name of an annotation.
  * A common use case for KSP is to implement a customized visitor (interface
    `com.google.devtools.ksp.symbol.KSVisitor`) for operating on symbols. A simple template
    visitor is `com.google.devtools.ksp.symbol.KSDefaultVisitor`.
  * For sample implementations of the `SymbolProcessorProvider` and `SymbolProcessor` interfaces, see the following files
    in the sample project.
    * `src/main/kotlin/BuilderProcessor.kt`
    * `src/main/kotlin/TestProcessor.kt`
  * After writing your own processor, register your processor provider to the package by including
    its fully-qualified name in
    `resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`.

## Use your own processor in a project

### Setup using Kotlin DSL

1. Create another module that contains a workload where you want to try out your processor.
  
  ```kotlin
  pluginManagement {
      repositories {
         gradlePluginPortal()
      }
  }
  ```

2. In the new module's `build.gradle.kts`, do the following:
    * Apply the `com.google.devtools.ksp` plugin with the specified version.
    * Add `ksp(<your processor>)` to the list of dependencies.
3. Run `./gradlew build`. You can find the generated code under
  `build/generated/source/ksp`.

Here's a sample `build.gradle.kts` to apply the KSP plugin to a workload: 

```kotlin
plugins {
    id("com.google.devtools.ksp") version "1.5.30-1.0.0-beta09"
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

### Setup using Groovy

1. Create another module that contains a workload where you want to try out your processor.

  ```groovy
  pluginManagement {
    repositories {
        gradlePluginPortal()
    }
  }
  ```

2. In your projects `build.gradle` file add a plugins block containing the ksp plugin:

  ```groovy
  plugins {
    id "com.google.devtools.ksp" version "1.5.30-1.0.0-beta09"
  }
  ```
  
3. In the modules `build.gradle`, add the following:

    * Apply the `com.google.devtools.ksp` plugin:

    ```groovy
    apply plugin: 'com.google.devtools.ksp'
    ```

    * Add `ksp <your processor>` to the list of dependencies.

    ```groovy
    dependencies {
        implementation "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
        implementation project(":test-processor")
        ksp project(":test-processor")
    }
    ```

## Pass Options to Processors

Processor options in `SymbolProcessorEnvironment.options` are specified in gradle build scripts:

```properties
  ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
  }
```

## Make IDE Aware Of Generated Code

By default, IntelliJ or other IDEs don't know about the generated code and therefore
references to those generated symbols will be marked unresolvable.
To make, for example, IntelliJ be able to reason about the generated symbols,
the following paths need to be marked as generated source root:

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

and perhaps also resource directory if your IDE supports them:

```text
build/generated/ksp/main/resources/
```

It may also be necessary to configure these directories in your KSP consumer module `build.gradle.kts`:

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
