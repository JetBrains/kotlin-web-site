[//]: # (title: How KSP models Kotlin code)

You can find the API definition in the [KSP GitHub repository](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp).
The diagram below shows an overview of how Kotlin is [modeled](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/) 
in KSP:

![class diagram](ksp-class-diagram.svg)

## Type and resolution

The resolution takes most of the cost of the underlying API implementation. So type references are designed to be 
resolved by processors explicitly (with a few exceptions). When a _type_, such as `KSFunctionDeclaration.returnType` 
or `KSAnnotation.annotationType`, is referenced, it is always a `KSTypeReference`, which is a `KSReferenceElement` with
annotations and modifiers.

```kotlin
interface KSFunctionDeclaration : /* ... */ {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

A `KSTypeReference` can be resolved to a `KSType`, which refers to a type in Kotlin's type system.

A `KSTypeReference` has a `KSReferenceElement`, which models Kotlin‘s program structure: namely, how the reference is 
written. It corresponds to the [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) element in Kotlin's grammar.

A `KSReferenceElement` can be a `KSClassifierReference` or `KSCallableReference`, which contains a lot of useful 
information without the need for resolution. For example, `KSClassifierReference` has `referencedName`, while 
`KSCallableReference` has `receiverType`, `functionArguments`, and `returnType`.

If the original declaration referenced by a `KSTypeReference` is needed, it can usually be found by resolving to 
`KSType` and accessing through `KSType.declaration`. Moving from where a type is mentioned to where its class is defined 
looks like this:

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

Type resolution is costly and therefore has explicit form. Some of the information obtained from resolution is already 
available in `KSReferenceElement`. For example, `KSClassifierReference.referencedName` can filter out a lot of elements 
that are not interesting. You should resolve type only if you need specific information from `KSDeclaration` or `KSType`.

Note that a `KSTypeReference` pointing to a function type has most of its information in its element. 
Although it can be resolved to the family of `Function0`, `Function1`, and so on, these resolutions don‘t bring any
more information than `KSCallableReference`. One use case for resolving function type references is dealing with the 
identity of the function's prototype.
