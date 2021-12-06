[//]: # (title: Kotlin plugin releases)

The [IntelliJ Kotlin plugin](https://plugins.jetbrains.com/plugin/6954-kotlin) and [IntelliJ IDEA](https://www.jetbrains.com/idea/) are on the same release cycle.
To speed up the testing and delivery of new features, the plugin and the platform have been moved to the same codebase and ship simultaneously.
Kotlin releases happen independently according to the [release cadence](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

Kotlin and the Kotlin plugin have distinct sets of features:
* Kotlin releases contain language, compiler, and standard library features.
* Kotlin plugin releases introduce only IDE related features. For example, code formatting and debugging tools.

This also affects the versioning of the Kotlin plugin. Releases now have the same version as the simultaneous IntelliJ IDEA release.
This creates some limitations that are important to emphasize:
* The EAP version of Kotlin works only with the **stable version** of the IDE. That means that you can't install the Kotlin EAP version to the EAP IDEA release.
* The Kotlin plugin is based on the **previous stable version** of the Kotlin compiler. You can still update the Kotlin version in your project, but some IDE-related features might not be available.
  We are working on stabilizing the process so that the next versions of the plugin will be based on the latest stable version of the compiler.

You can learn more about new release cadence in this [blog post](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

## Update to a new release

IntelliJ IDEA and Android Studio suggest updating to a new release once it is out. When you accept the suggestion,
it automatically updates the Kotlin plugin to the new version. You can check the Kotlin plugin version in **Tools** | **Kotlin** 
| **Configure Kotlin Plugin Updates**.

If you are migrating to the new feature release, Kotlin plugin's migration tools will help you with the migration.

## Release details

The following table lists the details of the latest Kotlin plugin releases: 

<table>
<tr>
<th>Release info</th>
<th>Release highlights</th>
</tr>
<tr>
<td>

**2021.2**

Released: July 27, 2021

</td>
<td>

* Performance improvements
* Better debugging experience
* Remote development support

Learn more in:
* [What’s New in IntelliJ IDEA 2021.2](https://www.jetbrains.com/idea/whatsnew/2021-2/)

</td>
</tr>
<tr>
<td>

**2021.1**

Released: April 7, 2021

</td>
<td>

* Performance improvements
* Evaluation of custom getters during debugging
* Improved Change Signature refactoring
* Code completion for type arguments
* UML diagrams for Kotlin classes

Learn more in:
* [What’s New in IntelliJ IDEA 2021.1](https://www.jetbrains.com/idea/whatsnew/2021-1/)

</td>
</tr>
<tr>
<td>
    
**2020.3**

Released: December 1, 2020

</td>
<td>

* New types of inline refactorings
* Structural search and replace
* EditorConfig support
* Project templates for Jetpack Compose for Desktop

Learn more in:
* [IntelliJ IDEA 2020.3 release blog post](https://blog.jetbrains.com/idea/2020/12/intellij-idea-2020-3/)

</td>
</tr>
</table>