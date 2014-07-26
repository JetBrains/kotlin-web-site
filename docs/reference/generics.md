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

One of the most tricky parts of *Java*'s type system is wildcard types (see [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)). 
And Kotlin doesn't have any. Instead, it has two other things: declaration-site variance and type projections.

First, let's think about why *Java* needs those mysterious wildcards. The problem is explained in [Effective Java](http://java.sun.com/docs/books/effective/), [Item 28: *Use bounded wildcards to increase API flexibility*](http://java.sun.com/docs/books/effective/generics.pdf). 
First, generic types in Java are **invariant**, meaning that *List\<String\>*{: .keyword } is **not** a subtype of *List\<Object\>*{: .keyword }. 
Why so? If List was not **invariant**, it would have been no 
better than Java's arrays, cause the following code would have compiled and cause an exception at runtime:

``` java
// Java
List<String> strs = new ArrayList<String>();
List<Object> objs = strs; // !!! The cause of the upcoming problem sits here. Java prohibits this!
objs.add(1); // Here we put an Integer into a list of Strings
String s = strs.get(0); // !!! ClassCastException: Cannot cast Integer to String
```
So, Java prohibits such things in order to guarantee run-time safety. But this has some implications. For example, consider the *addAll()*{: .keyword } method from *Collection*{: .keyword } 
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

