[//]: # (title: Get started with Kotlin scripting – tutorial)

> Kotlin scripting in [Experimental](components-stability.md). It may be dropped or changed at any time.
> Opt-in is required (see details below). Use it only for evaluation purposes. We appreciate your feedback on it in [YouTrack](https://kotl.in/issue).
>
{type="warning"}

_Kotlin scripting_ is a technology that enables executing Kotlin code as scripts, without prior compilation or
packaging into executables.

For an overview of Kotlin scripting with examples, see the talk [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) 
by Rodrigo Oliveira from KotlinConf'19 .

In this tutorial, you'll create a Kotlin scripting project that executes arbitrary Kotlin code with maven dependencies.
You'll be able to execute scripts like the following:

```kotlin
@file:DependsOn("junit:junit:4.11")
org.junit.Assert.assertTrue(true)
```

The specified maven dependency will be downloaded during execution and used for the rest of the script.

## Project structure

A minimal Kotlin scripting project contains two parts:
* _Script definition_ - a set of parameters and configurations that define the script type. It includes the file extension
and location, compilation parameters, and so on.
* _Scripting host_ - an application or component that handles script execution.

So, you'll need a Kotlin/JVM Gradle project with two modules.

## Create a root project

Create a Kotlin/JVM Gradle project. TODO: link to tutorial

## Create a script definition

1. Go to ***File | New | Module** and add a new **Gradle** module with **Kotlin/JVM**. Select the **Kotlin DSL build script**
checkbox if you want to write the build script in Kotlin.

2. Open the `build.gradle(.kts)` file and add the following dependencies to the Gradle configuration. These dependencies
provide the APIs you will need for the script definition:

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   dependencies {
       // Other dependencies.
       implementation("org.jetbrains.kotlin:kotlin-scripting-common:$kotlinVersion")
       implementation("org.jetbrains.kotlin:kotlin-scripting-jvm:$kotlinVersion")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies:$kotlinVersion")
       implementation("org.jetbrains.kotlin:kotlin-scripting-dependencies-maven:$kotlinVersion")
   }
   ```

    </tab>
    <tab title="Groovy" group-key="groovy">

   ```groovy
   dependencies {
       // Other dependencies.
       implementation 'org.jetbrains.kotlin:kotlin-scripting-common'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-jvm'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies'
       implementation 'org.jetbrains.kotlin:kotlin-scripting-dependencies-maven'
   }
   ```

   </tab>
   </tabs>

3. Create a Kotlin source file in a package of your choice, for example, `scriptDef.kt` in the `org.example.kotlinscript`
package.


## Create a scripting host

## Run scripts

## What's next?

* [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
* [Kotlin scripting examples](https://github.com/Kotlin/kotlin-script-examples)
* [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) - KotlinConf'19 talk by Rodrigo Oliveira