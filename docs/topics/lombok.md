[//]: # (title: Lombok compiler plugin)

> The Lombok compiler plugin is [Experimental](components-stability.md).
> It may be dropped or changed at any time. Use it only for evaluation purposes.
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112).
>
{type="warning"}

The Kotlin Lombok compiler plugin allows the generation and use of Java's Lombok declarations by Kotlin code 
in the same mixed Java/Kotlin module.
If you call such declarations from another module, then you don't need to use this plugin for the compilation of 
that module.

The Lombok compiler plugin cannot replace [Lombok](https://projectlombok.org/), but it helps Lombok work in mixed Java/Kotlin modules.
Thus, you still need to configure Lombok as usual when using this plugin. 
Learn more about [how to make the plugin seeing Lombok's config](#using-the-lombok-configuration-file).

## Supported annotations

The plugin supports the following annotations:
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

We're continuing to work on this plugin. To find out the detailed current state, visit the [Lombok compiler plugin's README](https://github.com/JetBrains/kotlin/blob/master/plugins/lombok/lombok-compiler-plugin/README.md).

Currently, we don't have plans to support the `@Builder` annotation. However, we can consider this if you vote
for [`@Builder` in YouTrack](https://youtrack.jetbrains.com/issue/KT-46959).

> Kotlin compiler ignores Lombok annotations if you use them in Kotlin code.
>
{type="note"}

## Gradle

Apply the `kotlin-plugin-lombok` Gradle plugin in the `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "5.3.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '5.3.0'
}
```

</tab>
</tabs>

See this [test project with examples of the Lombok compiler plugin in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt).

### Using the Lombok configuration file

If you use a [Lombok configuration file](https://projectlombok.org/features/configuration) `lombok.config`,
provide a path to it to the plugin. The path should be relative to the module's directory. 
Add the following code to your `build.gradle(.kts)` file:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">


```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

See this [test project with examples of the Lombok compiler plugin and `lombok.config` in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig).

## Maven

To use the Lombok compiler plugin, add the plugin `lombok` to the `compilerPlugins` section and the dependency 
`kotlin-maven-lombok` to the `dependencies` section. 
If you use a [Lombok configuration file](https://projectlombok.org/features/configuration) `lombok.config`,
provide a path to it to the plugin in the `pluginOptions`. Add the following lines to the `pom.xml` file:

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
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

See this [test project example of the Lombok compiler plugin and `lombok.config` in use](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt).

## Using with kapt

By default, the [kapt](kapt.md) compiler plugin runs all annotation processors and disables annotation processing by javac.
To run [Lombok](https://projectlombok.org/) along with kapt, set up kapt to keep javac's annotation processors working.

If you use Gradle, add the option to the `build.gradle(.kts)` file:

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

In Maven, use the following settings to launch Lombok with Java's compiler:

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

The Lombok compiler plugin works correctly with [kapt](kapt.md) if annotation processors don't depend on the code generated by Lombok.

Look through the test project examples of kapt and the Lombok compiler plugin in use:
* Using [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt).
* Using [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)
