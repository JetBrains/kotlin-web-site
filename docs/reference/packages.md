---
layout: reference
title: "Packages"
category: reference
subcategory: syntax
---

## Root package
Every module declares a unique root package, that contains all the packages declared in the module.

## Header package declaration
A source file may start with a header package declaration (see the grammar):

``` kotlin
package foo.bar

// ...
```

All the contents of the source file are (directly or indirectly) contained by its header package. If the header is not specified, the module's root package is used.

## Imports

Apart from the [default imports][#default-imports] declared by the module, each file may contain its own import directives. Syntax for imports is described in the [grammar](grammar.html#imports).

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

## Absolute and relative names

Consider the following example (syntax is fictional):

``` kotlin
package a {
  package b {
    val x = 1
    package a {
      val y = a.b.x // Problem
    }
  }
}
```

At the line marked "Problem" we have the following potential ambiguity: what does a stand for: the outer package a or the inner one? The rule here is that names are always relative: a is resolved in its scope of occurrence that makes it mean the inner package a, so this code does not compile.

To fix it, we need an absolute name. These start with the package keyword:

``` kotlin
package a {
  package b {
    val x = 1
    package a {
      val y = package.root.a.b.x // Fixed
    }
  }
}
```

In this example, we assumed that the root package of our module is named root.

Absolute names may be used in imports as well:

``` kotlin
import package.root.a.b.a.*
```

