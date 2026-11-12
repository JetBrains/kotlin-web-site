[//]: # (title: Java annotation processing to KSP reference)

<web-summary>See how the Java annotation processing API maps to KSP, with KSP equivalents 
for program elements, types, and common operations.</web-summary>

The following tables map the Java annotation processing API to its equivalents in Kotlin Symbol Processing (KSP).

## Program elements

| **Java**               | **Closest facility in KSP**                  | **Notes**                                      |
| ---------------------- | -------------------------------------------- | ---------------------------------------------- |
| `AnnotationMirror`     | `KSAnnotation`                               |                                                |
| `AnnotationValue`      | `KSValueArgument`                            |                                                |
| `Element`              | `KSDeclaration` / `KSDeclarationContainer`   |                                                |
| `ExecutableElement`    | `KSFunctionDeclaration`                      |                                                |
| `PackageElement`       | `KSFile`                                     | KSP doesn't model packages as program elements |
| `Parameterizable`      | `KSDeclaration`                              |                                                |
| `QualifiedNameable`    | `KSDeclaration`                              |                                                |
| `TypeElement`          | `KSClassDeclaration`                         |                                                |
| `TypeParameterElement` | `KSTypeParameter`                            |                                                |
| `VariableElement`      | `KSValueParameter` / `KSPropertyDeclaration` |                                                |

## Types

KSP requires explicit type resolution, so some functionality in Java can only be carried out by `KSType` and
the corresponding elements before resolution.

| **Java**           | **Closest facility in KSP**        | **Notes**                                                                                                       |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `ArrayType`        | `KSBuiltIns.arrayType`             |                                                                                                                 |
| `DeclaredType`     | `KSType` / `KSClassifierReference` |                                                                                                                 |
| `ErrorType`        | `KSType.isError`                   |                                                                                                                 |
| `ExecutableType`   | `KSType` / `KSCallableReference`   |                                                                                                                 |
| `IntersectionType` | `KSType` / `KSTypeParameter`       |                                                                                                                 |
| `NoType`           | `KSBuiltIns.unitType`              | Kotlin uses `Unit` instead of `void`. Other `NoType` kinds have no equivalent in KSP.                           |
| `NullType`         |                                    | N/A in KSP                                                                                                      |
| `PrimitiveType`    | `KSBuiltIns`                       | Not exactly the same as primitive type in Java                                                                  |
| `ReferenceType`    | `KSTypeReference`                  |                                                                                                                 |
| `TypeMirror`       | `KSType`                           |                                                                                                                 |
| `TypeVariable`     | `KSTypeParameter`                  |                                                                                                                 |
| `UnionType`        | N/A                                | Kotlin has only one type per catch block. `UnionType` is not observable even by Java annotation processors.     |
| `WildcardType`     | `KSType` / `KSTypeArgument`        |                                                                                                                 |

## Miscellaneous

| **Java**                       | **Closest facility in KSP**     | **Notes**                                                                              |
| ------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------- |
| `Name`                         | `KSName`                        |                                                                                        |
| `ElementKind`                  | `ClassKind` / `FunctionKind`    |                                                                                        |
| `Modifier`                     | `Modifier`                      |                                                                                        |
| `NestingKind`                  | `ClassKind` / `FunctionKind`    |                                                                                        |
| `AnnotationValueVisitor`       |                                 |                                                                                        |
| `ElementVisitor`               | `KSVisitor`                     |                                                                                        |
| `AnnotatedConstruct`           | `KSAnnotated`                   |                                                                                        |
| `TypeVisitor`                  |                                 |                                                                                        |
| `TypeKind`                     | `KSBuiltIns`                    | Some can be found in builtins, otherwise check `KSClassDeclaration` for `DeclaredType` |
| `ElementFilter`                | `Collection.filterIsInstance()` |                                                                                        |
| `ElementKindVisitor`           | `KSVisitor`                     |                                                                                        |
| `ElementScanner`               | `KSTopDownVisitor`              |                                                                                        |
| `SimpleAnnotationValueVisitor` |                                 | Not needed in KSP                                                                      |
| `SimpleElementVisitor`         | `KSVisitor`                     |                                                                                        |
| `SimpleTypeVisitor`            |                                 |                                                                                        |
| `TypeKindVisitor`              |                                 |                                                                                        |
| `Types`                        | `Resolver` / `utils`            | Some of the `utils` are also integrated into symbol interfaces                         |
| `Elements`                     | `Resolver` / `utils`            |                                                                                        |

## Details

The following tables show how to carry out individual operations of the Java annotation processing API with KSP.

> Some of the listed KSP functions, such as `getAnnotationsByType()`, `mapToJvmSignature()`, and
> `getDeclarationsFromPackage()`, are experimental. To use them, opt in with `@OptIn(KspExperimental::class)`.
>
{style="note"}

### `AnnotationMirror`

| **Java**            | **KSP equivalent**            |
| ------------------- | ----------------------------- |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues`  | `ksAnnotation.arguments`      |

### `AnnotationValue`

| **Java**   | **KSP equivalent**      |
| ---------- | ----------------------- |
| `getValue` | `ksValueArgument.value` |

### `Element`

| **Java**               | **KSP equivalent**                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `asType`               | `ksClassDeclaration.asType(...)` is available for `KSClassDeclaration` only. Type arguments need to be supplied. |
| `getAnnotation`        | `ksAnnotated.getAnnotationsByType()`                                                                             |
| `getAnnotationMirrors` | `ksDeclaration.annotations`                                                                                      |
| `getEnclosedElements`  | `ksDeclarationContainer.declarations`                                                                            |
| `getEnclosingElement`  | `ksDeclaration.parentDeclaration`                                                                                |
| `getKind`              | Type check and cast following `ClassKind` or `FunctionKind`                                                      |
| `getModifiers`         | `ksDeclaration.modifiers`                                                                                        |
| `getSimpleName`        | `ksDeclaration.simpleName`                                                                                       |

### `ExecutableElement`

| **Java**            | **KSP equivalent**                                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `getDefaultValue`   | `ksAnnotation.defaultArguments` for annotation members                                                                            |
| `getParameters`     | `ksFunctionDeclaration.parameters`                                                                                                |
| `getReceiverType`   | `ksFunctionDeclaration.parentDeclaration` for member functions, `ksFunctionDeclaration.extensionReceiver` for extension functions |
| `getReturnType`     | `ksFunctionDeclaration.returnType`                                                                                                |
| `getSimpleName`     | `ksFunctionDeclaration.simpleName`                                                                                                |
| `getThrownTypes`    | Not needed in Kotlin                                                                                                              |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters`                                                                                            |
| `isDefault`         | Check whether the parent declaration is an interface                                                                              |
| `isVarArgs`         | `ksFunctionDeclaration.parameters.any { it.isVararg }`                                                                            |

### `Parameterizable`

| **Java**            | **KSP equivalent**                     |
| ------------------- | -------------------------------------- |
| `getTypeParameters` | `ksDeclaration.typeParameters`         |

### `QualifiedNameable`

| **Java**           | **KSP equivalent**            |
| ------------------ | ----------------------------- |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### `TypeElement`

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
// Resolves each supertype to check whether it's an interface
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
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
// Resolves each supertype to find the superclass
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .firstOrNull { (it.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### `TypeParameterElement`

| **Java**              | **KSP equivalent**                  |
| --------------------- | ----------------------------------- |
| `getBounds`           | `ksTypeParameter.bounds`            |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement`   | `ksTypeParameter.parentDeclaration` |

### `VariableElement`

| **Java**              | **KSP equivalent**                                                  |
| --------------------- | ------------------------------------------------------------------- |
| `getConstantValue`    | Not supported. KSP doesn't provide access to property initializers. |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration`                                |
| `getSimpleName`       | `ksValueParameter.simpleName`                                       |

### `ArrayType`

| **Java**           | **KSP equivalent**         |
| ------------------ | -------------------------- |
| `getComponentType` | `ksType.arguments.first()` |

### `DeclaredType`

| **Java**           | **KSP equivalent**                     |
| ------------------ | -------------------------------------- |
| `asElement`        | `ksType.declaration`                   |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments`                     |

### `ExecutableType`

> A `KSType` for a function is just a signature represented by the `FunctionN<T1, T2, ..., TN, R>` family.
>
{style="note"}

| **Java**            | **KSP equivalent**                                                                      |
| ------------------- | --------------------------------------------------------------------------------------- |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType`   | `ksFunctionDeclaration.parentDeclaration.asType(...)`                                   |
| `getReturnType`     | `ksType.declaration.typeParameters.last()`                                              |
| `getThrownTypes`    | Not needed in Kotlin                                                                    |
| `getTypeVariables`  | `ksFunctionDeclaration.typeParameters`                                                  |

### `IntersectionType`

| **Java**    | **KSP equivalent**       |
| ----------- | ------------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### `TypeMirror`

| **Java**  | **KSP equivalent**                                                                            |
| --------- | --------------------------------------------------------------------------------------------- |
| `getKind` | Compare with types in `KSBuiltIns` for primitive types, `Unit` type, otherwise declared types |

### `TypeVariable`

| **Java**        | **KSP equivalent**                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| `asElement`     | `ksType.declaration`                                                                                          |
| `getLowerBound` | Not supported. Kotlin type parameters can't declare lower bounds, and KSP doesn't support capture conversion. |
| `getUpperBound` | `ksTypeParameter.bounds`                                                                                      |

### `WildcardType`

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

### `Elements`

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP equivalent</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclaration.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>ksClassDeclaration.getAllFunctions()</code> and <code>ksClassDeclaration.getAllProperties()</code></td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>No direct equivalent. <code>resolver.mapToJvmSignature()</code> returns the JVM descriptor of a class, such as <code>Lcom/example/Outer$Inner;</code>, which contains its <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">binary name</a></td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>KSP provides constant values, not expressions</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td><code>ksDeclaration.docString</code></td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td><code>ksAnnotation.arguments</code>, which includes the default values of omitted arguments</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString()</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>Not supported. To get the declarations in a package, use <code>resolver.getDeclarationsFromPackage()</code>.</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td><code>ksDeclaration.packageName</code></td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName()</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>Not supported</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
ksDeclaration.annotations.any {
    it.annotationType.resolve().declaration.qualifiedName?.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>resolver.overrides()</code></td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP has a basic <code>toString()</code> implementation on most classes</td>
    </tr>
</table>

### `Types`
{id="type-operations"}

| **Java**           | **KSP equivalent**                                                                   |
| ------------------ | ------------------------------------------------------------------------------------ |
| `asElement`        | `ksType.declaration`                                                                 |
| `asMemberOf`       | `ksPropertyDeclaration.asMemberOf()` / `ksFunctionDeclaration.asMemberOf()`          |
| `boxedClass`       | Not needed                                                                           |
| `capture`          | Not supported                                                                        |
| `contains`         | `KSType.isAssignableFrom()`                                                          |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes`                              |
| `erasure`          | `ksType.starProjection()`                                                            |
| `getArrayType`     | `ksBuiltIns.arrayType.replace(...)`                                                  |
| `getDeclaredType`  | `ksClassDeclaration.asType(...)`                                                     |
| `getNoType`        | `ksBuiltIns.unitType` / `null`                                                       |
| `getNullType`      | Depending on the context, `KSType.makeNullable()` could be useful                    |
| `getPrimitiveType` | Not needed, check for `KSBuiltIns`                                                   |
| `getWildcardType`  | Use `Variance` in places expecting `KSTypeArgument`                                  |
| `isAssignable`     | `ksType.isAssignableFrom()`                                                          |
| `isSameType`       | `ksType.equals()`                                                                    |
| `isSubsignature`   | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype`        | `ksType.isAssignableFrom()`                                                          |
| `unboxedType`      | Not needed                                                                           |

## See also

* [How KSP models Kotlin code](ksp-kotlin-model.md)
* [Migrate from kapt to KSP](ksp-kapt-migration.md)
* [An example project with a Java annotation processor written alongside its KSP counterpart](https://github.com/google/ksp/tree/main/examples/playground/processors/src/main/kotlin)
