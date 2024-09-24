[//]: # (title: Kotlin Symbol Processing API)

Kotlin Symbol Processing (_KSP_) is an API that you can use to develop lightweight compiler plugins.
KSP provides a simplified compiler plugin API that leverages the power of Kotlin while keeping the learning curve at
a minimum. Compared to [kapt](kapt.md), annotation processors that use KSP can run up to two times faster.

* To learn more about how KSP compares to kapt, check out [why KSP](ksp-why-ksp.md).
* To get started writing a KSP processor, take a look at the [KSP quickstart](ksp-quickstart.md).

## Overview

The KSP API processes Kotlin programs idiomatically. KSP understands Kotlin-specific features, such as extension functions,
declaration-site variance, and local functions. It also models types explicitly and provides basic type checking,
such as equivalence and assign-compatibility.

The API models Kotlin program structures at the symbol level according to [Kotlin grammar](https://kotlinlang.org/docs/reference/grammar.html).
When KSP-based plugins process source programs, constructs like classes, class members, functions, and associated parameters are accessible for the
processors, while things like `if` blocks and `for` loops are not.

Conceptually, KSP is similar to [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) in Kotlin reflection.
The API allows processors to navigate from class declarations to corresponding types with specific type arguments and vice-versa.
You can also substitute type arguments, specify variances, apply star projections, and mark nullabilities of types.

Another way to think of KSP is as a preprocessor framework of Kotlin programs. By considering KSP-based plugins as
_symbol processors_, or simply _processors_, the data flow in a compilation can be described in the following steps:

1. Processors read and analyze source programs and resources.
2. Processors generate code or other forms of output.
3. The Kotlin compiler compiles the source programs together with the generated code.

Unlike a full-fledged compiler plugin, processors cannot modify the code.
A compiler plugin that changes language semantics can sometimes be very confusing.
KSP avoids that by treating the source programs as read-only.

You can also get an overview of KSP in this video:

<video src="https://www.youtube.com/bv-VyGM3HCY" title="Kotlin Symbol Processing (KSP)"/>


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

## `SymbolProcessorProvider`: the entry point

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
    val functions = mutableListOf<KSClassDeclaration>()
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
* [Why use KSP?](ksp-why-ksp.md)
* [Examples](ksp-examples.md)
* [How KSP models Kotlin code](ksp-additional-details.md)
* [Reference for Java annotation processor authors](ksp-reference.md)
* [Incremental processing notes](ksp-incremental.md)
* [Multiple round processing notes](ksp-multi-round.md)
* [KSP on multiplatform projects](ksp-multiplatform.md)
* [Running KSP from command line](ksp-command-line.md)
* [FAQ](ksp-faq.md)

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
| DeeplinkDispatch | [Supported via airbnb/DeepLinkDispatch#323](https://github.com/airbnb/DeepLinkDispatch/pull/323)  |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                         |
| Motif            | [Alpha](https://github.com/uber/motif)                                                            |
| Hilt             | [In progress](https://dagger.dev/dev-guide/ksp)                                                   |
| Auto Factory     | [Not yet supported](https://github.com/google/auto/issues/982)                                    |