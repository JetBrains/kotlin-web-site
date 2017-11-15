---
layout: default
title:  "Using coroutines"
authors: Roman Belov
showAuthorInfo: false
---

# Using coroutines

With all the benefits that they bring, Kotlin coroutines are a fairly new design that needs extensive battle-testing before we can be sure it’s 100% right and complete. This is why it is released under an “experimental” opt-in flag. We do not expect the language rules to change and the coroutines are definitely there to stay, but APIs will require some adjustments in the future release.

* **Command line:** `-Xcoroutines=enable`
* **Gradle:** `kotlin { experimental { coroutines 'enable' } }`
* **Maven:** `<configuration> <args> <arg>-Xcoroutines=enable</arg> </args> </configuration>`
* **IDE:** Use a quick-fix (Alt+Enter) or modify the facet options *(Project Structure -> Modules -> Your Module -> Compiler -> Coroutines (experimental))*
