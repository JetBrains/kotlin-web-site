---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

## 插件和版本

使用 *kotlin-gradle-plugin* 编译Kotlin的源代码和模块.

我们希望通过 *kotlin.version*这样的形式来定义Kotlin的版本. 可能使用的形式是:

* X.Y-SNAPSHOT: 对应于每一个X.Y形式的发布版本, 在服务器上都会更新为对应的成功编译的版本. 这种版本是不稳定的，并且推荐您仅用于测试编译器新功能. 现阶段所有的构建版本都以0.1-SNAPSHOT的形式发布. 通过使用快照方式, 我们需要 [在build.gradle文件中配置一个快照仓库](#using-snapshot-versions).

* X.Y.Z: 对应于发布版本和里程碑版本 X.Y.Z, 是通过手动升级的. 这是稳定的版本. 正式版会在 Maven Central Repository中发布. 并不需要在build.gradle文件中额外配置.

里程碑和版本之间的对应关系如下:

<table>
<thead>
<tr>
  <th>里程碑</th>
  <th>版本</th>
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

## 应用于JVM

为了在JVM中应用, Kotlin插件需要配置如下

``` groovy
apply plugin: "kotlin"
```

在M11版本, Kotlin源文件和Java源文件可以在同一个文件夹中存在, 也可以在不同文件夹中. 默认采用的是不同的文件夹:

``` groovy
project
    - main (root)
        - kotlin
        - java
```

如果不想使用默认选项，你需要更新对应的 *sourceSets* 属性

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

## 应用于 JavaScript

当应用于 JavaScript 的时候, 需要设置一个不同的插件:

``` groovy
apply plugin: "kotlin2js"
```

该插件仅作用于Kotlin文件，因此推荐使用这个插件来区分Kotlin和Java文件 (这种情况仅仅是同一工程中包含Java源文件的时候). 如果不使用默认选项，又为了应用于 JVM，我们需要指定源文件夹使用 *sourceSets*

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

如果你想创建一个可重用的库, 使用 `kotlinOptions.metaInfo` 来生成额外的二进制形式的JS文件.
这个文件应该和编译结果一起分发.

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```


## 应用于 Android

Android的 Gradle模型和传统的Gradle有些不同, 因此如果我们想要通过Kotlin来创建一个Android应用, 应该使用
*kotlin-android* 插件来代替 *kotlin*:

``` groovy
buildscript {
    ...
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

### Android Studio

如果你使用的是Android Studio, 下面的一些属性需要添加到文件中:

``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

上述属性可以使kotlin目录在Android Studio中作为源码根目录存在, 所以当项目模型加载到IDE可以被正确识别.



## 配置依赖

我们需要添加kotlin-gradle-plugin和Kotlin标准库的依赖:

``` groovy
buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:<version>'
  }
}

apply plugin: "kotlin" // or apply plugin: "kotlin2js" if targeting JavaScript

repositories {
  mavenCentral()
}

dependencies {
  compile 'org.jetbrains.kotlin:kotlin-stdlib:<version>'
}
```

## 使用快照版本

如果想要使用快照版本 (每日构建), 我们需要添加一个快照仓库并且将版本更改为0.1-SNAPSHOT:

``` groovy
buildscript {
  repositories {
    mavenCentral()
    maven {
      url 'http://oss.sonatype.org/content/repositories/snapshots'
    }
  }
  dependencies {
    classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:0.1-SNAPSHOT'
  }
}

apply plugin: "kotlin" // or apply plugin: "kotlin2js" if targeting JavaScript

repositories {
  mavenCentral()
  maven {
    url 'http://oss.sonatype.org/content/repositories/snapshots'
  }
}

dependencies {
  compile 'org.jetbrains.kotlin:kotlin-stdlib:0.1-SNAPSHOT'
}
```


## 使用外部注释

JDK和Android SDK的外部注释将自动配置. 如果想要为一些库添加更多的注解，需要在Gradle脚本中添加下面这一行:

``` groovy

kotlinOptions.annotations = file('<path to annotations>')
```

## 例子

[Kotlin Repository](https://github.com/jetbrains/kotlin) 包含的例子:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Mixed Java and Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin/src/test/resources/testProject/kotlin2JsProject)

翻译By [ChiahaoLu](https://github.com/chiahaolu)
