[//]: # (title: Compile and package a Maven project)

You can set up your Maven project to compile Kotlin-only or mixed Kotlin/Java sources, configure the Kotlin compiler,
specify compiler options, and package your application into JARs.

## Configure source code compilation

### Compile Kotlin-only sources

To compile your source code:

1. Specify the source directories in the `<build>` section:

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. Ensure that the Kotlin Maven plugin is applied:

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

You can replace the whole `<executions>` section above with `<extensions>true</extensions>`.
Enabling extensions automatically adds the `compile`, `test-compile`, `kapt`, and `test-kapt` executions to your build,
bound to their appropriate [lifecycle phases](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html).
If you need to configure an execution, you need to specify its ID. You can find an example of this in the next section.

> If several build plugins overwrite the default lifecycle, and you have also enabled the `extensions` option, the last plugin in
> the `<build>` section has priority in terms of lifecycle settings. All earlier changes to lifecycle settings are ignored.
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### Compile Kotlin and Java sources

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

## Configure Kotlin compiler

### Choose execution strategy

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

### Enable incremental compilation

To make your builds faster, you can enable incremental compilation by adding the `kotlin.compiler.incremental` property:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

Alternatively, run your build with the `-Dkotlin.compiler.incremental=true` option.

### Specify compiler options

Additional options and arguments for the compiler can be specified as elements in the `<configuration>` section of the
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

#### Attributes specific to JVM

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

## Package your project

### Create JAR files

To create a small JAR file containing just the code from your module, include the following under `<build><plugins>`
in your Maven `pom.xml` file, where `main.class` is defined as a property and points to the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
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

### Create self-contained JAR files

To create a self-contained JAR file containing the code from your module along with its dependencies, include the following
under `<build><plugins>` in your Maven `pom.xml` file, where `main.class` is defined as a property and points to
the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
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
