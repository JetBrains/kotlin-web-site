import references.KotlinGradlePlugin
import references.KotlinxCoroutines
import references.KotlinxDatetime
import references.KotlinxIO
import references.KotlinxMetadata
import references.KotlinxSerialization
import references.common.VCS

object BuildParams {
  const val DOKKA_TEMPLATES_VERSION = "2.0.0"

  const val SEARCH_APP_ID = "7961PKYRXV"
  const val SEARCH_INDEX_NAME = "prod_KOTLINLANG_WEBHELP"

  val CORE_API_BUILD_ID = ""

  const val CORE_API_TITLE = "Core API"
  const val KGP_API_TITLE = "Kotlin Gradle Plugin"

  val API_REFERENCES = listOf(
    KotlinxCoroutines("1.10.1", VCS.branch("whyoleg/dokka2-sync")), // master
    KotlinxSerialization("1.8.1", VCS.branch("whyoleg/dokka2-sync")), // master
    KotlinxDatetime("0.6.2", VCS.branch("whyoleg/dokka2-sync")), // latest-release
    KotlinxIO("0.7.0", VCS.branch("whyoleg/dokka2-sync")), // 0.7.0

    KotlinGradlePlugin {
      addVersion("2.1.20", VCS.branch("whyoleg/dokka2-sync"))
    },

    KotlinxMetadata("2.1.20", VCS.branch("whyoleg/dokka2-sync")),
  )
}
