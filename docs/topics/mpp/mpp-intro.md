[//]: # (title: Kotlin Multiplatform)

> Multiplatform projects are in [Alpha](components-stability.md). Language features and tooling may change in future Kotlin versions.
>
{type="note"}

Support for multiplatform programming is one of Kotlin’s key benefits. It reduces time spent writing and maintaining the
 same code for [different platforms](mpp-supported-platforms.md) while retaining the flexibility and benefits of native programming. 
 Learn more about [Kotlin Multiplatform benefits](multiplatform.md).

With Kotlin Multiplatform, share the code using the mechanisms Kotlin provides: 
 
*   [Share code among all platforms used in your project](mpp-share-on-platforms.md#share-code-on-all-platforms). Use it for sharing the common 
business logic that applies to all platforms. 
     
    ![Code shared for all platforms](flat-structure.png)
    
*   [Share code among some platforms](mpp-share-on-platforms.md#share-code-on-similar-platforms) included in your project but not all. You can 
reuse much of the code in similar platforms using a hierarchical structure. You can use [target shortcuts](mpp-share-on-platforms.md#use-target-shortcuts) 
for common combinations of targets or [create the hierarchical structure manually](mpp-share-on-platforms.md#configure-the-hierarchical-structure-manually).
    
    ![Hierarchical structure](hierarchical-structure.png)

If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of [expected and actual 
declarations](mpp-connect-to-apis.md).

## Tutorials

* [Creating a multiplatform Kotlin library](multiplatform-library.md) teaches how to create a multiplatform 
library available for JVM, JS, and Native and which can be used from any other common code (for example, shared with 
Android and iOS). It also shows how to write tests which will be executed on all platforms and use an efficient implementation
 provided by a specific platform.
 
* [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction) 
  teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server 
  application that makes use of shared code, serialization, and other multiplatform paradigms. It also provides a brief
  introduction to working with Ktor both as a server- and client-side framework.
