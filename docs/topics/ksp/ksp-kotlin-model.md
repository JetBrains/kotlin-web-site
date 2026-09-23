[//]: # (title: How KSP models Kotlin code)
[//]: # (description: Learn how the KSP API models Kotlin source code through a hierarchy of symbols.)

KSP represents source code as a hierarchy of symbols. Processors navigate this hierarchy to inspect declarations, types,
annotations, and other elements of the source code.

At the top level, a source file is represented by `KSFile`. A `KSFile` contains declarations such as classes, functions,
and properties, which can contain additional declarations. The following simplified hierarchy shows some of the most
common symbols and properties available through the KSP API:

```none
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
    KSFunctionDeclaration // top-level function
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

This hierarchy shows some of the common declarations in a source file. The KSP API provides additional symbols and
properties that aren't shown here.

The following diagram illustrates the relationships between the main KSP API types:

![The full class diagram of the KSP 2 model](ksp-class-diagram.svg){thumbnail="true" width="800" thumbnail-same-file="true"}

> [See the full-sized diagram](https://kotlinlang.org/docs/images/ksp-class-diagram.svg).
>
{style="note"}

You can find the complete API definition in the [KSP GitHub repository](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp).

## Type references and resolution

Type resolution is one of the most expensive operations in the KSP API. To avoid unnecessary work, processors resolve 
most type references explicitly. Properties that refer to types, such as `KSFunctionDeclaration.returnType` and 
`KSAnnotation.annotationType`, return a `KSTypeReference`.

```kotlin
interface KSFunctionDeclaration : ... {
    val returnType: KSTypeReference?
    // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
    val element: KSReferenceElement?
    fun resolve(): KSType
}
```

A `KSTypeReference` represents an unresolved type. It preserves the syntactic representation of the type as it appears 
in the source code. Its `KSReferenceElement` models the corresponding type element in Kotlin's grammar, including its 
annotations and modifiers.

A `KSReferenceElement` can be one of the following:

* `KSClassifierReference`, which provides information such as `referencedName()`.

* `KSCallableReference`, which provides information such as `receiverType`, `functionParameters`, and `returnType`.

You can inspect this information without resolving the reference.

If a processor generates code that references the same types as the source code, it doesn't need to resolve those types. 
Instead, it can use the type names available from `KSTypeReference` to generate the same syntactic type reference. KSP 
adds the generated source files to the compilation, and the Kotlin compiler later resolves and type-checks the type 
references together with the rest of the source code.

To access the type in Kotlin's type system, call `KSTypeReference.resolve()`. The returned `KSType` provides access to 
the declaration that defines the type:

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

Resolve a type reference only when you need information available from `KSType` or `KSDeclaration`. When possible, 
inspect the `KSReferenceElement` first. For example, you can use the `KSClassifierReference.referencedName()` function to filter 
irrelevant references before resolving them.

For function type references, most information is already available from `KSCallableReference`. Resolving a function 
type produces a type from the `Function0`, `Function1`, and related families, but usually provides no additional information. 
Resolve a function type when you need information such as the identity of its function prototype.
