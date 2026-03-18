[//]: # (title: Set Kotlin Maven compiler options)

You can specify additional options and arguments for the compiler as elements in the `<configuration>` section of the
Kotlin Maven plugin node:

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
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

The following attributes are supported:

## Attributes specific to JVM

| Name              | Property name                     | Description                                                                                          | Possible values                                         | Default value               |
|-------------------|-----------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | Generate no warnings                                                                                 | true, false                                             | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | Provide source compatibility with the specified version of Kotlin                                    | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | Allow using declarations only from the specified version of bundled libraries                        | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                   | The directories containing the source files to compile                                               |                                                         | The project source roots    |
| `compilerPlugins` |                                   | Enabled compiler plugins                                                                             |                                                         | []                          |
| `pluginOptions`   |                                   | Options for compiler plugins                                                                         |                                                         | []                          |
| `args`            |                                   | Additional compiler arguments                                                                        |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | Target version of the generated JVM bytecode                                                         | "1.8", "9", "10", ..., "25"                             | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | Include a custom JDK from the specified location into the classpath instead of the default JAVA_HOME |                                                         |                             |

## Choose execution strategy

<snippet id="maven-configure-execution-strategy">

By default, Maven uses the Kotlin daemon compiler execution strategy. To switch to the "in process" strategy, set the following
property in your `pom.xml` file:

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

For more information about the different strategies, see [Compiler execution strategy](compiler-execution-strategy.md).

## Enable incremental compilation

To make your builds faster, you can enable incremental compilation by adding the `kotlin.compiler.incremental` property:

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

Alternatively, run your build with the `-Dkotlin.compiler.incremental=true` option.

## What's next?

[Package your project](maven-compile-package.md)