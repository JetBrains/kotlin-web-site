---
type: doc
layout: reference
title: "Using Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# Using Maven

## Plugin and Versions

The *kotlin-maven-plugin* compiles Kotlin sources and modules. Currently only Maven v3 is supported.

Define the version of Kotlin you want to use via *kotlin.version*. The correspondence between Kotlin releases and versions is displayed below:

<table>
<thead>
<tr>
  <th>Milestone</th>
  <th>Version</th>
</tr>
</thead>
<tbody>
{% for entry in site.data.releases.list %}
<tr>
  <td>{{ entry.milestone }}</td>
  <td>{{ entry.version }}</td>
</tr>
{% endfor %}
</tbody>
</table>


## Dependencies

Kotlin has an extensive standard library that can be used in your applications. Configure the following dependency in the pom file

``` xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

## Compiling Kotlin only source code

To compile source code, specify the source directories in the <build> tag:

``` xml
<sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
<testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
```

The Kotlin Maven Plugin needs to be referenced to compile the sources:

``` xml

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
```

## Compiling Kotlin and Java sources

To compile mixed code applications Kotlin compiler should be invoked before Java compiler.
In maven terms that means kotlin-maven-plugin should be run before maven-compiler-plugin.

It could be done by moving Kotlin compilation to previous phase, process-sources (feel free to suggest a better solution if you have one):

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <executions>
        <execution>
            <id>compile</id>
            <phase>process-sources</phase>
            <goals> <goal>compile</goal> </goals>
        </execution>

        <execution>
            <id>test-compile</id>
            <phase>process-test-sources</phase>
            <goals> <goal>test-compile</goal> </goals>
        </execution>
    </executions>
</plugin>
```

## OSGi

For OSGi support see the [Kotlin OSGi page](kotlin-osgi.html).

## Examples

An example Maven project can be [downloaded directly from the GitHub repository](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip)
