---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

## Plugin and Versions

The *kotlin-gradle-plugin* compiles Kotlin sources and modules.

Define the version of Kotlin we want to use via *kotlin.version*. The possible values are:

* X.Y-SNAPSHOT: Correspond to snapshot version for X.Y releases, updated with every successful build on the CI server. These versions are not really stable and are
only recommended for testing new compiler features. Currently all builds are published as 0.1-SNAPSHOT. To use a snapshot, we need to [configure a snapshot repository
in the build.gradle file](#using-snapshot-versions).

* X.Y.Z: Correspond to release or milestone versions X.Y.Z, updated manually. These are stable builds. Release versions are published to Maven Central Repository. No extra configuration
is needed in the build.gradle file.

The correspondence between milestones and versions is displayed below:

<table>
<thead>
<tr>
  <th>Milestone</th>
  <th>Version</th>
</tr>
</thead>
<tbody>
{% for entry in site.data.releases.list %}
<tr>
  <td>{{ entry.milestone }}</td>
  <td>{{ entry.version }}</td>
</tr>
{% endfor %}
</tbody>
</table>

## Targeting the JVM

To target the JVM, the Kotlin plugin needs to be applied

``` groovy
apply plugin: "kotlin"
```

As of M11, Kotlin sources can be mixed with Java sources in the same folder, or in different folders. The default convention is using different folders:

``` groovy
project
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

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized.



## Configuring Dependencies

We need to add dependencies on kotlin-gradle-plugin and the Kotlin standard library:

``` groovy
buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:<version>'
  }
}

apply plugin: "kotlin" // or apply plugin: "kotlin2js" if targeting JavaScript

repositories {
  mavenCentral()
}

dependencies {
  compile 'org.jetbrains.kotlin:kotlin-stdlib:<version>'
}
```

## Using Snapshot versions

If we want to use a snapshot version (nightly build), we need to add the snapshot repository and change the version to 0.1-SNAPSHOT:

``` groovy
buildscript {
  repositories {
    mavenCentral()
    maven {
      url 'http://oss.sonatype.org/content/repositories/snapshots'
    }
  }
  dependencies {
    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:0.1-SNAPSHOT'
  }
}

apply plugin: "kotlin" // or apply plugin: "kotlin2js" if targeting JavaScript

repositories {
  mavenCentral()
  maven {
    url 'http://oss.sonatype.org/content/repositories/snapshots'
  }
}

dependencies {
  compile 'org.jetbrains.kotlin:kotlin-stdlib:0.1-SNAPSHOT'
}
```


## Using External Annotations

External annotations for JDK and Android SDK will be configured automatically. If we want to add more annotations for some libraries, we need to add the following line to the Gradle script:

``` groovy

kotlinOptions.annotations = file('<path to annotations>')
```

## Examples

The [Kotlin Repository](https://github.com/jetbrains/kotlin) contains examples:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin/src/test/resources/testProject/kotlin2JsProject)
