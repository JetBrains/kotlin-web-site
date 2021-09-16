[//]: # (title: Kotlin Symbol Processing API)

Kotlin Symbol Processing (_KSP_) is an API that you can use to develop
lightweight compiler plugins. KSP provides a simplified compiler plugin
API that leverages the power of Kotlin while keeping the learning curve at
a minimum. Compared to KAPT, annotation processors that use KSP can run up to 2x faster.

To learn more about how KSP compares to KAPT, check out [why KSP](ksp-why-ksp.md). To get started writing a KSP processor, take a look at the [KSP quickstart](ksp-quickstart.md).

## Overview

The KSP API processes Kotlin programs idiomatically. KSP understands
Kotlin-specific features, such as extension functions, declaration-site
variance, and local functions. KSP also models types explicitly and
provides basic type checking, such as equivalence and assign-compatibility.

The API models Kotlin program structures at the symbol level according to
[Kotlin grammar](https://kotlinlang.org/docs/reference/grammar.html). When
KSP-based plugins process source programs, constructs like classes, class
members, functions, and associated parameters are easily accessible for the
processors, while things like if blocks and for loops are not.

Conceptually, KSP is similar to
[KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/)
in Kotlin reflection. The API allows processors to navigate from class
declarations to corresponding types with specific type arguments and
vice-versa. Substituting type arguments, specifying variances, applying
star projections, and marking nullabilities of types are also possible.

Another way to think of KSP is as a pre-processor framework of Kotlin
programs. If we refer to KSP-based plugins as _symbol processors_, or
simply _processors_, then the data flow in a compilation can be described
in the following steps:

1. Processors read and analyze source programs and resources.
1. Processors generate code or other forms of output.
1. The Kotlin compiler compiles the source programs together with the
   generated code.

Unlike a full-fledged compiler plugin, processors cannot modify the code.
A compiler plugin that changes language semantics can sometimes be very
confusing. KSP avoids that by treating the source programs as read-only.

## How KSP looks at source files

Most processors navigate through the various program structures of the
input source code. Before diving into usage of the API, let's look at how
a file might look from KSP's point of view:

```kotlin
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

This view lists common things that are declared in the file--classes,
functions, properties, and so on.

## SymbolProcessorProvider: The entry point

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

A `Resolver` provides `SymbolProcessor` with access to compiler details
such as symbols. A processor that finds all top-level functions and non-local functions in top-level
classes might look something like this:

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    ...
    val functions = mutableListOf<String>()
    val visitor = FindFunctionsVisitor()

    override fun process(resolver: Resolver) {
        resolver.getAllFiles().map { it.accept(visitor, Unit) }
    }

    inner class FindFunctionsVisitor : KSVisitorVoid() {
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            classDeclaration.getDeclaredFunctions().map { it.accept(this, Unit) }
        }

        override fun visitFunctionDeclaration(function: KSFunctionDeclaration, data: Unit) {
            functions.add(function)
        }

        override fun visitFile(file: KSFile, data: Unit) {
            file.declarations.map { it.accept(this, Unit) }
        }
    }
    ...
    
    class Provider : SymbolProcessorProvider {
        override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor = ...
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
* [FAQ](ksp-faq.md)

## Supported libraries

The table below includes a list of popular libraries on Android and their various stages of support for KSP. If your library is missing, please feel free to submit a pull request.

|Library|Status|Tracking issue for KSP|
|---|---|---|
|Room|[Experimentally supported](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)|   |
|Moshi|[Experimentally supported](https://github.com/ZacSweers/MoshiX/tree/main/moshi-ksp)|   |
|Kotshi|[Experimentally supported](https://github.com/ansman/kotshi)|   |
|Lyricist|[Experimentally supported](https://github.com/adrielcafe/lyricist)|   |
|Auto Factory|Not yet supported|[Link](https://github.com/google/auto/issues/982)|
|Dagger|Not yet supported|[Link](https://github.com/google/dagger/issues/2349)|
|Hilt|Not yet supported|[Link](https://issuetracker.google.com/179057202)|
|Glide|Not yet supported|[Link](https://github.com/bumptech/glide/issues/4492)|
|DeeplinkDispatch|Not yet supported|[Link](https://github.com/airbnb/DeepLinkDispatch/issues/307)|
