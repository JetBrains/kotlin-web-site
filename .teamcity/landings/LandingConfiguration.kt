package landings

/**
 * Configuration for a landing page instance.
 * Each landing page is a separate client app.
 *
 * @param name The landing page name, used as base path
 * @param repositoryUrl The GitHub repository URL
 * @param branch The branch to build from
 */
data class LandingConfiguration(
  val name: String,
  val repositoryUrl: String,
  val branch: String = "main"
)

/**
 * List of all landing pages to be built.
 * Add new landing pages here.
 */
val landingConfigurations = listOf(
  LandingConfiguration(
    name = "kotlin-spring-ai-tutorial",
    repositoryUrl = "git@github.com:jetbrains-lovable/kotlin-ai-tutorial.git"
  )
)
