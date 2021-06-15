[//]: # (title: Lombok compiler plugin)

> The Lombok compiler plugin is [Experimental](components-stability.md). 
> It may be dropped or changed at any time. Use it only for evaluation purposes. 
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112).
>
{type="warning"}

Since 1.5.20, Kotlin supports the experimental Lombok Kotlin compiler plugin. This plugin allows the use of
Java's Lombok-generated declarations in mixed Kotlin/Java sources.
If Java's Lombok-generated declarations are in another module than the Kotlin code that uses these declarations, 
then you don't need to use this plugin.

[Lombok](https://projectlombok.org/) does Java code generation itself, not the Lombok Kotlin compiler plugin. 
So, you still need to configure Lombok as usual, when using this plugin. 
Learn more about [how to make the plugin seeing Lombok's config](#defining-the-place-of-lombok-config).

## Support of annotations

Learn which annotations the plugin supports and the
[current state of Lombok Kotlin compiler plugin](https://github.com/JetBrains/kotlin/blob/master/plugins/lombok/lombok-compiler-plugin/README.md).

> Generation of `@Builder` annotation won't be supported in the current prototype. However, you can give your feedback
> about the plugin and vote for [`@Builder` in YouTrack](https://youtrack.jetbrains.com/issue/KT-46959).
>
{type="warning"}

> Kotlin compiler ignores Lombok annotations if you use them in Kotlin code.
>
{type="note"}

Please read below about how to apply the Lombok Kotlin compiler plugin to your Gradle/Maven build.

## Gradle

### Main settings

Apply the `kotlin-plugin-lombok` Gradle plugin:

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.lombok" version "%kotlinVersion%"
}
```

Alternatively, you can use the `apply plugin` syntax:

```groovy
apply plugin: 'kotlin-plugin-lombok'
```

The Lombok itself should be set up as the Java annotation processor (not via kapt) or as the plugin as below:

```groovy
plugins {
    id "io.freefair.lombok" version "5.3.0"
}
```
Learn the [test project with examples of Lombok compiler plugin usage](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt).

### Defining the place of lombok.config

If you use the file `lombok.config` for [configuring Lombok](https://projectlombok.org/features/configuration),
Kotlin Lombok compiler plugin should know where this file situates. Use the following syntax in your `build.gradle` file:

```groovy
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

Learn the [test project with examples of Lombok compiler plugin and `lombok.config` usages](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig).

## Maven

Here's how to use Lombok Kotlin compiler plugin with Maven:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
            <plugin>lombok</plugin>
        </compilerPlugins>
        <pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

Please refer to the [Gradle](#gradle) section for detailed information about the Lombok Kotlin compiler plugin configuration.

Learn the [test project example of Lombok compiler plugin and `lombok.config` usages](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt).

## Using the plugin along with kapt

If you use [kapt](kapt.md) compiler plugin, note that Java's Lombok should be launched via annotation processor of Java's compiler.
By default, kapt assumes that all annotation processors work through it and disables Java's compiler's annotation processors.
To make Lombok working, you need to change this behavior.

If you use the Gradle build system, add the additional flag to the `build.gradle` file to make Java's compiler's annotations
processors working:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

If you use Maven, use the following settings to make Lombok launched by Java's compiler:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>    
```

> The Lombok compiler plugin works successfully along with [kapt](kapt.md) if annotations processors don't depend
> on the code generated by Lombok.
>
{type="note"}

Learn the test project examples of kapt and Lombok compiler plugins usages:
* Using [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt).
* Using [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

