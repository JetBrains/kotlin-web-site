---
type: doc
layout: reference
category: "Syntax"
title: "Control Flow"
---

# Control Flow

## If Expression

In Kotlin, if is an expression, i.e. it returns a value. Therefore there is no ternary operator (condition ? then : else), because ordinary if works fine in this role. 

``` kotlin
// Traditional usage 
var max = a 
if (a < b) 
  max = b 
 
// With else 
var max : Int 
if (a > b) 
  max = a 
else 
  max = b 
 
// As expression 
val max = if (a > b) a else b
```

If branches can be blocks, and the last expression is the value of a block:

``` kotlin
val max = if (a > b) { 
    print("Choose a") 
    a 
  } 
  else { 
    print("Choose b") 
    b 
  }
```

When if has only one branch, or one of its branches results in Unit, it's type is Unit.

See the [grammar for if](grammar.html#if).

## When Expression

When replaces the switch operator of C-like languages. In the simplest form it looks like this

``` kotlin
when (x) {
  1 -> print("x == 1")
  2 -> print("x == 2")
  else -> { // Note the block
    print("x is neither 1 nor 2")
  }
}
```

When matches its argument against all branches consequently until some branch condition is satisfied. When is an expression and results in satisfied branch's right hand side. If some of its branches return result in a value of type Unit, the whole expression has type Unit.
Note that the else branch is mandatory, unless the compiler can prove that all possible cases are covered with branch conditions.

If many cases should be handled in the same way, the branch conditions may be combined with a comma

``` kotlin
when (x) {
  0, 1 -> print("x == 0 or x == 1")
  else -> print("otherwise")
}
```

We can use arbitrary expressions (not only constants) as branch conditions

``` kotlin
when (x) {
  parseInt(s) -> print("s encodes x")
  else -> print("s does not encode x")
}
```

We can also check a value for being in or !in a [range](ranges.html)

``` kotlin
when (x) {
  in 1..10 -> print("x is in the range")
  !in 10..20 -> print("x is outside the range")
  else -> print("none of the above")
}
```

When can also be used as a replacement for an if-else-if chain. If no argument is supplied, the branch conditions are simply boolean expressions, and a branch is executed when its condition is true:

``` kotlin
when {
  x.isOdd() -> print("x is odd")
  x.isEven() -> print("x is even")
  else -> print("x is funny")
}
```


### Continue inside when

**Note: There are currently [issues with this](http://youtrack.jetbrains.com/issue/KT-771)**

Inside when expressions, continue jumps to the next branch condition, if any:

``` kotlin
when (x) {
  in 1..100 ->
    if (x.isOdd())
      continue // Jump to the next branch, i.e. '3, 101 -> ...'
    else
      print("Even between 1 and 100")
  3, 101 -> print("3 or 101")
  1000 -> continue // Error: continue is not allowed in the last branch
}
```

This mechanism replaces the concept of guards available in other languages. I.e. in Scala one has guard if expressions in match (that corresponds to when):

``` scala
// Scala
term match {
  case Fun(x, y) if x == y -> print(x)
  case _ -> print("Nope!")
}
```

This can be rewritten in Kotlin with as follows:

``` kotlin
when(term) {
  is Fun -> { if (tem.v != term.body) continue; print(x) }
  else -> print("Nope!")
}
```

See [Returns and jumps](returns.html) for more information about continue.
See the [grammar for when](grammar.html#when).

## For Loops

For loop iterates through anything that provides an iterator. The syntax is as follows:

``` kotlin
for (item in collection)
  print(item)
The body can be a block.

for (item : Int in ints) {
  // ...
}
```

As mentioned before, for iterates through anything that provides and iterator, i.e.

* has an instance- or extension-function iterator(), whose return type
*has an instance- or extension-function next(), and
*has an instance- or extension-function hasNext() that returns Boolean.

If you want to iterate through an array or list with an index, you can do it this way:

``` kotlin
for (i in array.indices)
  print(array[i])
```

Note that this "iteration through a range" is compiled down to optimal implementation with no extra objects created.

See the [grammar for for](grammar.html#for).

## While Loops

While and do..while work as usual

``` kotlin
while(x > 0) {
  x--
}

do {
  val y = retrieveData()
} while(y != null) // y is visible here!
```

See the [grammar for while](grammar.html#while).

## Break and continue in loops

Kotlin supports traditional break and continue operators in loops. See more here [Returns and jumps](returns.html).


