[//]: # (title: Work with collections in Spring Boot project)

<tldr>
    <p>This is a part of the <strong>Getting started with Spring Boot and Kotlin</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">Create a Spring Boot project with Kotlin</a><br/><a href="jvm-spring-boot-add-data-class.md">Add a data class to Spring Boot project</a><br/><strong>Add database support for Spring Boot project</strong><br/></p>
</tldr>

In this part, you will learn how to perform various operations on collections in Kotlin.
While in many cases SQL can help with data operations such as filtering and sorting, in real-life applications, we often have to work with collections to manipulate data.

Below you will find some useful receipts for working with collections based on the data objects that is already present in our demo application.
In all the examples we assume to start with retrieving all the messages stored in the database by calling `service.findMessages()` function, and then perform various operations to filter, sort, group, or transform the list of messages.

## Retrieving elements

Kotlin collections provide a set of functions for retrieving single elements from collections.
It's possible to retrieve a single element from collection either by position or by a matching condition.

For instance, retrieving the first and last elements of a collection is made possible with the corresponding functions, `first()` and `last()`:

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

In the example above, retrieve the collection's first and last elements and create a new list of two elements that will be serialized into a JSON document.

To retrieve an element at a specific position, you can use [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) function.

Both `first()` and `last()` functions also let you search a collection for elements matching a given predicate.
For example, here's how to find the first `Message` instance in the list where the length of the message is longer than ten characters:

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

Of course, it might be the case that there are no messages that are longer than the given character limit.
In this case, the code above would produce NoSuchElementException.
Alternatively, you can use `firstOrNull()` function to return null in case there is no matching element in the collection.
It is then the programmer's responsibility to check the result if it's null or not:

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## Filtering elements

_Filtering_ is one of the most popular tasks in collection processing.
The standard library contains a group of extension functions that let you filter collections in a single call.
These functions leave the original collection unchanged and produce a new collection with the filtered elements:

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

This code looks very similar to the example where you used `first()` function to find the single element with a text length greater than 10.
The difference is that `filter()` returns a list of the elements matching a condition.

## Sorting elements

The order of elements is an important aspect of certain collection types.
Kotlin's standard library provides a number of functions for sorting in various ways: natural, custom, reverse, and random order.

For instance, let's sort the messages in the list by the last letter.
This is possible by using `sortedBy()` function that uses a selector to extract the required value from the collection objects.
The comparison of the elements in the list will then be made based on the extracted values:

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## Grouping elements

Grouping may require implementing some pretty complex logic, of how the elements should be grouped together.
The [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) function takes a lambda and returns a `Map`.
In this map, each key is the lambda result, and the corresponding value is the `List` of elements on which this result is returned.

Let's group the messages by matching the specific words, for instance, "hello" and "bye".
If message's text does not contain any of the provided words, then you'll add it to a separate group called "other":

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message ->
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## Transformation operations

A common task with collections is to transform the collection elements from one type to another.
Of course, Kotlin standard library provides a number of [transformation functions](https://kotlinlang.org/docs/collection-transformations.html) for such tasks.

For instance, let's transform a list of `Message` objects into a list of String objects which are composed by concatenating the `id` and the `text` body of the message.
For that, we can use `map()` function that applies the given lambda function to each subsequent element and returns the list of the lambda results:

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## Aggregate operations

An aggregation operation computes a single value from a collection of values.
An example of an aggregation operation is calculating the average of the length of all messages:

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

First, use the `map()` function to convert the list of messages to the list of values that represent the length of each message.
Then you can use the average function to calculate the final result.

The other examples of the aggregate functions are `mix()`, `max()`, `sum()`, and `count()`.

For more specific cases, there are the functions [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) and [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) that apply the provided operation to the collection elements sequentially and return the accumulated result.

For instance, let's find a message with the longest text in it:

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second ->
        if (first.text.length > second.text.length) first else second
    }
}
```

## Next step

Go to the [next section](jvm-spring-boot-using-crudrepository.md).