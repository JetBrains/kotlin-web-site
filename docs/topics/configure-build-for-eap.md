[//]: # (title: Configure your build for EAP)

If you create new projects using the EAP version of Kotlin, you don’t need to perform any additional steps. The [Kotlin Plugin](install-eap-plugin.md) will do everything for you!

You only need to configure your build manually for existing projects — projects that were created before installing the EAP version.

To configure your build to use the EAP version of Kotlin, you need to: 

* Specify the EAP version of Kotlin. [Available EAP versions are listed here](eap.md#build-details).
* Change the versions of dependencies to EAP ones.
The EAP version of Kotlin may not work with the libraries of the previously released version. 

The following procedures describe how to configure your build in Gradle and Maven:

* [Configure in Gradle](#configure-in-gradle)
* [Configure in Maven](#configure-in-maven)  

## Configure in Gradle 

This section describes how you can:

* [Adjust the Kotlin version](#adjust-the-kotlin-version)
* [Adjust versions in dependencies](#adjust-versions-in-dependencies)

### Adjust the Kotlin version

In the `plugins` block within `build.gradle(.kts)`, change the `KOTLIN-EAP-VERSION` to the actual EAP version,
such as `%kotlinEapVersion%`. [Available EAP versions are listed here](eap.md#build-details).

Alternatively, you can specify the EAP version in the `pluginManagement` block in `settings.gradle(.kts)` – see [Gradle documentation](https://docs.gradle.org/current/userguide/plugins.html#sec:plugin_version_management) for details.

Here is an example for the Multiplatform project.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
   java
   kotlin("multiplatform") version "KOTLIN-EAP-VERSION"
}

repositories {
   mavenCentral()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
   id 'java'
   id 'org.jetbrains.kotlin.multiplatform' version 'KOTLIN-EAP-VERSION'
}

repositories {
   mavenCentral()
}
```

</tab>
</tabs>

### Adjust versions in dependencies

If you use kotlinx libraries in your project, your versions of the libraries may not be compatible with the EAP version of Kotlin.

To resolve this issue, you need to specify the version of a compatible library in dependencies. For a list of compatible libraries, 
see [EAP build details](eap.md#build-details). 

> In most cases we create libraries only for the first EAP version of a specific release and these libraries work with the subsequent EAP versions for this release.
> 
> If there are incompatible changes in next EAP versions, we release a new version of the library.
>
{type="note"}

Here is an example.

For the **kotlinx.coroutines** library, add the version number – `%coroutinesEapVersion%` – that is compatible with `%kotlinEapVersion%`. 

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesEapVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesEapVersion%"
}
```

</tab>
</tabs>

## Configure in Maven

In the sample Maven project definition, replace `KOTLIN-EAP-VERSION` with the actual version, such as `%kotlinEapVersion%`.
[Available EAP versions are listed here](eap.md#build-details).

```xml
<project ...>
    <properties>
        <kotlin.version>KOTLIN-EAP-VERSION</kotlin.version>
    </properties>

    <repositories>
        <repository>
           <id>mavenCentral</id>
           <url>https://repo1.maven.org/maven2/</url>
        </repository>
    </repositories>

    <pluginRepositories>
       <pluginRepository>
          <id>mavenCentral</id>
          <url>https://repo1.maven.org/maven2/</url>
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

