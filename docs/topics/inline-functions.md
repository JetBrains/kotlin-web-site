[//]: # (title: Inline functions)

Using [higher-order functions](lambdas.md) imposes certain runtime penalties: each function is an object, and it captures a closure.
A closure means those variables that are accessed in the body of the function.
Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.

But it appears that in many cases this kind of overhead can be eliminated by inlining the lambda expressions.
The functions shown below are good examples of this situation. The `lock()` function could be easily inlined at call-sites.
Consider the following case:

```kotlin
lock(l) { foo() }
```

Instead of creating a function object for the parameter and generating a call, the compiler could emit the following code:

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

To make the compiler do this, you need to mark the `lock()` function with the `inline` modifier:

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

The `inline` modifier affects both the function itself and the lambdas passed to it: all of those will be inlined
into the call site.

Inlining may cause the generated code to grow; however, if you do it in a reasonable way (avoiding inlining large functions), 
it will pay off in performance, especially at "megamorphic" call-sites inside loops.

## `noinline`

In case you want only some of the lambdas passed to an inline function to be inlined, you can mark some of your function
parameters with the `noinline` modifier:

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

Inlinable lambdas can only be called inside the inline functions or passed as inlinable arguments,
but `noinline` ones can be manipulated in any way you like such as stored in fields or passed around.

> If an inline function has no inlinable function parameters and no
> [reified type parameters](#reified-type-parameters), the compiler will issue a warning, since inlining such functions is
> very unlikely to be beneficial (you can suppress the warning if you are sure the inlining is needed using the annotation `@Suppress("NOTHING_TO_INLINE")`).
>
{type="note"}

## Non-local returns

In Kotlin, you can only use a normal, unqualified `return` to exit a named function or an anonymous function.
To exit a lambda, use a [label](returns.md#return-at-labels). A bare `return` is forbidden
inside a lambda because a lambda cannot make the enclosing function `return`:

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // ERROR: cannot make `foo` return here
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

But if the function the lambda is passed to is inlined, the return can be inlined as well. So it is allowed:

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: the lambda is inlined
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

Such returns (located in a lambda, but exiting the enclosing function) are called *non-local* returns. This sort of 
construct usually occurs in loops, which inline functions often enclose:

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // returns from hasZeros
    }
    return false
}
```

Note that some inline functions may call the lambdas passed to them as parameters not directly from the function body,
but from another execution context, such as a local object or a nested function. In such cases, non-local control flow
is also not allowed in the lambdas. To indicate that, the lambda parameter needs to be marked with
the `crossinline` modifier:

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

> `break` and `continue` are not yet available in inlined lambdas, but we are planning to support them too.
>
{type="note"}

## Reified type parameters

Sometimes you need to access a type passed as a parameter:

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

Here, you walk up a tree and use reflection to check if a node has a certain type.
It’s all fine, but the call site is not very pretty:

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

What you actually want is simply pass a type to this function. You can call it like this:

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

To enable this, inline functions support *reified type parameters*, so you can write something like this:

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

You qualified the type parameter with the `reified` modifier to make it accessible inside the function,
almost as if it were a normal class. Since the function is inlined, no reflection is needed, normal operators like `!is`
and `as` are working now. Also, you can call it as mentioned above: `myTree.findParentOfType<MyTreeNodeType>()`.

Though reflection may not be needed in many cases, you can still use it with a reified type parameter:

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("\n"))
}
```

Normal functions (not marked as inline) cannot have reified parameters.
A type that does not have a run-time representation (for example, a non-reified type parameter or a fictitious type like `Nothing`)
cannot be used as an argument for a reified type parameter.

## Inline properties 

The `inline` modifier can be used on accessors of properties that don't have a backing field.
You can annotate individual property accessors:

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

You can also annotate an entire property, which marks both of its accessors as `inline`:

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

At the call site, inline accessors are inlined as regular inline functions.

## Restrictions for public API inline functions

When an inline function is `public` or `protected` and is not a part of a `private` or `internal` declaration, 
it is considered a [module](visibility-modifiers.md#modules)'s public API. It can be called in other modules and is inlined at such call sites as well.

This imposes certain risks of binary incompatibility caused by changes in the module that declares an inline function in 
case the calling module is not re-compiled after the change.

To eliminate the risk of such incompatibility being introduced by a change in *non*-public API of a module, the public 
API inline functions are not allowed to use non-public-API declarations, i.e. `private` and `internal` declarations and 
their parts, in their bodies.

An `internal` declaration can be annotated with `@PublishedApi`, which allows its use in public API inline functions. 
When an `internal` inline function is marked as `@PublishedApi`, its body is checked too, as if it were public.
 