(In Java, we learned this lesson the hard way, see [Effective Java](http://java.sun.com/docs/books/effective/)'s [Item 25: *Prefer lists to arrays*](http://java.sun.com/docs/books/effective/generics.pdf))


That's why the actual signature of *addAll()*{: .keyword } is the following:

``` java
// Java
interface Collection<E> ... {
  void addAll(Collection<? extends E> items);
}
```

The **wildcard type argument** *? extends T*{: .keyword } indicates that this method accepts a collection of objects of *some subtype of* *T*{: .keyword }, not *T*{: .keyword } itself. 
This means that we can safely **read** *T*{: .keyword }'s from items (elements of this collection are instances of a subclass of T), but **cannot write** to 
it since we do not know what objects comply to that unknown subtype of *T*{: .keyword }. 
In return for this limitation, we have the desired behaviour: *Collection\<String\>*{: .keyword } *is* a subtype of *Collection\<? extends Object\>*{: .keyword }. 
In "clever words", the wildcard with an **extends**\-bound (**upper** bound) makes the type **covariant**.

The key to understanding why this trick works is rather simple: if you can only **take** items from a collection, then a collection of String's 
and reading Object's from it is fine. Conversely, if you can only _put_ items into the collection, it's OK to take a collection of 
Object's and put String's into it: in Java we have 
*List\<? super String\>*{: .keyword } a **supertype** of *List\<Object\>*{: .keyword }.
 
The latter is called **contravariance**, and you can only call methods that take String as an argument on *List\<? super String\>*{: .keyword } 
(e.g., you can call *add(String)*{: .keyword } or *set(int, String)*{: .keyword }), while 
if you call something that returns *T*{: .keyword } in *List\<T\>*{: .keyword }, you don't get a *String*{: .keyword }, but an *Object*{: .keyword }.

Joshua Bloch calls those objects you only **read** from **Producers**, and those you only **write** to **Consumers**. He recommends: "*For maximum flexibility, use wildcard types on input parameters that represent producers or consumers*", and proposes the following mnemonic:

*PECS stands for Producer-Extends, Consumer-Super.*

*NOTE*: if you use a producer-object, say, *List\<? extends Foo\>*{: .keyword }, you are not allowed to call *add()*{: .keyword } or *set()*{: .keyword } on this object, but this does not mean 
that this object is **immutable**: for example, nothing prevents you to call *clear()*{: .keyword } to remove all items from the list, since *clear()*{: .keyword } 
does not take any parameters at all. The only thing guaranteed by wildcards (or other types of variance) is **type safety**. Immutability is a completely different story.

### Declaration-site variance

Suppose we have a generic interface *Source\<T\>*{: .keyword } that does not have any methods that take *T*{: .keyword } as a parameter, only methods that return *T*{: .keyword }:

``` java
// Java
interface Source<T> {
  T nextT();
}
```

Then, it would be perfectly safe to store a reference to an instance of *Source\<String\>*{: .keyword } in a variable of type *Source\<Object\>*{: .keyword } -- there're no consumer-methods to call. But Java does not know this, and still prohibits:

``` java
// Java
void demo(Source<String> strs) {
  Source<Object> objects = strs; // !!! Not allowed in Java
  // ...
}
```

To fix this, we have to declare objects of type *Source\<? extends Object\>*{: .keyword } that is sort of meaningless, because we can call all the same methods on such a variable, as before, so there's no value added by the more complex type. But the compiler does not know that.

In [Kotlin], there is a way to explain this sort of thing to the compiler. This is called **declaration-site variance**: we can annotate the **type parameter** *T*{: .keyword } of Source to make sure that it is only **returned** (produced) from members of *Source\<T\>*{: .keyword }, and never consumed. 
To do this we provide the **out** modifier:

``` kotlin
abstract class Source<out T> {
  fun nextT() : T
}

fun demo(strs : Source<String>) {
  val objects : Source<Any> = strs // This is OK, since T is an out-parameter
  // ...
}
```

The general rule is: when a type parameter *T*{: .keyword } of a class *C*{: .keyword } is declared **out**, it may occur only in **out**\-position in the members of *C*{: .keyword }, but in *return C\<Base\>*{: .keyword } can safely be a supertype 
of *C\<Derived\>*{: .keyword }.

In "clever words" they say that the class *C*{: .keyword } is **covariant** in the parameter *T*{: .keyword }, or that *T*{: .keyword } is a **covariant** type parameter. 
You can think of *C*{: .keyword } as being a **producer** of *T*{: .keyword }'s, and NOT a **consumer** of *T*{: .keyword }'s.

The **out** modifier is called a **variance annotation**, and  since it is provided at the type parameter declaration site, we talk about **declaration-site variance**. 
This is in contrast with Java's **use-site variance** where wildcards in the type usages make the types covariant.

In addition to **out**, Kotlin provides a complementary variance annotation: **in**. It makes a type parameter **contravariant**: it can only be consumed and never 
produced. A good example of a contravariant class is Comparable:

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

We believe that the words **in** and **out** are self-explainig (as they were successfully used in C# for quite some time already), 
thus the mnemonic mentioned above is not really needed, and one can rephrase it for a higher purpose:

**[The Existential](http://en.wikipedia.org/wiki/Existentialism) Transformation: Consumer in, Producer out\!** :-)

## Type projections

### Use-site variance: Type projections

It is very convenient to declare a type parameter T as *out* and have no trouble with subtyping on the use site. Yes, it is, when the class in question **can** actually be restricted to only return *T*{: .keyword }'s, but what if it can't? 
A good example of this is Array:

``` kotlin
class Array<T>(val length : Int) {
  fun get(index : Int) : T { /* ... */ }
  fun set(index : Int, value : T) { /* ... */ }
}
```

This class cannot be either co\- or contravariant in *T*{: .keyword }. And this imposes certain inflexibilities. Consider the following function:

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

Here we run into the same familiar problem: *Array\<T\>*{: .keyword } is **invariant** in *T*{: .keyword }, thus neither of *Array\<Int\>*{: .keyword } and *Array\<Any\>*{: .keyword } 
is a subtype of the other. Why? Again, because copy **might** be doing bad things, i.e. it might attempt to **write**, say, a String to from, and if we actually 
passed an array of Int there, a ClassCastException would have been thrown sometime later...

Then, the only thing we want to ensure is that *copy()*{: .keyword } does not do any bad things. We want to prohibit it to **write** to from, and we can:

``` kotlin
fun copy(from : Array<out Any>, to : Array<Any>) {
 // ...
}
```

What has happened here is called **type projection**: we said that from is not simply an array, but a restricted (**projected**) one: we can only call those methods that return the type parameter 
*T*{: .keyword }, in this case it means that we can only call *get()*{: .keyword }. This is our approach to **use-site variance**, and corresponds to Java's *Array\<? extends Object\>*{: .keyword }, 
but in a little simpler way.

You can project a type with **in** as well:

``` kotlin
fun fill(dest : Array<in String>, value : String) {
  // ...
}
```

*Array\<in String\>*{: .keyword } corresponds to Java's *Array\<? super String\>*{: .keyword }, i.e. you can pass an array of *CharSequence*{: .keyword } or an array of *Object*{: .keyword } to the *fill()*{: .keyword } function.

### Star-projections

Sometimes you want to say that you know nothing about the type argument, but still want to use it in a safe way. 
The safe way here is to say that we are dealing with an *out*\-projection 
(the object does not consume any values of unknown types), and that this projection is with the upper-bound of the corresponding parameter, i.e. *out Any?*{: .keyword } 
for most cases. Kotlin provides a shortahnd syntax for this, that we call a **star-projection**: *Foo\<*\>*{: .keyword } means *Foo\<out Bar\>*{: .keyword } where *Bar*{: .keyword }
 is the upperbound for *Foo*{: .keyword }'s type parameter.

*Note*: star-projections are very much like Java's raw types, but safe.

# Generic functions

Not only classes can have type parameters. Functions can, too. Usually, one places the type parameters in angle brackets **after** the name of the function:

``` kotlin
fun singletonList<T>(item : T) : List<T> {
  // ...
}
```

But for [Extension functions](extensions.html) it may be necessary to declare type parameters before specifying the receiver type, so 
Kotlin allows the alternative syntax:

``` kotlin
fun <T> T.basicToString() : String {
  return typeinfo.typeinfo(this) + "@" + System.identityHashCode(this)
}
```

If type parameters are passed explicitly at the call site, they can be only specified **after** the name of the function:

``` kotlin
val l = singletonList<Int>(1)
```

# Generic constraints

The set of all possible types that can be substituted for a given type parameter may be restricted by **generic constraints**.

## Upper bounds

The most common type a constraint is an **upper bound** that corresponds to *Java*'s *extends* keyword:

``` kotlin
fun sort<T : Comparable<T>>(list : List<T>) {
  // ...
}
```

The type specified after a colon is the **upper bound**: only subtype of *Comparable\<T\>*{: .keyword } may be substituted for *T*{: .keyword }. For example

``` kotlin
sort(list(1, 2, 3)) // OK. Int is a subtype of Comparable<Int>
sort<error desc="Argument type mismatch">(list(HashMap<Int, String>()))</error> // Error: HashMap<Int, String> is not a subtype of Comparable<HashMap<Int, String>>
```

The default upper bound (if none specified) is Any?. There can be not more than one upper bound specified directly inside the angle brackets. If same type parameter needs more than one upper bound, 
we need a separate **where**\-clause:

``` kotlin
fun cloneWhenGreater<T : Comparable<T>>(list : List<T>, threshold : T) : List<T>
    where T : Cloneable {
  return list when {it > threshold} map {it.clone()}
}
```

## Class objects

Another type of generic constraints are *class object* constraints. They restrict the properties of a [class object](classes.html#class-objects) of the root class of a type being substituted for *T*{: .keyword }.

Consider the following example. Suppose, we have a class Default that has a property default that holds a **default** value to be used for this type:

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

Now, let's consider a function that takes a list of [nullable](null-safety.html) *T*{: .keyword }'s, i.e. *T?*{: .keyword }, and replaces all the null's with the default values:

``` kotlin
fun replaceNullsWithDefaults<T : Any>(list : List<T?>) : List<T> {
  return list map {
    if (it == null)
      <error desc="The type T does not have a class object">T</error>.default // For now, we don't know if T's class object has such a property
    else it
  }
}
```

For this function to compile, we need to specify a type constraint that requires a **class object** of *T*{: .keyword } to be of a subtype of *Default\<T\>*{: .keyword }:

``` kotlin
fun replaceNullsWithDefaults<T : Any>(list : List<T?>) : List<T>
    where class object T : Default<T> {
// ...
```

Now the compiler knows that *T*{: .keyword } (as a *class object* reference) has the **default** property, and we can access it.


