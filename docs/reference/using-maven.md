---
type: doc
layout: reference
title: "Using Maven"
description: "This tutorials walks you through different scenarios when using Maven for building applications that contain Kotlin code"
---

# 使用 Maven

## 插件与版本

*kotlin-maven-plugin* 用于编译 Kotlin 源码与模块，当前只支持 Marven V3

通过 *kotlin.version* 指定所要使用的 Kotlin 版本，有以下值可供选择：

* X.Y-SNAPSHOP：指定 X.Y 的值使用对应的最新开发版，当前只有一个开发版版本号 0.1-SNAPSHOT。这是非稳定的版本的只适用于测试编译器的新特性。使用开发版需要在 pom 文件中[设置相应的 repository](#configuring-snapshot-repositories).

* X.Y.Z：指定 X.Y.Z 值使用对应的稳定版本，这些版本发布在 Maven Central Repository 中，无需在 pom 文件中进行额外的设置。

以下是稳定版本对应的版本号 X.Y.Z 值：
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


## 设置开发版的 repository

使用 Kotlin 的开发版需要在 pom 文件中定义以下的 respository：

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

## 依赖

Kotlin 提供了大量的标准库以供开发使用，需要在 pom 文件中设置以下依赖：

``` xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

## 仅编译 Kotlin 源码

在 &lt;build&gt; 标签中指定所要编译的 Kotlin 源码目录：

``` xml
<sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
<testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
```

Maven 中需要引用 Kotlin 插件用于编码源码：

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

## 同时编译 Kotlin 与 Java 源码

编译混合代码时 Kotlin 编译器应先于 Java 的编译器被调用。在 Maven 中这表示 kotlin-maven-plugin 先于 maven-compiler-plugin 运行。

通过指定 pom 文件中 &lt;phase&gt; 标签的值为 process-sources 可实现以上目的。（如果有更好的方法欢迎提出）

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

## OSGi

OSGi支持查看 [Kotlin OSGi page](kotlin-osgi.html).

## 使用外部的注解


Kotlin 使用外部注解为 Java 库提供精准的类型信息，通过 &lt;configuration&gt; 标签中的 annotationPaths 指定这些注解。

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>0.1-SNAPSHOT</version>

    <configuration>
        <annotationPaths>
            <!--指向注解文件的根目录-->
            <annotationPath>${project.basedir}/src/main/resources/</annotationPath>
        </annotationPaths>
    </configuration>

...
```

## 例子

Maven 工程的例子可从 [Github 直接下载](https://github.com/JetBrains/kotlin-examples/archive/master/maven.zip)

翻译 by [DemoJameson](http://www.demojameson.com)
