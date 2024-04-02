[//]: # (title: Kotlin and OSGi)

To enable Kotlin [OSGi](https://www.osgi.org/) support in your Kotlin project, include `kotlin-osgi-bundle` instead of
the regular Kotlin libraries. It is recommended to remove `kotlin-runtime`, `kotlin-stdlib` and `kotlin-reflect` dependencies
as `kotlin-osgi-bundle` already contains all of them. You also should pay attention in case when external Kotlin libraries
are included. Most regular Kotlin dependencies are not OSGi-ready, so you shouldn't use them and should remove them from
your project.

## Maven

To include the Kotlin OSGi bundle to a Maven project:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

To exclude the standard library from external libraries (notice that "star exclusion" works in Maven 3 only):

```xml
<dependency>
    <groupId>some.group.id</groupId>
    <artifactId>some.library</artifactId>
    <version>some.library.version</version>

    <exclusions>
        <exclusion>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## Gradle

To include `kotlin-osgi-bundle` to a Gradle project:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(kotlin("osgi-bundle"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-osgi-bundle:%kotlinVersion%"
}
```

</tab>
</tabs>

To exclude default Kotlin libraries that comes as transitive dependencies you can use the following approach:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("some.group.id:some.library:someversion") {
        exclude(group = "org.jetbrains.kotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation('some.group.id:some.library:someversion') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```

</tab>
</tabs>

## FAQ

### Why not just add required manifest options to all Kotlin libraries

Even though it is the most preferred way to provide OSGi support, unfortunately it couldn't be done for now due to so called
["package split" issue](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) that couldn't be easily eliminated and such a big change is
not planned for now. There is `Require-Bundle` feature but it is not the best option too and not recommended to use.
So it was decided to make a separate artifact for OSGi.

