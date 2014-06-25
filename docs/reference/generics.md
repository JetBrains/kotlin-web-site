---
type: doc
layout: reference
category: "Syntax"
title: "Generics"
---

# Generics

As in *Java*, classes in [Kotlin] may have type parameters:

``` kotlin
class Box<T>(t : T) {
  var value = t
}
```

In general, to create an instance of such a class, one needs to provide the type parameters:

``` kotlin
val box : Box<Int> = Box<Int>(1)
```

But if the parameters may be inferred, e.g. from the constructor arguments or by some other means, one is allowed to omit the type parameters:

``` kotlin
val box = Box(1) // 1 has type Int, so the compiler figures out that we are talking about Box<Int>
```

## Variance

One of the most tricky parts of *Java*'s type system is wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html])). 
And Kotlin doesn't have any. Instead, it has two other things: declaration-site variance and type projections.

First, let's think about why *Java* needs those mysterious wildcards. The problem is explained in [Effective Java](http://java.sun.com/docs/books/effective/), [Item 28: *Use bounded wildcards to increase API flexibility*](http://java.sun.com/docs/books/effective/generics.pdf). 
First, generic types in *Java* are _invariant_, meaning that List<String> is _not_ a subtype of List<Object>. Why so? If List was not _invariant_, it would have been no 
better than *Java*'s arrays, cause the following code would have compiled and cause an exception at runtime:

``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! The cause of the upcoming problem sits here. Java prohibits this!
objs.add(1); // Here we put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```
So, *Java* prohibits such things in order to guarantee run-time safety. But this has some implications. For example, consider the addAll() method from Collection 
interface. What's the signature of this method? Intuitively, we'd put it this way:
``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<E> items);
}
```

But then, we would not be able to do the following simple thing (which is perfectly safe):

``` java
// Java
void copyAll(Collection<Object> to, Collection<String> from) {
  to.addAll(from); // !!! Would not compile with the naive declaration of addAll:
                   //       Collection<String> is not a subtype of Collection<Object>
}
```

(In *Java*, we learned this lesson the hard way, see [Effective Java](http://java.sun.com/docs/books/effective/)'s [Item 25: *Prefer lists to arrays*](http://java.sun.com/docs/books/effective/generics.pdf))


That's why the actual signature of addAll() is the following:

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

The _wildcard type argument_ "? extends T" indicates that this method accepts a collection of objects of _some subtype of_ T, not T itself. 
This means that we can safely _read_ T's from items (elements of this collection are instances of a subclass of T), but _cannot write_ to 
it since we do not know what objects comply to that unknown subtype of T. 
In return for this limitation, we have the desired behaviour: Collection<String> _is_ a subtype of Collection<? extends Object>. 
In "clever words", the wildcard with an *extends*\-bound (_upper_ bound) makes the type _covariant_.

The key to understanding why this trick works is rather simple: if you can only _take_ items from a collection, then a collection of String's 
and reading Object's from it is fine. Conversely, if you can only _put_ items into the collection, it's OK to take a collection of 
Object's and put String's into it: in *Java* we have 
List<? super String> a _supertype_ of List<Object>. 
The latter is called _contravariance_, and you can only call methods that take String as an argument on List<? super String> (e.g., you can call add(String) or set(int, String)), while 
if you call something that returns T in List<T>, you don't get a String, but an Object.

Joshua Bloch calls those objects you only _read_ from *producers*, and those you only _write_ to -- *consumers*. He recommends: "*For maximum flexibility, use wildcard types on input parameters that represent producers or consumers*", and proposes the following mnemonic:

*PECS stands for producer-extends, consumer-super.*

*NOTE*: if you use a producer-object, say, List<? extends Foo>, you are not allowed to call add() or set() on this object, but this does not mean 
that this object is _immutable_: for example, nothing prevents you to call clear() to remove all items from the list, since clear() 
does not take any parameters at all. The only thing guaranteed by wildcards (or other types of variance) is _type safety_. Immutability is a completely different story.

### Declaration-site variance

Suppose we have a generic interface Source<T> that does not have any methods that take T as a parameter, only methods that return T:

``` java
// Java
interface Source<T> {
  T nextT();
}
```

Then, it would be perfectly safe to store a reference to an instance of Source<String> in a variable of type Source<Object> -- there're no consumer-methods to call. But Java does not know this, and still prohibits:
``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```
To fix this, we have to declare objects of type Source<? extends Object> that is sort of meaningless, because we can call all the same methods on such a variable, as before, so there's no value added by the more complex type. But the compiler does not know that.

