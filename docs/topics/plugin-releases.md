[//]: # (title: Kotlin plugin releases)

The [IntelliJ Kotlin plugin](https://plugins.jetbrains.com/plugin/6954-kotlin) and [IntelliJ IDEA](https://www.jetbrains.com/idea/) are on the same release cycle. To speed up the testing and delivery of new features, the plugin and the platform have been moved to the same codebase and ship simultaneously. Kotlin releases happen independently according to the [new release cadence](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

Kotlin and the Kotlin plugin have distinct sets of features:
* Kotlin releases contain language, compiler, and standard library features.
* Kotlin plugin releases introduce only IDE related features. For example, code formatting and debugging tools.

This also affects the versioning of the Kotlin plugin. Releases now have the same version as the simultaneous IntelliJ IDEA release.
You can learn more about new release cadence in this [blog post](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/).

## Update to a new release

IntelliJ IDEA and Android Studio suggest updating to a new release once it is out. When you accept the suggestion,
it automatically updates the Kotlin plugin to the new version. You can check the Kotlin plugin version in **Tools** \| **Kotlin** 
\| **Configure Kotlin Plugin Updates**.

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
    
**2020.3**

Released: December 1, 2020

</td>
<td>

* New types of inline refactorings
* Structural search and replace
* EditorConfig support
* Project templates for Jetpack Compose for Desktop

Learn more in:
* [What's new in Kotlin plugin 2020.3](whatsnew-plugin-20203.md)
* [IntelliJ IDEA 2020.3 release blog post](https://blog.jetbrains.com/idea/2020/12/intellij-idea-2020-3/)

</td>
</tr>
</table>