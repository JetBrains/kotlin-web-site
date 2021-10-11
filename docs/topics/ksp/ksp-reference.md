[//]: # (title: Java annotation processing to KSP reference)

## Program elements

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP doesn't model packages as program elements |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## Types

KSP requires explicit type resolution, so some functionalities in Java can only be carried out by `KSType` and 
the corresponding elements before resolution.

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | N/A in KSP |
| `NullType` | | N/A in KSP |
| `PrimitiveType` | `KSBuiltIns` | Not exactly same as primitive type in Java |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin has only one type per catch block. `UnionType` is also not observable by even Java annotation processors |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## Misc

| **Java** | **Closest facility in KSP** | **Notes** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | Some can be found in builtins, otherwise check `KSClassDeclaration` for `DeclaredType` |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | Not needed in KSP |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | Some of the `utils` are also integrated into symbol interfaces |
| `Elements` | `Resolver` / `utils` | |

## Details

See how functionalities of Java annotation processing API can be carried out by KSP.

### AnnotationMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` is available for `KSClassDeclaration` only. Type arguments need to be supplied. |
| `getAnnotation` | To be implemented |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | Type check and cast following `ClassKind` or `FunctionKind` |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getDefaultValue` | To be implemented |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Not needed in Kotlin |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | Check whether parent declaration is an interface or not |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP equivalent</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td>Check <code>KSClassDeclaration.parentDeclaration</code> and <code>inner</code> modifier</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getConstantValue` | To be implemented |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> A `KSType` for a function is just a signature represented by the `FunctionN<R, T1, T2, ..., TN>` family.
>
{type="note"}

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Not needed in Kotlin |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getKind` | Compare with types in `KSBuiltIns` for primitive types, `Unit` type, otherwise declared types |

### TypeVariable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | To be decided. Only needed if capture is provided and explicit bound checking is needed. |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP equivalent</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP equivalent</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code> is to be implemented</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>To be decided, see <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a></td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>There is constant value, not expression</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>To be implemented</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>To be implemented</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>Package not supported, while package information can be retrieved. Operation on package is not possible for KSP</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>Package not supported</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>To be implemented</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.quailifiedName!!.asString() == Deprecated::class.quailifiedName 
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (member function of respective class)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP has basic <code>toString()</code> implementation on most classes</td>
    </tr>
</table>

### Types
{id="type-operations"}

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | Not needed |
| `capture` | To be decided |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | Depending on the context, `KSType.markNullable` could be useful |
| `getPrimitiveType` | Not needed, check for `KSBuiltins` |
| `getWildcardType` | Use `Variance` in places expecting `KSTypeArgument` |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | Not needed |
