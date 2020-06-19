---
type: tutorial
layout: tutorial
title:  "Setting up a Kotlin/JS project"
description: "How to set up a Gradle project targeting JavaScript using the JS or multiplatform plugins."
authors: Sebastian Aigner
date: 2020-02-23
showAuthorInfo: false
---

There are two major ways how we can set up a Kotlin/JS project: we can use the [Kotlin/JS Gradle plugin](#setting-up-for-javascript-gradle), or use the [Kotlin Multiplatform Gradle plugin](#setting-up-using-the-kotlin-multiplatform-plugin).

## Setting up for JavaScript (Gradle)

The most straightforward way to get started with Kotlin/JS is via the Kotlin/JS Gradle plugin. If you're using IntelliJ IDEA, the setup for such a project can be done via wizard.

Through the __New Project__ wizard, we can select the platform we want to target. For this example, we're selecting __Kotlin/JS for browser__,
 which allows us to use browser-specific APIs in our project. If we're targeting Node.js, we can select the __Kotlin/JS for Node.js__ option instead.

Make sure that the __Kotlin DSL build script__ option is selected to use the Gradle Kotlin DSL as well:

![New JavaScript project wizard]({{ url_for('tutorial_img', filename='javascript/setting-up/new-project.png')}})

After selecting a project name, such as `jsTutorial`, IntelliJ IDEA will automatically start creating the folder structure for your Gradle project. To see and adjust the default build configuration, we can open the `build.gradle.kts` in the root of our application:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
plugins {
    id("org.jetbrains.kotlin.js") version "1.3.70"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-js"))
}

kotlin.target.browser { }
```
</div>

As we can see, the `kotlin.js` Gradle plugin is used to provide JavaScript support for our project. The plugin also takes care of managing a development environment for us – under the hood, it manages its own `yarn` and `webpack` installation, and exposes their functionality through the Gradle DSL.

The `kotlin.target.browser` part at the bottom of the file can be used for target-specific configurations. This part becomes relevant when adjusting the behavior of the JS plugin, for example to configure the available test runners for the platform.

To learn about how to run your program, both in the browser and on the Node.js target, check out [Running Kotlin/JS](running-kotlin-js.html).

## Setting up using the Kotlin Multiplatform plugin

When targeting other platforms alongside JavaScript, the Multiplatform plugin can be used instead of the JS plugin. An empty template for such a project can be created through the wizard in IntelliJ IDEA:

![Multiplatform project wizard]({{ url_for('tutorial_img', filename='javascript/setting-up/multiplatform-project.png')}})

After creating a multiplatform plugin with the wizard, any kind of platform-specific configuration is omitted at first. To add the JavaScript target, we adjust our automatically generated `build.gradle.kts` file to look analogous to this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
plugins {
    kotlin("multiplatform") version "1.3.70"
}

group = "org.example"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    js {
        browser { }
    }

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(kotlin("stdlib-common"))
            }
        }
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test-common"))
                implementation(kotlin("test-annotations-common"))
            }
        }

        val jsMain by getting {
            dependencies {
                implementation(kotlin("stdlib-js"))
            }
        }

        val jsTest by getting {
            dependencies {
                implementation(kotlin("test-js"))
            }
        }
    }
}
```
</div>
