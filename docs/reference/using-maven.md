---
type: doc
layout: reference
title: "Using Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# Using Maven

## Plugin and Versions

The *kotlin-maven-plugin* compiles Kotlin sources and modules. Currently only Maven v3 is supported.

Define the version of Kotlin you want to use via *kotlin.version*. The possible values are:

* X.Y-SNAPSHOT: Correspond to snapshot version for X.Y releases, updated with every successful build on the CI server. These versions are not really stable and are
only recommended for testing new compiler features. Currently all builds are published as 0.1-SNAPSHOT. To use a snapshot, you need to [configure a snapshot repository
in the pom file](#configuring-snapshot-repositories).

* X.Y.Z: Correspond to release or milestone versions X.Y.Z, updated manually. These are stable builds. Release versions are published to Maven Central Repository. No extra configuration
is needed in your pom file.

The correspondence between milestones and versions is displayed below:

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


## Configuring Snapshot Repositories

To use a snapshot version of Kotlin, include the following repository definitions to the pom

``` xml
<repositories>
  <repository>
    <id>sonatype.oss.snapshots</id>
    <name>Sonatype OSS Snapshot Repository</name>
    <url>http://oss.sonatype.org/content/repositories/snapshots</url>
    <releases>
      <enabled>false</enabled>
    </releases>
    <snapshots>
      <enabled>true</enabled>
    </snapshots>
  </repository>
</repositories>

<pluginRepositories>
  <pluginRepository>
    <id>sonatype.oss.snapshots</id>
    <name>Sonatype OSS Snapshot Repository</name>
    <url>http://oss.sonatype.org/content/repositories/snapshots</url>
    <releases>
      <enabled>false</enabled>
    </releases>
    <snapshots>
      <enabled>true</enabled>
    </snapshots>
  </pluginRepository>
</pluginRepositories>
```

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
            <phase>compile</phase>
            <goals> <goal>compile</goal> </goals>
        </execution>

        <execution>
            <id>test-compile</id>
            <phase>test-compile</phase>
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
    <version>0.1-SNAPSHOT</version>

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

## Using External Annotations

Kotlin uses external annotation to have precise information about types in Java libraries. To specify these annotations, use annotationPaths in <configuration>:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>0.1-SNAPSHOT</version>

    <configuration>
        <annotationPaths>
            <annotationPath>path to annotations root</annotationPath>
        </annotationPaths>
    </configuration>

...
```

## Examples

An example Maven project can be [downloaded directly from the GitHub repository](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip)
