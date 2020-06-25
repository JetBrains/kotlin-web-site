---
type: doc
layout: reference
title: "Kotlin Multiplatform"
---

# Kotlin Multiplatform

Support for multiplatform programming is one of Kotlin’s key benefits. It reduces time spent writing and maintaining the
 same code for different platforms while retaining the flexibility and benefits of native programming. 

This is how Kotlin Multiplatform works.

<img class="img-responsive" src="{{ url_for('asset', path='images/reference/mpp/kotlin-multiplatform.png' )}}" alt
="Kotlin Multiplatform" width="500" />

*   **Common Kotlin** includes the language, core libraries, and basic tools. Code written in common Kotlin works 
everywhere on all platforms.
*   With Kotlin Multiplatform libraries, you can reuse the multiplatform logic in common and platform-specific code.
*   To interop with platforms, use platform-specific versions of Kotlin. **Platform-specific versions of Kotlin** 
(Kotlin/JVM, Kotlin/JS, Kotlin/Native) include extensions to the Kotlin language, and platform-specific libraries and tools. 
*   Through these platforms you can access the **platform native code** (JVM, JS, and Native) and leverage all native
 capabilities.

With Kotlin Multiplatform, spend less time on writing and maintaining the same code for different platforms – just share 
it using the mechanisms Kotlin provides:

*   [Share code among all platforms used in your project](https://docs.google.com/document/d/1Zilt6dZN1oGG9UYY4H7VtUtgoABl0RKvzhWVamwu7V0/edit#heading=h.t5tm40isd5ld). Use it for sharing the common business logic that applies to all platforms. 
*   [Share code among some platforms](https://docs.google.com/document/d/1Zilt6dZN1oGG9UYY4H7VtUtgoABl0RKvzhWVamwu7V0/edit#heading=h.80xqjxcz4gsi) included in your project but not all. Do this when you can reuse much of the code in similar platforms.

With IntelliJ IDEA, you can [create a multiplatform application or multiplatform library](mpp-create-lib.html).
