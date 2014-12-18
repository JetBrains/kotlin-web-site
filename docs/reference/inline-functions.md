---
type: doc
layout: reference
category: "Syntax"
title: "Inline Functions"
---

# Inline Functions

Using [higher-order functions](lambdas.html) imposes certain runtime penalties: each function is an object, and it captures a closure,
i.e. those variables that are accessed in the body of the function.
Memory allocations (both for function objects and classes) and virtual calls introduce runtime overhead.

But it appears that in many cases this kind of overhead can be eliminated by inlining the function literals.
The functions shown above are good examples of this situation. I.e., the `lock()` function could be easily inlined at call-sites.
Consider the following case:

``` kotlin
lock(l) {foo()}
```

Instead of creating a function object for the parameter and generating a call, the compiler could emit the following code

``` kotlin
lock.lock()
try {
  foo()
}
finally {
  lock.unlock()
}
```

Isn't it what we wanted from the very beginning?

To make the compiler do this, we need to annotate the `lock()` function with the `inline` annotation:

``` kotlin
inline fun lock<T>(lock: Lock, body: () -> T): T {
  // ...
}
```

Inlining may cause the generated code to grow, but if we do it in a reasonable way (do not inline big functions)
it will pay off in performance, especially at "megamorphic" call-sites inside loops.