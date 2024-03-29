[//]: # (title: Migrate to Kotlin code style)

## Kotlin coding conventions and IntelliJ IDEA formatter

[Kotlin coding conventions](coding-conventions.md) affect several aspects of writing idiomatic Kotlin, and a set of
formatting recommendations aimed at improving Kotlin code readability is among them. 

Unfortunately, the code formatter built into IntelliJ IDEA had to work long before this document was released and now
has a default setup that produces different formatting from what is now recommended.

It may seem a logical next step to remove this obscurity by switching the defaults in IntelliJ IDEA and make formatting
consistent with the Kotlin coding conventions. But this would mean that all the existing Kotlin projects will have a new
code style enabled the moment the Kotlin plugin is installed. Not really the expected result for plugin update, right? 

That's why we have the following migration plan instead:

* Enable the official code style formatting by default starting from Kotlin 1.3 and only for new projects (old formatting
can be enabled manually)
* Authors of existing projects may choose to migrate to the Kotlin coding conventions
* Authors of existing projects may choose to explicitly declare using the old code style in a project (this way the project
won't be affected by switching to the defaults in the future)
* Switch to the default formatting and make it consistent with Kotlin coding conventions in Kotlin 1.4

## Differences between "Kotlin coding conventions" and "IntelliJ IDEA default code style"

The most notable change is in the continuation indentation policy. There's a nice idea to use the double indent for showing
that a multi-line expression hasn't ended on the previous line. This is a very simple and general rule, but several Kotlin
constructions look a bit awkward when they are formatted this way. In Kotlin coding conventions, it's recommended to use
a single indent in cases where the long continuation indent has been forced before.

<img src="code-formatting-diff.png" alt="Code formatting" width="700"/>

In practice, quite a bit of code is affected, so this can be considered a major code style update.

## Migration to a new code style discussion

A new code style adoption might be a very natural process if it starts with a new project, when there's no code formatted
in the old way. That is why starting from version 1.3, the Kotlin IntelliJ Plugin creates new projects with formatting from
the [Coding conventions](coding-conventions.md) document which is enabled by default.

Changing formatting in an existing project is a far more demanding task, and should probably be started with discussing
all the caveats with the team.

The main disadvantage of changing the code style in an existing project is that the blame/annotate VCS feature will point
to irrelevant commits more often. While each VCS has some kind of way to deal with this problem
(["Annotate Previous Revision"](https://www.jetbrains.com/help/idea/investigate-changes.html) can be used in IntelliJ IDEA),
it's important to decide if a new style is worth all the effort. The practice of separating reformatting commits from
meaningful changes can help a lot with later investigations. 

Also migrating can be harder for larger teams because committing a lot of files in several subsystems may produce merging
conflicts in personal branches. And while each conflict resolution is usually trivial, it's still wise to know if there are
large feature branches currently in work.

In general, for small projects, we recommend converting all the files at once.

For medium and large projects the decision may be tough. If you are not ready to update many files right away you may
decide to migrate module by module, or continue with gradual migration for modified files only.

## Migration to a new code style

Switching to the Kotlin Coding Conventions code style can be done in **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin**
dialog. Switch scheme to **Project** and activate **Set from...** | **Kotlin style guide**.

In order to share those changes for all project developers `.idea/codeStyle` folder have to be committed to VCS.

If an external build system is used for configuring the project, and it's been decided not to share `.idea/codeStyle` folder,
Kotlin coding conventions can be forced with an additional property:

### In Gradle

Add `kotlin.code.style=official` property to the `gradle.properties` file at the project root and commit the file to VCS. 

### In Maven

Add `kotlin.code.style official` property to root `pom.xml` project file. 

```
<properties>
  <kotlin.code.style>official</kotlin.code.style>
</properties>
```

>Having the **kotlin.code.style** option set may modify the code style scheme during a project import and may change
>the code style settings.
>
{type="warning"}

After updating your code style settings, activate **Reformat Code** in the project view on the desired scope.

<img src="reformat-code.png" alt="Reformat code" width="500"/>

For a gradual migration, it's possible to enable the **File is not formatted according to project settings** inspection.
It will highlight the places that should be reformatted. After enabling the **Apply only to modified files** option,
inspection will show formatting problems only in modified files. Such files are probably going to be committed soon anyway.

## Store old code style in project

It's always possible to explicitly set the IntelliJ IDEA code style as the correct code style for the project:

1. In **Settings/Preferences** | **Editor** | **Code Style** | **Kotlin**, switch to the **Project** scheme.
2. Open the **Load/Save** tab and in the **Use defaults from** select **Kotlin obsolete IntelliJ IDEA codestyle**.

In order to share the changes across the project developers `.idea/codeStyle` folder, it has to be committed to VCS.
Alternatively, **kotlin.code.style**=**obsolete** can be used for projects configured with Gradle or Maven.
