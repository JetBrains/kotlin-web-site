[//]: # (title: Collections overview)

The Kotlin standard library provides a comprehensive set of tools for working with collections. A collection is a group
of items that relate to the problem you solve and that you commonly process together. Collections usually contain
elements of the same type or its subtypes. Objects in a collection are called _elements_ or _items_.

The collection API is generic, so you can use the same functions and interfaces with built-in
and user-defined types. The `kotlin.collections` package contains the collection interfaces and related functions.

Kotlin provides three main collection types:

* [_List_](collection-types.md#list) is an ordered collection. It supports indexed access and can contain duplicate elements.
  For example, you can use a list to store the digits of a telephone number.
* [_Set_](collection-types.md#set) is a collection of unique elements. The order of set elements has no significance.
  For example, you can use to store the numbers of lottery tickets.
* [_Map_](collection-types.md#map) (or _dictionary_) is a set of key-value pairs. Each key is unique and maps to one value.
  For example, you can use to associate employee IDs and their position.

Kotlin also provides [`ArrayDeque`](collection-types.md#arraydeque). It's a double-ended queue that you can use as a queue or stack.

> Arrays aren't a type of collection. Learn how to choose between arrays and collections in [When to use arrays](arrays.md#when-to-use-arrays).
>
{style="note"}

To learn about `List`, `Set`, and `Map`, read the corresponding sections or watch a video by Sebastian Aigner, Kotlin Developer Advocate:

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

## Read-only and mutable collections

Each main collection type has a read-only interface, such as `List`, and a corresponding mutable interface, such as
`MutableList`. Read-only interfaces provide operations for accessing elements, while mutable interfaces add operations
for adding, removing, and updating them.

Prefer read-only interfaces when callers don't need to modify a collection. This makes your intent explicit in the
API and prevents accidental modification through that interface. By contrast, an immutable collection doesn't allow to
change its elements after creation. For immutable and persistent implementations, use the [`kotlinx-collections-immutable`](https://kotlinlang.org/api/kotlinx.collections.immutable/) library.

The interfaces form the following hierarchy:

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) is the common superinterface of `List` and `Set`. It provides operations like
checking the size of a collection. `Collection` inherits from the `Iterable<T>` interface, which supports iteration over elements.
`Map` doesn't extend `Collection`.

You can use `Collection` as a parameter of a function that applies to different collection types. For more specific cases,
use the `Collection`'s inheritors: [`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) and [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html). 