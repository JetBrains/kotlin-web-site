---
layout: api
title: ModuleBuilder
---
[stdlib](../../index.md) / [kotlin.modules](../index.md) / [ModuleBuilder](index.md)

# ModuleBuilder

```
open class ModuleBuilder
```

## Members

| Name | Summary |
|------|---------|
|[*.init*](_init_.md)|&nbsp;&nbsp;**`public ModuleBuilder(name: String, outputDir: String)`**<br>|
|[addAnnotationsPathEntry](addAnnotationsPathEntry.md)|&nbsp;&nbsp;**`public fun addAnnotationsPathEntry(name: String): Unit`**<br>|
|[addClasspathEntry](addClasspathEntry.md)|&nbsp;&nbsp;**`public fun addClasspathEntry(name: String): Unit`**<br>|
|[addSourceFiles](addSourceFiles.md)|&nbsp;&nbsp;**`public fun addSourceFiles(pattern: String): Unit`**<br>|
|[annotationsPath](annotationsPath/index.md)|&nbsp;&nbsp;**`val annotationsPath: AnnotationsPathBuilder`**<br>|
|[annotationsRoots0](annotationsRoots0.md)|&nbsp;&nbsp;**`private val annotationsRoots0: ArrayList<String>`**<br>|
|[classpath](classpath/index.md)|&nbsp;&nbsp;**`val classpath: ClasspathBuilder`**<br>|
|[classpathRoots0](classpathRoots0.md)|&nbsp;&nbsp;**`private val classpathRoots0: ArrayList<String>`**<br>|
|[getAnnotationsRoots](getAnnotationsRoots.md)|&nbsp;&nbsp;**`open public fun getAnnotationsRoots(): List<String>`**<br>|
|[getClasspathRoots](getClasspathRoots.md)|&nbsp;&nbsp;**`open public fun getClasspathRoots(): List<String>`**<br>|
|[getModuleName](getModuleName.md)|&nbsp;&nbsp;**`open public fun getModuleName(): String`**<br>|
|[getOutputDirectory](getOutputDirectory.md)|&nbsp;&nbsp;**`open public fun getOutputDirectory(): String`**<br>|
|[getSourceFiles](getSourceFiles.md)|&nbsp;&nbsp;**`open public fun getSourceFiles(): List<String>`**<br>|
|[name](name.md)|&nbsp;&nbsp;**`val name: String`**<br>|
|[outputDir](outputDir.md)|&nbsp;&nbsp;**`val outputDir: String`**<br>|
|[sourceFiles0](sourceFiles0.md)|&nbsp;&nbsp;**`private val sourceFiles0: ArrayList<String>`**<br>|
|[sources](sources/index.md)|&nbsp;&nbsp;**`val sources: SourcesBuilder`**<br>|
