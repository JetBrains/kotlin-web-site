[//]: # (title: Generics: in, out, where)

As in Java, classes in Kotlin can have type parameters:

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

In general, to create an instance of such a class, provide the type arguments:

```kotlin
val box: Box<Int> = Box<Int>(1)
```

But if the parameters may be inferred, for example, from the constructor arguments or by some other means, 
you can omit the type arguments:

```kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that it is Box<Int>
```

## Variance

One of the most tricky parts of Java's type system is wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)).
And Kotlin doesn't have any. Instead, it has two other things: declaration-site variance and type projections.

First, let's think about why Java needs those mysterious wildcards. The problem is explained in [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 31: _Use bounded wildcards to increase API flexibility_.
First, generic types in Java are _invariant_, meaning that `List<String>` is _not_ a subtype of `List<Object>`. 
Why so? If `List` was not _invariant_, it would have been no 
better than Java's arrays, since the following code would have compiled and caused an exception at runtime:

```java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! A compile-time error here saves us from a runtime exception later.
objs.add(1); // Put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```

So, Java prohibits such things in order to guarantee run-time safety. But this has some implications. For example, 
consider the `addAll()` method from `Collection` interface. What's the signature of this method? Intuitively, 
you'd put it this way:

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

But then, you are not able to do the following simple thing (which is perfectly safe):

```java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
    // !!! Would not compile with the naive declaration of addAll:
    // Collection<String> is not a subtype of Collection<Object>
}
```

(In Java, you learned this lesson the hard way, see [Effective Java, 3rd Edition](https://www.oracle.com/technetwork/java/effectivejava-136174.html), Item 28: _Prefer lists to arrays_)

That's why the actual signature of `addAll()` is the following:

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

The _wildcard type argument_ `? extends E` indicates that this method accepts a collection of objects of `E` 
_or some subtype of_ `E`, not just `E` itself. This means that you can safely _read_ `E`'s from items 
(elements of this collection are instances of a subclass of E), but _cannot write_ to 
it since you don't know what objects comply to that unknown subtype of `E`. 
In return for this limitation, you have the desired behaviour: `Collection<String>` _is_ a subtype of `Collection<? extends Object>`. 
In other words, the wildcard with an _extends_\-bound (_upper_ bound) makes the type _covariant_.

The key to understanding why this trick works is rather simple: if you can only _take_ items from a collection, 
then using a collection of `String`s and reading `Object`s from it is fine. Conversely, if you can only _put_ items 
into the collection, it's OK to take a collection of `Object`s and put `String`s into it: there is 
`List<? super String>` in Java, a _supertype_ of `List<Object>`.
 
The latter is called _contravariance_, and you can only call methods that take `String` as an argument on `List<? super String>` 
(for example, you can call `add(String)` or `set(int, String)`).  If you call something that returns `T` in `List<T>`, 
you don't get a `String`, but an `Object`.

Joshua Bloch calls those objects you only _read_ from _Producers_, and those you only _write_ to _Consumers_. He recommends: 

>"For maximum flexibility, use wildcard types on input parameters that represent producers or consumers", 
> and proposes the following mnemonic:
>
>_PECS stands for Producer-Extends, Consumer-Super._
>

> If you use a producer-object, say, `List<? extends Foo>`, you are not allowed to call `add()` or `set()` on this object, 
> but this does not mean that this object is _immutable_: for example, nothing prevents you from calling `clear()` 
> to remove all items from the list, since `clear()` does not take any parameters at all. 
>
>The only thing guaranteed by wildcards (or other types of variance) is _type safety_. Immutability is a completely different story.
> 
{type="note"}

### Declaration-site variance

Let's suppose that there is a generic interface `Source<T>` that does not have any methods that take `T` as a parameter, only methods that return `T`:

```java
// Java
interface Source<T> {
  T nextT();
}
```

Then, it would be perfectly safe to store a reference to an instance of `Source<String>` in a variable of 
type `Source<Object>` - there are no consumer-methods to call. But Java does not know this, and still prohibits it:

```java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```

To fix this, you should declare objects of type `Source<? extends Object>`, which is meaningless, 
because you can call all the same methods on such a variable as before, so there's no value added by the more complex type. 
But the compiler does not know that.

In Kotlin, there is a way to explain this sort of thing to the compiler. This is called _declaration-site variance_: 
you can annotate the _type parameter_ `T` of `Source` to make sure that it is only _returned_ (produced) from members 
of `Source<T>`, and never consumed. 
To do this, use the `out` modifier:

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // This is OK, since T is an out-parameter
    // ...
}
```

The general rule is: when a type parameter `T` of a class `C` is declared `out`, it may occur only in _out_-position
 in the members of `C`, but in return `C<Base>` can safely be a supertype of `C<Derived>`.

In other words, you can say that the class `C` is _covariant_ in the parameter `T`, or that `T` is a _covariant_ type parameter. 
You can think of `C` as being a _producer_ of `T`'s, and NOT a _consumer_ of `T`'s.

The `out` modifier is called a _variance annotation_, and  since it is provided at the type parameter declaration site, 
it provides _declaration-site variance_. 
This is in contrast with Java's _use-site variance_ where wildcards in the type usages make the types covariant.

In addition to `out`, Kotlin provides a complementary variance annotation: `in`. It makes a type parameter _contravariant_: 
it can only be consumed and never produced. A good example of a contravariant type is `Comparable`:

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
    // Thus, you can assign x to a variable of type Comparable<Double>
    val y: Comparable<Double> = x // OK!
}
```

The words _in_ and _out_ seem to be self-explaining (as they were successfully used in C# for quite some time already), 
thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:

**[The Existential](https://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)

## Type projections

### Use-site variance: type projections

It is very convenient to declare a type parameter T as `out` and avoid trouble with subtyping on the use site, 
but some classes _can't_ actually be restricted to only return `T`'s! 
A good example of this is `Array`:

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

This class cannot be either co\- or contravariant in `T`. And this imposes certain inflexibilities. Consider the following function:

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

This function is supposed to copy items from one array to another. Let's try to apply it in practice:

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ type is Array<Int> but Array<Any> was expected
```

Here you run into the same familiar problem: `Array<T>` is _invariant_ in `T`, thus neither of `Array<Int>` and `Array<Any>` 
is a subtype of the other. Why? Again, because copy may have an unexpected behavior, for example, it may attempt to 
write a `String` to `from`, and if you actually pass an array of `Int` there, a `ClassCastException`'ll be thrown sometime later.

To prohibit the `copy` function from _writing_ to `from`, do the following:

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

This is _type projection_, that means that `from` is not simply an array, but a restricted (_projected_) one.
You can only call those methods that return the type parameter `T`, in this case it means that you can only call `get()`. 
This is our approach to _use-site variance_, and corresponds to Java's `Array<? extends Object>`, but in a slightly simpler way.

You can project a type with `in` as well:

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` corresponds to Java's `Array<? super String>`. This means that you can pass an array of `CharSequence` 
or an array of `Object` to the `fill()` function.

### Star-projections

Sometimes you want to say that you know nothing about the type argument, but still want to use it in a safe way.
The safe way here is to define such a projection of the generic type, that every concrete instantiation of that generic 
type would be a subtype of that projection.

Kotlin provides so called _star-projection_ syntax for this:

 - For `Foo<out T : TUpper>`, where `T` is a covariant type parameter with the upper bound `TUpper`, `Foo<*>` is 
 equivalent to `Foo<out TUpper>`. It means that when the `T` is unknown you can safely _read_ values of `TUpper` from `Foo<*>`.
 - For `Foo<in T>`, where `T` is a contravariant type parameter, `Foo<*>` is equivalent to `Foo<in Nothing>`. It means 
 there is nothing you can _write_ to `Foo<*>` in a safe way when `T` is unknown.
 - For `Foo<T : TUpper>`, where `T` is an invariant type parameter with the upper bound `TUpper`, `Foo<*>` is equivalent 
 to `Foo<out TUpper>` for reading values and to `Foo<in Nothing>` for writing values.

If a generic type has several type parameters each of them can be projected independently.
For example, if the type is declared as `interface Function<in T, out U>` you can imagine the following star-projections:

* `Function<*, String>` means `Function<in Nothing, String>`.
* `Function<Int, *>` means `Function<Int, out Any?>`.
* `Function<*, *>` means `Function<in Nothing, out Any?>`.

> Star-projections are very much like Java's raw types, but safe.
>
{type="note"}

## Generic functions

Not only classes can have type parameters. Functions can, too. Type parameters are placed _before_ the name of the function:

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String {  // extension function
    // ...
}
```

To call a generic function, specify the type arguments at the call site _after_ the name of the function:

```kotlin
val l = singletonList<Int>(1)
```

Type arguments can be omitted if they can be inferred from the context, so the following example works as well:

```kotlin
val l = singletonList(1)
```

## Generic constraints

The set of all possible types that can be substituted for a given type parameter may be restricted by _generic constraints_.

### Upper bounds

The most common type of constraint is an _upper bound_ that corresponds to Java's `extends` keyword:

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

The type specified after a colon is the _upper bound_: only a subtype of `Comparable<T>` can be substituted for `T`. For example:

```kotlin
sort(listOf(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort(listOf(HashMap<Int, String>())) // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

The default upper bound (if none specified) is `Any?`. Only one upper bound can be specified inside the angle brackets.
If the same type parameter needs more than one upper bound, you need a separate _where_\-clause:

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

The passed type must satisfy all conditions of the `where` clause simultaneously. In the above example, the `T` type 
must implement _both_ `CharSequence` and `Comparable`.

## Type erasure

The type safety checks that Kotlin performs for generic declaration usages are only done at compile time.
At runtime, the instances of generic types do not hold any information about their actual type arguments.
The type information is said to be _erased_. For example, the instances of `Foo<Bar>` and `Foo<Baz?>` are erased to
just `Foo<*>`.

Therefore, there is no general way to check whether an instance of a generic type was created with certain type
arguments at runtime, and the compiler [prohibits such `is`-checks](typecasts.md#type-erasure-and-generic-type-checks).

Type casts to generic types with concrete type arguments, for example, `foo as List<String>`, cannot be checked at runtime.  
These [unchecked casts](typecasts.md#unchecked-casts) can be used when type safety is implied by the high-level 
program logic but cannot be inferred directly by the compiler. The compiler issues a warning on unchecked casts, and at 
runtime, only the non-generic part is checked (equivalent to `foo as List<*>`).
 
The type arguments of a generic function calls are also only checked at compile time. Inside the function bodies, 
the type parameters cannot be used for type checks, and type casts to type parameters (`foo as T`) are unchecked. However,
[reified type parameters](inline-functions.md#reified-type-parameters) of inline functions are substituted by the actual 
type arguments in the inlined function body at the call sites and thus can be used for type checks and casts,
with the same restrictions for instances of generic types as described above.
