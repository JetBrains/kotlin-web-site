[//]: # (title: Kotlin AI Skills)
[//]: # (description: Learn what Kotlin AI skills are, how they help AI agents, and where to find available skills.)

Kotlin AI skills are reusable instructions that help AI agents
perform Kotlin-specific tasks more reliably.

A skill gives an AI agent the context it needs before it starts executing a task.
For example, a skill can point to a relevant API, define prerequisites,
or provide step-by-step workflow guidance.

Skills help agents produce more accurate results and reduce the time you spend explaining the task manually.
For teams, skills also provide a shared framework for common tasks, so everyone gets consistent results.

> You can find Kotlin AI skills in the
> [AI agent skills for Kotlin repository](https://github.com/Kotlin/kotlin-agent-skills).
>
{style="note"}

Kotlin AI skills follow the [Agent Skills standard](https://agentskills.io/home), so you can use them
with compatible AI agents. For example, [Junie](https://www.jetbrains.com/junie/), Claude Code, Gemini,
GitHub Copilot, and Mistral AI.

## Supported workflows

You can use Kotlin AI skills for different Kotlin-specific scenarios. 
The following examples show some tasks that AI skills can help with.

### Update multiplatform projects with Android apps to use AGP 9

[This skill](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) helps update Kotlin Multiplatform projects with Android apps to use Android Gradle Plugin 9.

Use this skill when your project needs to migrate to AGP 9 and you want an AI agent to apply the required project and Gradle configuration changes.

Learn more in [Update multiplatform projects with Android apps to use AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html).

### Migrate multiplatform projects from CocoaPods to SwiftPM dependencies

[This skill](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration) helps migrate Kotlin Multiplatform projects from CocoaPods to Swift Package Manager dependencies.

Use this skill when your project uses CocoaPods for iOS integration and you want an AI agent to move the setup to SwiftPM.

Learn more in [Migrate multiplatform projects from CocoaPods to SwiftPM dependencies](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html).

## Get support

If you have questions or encounter problems, ask for help in ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up).
