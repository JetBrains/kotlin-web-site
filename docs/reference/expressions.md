---
type: doc
layout: reference
category: "Expressions"
title: "Expressions"
---

## Atomic expressions

Atomic expressions are

- Literal constants (see [Basic types](basic-types.html), [Strings](basic-types.html#Strings))
- [Variable names or field references](properties.html)
- [Object expressions](object-declarations.htmls)
- Parenthesized expression
- [Control structures (if, when, try)](control-flow.html)
- [Function literals](lambdas.html)
- [this expressions](this-expressions.html)
- [break, continue or return](returns.html)

See the [grammar](grammar.html) for atomic expressions.

## Operators

The grammar defines a number of operators denoted by symbols. The precedence table is available here. Many of the operators can be overloaded, other are described below:

- . – for member access
- ?. and ?: – for [Null-safety](null-safety.html)
- && and || – for incomplete boolean evaluation
