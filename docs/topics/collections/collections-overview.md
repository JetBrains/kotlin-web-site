[//]: # (title: Collections overview)

The Kotlin standard library provides a comprehensive set of tools for working with collections: groups of items that
are significant to the problem being solved and are commonly processed together. Collections usually contain elements of
the same type or its subtypes. Objects in a collection are called _elements_ or _items_.

The collection API is generic, so you can use the same functions and interfaces with built-in
and user-defined types. The collection interfaces and related functions are located in the `kotlin.collections` package.

Kotlin provides three main collection types:

* [_List_](collection-types.md#list) is an ordered collection. It supports indexed access and can contain duplicate elements.
For example, a telephone number.
* [_Set_](collection-types.md#set) is a collection of unique elements. Generally, the order of set elements has no significance.
For example, the numbers on lottery tickets.
* [_Map_](collection-types.md#map) (or _dictionary_) is a set of key-value pairs. Each key is unique and maps to one value.
For example, an employee's ID and their position.

Kotlin also provides [`ArrayDeque`](collection-types.md#arraydeque). It is a double-ended queue that you can use as a queue
or stack.

Kotlin lets you manipulate collections independently of the exact type of objects stored in them. In other words, you add 
a `String` to a list of `String`s the same way as you would do with `Int`s or a user-defined class.
So, the Kotlin Standard Library offers generic interfaces, classes, and functions for creating, populating, and managing 
collections of any type.

> Arrays are not a type of collection. Learn [when to use arrays instead of collections](arrays.md#when-to-use-arrays).
>
{style="note"}

Watch a video by Sebastian Aigner, Kotlin Developer Advocate:

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

## Read-only and mutable collections

Each main collection type has a read-only interface, such as `List`, and a corresponding mutable interface, such as
`MutableList`. Read-only interfaces provide operations for accessing elements, while mutable interfaces add operations
for adding, removing, and updating them. Prefer read-only interfaces when callers don't need to modify a collection.

Read-only collection interfaces don't guarantee immutability. They only prevent you from modifying a collection through
that interface. The same collection can still be mutable through another reference. However, you can implement a read-only
interface through an immutable collection that can't change after creation. For immutable and persistent
implementations, use the [`kotlinx.collections.immutable`](https://kotlinlang.org/api/kotlinx.collections.immutable/) library.

The interfaces form the following hierarchy:

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) is the root of the collection hierarchy. This interface represents the common behavior of a
read-only collection: retrieving size, checking item membership, and so on. `Collection` inherits from the `Iterable<T>`
interface that defines the operations for iterating elements. You can use
`Collection` as a parameter of a function that applies to different collection types. For more specific cases, use
the `Collection`'s inheritors: [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html)
and [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html). 