In [Kotlin], there is a way to explain this sort of thing to the compiler. This is called _declaration-site variance_: we can annotate the _type parameter_ T of Source to make sure that it is only _returned_ (produced) from members of Source<T>, and never consumed. To do this we provide the *out* modifier:

``` kotlin
abstract class Source<out T> {
  fun nextT() : T
}

fun demo(strs : Source<String>) {
  val objects : Source<Any> = strs // This is OK, since T is an out-parameter
  // ...
}
```

The general rule is: when a type parameter T of a class C is declared *out*, it may occur only in *out*\-position in the members of C, but in return C<Base> can safely be a supertype of C<Derived>.

In "clever words" they say that the class C is _covariant_ in the parameter T, or that T is a _covariant_ type parameter. You can think of C as being a _producer_ of T's, and NOT a _consumer_ of T's.

The *out* modifier is called a _variance annotation_, and  since it is provided at the type parameter declaration site, we talk about _declaration-site variance_. This is in contrast with *Java*'s _use-site variance_ where wildcards in the type usages make the types covariant.

In addition to *out*, [Kotlin] provides a complementary variance annotation: *in*. It makes a type parameter _contravariant_: it can only be consumed and never produced. A good example of a contravariant class is Comparable:

``` kotlin
abstract class Comparable<in T> {
  fun compareTo(other : T) : Int
}

fun demo(x : Comparable<Number>) {
  x.compareTo(1.0) // 1.0 has type Double, which is a subtype of Number
  // Thus, we can assign x to a variable of type Comparable<Double>
  val y : Comparable<Double> = x // OK!
}
```

