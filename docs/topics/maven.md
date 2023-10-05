[//]: # (title: Maven)

Maven is a build system that you can use to build and manage any Java-based project.

## Configure plugin and versions

The *kotlin-maven-plugin* compiles Kotlin sources and modules. Currently, only Maven v3 is supported.

Define the version of Kotlin you want to use via the `kotlin.version` property:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

### Use JDK 17

To use JDK 17, in your `.mvn/jvm.config` file, add:

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## Set dependencies

Kotlin has an extensive standard library that can be used in your applications.
To use the standard library in your project, add the following dependency to your `pom.xml` file:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> If you're targeting JDK 7 or 8 with Kotlin versions older than:
> * 1.8, use `kotlin-stdlib-jdk7` or `kotlin-stdlib-jdk8`, respectively.
> * 1.2, use `kotlin-stdlib-jre7` or `kotlin-stdlib-jre8`, respectively.
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

Starting from Kotlin 1.8.20, you can replace the whole `<executions>` element above with `<extensions>true</extensions>`. 
Enabling extensions automatically adds the `compile`, `test-compile`, `kapt`, and `test-kapt` executions to your build, 
bound to their appropriate [lifecycle phases](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html). 
If you need to configure an execution, you need to specify its ID. You can find an example of this in the next section.

> If several build plugins overwrite the default lifecycle and you have also enabled the `extensions` option, the last plugin in 
> the `<build>` section has priority in terms of lifecycle settings. All earlier changes to lifecycle settings are ignored.
> 
{type="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## Compile Kotlin and Java sources

To compile projects that include Kotlin and Java source code, invoke the Kotlin compiler before the Java compiler.
In Maven terms it means that `kotlin-maven-plugin` should be run before `maven-compiler-plugin` using the following method,
making sure that the `kotlin` plugin comes before the `maven-compiler-plugin` in your `pom.xml` file:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- You can set this option 
            to automatically take information about lifecycles -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- You can skip the <goals> element 
                        if you enable extensions for the plugin -->
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
                    <goals> <goal>test-compile</goal> </goals> <!-- You can skip the <goals> element 
                    if you enable extensions for the plugin -->
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
                <!-- Replacing default-compile as it is treated specially by Maven -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by Maven -->
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

## Enable incremental compilation

To make your builds faster, you can enable incremental compilation by adding the `kotlin.compiler.incremental` property:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

Alternatively, run your build with the `-Dkotlin.compiler.incremental=true` option.

## Configure annotation processing

See [`kapt` – Using in Maven](kapt.md#use-in-maven).

## Create JAR file

To create a small JAR file containing just the code from your module, include the following under `build->plugins`
in your Maven `pom.xml` file, where `main.class` is defined as a property and points to the main Kotlin or Java class:

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

## Create self-contained JAR file

To create a self-contained JAR file containing the code from your module along with its dependencies, include the following
under `build->plugins` in your Maven `pom.xml` file, where `main.class` is defined as a property and points to
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

This self-contained JAR file can be passed directly to a JRE to run your application:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## Specify compiler options

Additional options and arguments for the compiler can be specified as tags under the `<configuration>` element of the
Maven plugin node:

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- If you want to enable automatic addition of executions to your build -->
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
        <kotlin.compiler.languageVersion>1.9</kotlin.compiler.languageVersion>
    </properties>
</project>
```

The following attributes are supported:

### Attributes common to JVM and JS

| Name | Property name | Description | Possible values | Default value |
|------|---------------|-------------|-----------------|---------------|
| `nowarn` | | Generate no warnings | true, false | false |
| `languageVersion` | kotlin.compiler.languageVersion | Provide source compatibility with the specified version of Kotlin | "1.3" (DEPRECATED), "1.4" (DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (EXPERIMENTAL) | 
| `apiVersion` | kotlin.compiler.apiVersion | Allow using declarations only from the specified version of bundled libraries | "1.3" (DEPRECATED), "1.4" (DEPRECATED), "1.5", "1.6", "1.7", "1.8", "1.9" (EXPERIMENTAL) | 
| `sourceDirs` | | The directories containing the source files to compile | | The project source roots
| `compilerPlugins` | | Enabled compiler plugins  | | []
| `pluginOptions` | | Options for compiler plugins  | | []
| `args` | | Additional compiler arguments | | []

### Attributes specific to JVM

| Name | Property name | Description | Possible values                |Default value |
|------|---------------|-------------|--------------------------------|--------------|
| `jvmTarget` | `kotlin.compiler.jvmTarget` | Target version of the generated JVM bytecode | "1.8", "9", "10", ..., "21" | "%defaultJvmTargetVersion%" |
| `jdkHome` | `kotlin.compiler.jdkHome` |  	Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME |                                | |

### Attributes specific to JS

| Name | Property name | Description | Possible values |Default value |
|------|---------------|-------------|-----------------|--------------|
| `outputFile` | | Destination *.js file for the compilation result | | |
| `metaInfo` |  | Generate .meta.js and .kjsm files with metadata. Use to create a library | true, false | true
| `sourceMap` | | Generate source map | true, false | false
| `sourceMapEmbedSources` | | Embed source files into source map | "never", "always", "inlining" | "inlining" |
| `sourceMapPrefix` | | Add the specified prefix to paths in the source map |  |  |
| `moduleKind` | | The kind of JS module generated by the compiler | "umd", "commonjs", "amd", "plain" | "umd"

## Use BOM

To use a Kotlin [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms), 
write a dependency on [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom):

```xml
<dependencyManagement>
  <dependencies>  
    <dependency>
      <groupId>org.jetbrains.kotlin</groupId>
      <artifactId>kotlin-bom</artifactId>
      <version>%kotlinVersion%</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

## Generate documentation

The standard Javadoc generation plugin (`maven-javadoc-plugin`) doesn't support Kotlin code. To generate documentation 
for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka). Dokka supports mixed-language projects and can 
generate output in multiple formats, including standard Javadoc. For more information about how to configure Dokka in
your Maven project, see [Maven](dokka-maven.md).

## Enable OSGi support

[Learn how to enable OSGi support in your Maven project](kotlin-osgi.md#maven).
