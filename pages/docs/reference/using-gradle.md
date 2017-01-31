---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

In order to build Kotlin with Gradle you should [set up the *kotlin-gradle* plugin](#plugin-and-versions), [apply it](#targeting-the-jvm) to your project and [add *kotlin-stdlib* dependencies](#configuring-dependencies). Those actions may also be performed automatically in IntelliJ IDEA by invoking the Tools \| Kotlin \| Configure Kotlin in Project action.

You can also enable [incremental compilation](#incremental-compilation) to make your builds faster. 

## Plugin and Versions

The *kotlin-gradle-plugin* compiles Kotlin sources and modules.

The version of Kotlin to use is usually defined as the *kotlin_version* property:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'

   repositories {
     mavenCentral()
   }

   dependencies {
     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
   }
}
```

## Targeting the JVM

To target the JVM, the Kotlin plugin needs to be applied

``` groovy
apply plugin: "kotlin"
```

Kotlin sources can be mixed with Java sources in the same folder, or in different folders. The default convention is using different folders:

``` groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

The corresponding *sourceSets* property should be updated if not using the default convention

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

## Targeting JavaScript

When targeting JavaScript, a different plugin should be applied:

``` groovy
apply plugin: "kotlin2js"
```

This plugin only works for Kotlin files so it is recommended to keep Kotlin and Java files separate (if it's the case that the same project contains Java files). As with
targeting the JVM, if not using the default convention, we need to specify the source folder using *sourceSets*

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

If you want to create a re-usable library, use `kotlinOptions.metaInfo` to generate additional JS file with binary descriptors.
This file should be distributed together with the result of translation.

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```


## Targeting Android

Android's Gradle model is a little different from ordinary Gradle, so if we want to build an Android project written in Kotlin, we need
*kotlin-android* plugin instead of *kotlin*:

``` groovy
buildscript {
    ...
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

### Android Studio

If using Android Studio, the following needs to be added under android:

``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized. Alternatively, you can put Kotlin classes in the Java source directory, typically located in `src/main/java`.



## Configuring Dependencies

In addition to the kotlin-gradle-plugin dependency shown above, you need to add a dependency on the Kotlin standard library:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
  }
}

apply plugin: "kotlin" // or apply plugin: "kotlin2js" if targeting JavaScript

repositories {
  mavenCentral()
}

dependencies {
  compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
}
```

If your project uses Kotlin reflection or testing facilities, you need to add the corresponding dependencies as well:

``` groovy
compile "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
testCompile "org.jetbrains.kotlin:kotlin-test:$kotlin_version"
testCompile "org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version"
```

## Annotation processing

The Kotlin plugin supports annotation processors like _Dagger_ or _DBFlow_. In order for them to work with Kotlin classes, add the respective dependencies using the `kapt` configuration in your `dependencies` block:

``` groovy
dependencies {
  kapt 'groupId:artifactId:version'
}
```

If you previously used the [android-apt](https://bitbucket.org/hvisser/android-apt) plugin, remove it from your `build.gradle` file and replace usages of the `apt` configuration with `kapt`. If your project contains Java classes, `kapt` will also take care of them. If you use annotation processors for your `androidTest` or `test` sources, the respective `kapt` configurations are named `kaptAndroidTest` and `kaptTest`.

Some annotation processing libraries require you to reference generated classes from within your code. For this to work, you'll need to add an additional flag to enable the _generation of stubs_ to your build file:

``` groovy
kapt {
    generateStubs = true
}
```

Note, that generation of stubs slows down your build somewhat, which is why it's disabled by default. If generated classes are referenced only in a few places in your code, you can alternatively revert to using a helper class written in Java which can be [seamlessly called](java-interop.html) from your Kotlin code.

For more information on `kapt` refer to the [official blogpost](http://blog.jetbrains.com/kotlin/2015/06/better-annotation-processing-supporting-stubs-in-kapt/).

## Incremental compilation

Kotlin 1.0.2 introduced new experimental incremental compilation mode in Gradle. 
Incremental compilation tracks changes of source files between builds so only files affected by these changes would be compiled.

There are several ways to enable it:

  1. add `kotlin.incremental=true` line either to a `gradle.properties` or a `local.properties` file;

  2. add `-Pkotlin.incremental=true` to gradle command line parameters. Note that in this case the parameter should be added to each subsequent build (any build without this parameter invalidates incremental caches).

After incremental compilation is enabled, you should see the following warning message in your build log:
```
Using experimental kotlin incremental compilation
```

Note, that the first build won't be incremental.

## Compiler Options

To specify additional compilation options, use the `kotlinOptions` property of a Kotlin compilation task. Examples:

``` groovy
compileKotlin {
    kotlinOptions.suppressWarnings = true
}

compileKotlin {
    kotlinOptions {
        suppressWarnings = true
    }
}
```


A complete list of options for the Gradle tasks follows:

### Attributes common for 'kotlin' and 'kotlin2js'

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `apiVersion` | Allow to use declarations only from the specified version of bundled libraries | "1.0" | "1.0" |
| `languageVersion` | Provide source compatibility with specified language version | "1.0" | "1.0" |
| `suppressWarnings` | Generate no warnings |  | false |
| `verbose` | Enable verbose logging output |  | false |
| `freeCompilerArgs` | A list of additional compiler arguments |  | [] |

### Attributes specific for 'kotlin'

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `includeRuntime` | Include Kotlin runtime in to resulting .jar |  | false |
| `jdkHome` | Path to JDK home directory to include into classpath, if differs from default JAVA_HOME |  |  |
| `jvmTarget` | Target version of the generated JVM bytecode, only 1.6 is supported | "1.6" | "1.6" |
| `noJdk` | Don't include Java runtime into classpath |  | false |
| `noReflect` | Don't include Kotlin reflection implementation into classpath |  | true |
| `noStdlib` | Don't include Kotlin runtime into classpath |  | true |

### Attributes specific for 'kotlin2js'

| Name | Description | Possible values |Default value |
|------|-------------|-----------------|--------------|
| `kjsm` | Generate kjsm-files (for creating libraries) |  | true |
| `main` | Whether a main function should be called | "call", "noCall" | "call" |
| `metaInfo` | Generate metadata |  | true |
| `moduleKind` | Kind of a module generated by compiler | "plain", "amd", "commonjs", "umd" | "plain" |
| `noStdlib` | Don't use bundled Kotlin stdlib |  | true |
| `outputFile` | Output file path |  |  |
| `sourceMap` | Generate source map |  | false |
| `target` | Generate JS files for specific ECMA version | "v5" | "v5" |


## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.html).

## Examples

The [Kotlin Repository](https://github.com/jetbrains/kotlin) contains examples:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/kotlin2JsProject)