We believe that the word *in* and *out* are self-explainig (as they were successfully used in C# for quite some time already), thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:

*The* *[Existential|http://en.wikipedia.org/wiki/Existentialism]* *Transformation: Consumer in, Producer out\!* :-)

{anchor:Type projections}

### Use-site variance: Type projections

It is very convenient to declare a type parameter T as *out* and have no trouble with subtyping on the use site. Yes, it is, when the class in question _can_ actually be restricted to only return T's, but what if it can't? A good example of this is Array:

``` kotlin
class Array<T>(val length : Int) {
  fun get(index : Int) : T { /* ... */ }
  fun set(index : Int, value : T) { /* ... */ }
}
```

This class cannot be either co\- or contravariant in T. And this imposes certain inflexibilities. Consider the following function:

``` kotlin
fun copy(from : Array<Any>, to : Array<Any>) {
  assert {from.length == to.length}
  for (i in from.indices)
    to[i] = from[i]
}
```

This function is supposed to copy item from one array to another. Let's try to apply it in practice:
``` kotlin
val ints : Array<Int> = array(1, 2, 3)
val any = Array<Any>(3)
copy<error desc="The arguments (Array<int>, Array<Any>) do not match the signature 'copy(Array<Any>, Array<Any>)'">(ints, any)</error> // Error: expects (Array<Any>, Array<Any>)
```

Here we run into the same familiar problem: Array<T> is _invariant_ in T, thus neither of Array<Int> and Array<Any> is a subtype of the other. Why? Again, because copy _might_ be doing bad things, i.e. it might attempt to _write_, say, a String to from, and if we actually passed an array of Int there, a ClassCastException would have been thrown sometime later...
Then, the only thing we want to ensure is that copy() does not do any bad things. We want to prohibit it to _write_ to from, and we can:

``` kotlin
fun copy(from : Array<out Any>, to : Array<Any>) {
 // ...
}
```

What has happened here is called _type projection_: we said that from is not simply an array, but a restricted (_projected_) one: we can only call those methods that return the type parameter T, in this case it means that we can only call get(). This is our approach to _use-site variance_, and corresponds to *Java*'s Array<? extends Object>, but in a little simpler way.

You can project a type with *in* as well:
``` kotlin
fun fill(dest : Array<in String>, value : String) {
  // ...
}
```
Array<in String> corresponds to Java's Array<? super String>, i.e. you can pass an array of CharSequence or an array of Object to the fill() function.

### Star-projections

Sometimes you want to say that you know nothing about the type argument, but still want to use it in a safe way. The safe way here is to say that we are dealing with an *out*\-projection (the object does not consume any values of unknown types), and that this projection is with the upper-bound of the corresponding parameter, i.e. *out* Any? for most cases. [Kotlin] provides a shortahnd syntax for this, that we call a _star-projection_: Foo<*> means Foo<out Bar> where Bar is the upperbound for Foo's type parameter.

*Note*: star-projections are very much like *Java*'s raw types, but safe.

# Generic functions

Not only classes can have type parameters. Functions can, too. Usually, one places the type parameters in angle brackets _after_ the name of the function:

``` kotlin
fun singletonList<T>(item : T) : List<T> {
  // ...
}
```

But for [Extension functions] it may be necessary to declare type parameters before specifying the receiver type, so [Kotlin] allows the alternative syntax:

``` kotlin
fun <T> T.basicToString() : String {
  return typeinfo.typeinfo(this) + "@" + System.identityHashCode(this)
}
```

If type parameters are passed explicitly at the call site, they can be only specified _after_ the name of the function:
``` kotlin
val l = singletonList<Int>(1)
```

# Generic constraints

The set of all possible types that can be substituted for a given type parameter may be restricted by _generic constraints_.

## Upper bounds

The most common type a constraint is an _upper bound_ that corresponds to *Java*'s *extends* keyword:

``` kotlin
fun sort<T : Comparable<T>>(list : List<T>) {
  // ...
}
```

The type specified after a colon is the _upper bound_: only subtype of Comparable<T> may be substituted for T. For example

``` kotlin
sort(list(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort<error desc="Argument type mismatch">(list(HashMap<Int, String>()))</error> // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

The default upper bound (if none specified) is Any?. There can be not more than one upper bound specified directly inside the angle brackets. If same type parameter needs more than one upper bound, we need a separate *where*\-clause:
``` kotlin
fun cloneWhenGreater<T : Comparable<T>>(list : List<T>, threshold : T) : List<T>
    where T : Cloneable {
  return list when {it > threshold} map {it.clone()}
}
```

## Class objects

Another type of generic constraints are *class object* constraints. They restrict the properties of a [class object|Classes and Inheritance#Class objects] of the root class of a type being substituted for T.

Consider the following example. Suppose, we have a class Default that has a property default that holds a _default_ value to be used for this type:

``` kotlin
abstract class Default<T> {
  val default : T
}
```

For example, the class Int could extend Default in the following way:
``` kotlin
class Int {
  class object : Default<Int> {
    override val default = 0
  }
  // ...
}
```

Now, let's consider a function that takes a list of [nullable|Null-safety] T's, i.e. T?, and replaces all the null's with the default values:

``` kotlin
fun replaceNullsWithDefaults<T : Any>(list : List<T?>) : List<T> {
  return list map {
    if (it == null)
      <error desc="The type T does not have a class object">T</error>.default // For now, we don't know if T's class object has such a property
    else it
  }
}
```

For this function to compile, we need to specify a type constraint that requires a *class object* of T to be of a subtype of Default<T>:

``` kotlin
fun replaceNullsWithDefaults<T : Any>(list : List<T?>) : List<T>
    where class object T : Default<T> {
// ...
```

Now the compiler knows that T (as a *class object* reference) has the *default* property, and we can access it.

{note:title=Class object bounds are not supported yet}See the corresponding [issue|http://youtrack.jetbrains.com/issue/KT-1437].{note}

