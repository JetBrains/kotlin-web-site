---
type: doc
layout: reference
title: "Using Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# Using Maven

## Plugin and Versions

The *kotlin-maven-plugin* compiles Kotlin sources and modules. Currently only Maven v3 is supported.

Define the version of Kotlin you want to use via a *kotlin.version* property:

``` xml
<properties>
    <kotlin.version>{{ site.data.releases.latest.version }}</kotlin.version>
</properties>
```

## Dependencies

Kotlin has an extensive standard library that can be used in your applications. Configure the following dependency in the pom file:

``` xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

If you're targeting JDK 7 or JDK 8, you can use extended versions of the Kotlin standard library which contain
additional extension functions for APIs added in new JDK versions. Instead of `kotlin-stdlib`, use `kotlin-stdlib-jre7`
or `kotlin-stdlib-jre8`, depending on your JDK version.

If your project uses [Kotlin reflection](/api/latest/jvm/stdlib/kotlin.reflect.full/index.html) or testing facilities, you need to add the corresponding dependencies as well.
The artifact IDs are `kotlin-reflect` for the reflection library, and `kotlin-test` and `kotlin-test-junit`
for the testing libraries.

## Compiling Kotlin only source code

To compile source code, specify the source directories in the <build> tag:

``` xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

The Kotlin Maven Plugin needs to be referenced to compile the sources:

``` xml
<build>
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals> <goal>compile</goal> </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals> <goal>test-compile</goal> </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Compiling Kotlin and Java sources

To compile mixed code applications Kotlin compiler should be invoked before Java compiler.
In maven terms that means kotlin-maven-plugin should be run before maven-compiler-plugin using the following method, making sure that the kotlin plugin is above the maven-compiler-plugin in your pom.xml file:

``` xml
<build>
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>compile</id>
                    <goals> <goal>compile</goal> </goals>
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
                    <goals> <goal>compile</goal> </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals> <goal>testCompile</goal> </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## Incremental compilation

To make your builds faster, you can enable incremental compilation for Maven (supported since Kotlin 1.1.2).
In order to do that, define the `kotlin.compiler.incremental` property:

``` xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

Alternatively, run your build with the `-Dkotlin.compiler.incremental=true` option.

## Annotation processing

See the description of [Kotlin annotation processing tool](kapt.html) (`kapt`).

## Jar file

To create a small Jar file containing just the code from your module, include the following under `build->plugins` in your Maven pom.xml file,
where `main.class` is defined as a property and points to the main Kotlin or Java class:

``` xml
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

To create a self-contained Jar file containing the code from your module along with dependencies, include the following under `build->plugins` in your Maven pom.xml file,
where `main.class` is defined as a property and points to the main Kotlin or Java class:

``` xml
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

## Targeting JavaScript

In order to compile JavaScript code, you need to use the `js` and `test-js` goals for the `compile` execution:

``` xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <executions>
        <execution>
            <id>compile</id>
            <phase>compile</phase>
            <goals>
                <goal>js</goal>
            </goals>
        </execution>
        <execution>
            <id>test-compile</id>
            <phase>test-compile</phase>
            <goals>
                <goal>test-js</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

You also need to change the standard library dependency:

``` xml
<groupId>org.jetbrains.kotlin</groupId>
<artifactId>kotlin-stdlib-js</artifactId>
<version>${kotlin.version}</version>
```

For unit testing support, you also need to add a dependency on the `kotlin-test-js` artifact.

See the [Getting Started with Kotlin and JavaScript with Maven](/docs/tutorials/javascript/getting-started-maven/getting-started-with-maven.html)
tutorial for more information.

## Specifying compiler options

Additional options for the compiler can be specified as tags under the `<configuration>` element of the
Maven plugin node:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
    </configuration>
</plugin>
```

Many of the options can also be configured through properties:

``` xml
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
| nowarn | | Generate no warnings | true, false | false |
| languageVersion | kotlin.compiler.languageVersion | Provide source compatibility with specified language version | "1.0", "1.1" | "1.1"
| apiVersion | kotlin.compiler.apiVersion | Allow to use declarations only from the specified version of bundled libraries | "1.0", "1.1" | "1.1"
| sourceDirs | | The directories containing the source files to compile | | The project source roots
| compilerPlugins | | Enabled [compiler plugins](compiler-plugins.html)  | | []
| pluginOptions | | Options for compiler plugins  | | []
| args | | Additional compiler arguments | | []


### Attributes specific for JVM

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| jvmTarget | kotlin.compiler.jvmTarget | Target version of the generated JVM bytecode | "1.6", "1.8" | "1.6" |
| jdkHome | kotlin.compiler.jdkHome |  	Path to JDK home directory to include into classpath, if differs from default JAVA_HOME | | |

### Attributes specific for JS

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| outputFile | | Output file path | | |
| metaInfo |  | Generate .meta.js and .kjsm files with metadata. Use to create a library | true, false | true
| sourceMap | | Generate source map | true, false | false
| sourceMapEmbedSources | | Embed source files into source map | "never", "always", "inlining" | "inlining" |
| sourceMapPrefix | | Prefix for paths in a source map |  |  |
| moduleKind | | Kind of a module generated by compiler | "plain", "amd", "commonjs", "umd" | "plain"

## Generating documentation

The standard JavaDoc generation plugin (`maven-javadoc-plugin`) does not support Kotlin code.
To generate documentation for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka);
please refer to the [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-maven-plugin)
for configuration instructions. Dokka supports mixed-language projects and can generate output in multiple
formats, including standard JavaDoc.

## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.html).

## Examples

An example Maven project can be [downloaded directly from the GitHub repository](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip)
