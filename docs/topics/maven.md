[//]: # (title: Maven)

Maven is a build system that you can use to build and manage any Java-based project.

## Configure and enable the plugin

The `kotlin-maven-plugin` compiles Kotlin sources and modules. Currently, only Maven v3 is supported.

In your `pom.xml` file, define the version of Kotlin you want to use in the `kotlin.version` property:

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

To enable `kotlin-maven-plugin`, update your `pom.xml` file:

```xml
<plugins>
    <plugin>
        <artifactId>kotlin-maven-plugin</artifactId>
        <groupId>org.jetbrains.kotlin</groupId>
        <version>%kotlinVersion%</version>
    </plugin>
</plugins>
```

### Use JDK 17

To use JDK 17, in your `.mvn/jvm.config` file, add:

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## Declare repositories

By default, the `mavenCentral` repository is available for all Maven projects. To access artifacts in other repositories,
specify the ID and URL of each repository in the `<repositories>` element:

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> If you declare `mavenLocal()` as a repository in a Gradle project, you may experience problems when switching 
> between Gradle and Maven projects. For more information, see [Declare repositories](gradle-configure-project.md#declare-repositories).
>
{style="note"}

## Set dependencies

To add a dependency on a library, include it in the `<dependencies>` element:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### Dependency on the standard library

Kotlin has an extensive standard library that you can use in your applications.
To use the standard library in your project, add the following dependency to your `pom.xml` file:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- Uses the kotlin.version property 
            specified in <properties/>: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> If you're targeting JDK 7 or 8 with Kotlin versions older than:
> * 1.8, use `kotlin-stdlib-jdk7` or `kotlin-stdlib-jdk8`, respectively.
> * 1.2, use `kotlin-stdlib-jre7` or `kotlin-stdlib-jre8`, respectively.
>
{style="note"}

### Dependencies on test libraries

If your project uses [Kotlin reflection](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)
or testing frameworks, add the relevant dependencies.
Use `kotlin-reflect` for the reflection library, and `kotlin-test` and `kotlin-test-junit`
for the testing libraries.

For example:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

### Dependency on a kotlinx library

Depending on the kotlinx library, you can either add the base artifact name or the name with a `-jvm` suffix. Refer to 
the library's README file on [klibs.io](https://klibs.io/).

For example, to add a dependency on `kotlinx.coroutines`:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

To add a dependency on `kotlinx-datetime`:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

## Compile Kotlin-only source code

To compile source code, specify the source directories in the `<build>` tag:

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
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
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## Compile Kotlin and Java sources

To compile a project with both Kotlin and Java source files, make sure the Kotlin compiler runs before the Java compiler.
The Java compiler can't see Kotlin declarations until they are compiled into `.class` files.
If your Java code uses Kotlin classes, those classes must be compiled first to avoid `cannot find symbol` errors.

Maven determines plugin execution order based on two main factors:

* The order of plugin declarations in the `pom.xml` file.
* Built-in default executions, such as `default-compile` and `default-testCompile`, which always run before user-defined executions,
  regardless of their position in the `pom.xml` file.

To control the execution order:

* Declare `kotlin-maven-plugin` before `maven-compiler-plugin`.
* Disable the Java compiler plugin's default executions.
* Add custom executions to control the compile phases explicitly.

> You can use the special `none` phase in Maven to disable a default execution.
>
{style="note"}

You can simplify the configuration of mixed Kotlin/Java compilation using `extensions`.
It allows skipping the Maven compiler plugin configuration:

<tabs group="kotlin-java-maven">
<tab title="With extensions" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <phase>compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- Ensure Kotlin code can reference Java code -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>default-test-compile</id>
                    <phase>test-compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!-- No need to configure Maven compiler plugin with extensions -->
    </plugins>
</build>
```

If your project previously had a Kotlin-only configuration, you also need to remove the following lines from the `<build>` section:

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

It ensures that both Kotlin code can reference Java code and vice versa with the `extensions` setup.

</tab>
<tab title="Without extensions" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- Ensure Kotlin code can reference Java code -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Maven compiler plugin configuration -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- Disable default executions -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- Define custom executions -->
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

</tab>
</tabs>

This configuration ensures that:

* Kotlin code is compiled first.
* Java code is compiled after Kotlin and can reference Kotlin classes.
* Default Maven behavior doesn't override the plugin order.

For more details on how Maven handles plugin executions,
see [Guide to default plugin execution IDs](https://maven.apache.org/guides/mini/guide-default-execution-ids.html) in
the official Maven documentation.

## Configure Kotlin compiler execution strategy

The _Kotlin compiler execution strategy_ defines where the Kotlin compiler runs. There are two available strategies:

| Strategy                | Where the Kotlin compiler is executed |
|-------------------------|---------------------------------------|
| Kotlin daemon (default) | Inside its own daemon process         |
| In process              | Inside the Maven process              |

By default, the [Kotlin daemon](kotlin-daemon.md) is used. You can switch to the "in process" strategy by setting the following
property in your `pom.xml` file:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Regardless of the compiler execution strategy that you use, you still need to explicitly configure incremental compilation.

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

## Create a self-contained JAR file

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
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

The following attributes are supported:

### Attributes specific to JVM

| Name              | Property name                   | Description                                                                                          | Possible values                                         | Default value               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | Generate no warnings                                                                                 | true, false                                             | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | Provide source compatibility with the specified version of Kotlin                                    | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | Allow using declarations only from the specified version of bundled libraries                        | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | The directories containing the source files to compile                                               |                                                         | The project source roots    |
| `compilerPlugins` |                                 | Enabled compiler plugins                                                                             |                                                         | []                          |
| `pluginOptions`   |                                 | Options for compiler plugins                                                                         |                                                         | []                          |
| `args`            |                                 | Additional compiler arguments                                                                        |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | Target version of the generated JVM bytecode                                                         | "1.8", "9", "10", ..., "25"                             | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME |                                                         |                             |

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