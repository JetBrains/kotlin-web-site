import builds.common.VCS
import builds.references.apis.*

object BuildParams {
  const val SEARCH_APP_ID = "7961PKYRXV"
  const val SEARCH_INDEX_NAME = "prod_KOTLINLANG_WEBHELP"

  const val KOTLIN_CURRENT_RELEASE = "2.1.20"

  const val CORE_API_TITLE = "Core API"
  const val KGP_API_TITLE = "Kotlin Gradle Plugin"

  val CORE_API_BUILD_ID = "Kotlin_KotlinRelease_${KOTLIN_CURRENT_RELEASE.replace(".", "") }}_LibraryReferenceLatestDocs"

  val API_REFERENCES = listOf(
    KotlinxCoroutines("1.10.1"),
    KotlinxSerialization("1.8.1"),
    KotlinxDatetime("0.6.2"),
    KotlinxIO("0.7.0"),

    KotlinxMetadata(KOTLIN_CURRENT_RELEASE),

    KotlinGradlePlugin {
      addVersion(KOTLIN_CURRENT_RELEASE)
    },
  )
}
