[//]: # (title: Lombok compiler plugin)

> The Lombok compiler plugin is [Experimental](components-stability.md). 
> It may be dropped or changed at any time. Use it only for evaluation purposes. 
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112).
>
{type="warning"}

The Kotlin Lombok compiler plugin allows the generation and use of Java's Lombok declarations by Kotlin code 
in the same mixed Java/Kotlin module.
If you call such declarations from another module, then you don't need to use this plugin for the compilation of 
that another module.

The Lombok compiler plugin does not substitute [Lombok](https://projectlombok.org/), it helps Lombok work in mixed Java/Kotlin modules.
Thus, you still need to configure Lombok as usual, when using this plugin. 
Learn more about [how to make the plugin seeing Lombok's config](#defining-the-place-of-lombok-config).

## Supported annotations

The plugin supports the following annotations:
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

Currently, we don't have plans on supporting the `@Builder` annotation. However, we can consider this if you vote
for [`@Builder` in YouTrack](https://youtrack.jetbrains.com/issue/KT-46959).

> Kotlin compiler ignores Lombok annotations if you use them in Kotlin code.
>
{type="note"}

We continue to work on this plugin. To find out the detailed current state, visit the [Lombok compiler plugin's README](https://github.com/JetBrains/kotlin/blob/master/plugins/lombok/lombok-compiler-plugin/README.md).

## Gradle

Apply the `kotlin-plugin-lombok` Gradle plugin in the `build.gradle(.kts)` file:

<tabs>

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '5.3.0'
}
```

```kotlin
plugins {
    id ("org.jetbrains.kotlin.plugin.lombok") version "%kotlinVersion%"
    id ("io.freefair.lombok") version "5.3.0"
}
```

</tabs>

See the [test project with examples of Lombok compiler plugin usage](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt).

### Using the Lombok configuration file

If you use [Lombok configuration file](https://projectlombok.org/features/configuration) `lombok.config`, 
provide a path to it to the plugin. The path should be relative to the module's directory. 
Add the following code to your `build.gradle(.kts)` file:

```groovy
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

See the [test project with examples of Lombok compiler plugin and `lombok.config` usages](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig).

## Maven

To use Lombok compiler plugin, add the plugin `lombok` to the `compilerPlugins` section and the dependency 
`kotlin-maven-lombok` to the `dependencies` section. 
If you use [Lombok configuration file](https://projectlombok.org/features/configuration) `lombok.config`,
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

See the [test project example of Lombok compiler plugin and `lombok.config` usages](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt).

## Using the plugin along with kapt

By default, [kapt](kapt.md) compiler plugin launches all annotation processors and disables javac's annotation processors.
You need javac's annotation processors working to launch Lombok.

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

> The Lombok compiler plugin works correctly along with [kapt](kapt.md) if annotations processors don't depend
> on the code generated by Lombok.
>
{type="note"}

Look through the test project examples of kapt and Lombok compiler plugins usages:
* Using [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt).
* Using [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)

