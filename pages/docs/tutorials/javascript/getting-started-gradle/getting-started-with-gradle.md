---
type: tutorial
layout: tutorial
title:  "Getting Started with Kotlin and JavaScript with Gradle"
description: "A look at how to use Gradle to target JavaScript."
authors: Hadi Hariri 
date: 2016-11-04
showAuthorInfo: false
---

In this tutorial we'll see how to

* Create an application targeting JavaScript with Gradle
* [Configure compiler options](#configuring-compiler-options)

In order to use Gradle to target JavaScript, we need to use the `kotlin2js` plugin as opposed to the `kotlin` plugin.

Our `build.gradle` file should look like the following

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
group 'org.example'
version '1.0-SNAPSHOT'

buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin2js'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib-js:$kotlin_version"
}

```
</div>

To use an EAP build instead, we need to specify its version in `ext.kotlin_version` and 
add the corresponding repository to the `buildscript` section (usually EAP builds are located on [Bintray](https://bintray.com/kotlin))

On compiling, Gradle will produce the output of our application, which is by default placed under the `build/classes/main` directory. This can be overridden using [the compiler options](#configuring-compiler-options).

In order to assemble an application, we also need to include the Kotlin standard library, i.e. `kotlin.js`, which was included as a dependency, and the other libraries if any. 

By default, Gradle does not expand the JARs in the build process, so we need to add an additional step in our build to do so:

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
task assembleWeb(type: Sync) {
    configurations.compile.each { File file ->
        from(zipTree(file.absolutePath), {
            includeEmptyDirs = false
            include { fileTreeElement ->
                def path = fileTreeElement.path
                path.endsWith(".js") && (path.startsWith("META-INF/resources/") || 
                    !path.startsWith("META-INF/"))
            }
        })
    }
    from compileKotlin2Js.destinationDir
    into "${projectDir}/web"

    dependsOn classes
}

assemble.dependsOn assembleWeb
```
</div>

This task copies both dependencies runtime files and the compilation output to the `web` directory.

For more information on the output generated and the instructions for running the application, please see [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)

## Configuring Compiler Options

Similar to when we're using [IntelliJ IDEA build system](../getting-started-idea/getting-started-with-intellij-idea.html) or the command line, we can have the compiler output JavaScript to comply with a specific module system such as AMD, CommonJS or UMD. 

In order to specify the module kind, we can add a configuration to our plugin as below

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
compileKotlin2Js {
    kotlinOptions.outputFile = "${projectDir}/web/output.js"
    kotlinOptions.moduleKind = "amd"
    kotlinOptions.sourceMap = true
}
```
</div>

where `moduleKind` can be

* plain (default)
* amd
* commonjs
* umd

For more information about the different types of module outputs, please see [Working with Modules](../working-with-modules/working-with-modules.html)

We can also see how we can define whether we want the compiler to generate sourcemaps for us by indicating this via the `sourceMap` option. 
