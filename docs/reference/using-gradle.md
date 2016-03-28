---
type: doc
layout: reference
title: "Using Gradle"
---

# Using Gradle

In order to build Kotlin with Gradle you should [set up the *kotlin-gradle* plugin](#plugin-and-versions), [apply it](#targeting-the-jvm) to your project and [add *kotlin-stdlib* dependencies](#configuring-dependencies). Those actions may also be performed automatically in IntelliJ IDEA by invoking the Tools | Kotlin | Configure Kotlin in Project action.

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

The correspondence between Kotlin releases and versions is displayed below:

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

This lets Android Studio know that the kotlin directory is a source root, so when the project model is loaded into the IDE it will be properly recognized.



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
```


## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.html).

## Examples

The [Kotlin Repository](https://github.com/jetbrains/kotlin) contains examples:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin/src/test/resources/testProject/kotlin2JsProject)
