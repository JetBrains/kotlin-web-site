---
layout: default
title: Configure your build for EAP
main_nav_id: configure-build-for-eap
---

# Configure your build for EAP

If you create new projects using the EAP version of Kotlin, you don’t need to perform any additional steps. The [Kotlin Plugin](install-eap-plugin.html) will do everything for you!

You only need to configure your build manually for existing projects — projects that were created before installing the EAP version.

To configure your build to use the EAP version of Kotlin, you need to: 

*   Specify the EAP version of Kotlin. Available EAP versions are listed [here](index.html#build-details). 
*   Add the EAP repository to the build – <https://dl.bintray.com/kotlin/kotlin-eap>.
*   Change the versions of dependencies to EAP ones.
The EAP version of Kotlin may not work with the libraries of the previously released version. 

The following procedures describe how to configure your build in Gradle and Maven:

*   [Configure in Gradle](#configure-in-gradle)
*   [Configure in Maven](#configure-in-maven)  

## Configure in Gradle 

This section describes how you can:

*   [Adjust the Kotlin version and add the EAP repository](#adjust-the-kotlin-version-and-add-the-eap-repository)
*   [Adjust versions in dependencies](#adjust-versions-in-dependencies)


### Adjust the Kotlin version and add the EAP repository 

Depending on your configuration approach, you need to perform different steps in your build files. 
This section describes common options, but if you use a different approach, you can refer to [Gradle documentation](https://docs.gradle.org/) for assistance.

This section covers:

*   [Option 1. Configure in the build and settings files](#option-1-configure-in-the-build-and-settings-files)
*   [Option 2. Configure in the build file only](#option-2-configure-in-the-build-file-only)

#### Option 1. Configure in the build and settings files 

1. In the `plugins` block within `build.gradle` (`build.gradle.kts`), change the `KOTLIN-EAP-VERSION` to the actual EAP version, such as `{{ site.data.releases.eap.version }}`. Available EAP versions are listed [here](index.html#build-details).<br>
Alternatively, you can specify the EAP version in the `pluginManagement` block in `settings.gradle` (`settings.gradle.kts`) – see [Gradle documentation](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management) for details.
2. In the `repositories` block, specify the EAP repository – <https://dl.bintray.com/kotlin/kotlin-eap> – for dependencies.

Here is an example for the Multiplatform project.


<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
   id 'java' 
   id 'org.jetbrains.kotlin.multiplatform' version 'KOTLIN-EAP-VERSION'
}

repositories {
   mavenCentral()
   maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }
   maven { url 'https://kotlin.bintray.com/kotlinx' }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
   java
   kotlin("multiplatform") version "KOTLIN-EAP-VERSION"
}
repositories {
   mavenCentral()
   maven ("https://dl.bintray.com/kotlin/kotlin-eap")
   maven ("https://kotlin.bintray.com/kotlinx")
}
```

</div>
</div>

* In the `pluginManagement` block within `settings.gradle` (`settings.gradle.kts`), specify the EAP repository – <https://dl.bintray.com/kotlin/kotlin-eap>.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
pluginManagement {
   repositories {
       mavenCentral()
       gradlePluginPortal()
       maven { url 'https://dl.bintray.com/kotlin/kotlin-eap' }
   }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
pluginManagement { 
   repositories { 
       mavenCentral() 
       gradlePluginPortal() 
       maven ("https://dl.bintray.com/kotlin/kotlin-eap") 
         }
}
```

</div>
</div> 

#### Option 2. Configure in the build file only 

1. In `build.gradle` (`build.gradle.kts`), change the `KOTLIN-EAP-VERSION` in the `buildscript` block to the actual EAP version, such as `{{ site.data.releases.eap.version }}`.  
Available EAP versions are listed [here](index.html#build-details).
2. Add the EAP repository – <https://dl.bintray.com/kotlin/kotlin-eap> – to the `buildscript` block.
3. In the `repositories` block, specify the EAP repository for dependencies. 

<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
buildscript {
    repositories {
        mavenCentral()
        gradlePluginPortal()
       maven { url "https://dl.bintray.com/kotlin/kotlin-eap" }
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:KOTLIN-EAP-VERSION"
    }
}

apply plugin: "kotlin"

repositories {
    maven { url "https://dl.bintray.com/kotlin/kotlin-eap" }
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib"
}
```

</div>

### Adjust versions in dependencies

If you use kotlinx libraries in your project, your versions of the libraries may not be compatible with the EAP version of Kotlin.

To resolve this issue, you need to specify the version of a compatible library in dependencies. For a list of compatible libraries, 
see [EAP build details](index.html#build-details). 

> In most cases we create libraries only for the first EAP version of a specific release and these libraries work with the subsequent EAP versions for this release.
> 
> If there are incompatible changes in next EAP versions, we release a new version of the library.  
{:.note}

Here is an example.

For the **kotlinx.coroutines** library, add the version number – `{{ site.data.releases.eap.coroutines }}` – that is compatible with `{{ site.data.releases.eap.version }}`. 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
dependencies {
   implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.eap.coroutines }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
dependencies {
   implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.eap.coroutines }}")
}
```

</div>
</div>

## Configure in Maven

In the sample Maven project definition, replace `KOTLIN-EAP-VERSION` with the actual version, such as `{{ site.data.releases.eap.version }}`. 
Available EAP versions are listed [here](index.html#build-details).

<div class="sample" markdown="1" theme="idea" mode='xml'>

```xml
<project ...>
    <properties>
        <kotlin.version>KOTLIN-EAP-VERSION</kotlin.version>
    </properties>

    <repositories>
        <repository>
            <id>bintray.kotlin.eap</id>
            <name>Bintray Kotlin EAP Repository</name>
            <url>https://dl.bintray.com/kotlin/kotlin-eap</url>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
            <id>bintray.kotlin.eap</id>
            <name>Bintray Kotlin EAP Repository</name>
            <url>https://dl.bintray.com/kotlin/kotlin-eap</url>
        </pluginRepository>
    </pluginRepositories>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-stdlib</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.jetbrains.kotlin</groupId>
                <artifactId>kotlin-maven-plugin</artifactId>
                <version>${kotlin.version}</version>
                ...
            </plugin>
        </plugins>
    </build>
</project>
```

</div>