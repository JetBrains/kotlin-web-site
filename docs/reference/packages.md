---
type: doc
layout: reference
category: "Syntax"
title: "Packages"
---

# Packages

A source file may start with a package declaration:

``` kotlin
package foo.bar

fun baz() {}

class Goo {}

// ...
```

All the contents (such as classes and functions) of the source file are contained by the package declared.
So, in the example above, the full name of `baz()` is `foo.bar.baz`, and the full name of `Goo` is `foo.bar.Goo`. 
 
If the package is not specified, the contents of such a file belong to "default" package that has no name.

## Imports

Apart from the [default imports][#default-imports] declared by the module, each file may contain its own import directives. 
Syntax for imports is described in the [grammar](grammar.html#imports).

We can import either a single name, e.g.

``` kotlin
import foo.Bar // Bar is now accessible without qualification
```

or all the accessible contents of a scope (package, class, object etc):

``` kotlin
import foo.* // everything in 'foo' becomes accessible
```

If there is a name clash, we can disambiguate by using as keyword to locally rename the clashing entity:

``` kotlin
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
```

## Visibility and Package Nesting

If a top-level declaration is marked `private`, it is private to the package it's declared in (see [Visibility Modifiers](visibility-modifiers.html)).
Since packages really nest in Kotlin, i.e. package `foo.bar` is considered a member of `foo`, if something is `private` in a package, 
it is visible to all its subpackages.

Note that members of outer packages are **not** imported by default, i.e. in a file in package `foo.bar` we can't access
members of `foo` without importing them.
