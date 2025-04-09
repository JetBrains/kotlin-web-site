import builds.references.apis.*

object BuildParams {
  const val SEARCH_APP_ID = "7961PKYRXV"
  const val SEARCH_INDEX_NAME = "prod_KOTLINLANG_WEBHELP"

  const val CORE_API_TITLE = "Core API"
  const val CORE_API_STABLE = "2.1.20"

  const val KGP_API_TITLE = "Kotlin Gradle Plugin"
  val KGP_API_VERSIONS: KGPSetup = {
    addVersion("2.1.0")
    addVersion(CORE_API_STABLE)
  }

  val API_REFERENCES = listOf(
    KotlinxCoroutines("1.10.1"),
    KotlinxSerialization("1.8.1"),
    KotlinxDatetime("0.6.2"),
    KotlinxIO("0.7.0"),
    KotlinxMetadata(CORE_API_STABLE),
    KotlinGradlePlugin(KGP_API_VERSIONS),
  )
}
