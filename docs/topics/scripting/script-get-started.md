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

1. 

## Create a script definition

## Create a scripting host

## Run scripts

## What's next?

* [Kotlin scripting KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)
* [Kotlin scripting examples](https://github.com/Kotlin/kotlin-script-examples)
* [Implementing the Gradle Kotlin DSL](https://kotlinconf.com/2019/talks/video/2019/126701/) - KotlinConf'19 talk by Rodrigo Oliveira