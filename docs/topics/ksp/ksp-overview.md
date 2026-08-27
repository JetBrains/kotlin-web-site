[//]: # (title: Kotlin Symbol Processing API)

Kotlin Symbol Processing (KSP) is a source code generation framework for Kotlin. With the KSP API, you can create 
processors that inspect static information about your source code and generate new code from it. A common use case is 
generating code based on [annotations](annotations.md).

KSP aims to simplify the creation of lightweight compiler plugins. Its well-defined API hides compiler changes, 
so you don't need to spend much effort maintaining your processors. However, this approach comes with trade-offs. 
For example, KSP-based processors can't examine expressions or statements, and they can't modify the source code.

Typical use cases for KSP-based plugins include: 
* Dependency injection ([Dagger](https://dagger.dev/dev-guide/ksp))
* Serialization ([Moshi](https://github.com/square/moshi))
* Database management ([Room](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02))

## Overview

To learn how to create your first KSP-based processor, see the [KSP quickstart](ksp-quickstart.md).KSP represents Kotlin 
source code as a hierarchy of symbols based on the Kotlin grammar. Processors use these symbols to inspect declarations 
such as classes, functions, properties, and types.

> KSP models declarations and type information, but doesn't provide access to expressions or
> function bodies.
{style=”note”}

KSP fits into the compilation process as follows:
1. KSP processors analyze source code and resources.
2. The processors generate source files or other outputs.
3. The Kotlin compiler compiles the original source code together with the generated code.

To learn more about KSP, watch this video:

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>

## How KSP looks at source files

Most processors navigate through the various program structures of the input source code.
Before diving into usage of the API, let's see at how a file might look from KSP's point of view:

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  (File annotations)
  declarations: List<KSDeclaration>
    KSClassDeclaration // class, interface, object
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // contains inner classes, member functions, properties, etc.
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // top level function
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // contains local classes, local functions, local variables, etc.
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // global variable
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      extensionReceiver: KSTypeReference?
      type: KSTypeReference
      getter: KSPropertyGetter
        returnType: KSTypeReference
      setter: KSPropertySetter
        parameter: KSValueParameter
```

This view lists common things that are declared in the file: classes, functions, properties, and so on.

## SymbolProcessorProvider: the entry point

KSP expects an implementation of the `SymbolProcessorProvider` interface to instantiate `SymbolProcessor`:

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

While `SymbolProcessor` is defined as:

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // Let's focus on this
    fun finish() {}
    fun onError() {}
}
```

A `Resolver` provides `SymbolProcessor` with access to compiler details such as symbols.
A processor that finds all top-level functions and non-local functions in top-level classes might look something like
the following:

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    // ...
    val functions = mutableListOf<KSFunctionDeclaration>()
    val visitor = FindFunctionsVisitor()

    override fun process(resolver: Resolver) {
        resolver.getAllFiles().forEach { it.accept(visitor, Unit) }
    }

    inner class FindFunctionsVisitor : KSVisitorVoid() {
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            classDeclaration.getDeclaredFunctions().forEach { it.accept(this, Unit) }
        }

        override fun visitFunctionDeclaration(function: KSFunctionDeclaration, data: Unit) {
            functions.add(function)
        }

        override fun visitFile(file: KSFile, data: Unit) {
            file.declarations.forEach { it.accept(this, Unit) }
        }
    }
    // ...
    
    class Provider : SymbolProcessorProvider {
        override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor = TODO()
    }
}
```

## Resources

* [Quickstart](ksp-quickstart.md)
* [Examples](ksp-examples.md)
* [How KSP models Kotlin code](ksp-additional-details.md)
* [Reference for Java annotation processor authors](ksp-reference.md)
* [Incremental processing notes](ksp-incremental.md)
* [Multiple round processing notes](ksp-multi-round.md)
* [KSP on multiplatform projects](ksp-multiplatform.md)
* [Running KSP from command line](ksp-command-line.md)

## Supported libraries

The table includes a list of popular libraries on Android and their various stages of support for KSP:

| Library          | Status                                                                                            |
|------------------|---------------------------------------------------------------------------------------------------|
| Room             | [Officially supported](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02) |
| Moshi            | [Officially supported](https://github.com/square/moshi/)                                          |
| RxHttp           | [Officially supported](https://github.com/liujingxing/rxhttp)                                     |
| Kotshi           | [Officially supported](https://github.com/ansman/kotshi)                                          |
| Lyricist         | [Officially supported](https://github.com/adrielcafe/lyricist)                                    |
| Lich SavedState  | [Officially supported](https://github.com/line/lich/tree/master/savedstate)                       |
| gRPC Dekorator   | [Officially supported](https://github.com/mottljan/grpc-dekorator)                                |
| EasyAdapter      | [Officially supported](https://github.com/AmrDeveloper/EasyAdapter)                               |
| Koin Annotations | [Officially supported](https://github.com/InsertKoinIO/koin-annotations)                          |
| Glide            | [Officially supported](https://github.com/bumptech/glide)                                         | 
| Micronaut        | [Officially supported](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)       |
| Epoxy            | [Officially supported](https://github.com/airbnb/epoxy)                                           |
| Paris            | [Officially supported](https://github.com/airbnb/paris)                                           |
| Auto Dagger      | [Officially supported](https://github.com/ansman/auto-dagger)                                     |
| SealedX          | [Officially supported](https://github.com/skydoves/sealedx)                                       |
| Ktorfit          | [Officially supported](https://github.com/Foso/Ktorfit)                                           |
| Mockative        | [Officially supported](https://github.com/mockative/mockative)                                    |
| Kotest           | [Officially supported](https://github.com/kotest/kotest)                                          |
| DeeplinkDispatch | [Supported via airbnb/DeepLinkDispatch#323](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [In progress](https://dagger.dev/dev-guide/ksp)                                                   |
| Auto Factory     | [Not yet supported](https://github.com/google/auto/issues/982)                                    |
