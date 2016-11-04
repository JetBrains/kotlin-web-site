---
type: tutorial
layout: tutorial
title:  "Getting Started with Kotlin and JavaScript with Gradle"
description: "A look at how to use Gradle to target JavaScript."
authors: Hadi Hariri 
date: 04/11/2016
showAuthorInfo: false
---

In this tutorial we'll see how to

* [Create an application targeting JavaScript with Gradle](#Creatinganapplicationtargetingjavascript)
* [Configure compiler options](#configuringcompileroptions)

In order to use Gradle to target JavaScript, we need to use the `kotlin2JS` plugin as opposed to the `kotlin` plugin. 

Our `build.gradle` file should look like the following

```groovy
group 'org.jetbrains'
version '1.0-SNAPSHOT'

buildscript {
    ext.kotlin_version = '${kotlinVersion}'
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin2js'

compileKotlin2Js {
    kotlinOptions.outputFile = "output.js"
}

sourceSets {
    main.kotlin.srcDirs += "src/main/kotlin"
}

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-js-library:$kotlin_version"
}

```

where `${kotlinVersion}` is the version of [Kotlin we want to use](https://kotlinlang.org/docs/reference/using-gradle.html#plugin-and-versions). It's important to note that
if we're using an EAP build, we need to have the corresponding repository referenced in the `buildscript` section (usually EAP builds are located on [Bintray](https://bintray.com/kotlin))

The compiler option is defined under `compileKotlin2JS` and in particular `kotlinOptions.outputFile` is required to indicate the output of our compiled application. We can also use these options to [define module kinds](#configuringcompileroptions).

On compiling, Gradle will produce the following output

==================================== FIX FIX FIX 
![Gradle Output]({{ url_for('tutorial_img', filename='javascript/getting-started-maven/maven-output.png')}})

===> where we can see the Kotlin standard library (under the folder `koltinjs-maven`) and the output of our application, which is the `kotlinjs-maven.js` file. For more information on the output generated please see [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)

==================================== FIX FIX FIX
For more information on the output generated please see [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)

## Configuring Compiler Options

Similar to when we're using [IntelliJ IDEA build system](../getting-started-idea/getting-started-with-intellij-idea.md) or the command line, we can have the compiler output JavaScript to comply with a specific module system such as AMD, CommonJS or UMD. 

In order to specify the module kind, we can add a configuration to our plugin as below

```groovy
compileKotlin2Js {
    kotlinOptions.outputFile = "output.js"
    kotlinOptions.moduleKind = "amd"
    kotlinOptions.sourceMap = true
}
 ```

where `moduleKind` can be

* plain (default)
* amd
* commonjs
* umd

For more information about the different types of module outputs, please see [Working with Modules](../working-with-modules/working-with-modules.md)

We can also see how we can define whether we want the compiler to generate sourcemaps for us by indicating this via the `sourceMap` option. 


