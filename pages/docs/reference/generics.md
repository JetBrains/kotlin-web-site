---
type: doc
layout: reference
category: "Syntax"
title: "Generics: in, out, where"
---

# Generics

As in Java, classes in Kotlin may have type parameters:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

</div>

In general, to create an instance of such a class, we need to provide the type arguments:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val box: Box<Int> = Box<Int>(1)
```

</div>

But if the parameters may be inferred, e.g. from the constructor arguments or by some other means, one is allowed to omit the type arguments:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that we are talking about Box<Int>
```

</div>

## Variance

One of the most tricky parts of Java's type system is wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
And Kotlin doesn't have any. Instead, it has two other things: declaration-site variance and type projections.

First, let's think about why Java needs those mysterious wildcards. The problem is explained in [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 31: *Use bounded wildcards to increase API flexibility*.
First, generic types in Java are **invariant**, meaning that `List<String>` is **not** a subtype of `List<Object>`. 
Why so? If List was not **invariant**, it would have been no 
better than Java's arrays, since the following code would have compiled and caused an exception at runtime:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! A compile-time error here saves us from a runtime exception later
objs.add(1); // Here we put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```

</div>

So, Java prohibits such things in order to guarantee run-time safety. But this has some implications. For example, consider the `addAll()` method from `Collection` 
interface. What's the signature of this method? Intuitively, we'd put it this way:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```

</div>

But then, we can't do the following simple thing (which is perfectly safe):

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from);
  // !!! Would not compile with the naive declaration of addAll:
  // Collection<String> is not a subtype of Collection<Object>
}
```

</div>

(In Java, we learned this lesson the hard way, see [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 28: *Prefer lists to arrays*)


That's why the actual signature of `addAll()` is the following:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

</div>

The **wildcard type argument** `? extends E` indicates that this method accepts a collection of objects of `E` *or some subtype of* `E`, not just `E` itself. 
This means that we can safely **read** `E`'s from items (elements of this collection are instances of a subclass of E), but **cannot write** to 
it since we do not know what objects comply to that unknown subtype of `E`. 
In return for this limitation, we have the desired behaviour: `Collection<String>` *is* a subtype of `Collection<? extends Object>`. 
In "clever words", the wildcard with an **extends**\-bound (**upper** bound) makes the type **covariant**.

The key to understanding why this trick works is rather simple: if you can only **take** items from a collection, then using a collection of `String`s
and reading `Object`s from it is fine. Conversely, if you can only _put_ items into the collection, it's OK to take a collection of
`Object`s and put `String`s into it: in Java we have `List<? super String>` a **supertype** of `List<Object>`.
 
The latter is called **contravariance**, and you can only call methods that take String as an argument on `List<? super String>` 
(e.g., you can call `add(String)` or `set(int, String)`), while 
if you call something that returns `T` in `List<T>`, you don't get a `String`, but an `Object`.

Joshua Bloch calls those objects you only **read** from **Producers**, and those you only **write** to **Consumers**. He recommends: "*For maximum flexibility, use wildcard types on input parameters that represent producers or consumers*", and proposes the following mnemonic:

*PECS stands for Producer-Extends, Consumer-Super.*

*NOTE*: if you use a producer-object, say, `List<? extends Foo>`, you are not allowed to call `add()` or `set()` on this object, but this does not mean 
that this object is **immutable**: for example, nothing prevents you from calling `clear()` to remove all items from the list, since `clear()` 
does not take any parameters at all. The only thing guaranteed by wildcards (or other types of variance) is **type safety**. Immutability is a completely different story.

### Declaration-site variance

Suppose we have a generic interface `Source<T>` that does not have any methods that take `T` as a parameter, only methods that return `T`:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
interface Source<T> {
  T nextT();
}
```

</div>

Then, it would be perfectly safe to store a reference to an instance of `Source<String>` in a variable of type `Source<Object>` -- there are no consumer-methods to call. But Java does not know this, and still prohibits it:

<div class="sample" markdown="1" mode="java" theme="idea">

``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```

</div>

To fix this, we have to declare objects of type `Source<? extends Object>`, which is sort of meaningless, because we can call all the same methods on such a variable as before, so there's no value added by the more complex type. But the compiler does not know that.

In Kotlin, there is a way to explain this sort of thing to the compiler. This is called **declaration-site variance**: we can annotate the **type parameter** `T` of Source to make sure that it is only **returned** (produced) from members of `Source<T>`, and never consumed. 
To do this we provide the **out** modifier:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // This is OK, since T is an out-parameter
    // ...
}
```

</div>

The general rule is: when a type parameter `T` of a class `C` is declared **out**, it may occur only in **out**\-position in the members of `C`, but in return `C<Base>` can safely be a supertype 
of `C<Derived>`.

In "clever words" they say that the class `C` is **covariant** in the parameter `T`, or that `T` is a **covariant** type parameter. 
You can think of `C` as being a **producer** of `T`'s, and NOT a **consumer** of `T`'s.

The **out** modifier is called a **variance annotation**, and  since it is provided at the type parameter declaration site, we talk about **declaration-site variance**. 
This is in contrast with Java's **use-site variance** where wildcards in the type usages make the types covariant.

In addition to **out**, Kotlin provides a complementary variance annotation: **in**. It makes a type parameter **contravariant**: it can only be consumed and never 
produced. A good example of a contravariant type is `Comparable`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
    // Thus, we can assign x to a variable of type Comparable<Double>
    val y: Comparable<Double> = x // OK!
}
```

