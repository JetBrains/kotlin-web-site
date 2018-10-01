---
type: doc
layout: reference
category: "Other"
title: "Multiplatform Projects"
---

# Multiplatform Projects

> Multiplatform projects are an experimental feature in Kotlin 1.2 and 1.3. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

A Kotlin multiplatform project allows you to compile your codebases to multiple target
platforms. This allows for code reuse between all of the Kotlin target platforms: the JVM, JS, and Native.

## Basic Concepts

Multiplatform projects are not just about compiling all the code for all target platforms, instead a project may 
contain platform-specific code, such as GUI logic, along with the common part shared between the platforms. 

To define the API for platform-specific logic and provide the implementations for certain target platforms, you can use 
[`expect` and `actual` declarations](platform-specific-declarations.html).

* an `expect` declaration does not require an implementation and is placed in the common code, communicating that
 its platform-specific implementations are *expected*; it can then be used in other `expect` declarations and the 
 common code;
  
* an `actual` declaration specifies a platform-specific implementation of a certain `expect` declaration for one or more
  of the target platforms; each `expect` declaration must have an actual counterpart on all of the target platforms.
  
Kotlin multiplatform projects support flexible code reuse between the target platforms by grouping the sources within 
source sets and directing them to certain targets. There is a set of building blocks that are used to define the 
structure of a multiplatform project:

* a *target* is a part of a multiplatform project that can be though of as a complete piece of software built for 
  a certain *target platform* like JVM 6, Android, NodeJS, Browser, iOS, Linux x64.
  
  * building a target, depending on its target platform, involves one or more Kotlin *compilations* from different 
    sources, for example, assembling the production sources first and then the tests;
    
* a *source set* is a collection of Kotlin sources, along with their dependencies, that takes part in one or more of 
  the target compilations
  
Using these terms, you can configure a Kotlin multiplatform project and build it for any and all of the supported
target platforms, as described below.

## Setting up a Multiplatform Project

As of Kotlin 1.3, multiplatform projects are built with Gradle 4.7 and above; other build systems and older Gradle 
versions are not supported.

You can create a new multiplatform project in the IDE by selecting one of the multiplatform project templates in the 
New Project dialog under the "Kotlin" section. 

For example, if you choose "Kotlin (Multiplatform Library)", a library project is created that has three targets, one 
for the JVM, one for JS, and one for the Native platform that you are using. These are configured in the `build.gradle`
script in the following way:

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
    targets {
        fromPreset(presets.jvm, 'jvm')
        fromPreset(presets.js, 'js')
        fromPreset(presets.mingwX64, 'mingw')
    }
    
    sourceSets { /* ... */ }
}
```
</div>

The three targets are created from the presets that provide some [default configuration](building-mpp-with-gradle.html#default-project-layout). 
There are presets for each of the [supported platforms](building-mpp-with-gradle.html#supported-platforms).

The source sets and their dependencies are configured as follows:

```groovy
/* ... */

kotlin {
    targets { /* ... */ }

    sourceSets { 
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-common'
            }
        }
        commonTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test-common'
                implementation 'org.jetbrains.kotlin:kotlin-test-annotations-common'
            }
        }
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-jdk8'
            }
        }
        jvmTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test'
                implementation 'org.jetbrains.kotlin:kotlin-test-junit'
            }
        }
        jsMain {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-stdlib-js'
            }
        }
        jsTest {
            dependencies {
                implementation 'org.jetbrains.kotlin:kotlin-test-js'
            }
        }
        mingwMain { }
        mingwTest { }
    }
}
```
</div>

These are the default source set names for the production and test sources for the targets configured above. The source 
sets `commonMain` and `commonTest` are included into production and test compilations, respectively, of all targets. 
Note that the dependencies for common source sets `commonMain` and `commonTest` are the common artifacts, and the 
platform libraries go to the source sets of the specific targets. Go to [Adding Dependencies](building-mpp-with-gradle.html#adding-dependencies) 
for details on dependencies configuration.

General information on configuring a Kotlin multiplatform project Gradle build can be found in [Building Multiplatform Projects with Gradle](building-mpp-with-gradle.html).

## Multiplatform tests

It is possible to write tests in a common project so that they will be compiled and run on each target platform. See [Running Tests](building-mpp-with-gradle.html#running-tests)