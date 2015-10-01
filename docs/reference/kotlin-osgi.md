# Kotlin OSGi

To enable kotlin OSGi support you need to include `kotlin-osgi-bundle` instead of regular kotlin libraries. It is  recommended to eliminate `kotlin-runtime`, `kotlin-stdlib` and `kotlin-reflect` dependencies as `kotlin-osgi-bundle` already contains all of them. You also should make attention in case when external kotlin libraries are included. As far as regular kotlin dependencies are not OSGi-ready you shouldn't use them and should eliminate.

## Maven

To include kotlin OSGi bundle to a Maven project:

```xml
   <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-osgi-bundle</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
```

to exclude stdlib from external libraries (notice that "star exclusion" works in Maven 3 only)

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

To include `kotlin-osgi-bundle` to a gradle project:

```groovy
compile "org.jetbrains.kotlin:kotlin-osgi-bundle:$kotlinVersion"
```

To exclude default kotlin libraries that comes as transitive dependencies you can use the following approach

```groovy
dependencies {
 compile (
   [group: 'some.group.id', name: 'some.library', version: 'someversion'],
   .....) {
  exclude group: 'org.jetbrains.kotlin'
}
```
## FAQ

#### Why not just add required manifest options to all kotlin libraries

In spite of it is the most preferred way to provide OSGi support unfortunately it couldn't be done for now due to so called ["package split" issue](http://wiki.osgi.org/wiki/Split_Packages) that could't be easily eliminated and such a big change is not planned for now. There is `Require-Bundle` feature but it is not the best option too and not recommended to use. So it is decided to make a separate artifact for OSGi



