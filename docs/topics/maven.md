[//]: # (title: Maven)

## Plugin and versions

The *kotlin-maven-plugin* compiles Kotlin sources and modules. Currently, only Maven v3 is supported.

Define the version of Kotlin you want to use via a *kotlin.version* property:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

## Dependencies

Kotlin has an extensive standard library that can be used in your applications.
To use the standard library in your project, add the following dependency in the pom file:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

If you're targeting JDK 7 or JDK 8, you can use extended versions of the Kotlin standard library. They contain
additional extension functions for APIs added in new JDK versions. Instead of `kotlin-stdlib`, use `kotlin-stdlib-jdk7`
or `kotlin-stdlib-jdk8`, depending on your JDK version. 

>For Kotlin versions older that  1.2, use `kotlin-stdlib-jre7` and `kotlin-stdlib-jre8`.
>
{type="note"} 

If your project uses [Kotlin reflection](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)
or testing facilities, you need to add the corresponding dependencies as well.
The artifact IDs are `kotlin-reflect` for the reflection library, and `kotlin-test` and `kotlin-test-junit`
for the testing libraries.

## Compile Kotlin-only source code

To compile source code, specify the source directories in the `<build>` tag:

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

The Kotlin Maven Plugin needs to be referenced to compile the sources:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Compile Kotlin and Java sources

To compile projects that include Kotlin and Java source code, invoke the Kotlin compiler before the Java compiler.
In maven terms that means that `kotlin-maven-plugin` should be run before `maven-compiler-plugin` using the following method,
making sure that the `kotlin` plugin comes before the `maven-compiler-plugin` in your `pom.xml` file:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> <goal>test-compile</goal> </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- Replacing default-compile as it is treated specially by maven -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by maven -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Incremental compilation

To make your builds faster, you can enable incremental compilation for Maven by defining the
`kotlin.compiler.incremental` property:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

Alternatively, run your build with the `-Dkotlin.compiler.incremental=true` option.

## Annotation processing

See the description of [Kotlin annotation processing tool](kapt.md) (`kapt`).

## Jar file

To create a small Jar file containing just the code from your module, include the following under `build->plugins`
in your Maven pom.xml file, where `main.class` is defined as a property and points to the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## Self-contained Jar file

To create a self-contained Jar file containing the code from your module along with dependencies, include the following
under `build->plugins` in your Maven pom.xml file, where `main.class` is defined as a property and points to
the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

This self-contained jar file can be passed directly to a JRE to run your application:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## Specifying compiler options

Additional options and arguments for the compiler can be specified as tags under the `<configuration>` element of the
Maven plugin node:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- Enable strict mode for JSR-305 annotations -->
            ...
        </args>
    </configuration>
</plugin>
```

Many of the options can also be configured through properties:

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>1.0</kotlin.compiler.languageVersion>
    </properties>
</project>
```

The following attributes are supported:

### Attributes common for JVM and JS

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| `nowarn` | | Generate no warnings | true, false | false |
| `languageVersion` | kotlin.compiler.languageVersion | Provide source compatibility with the specified version of Kotlin | "1.3" (DEPRECATED), "1.4", "1.5", "1.6" (EXPERIMENTAL) | 
| `apiVersion` | kotlin.compiler.apiVersion | Allow using declarations only from the specified version of bundled libraries | "1.3" (DEPRECATED), "1.4", "1.5", "1.6" (EXPERIMENTAL) | 
| `sourceDirs` | | The directories containing the source files to compile | | The project source roots
| `compilerPlugins` | | Enabled compiler plugins  | | []
| `pluginOptions` | | Options for compiler plugins  | | []
| `args` | | Additional compiler arguments | | []

### Attributes specific for JVM

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| `jvmTarget` | `kotlin.compiler.jvmTarget` | Target version of the generated JVM bytecode | "1.6" (DEPRECATED), "1.8", "9", "10", "11", "12", "13", "14", "15", "16" | "%defaultJvmTargetVersion" |
| `jdkHome` | `kotlin.compiler.jdkHome` |  	Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME | | |

### Attributes specific for JS

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| `outputFile` | | Destination *.js file for the compilation result | | |
| `metaInfo` |  | Generate .meta.js and .kjsm files with metadata. Use to create a library | true, false | true
| `sourceMap` | | Generate source map | true, false | false
| `sourceMapEmbedSources` | | Embed source files into source map | "never", "always", "inlining" | "inlining" |
| `sourceMapPrefix` | | Add the specified prefix to paths in the source map |  |  |
| `moduleKind` | | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain" | "umd"

## Generating documentation

The standard JavaDoc generation plugin (`maven-javadoc-plugin`) does not support Kotlin code.
To generate documentation for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka);
please refer to the [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-maven-plugin)
for configuration instructions. Dokka supports mixed-language projects and can generate output in multiple
formats, including standard JavaDoc.

## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.md).

## Examples

An example Maven project can be [downloaded from the GitHub repository](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip)
