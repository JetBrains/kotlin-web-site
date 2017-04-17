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

```groovy
group 'org.example'
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

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib-js:$kotlin_version"
}

```

where `${kotlinVersion}` is the version of Kotlin we want to use, for example `1.1.0`. It's important to note that
if we're using an EAP build, we need to have the corresponding repository referenced in the `buildscript` section (usually EAP builds are located on [Bintray](https://bintray.com/kotlin))

On compiling, Gradle will produce the output of our application, which is by default placed under the `build/classes/main` directory. This can be overridden using [the compiler options](#configuring-compiler-options).

In order to use this, we also need to include the Kotlin standard library in our application, i.e. `kotlin.js`, which was included as a dependency. By default,
Gradle does not expand the JAR as part of the build process, so we would need to add an additional step in our build to do so.

```groovy
build.doLast {
    configurations.compile.each { File file ->
        copy {
            includeEmptyDirs = false

            from zipTree(file.absolutePath)
            into "${projectDir}/web"
            include { fileTreeElement ->
                def path = fileTreeElement.path
                path.endsWith(".js") && (path.startsWith("META-INF/resources/") || !path.startsWith("META-INF/"))
            }
        }
    }
}
```

For more information on the output generated please see [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)

## Configuring Compiler Options

Similar to when we're using [IntelliJ IDEA build system](../getting-started-idea/getting-started-with-intellij-idea.html) or the command line, we can have the compiler output JavaScript to comply with a specific module system such as AMD, CommonJS or UMD. 

In order to specify the module kind, we can add a configuration to our plugin as below

```groovy
compileKotlin2Js {
    kotlinOptions.outputFile = "${projectDir}/web/output.js"
    kotlinOptions.moduleKind = "amd"
    kotlinOptions.sourceMap = true
}
```

where `moduleKind` can be

* plain (default)
* amd
* commonjs
* umd

For more information about the different types of module outputs, please see [Working with Modules](../working-with-modules/working-with-modules.html)

We can also see how we can define whether we want the compiler to generate sourcemaps for us by indicating this via the `sourceMap` option. 