</div>

We believe that the words **in** and **out** are self-explaining (as they were successfully used in C# for quite some time already), 
thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:

**[The Existential](http://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)

## Type projections

### Use-site variance: Type projections

It is very convenient to declare a type parameter T as *out* and avoid trouble with subtyping on the use site, but some classes **can't** actually be restricted to only return `T`'s! 
A good example of this is Array:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Array<T>(val size: Int) {
    fun get(index: Int): T { ... }
    fun set(index: Int, value: T) { ... }
}
```

</div>

This class cannot be either co\- or contravariant in `T`. And this imposes certain inflexibilities. Consider the following function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

</div>

This function is supposed to copy items from one array to another. Let's try to apply it in practice:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ type is Array<Int> but Array<Any> was expected
```

</div>

Here we run into the same familiar problem: `Array<T>` is **invariant** in `T`, thus neither of `Array<Int>` and `Array<Any>` 
is a subtype of the other. Why? Again, because copy **might** be doing bad things, i.e. it might attempt to **write**, say, a String to `from`,
and if we actually passed an array of `Int` there, a `ClassCastException` would have been thrown sometime later.

Then, the only thing we want to ensure is that `copy()` does not do any bad things. We want to prohibit it from **writing** to `from`, and we can:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

</div>

What has happened here is called **type projection**: we said that `from` is not simply an array, but a restricted (**projected**) one: we can only call those methods that return the type parameter 
`T`, in this case it means that we can only call `get()`. This is our approach to **use-site variance**, and corresponds to Java's `Array<? extends Object>`, 
but in a slightly simpler way.

You can project a type with **in** as well:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

</div>

`Array<in String>` corresponds to Java's `Array<? super String>`, i.e. you can pass an array of `CharSequence` or an array of `Object` to the `fill()` function.

### Star-projections

Sometimes you want to say that you know nothing about the type argument, but still want to use it in a safe way.
The safe way here is to define such a projection of the generic type, that every concrete instantiation of that generic type would be a subtype of that projection.

Kotlin provides so called **star-projection** syntax for this:

 - For `Foo<out T : TUpper>`, where `T` is a covariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>`. It means that when the `T` is unknown you can safely *read* values of `TUpper` from `Foo<*>`.
 - For `Foo<in T>`, where `T` is a contravariant type parameter, `Foo<*>` is equivalent to `Foo<in Nothing>`. It means there is nothing you can *write* to `Foo<*>` in a safe way when `T` is unknown.
 - For `Foo<T : TUpper>`, where `T` is an invariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent to `Foo<out TUpper>` for reading values and to `Foo<in Nothing>` for writing values.

If a generic type has several type parameters each of them can be projected independently.
For example, if the type is declared as `interface Function<in T, out U>` we can imagine the following star-projections:

 - `Function<*, String>` means `Function<in Nothing, String>`;
 - `Function<Int, *>` means `Function<Int, out Any?>`;
 - `Function<*, *>` means `Function<in Nothing, out Any?>`.

*Note*: star-projections are very much like Java's raw types, but safe.

## Generic functions

Not only classes can have type parameters. Functions can, too. Type parameters are placed **before** the name of the function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String {  // extension function
    // ...
}
```

</div>

To call a generic function, specify the type arguments at the call site **after** the name of the function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val l = singletonList<Int>(1)
```

</div>

Type arguments can be omitted if they can be inferred from the context, so the following example works as well:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val l = singletonList(1)
```

</div>

## Generic constraints

The set of all possible types that can be substituted for a given type parameter may be restricted by **generic constraints**.

### Upper bounds

The most common type of constraint is an **upper bound** that corresponds to Java's *extends* keyword:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

</div>

The type specified after a colon is the **upper bound**: only a subtype of `Comparable<T>` may be substituted for `T`. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

</div>

The default upper bound (if none specified) is `Any?`. Only one upper bound can be specified inside the angle brackets.
If the same type parameter needs more than one upper bound, we need a separate **where**\-clause:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

</div>

The passed type must satisfy all conditions of the `where` clause simultaneously. In the above example, the `T` type must implement *both* `CharSequence` and `Comparable`.

## Type erasure

The type safety checks that Kotlin performs for generic declaration usages are only done at compile time.
At runtime, the instances of generic types do not hold any information about their actual type arguments.
The type information is said to be *erased*. For example, the instances of `Foo<Bar>` and `Foo<Baz?>` are erased to
just `Foo<*>`.

Therefore, there is no general way to check whether an instance of a generic type was created with certain type
arguments at runtime, and the compiler [prohibits such *is*{: .keyword }-checks](typecasts.html#type-erasure-and-generic-type-checks).

Type casts to generic types with concrete type arguments, e.g. `foo as List<String>`, cannot be checked at runtime.  
These [unchecked casts](typecasts.html#unchecked-casts) can be used when type safety is implied by the high-level 
program logic but cannot be inferred directly by the compiler. The compiler issues a warning on unchecked casts, and at 
runtime, only the non-generic part is checked (equivalent to `foo as List<*>`).
 
The type arguments of generic function calls are also only checked at compile time. Inside the function bodies, 
the type parameters cannot be used for type checks, and type casts to type parameters (`foo as T`) are unchecked. However,
[reified type parameters](inline-functions.html#reified-type-parameters) of inline functions are substituted by the actual 
type arguments in the inlined function body at the call sites and thus can be used for type checks and casts,
with the same restrictions for instances of generic types as described above.
