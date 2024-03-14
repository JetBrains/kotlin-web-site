[//]: # (title: Document Kotlin code: KDoc)

The language used to document Kotlin code (the equivalent of Java's Javadoc) is called **KDoc**. In essence, KDoc
combines Javadoc's syntax for block tags (extended to support Kotlin's specific constructs) and Markdown for
inline markup.

> Kotlin's documentation engine: Dokka, understands KDoc and can be used to generate documentation in various formats.
> For more information, read our [Dokka documentation](dokka-introduction.md).
>
{type="note"}

## KDoc syntax

Just like with Javadoc, KDoc comments start with `/**` and end with `*/`. Every line of the comment may begin with
an asterisk, which is not considered part of the contents of the comment.

By convention, the first paragraph of the documentation text (the block of text until the first blank line) is the
summary description of the element, and the following text is the detailed description.

Every block tag begins on a new line and starts with the `@` character.

Here's an example of a class documented using KDoc:

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic; it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

### Block tags

KDoc currently supports the following block tags:

### @param _name_

Documents a value parameter of a function or a type parameter of a class, property or function.
To better separate the parameter name from the description, if you prefer, you can enclose the name of the
parameter in brackets. The following two syntaxes are therefore equivalent:

```none
@param name description.
@param[name] description.
```

### @return

Documents the return value of a function.

### @constructor

Documents the primary constructor of a class.

### @receiver

Documents the receiver of an extension function.

### @property _name_

Documents the property of a class which has the specified name. This tag can be used for documenting properties
declared in the primary constructor, where putting a doc comment directly before the property definition would be
awkward.

### @throws _class_, @exception _class_

Documents an exception which can be thrown by a method. Since Kotlin does not have checked exceptions, there is
also no expectation that all possible exceptions are documented, but you can still use this tag when it provides
useful information for users of the class.

### @sample _identifier_

Embeds the body of the function with the specified qualified name into the documentation for the current element,
in order to show an example of how the element could be used.

### @see _identifier_

Adds a link to the specified class or method to the **See also** block of the documentation.

### @author

Specifies the author of the element being documented.

### @since

Specifies the version of the software in which the element being documented was introduced.

### @suppress

Excludes the element from the generated documentation. Can be used for elements which are not part of the official
API of a module but still have to be visible externally.

> KDoc does not support the `@deprecated` tag. Instead, please use the `@Deprecated` annotation.
>
{type="note"}

## Inline markup

For inline markup, KDoc uses the regular [Markdown](https://daringfireball.net/projects/markdown/syntax) syntax, extended
to support a shorthand syntax for linking to other elements in the code.

### Links to elements

To link to another element (class, method, property, or parameter), simply put its name in square brackets:

```none
Use the method [foo] for this purpose.
```

If you want to specify a custom label for the link, add it in another set of square brackets before the element link:

```none
Use [this method][foo] for this purpose.
```

You can also use qualified names in the element links. Note that, unlike Javadoc, qualified names always use the dot character
to separate the components, even before a method name:

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

Names in element links are resolved using the same rules as if the name was used inside the element being documented.
In particular, this means that if you have imported a name into the current file, you don't need to fully qualify it
when you use it in a KDoc comment.

Note that KDoc does not have any syntax for resolving overloaded members in links. Since Kotlin's documentation generation
tool puts the documentation for all overloads of a function on the same page, identifying a specific overloaded function
is not required for the link to work.

### External links

To add an external link, use the typical Markdown syntax:

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## What's next?

Learn how to use Kotlin's documentation generation tool: [Dokka](dokka-introduction.md).
