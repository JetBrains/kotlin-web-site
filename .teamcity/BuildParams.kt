import references.builds.compose.ComposeMultiplatformCore
import references.builds.kgp.KotlinGradleAPI
import common.extensions.VCS

object BuildParams {
  const val DOKKA_TEMPLATES_VERSION = "2.0.0"

  const val KOTLINX_COROUTINES_RELEASE_TAG = "master"
  const val KOTLINX_COROUTINES_RELEASE_LABEL = "1.10.2"
  const val KOTLINX_COROUTINES_ID = "kotlinx.coroutines"
  const val KOTLINX_COROUTINES_TITLE = KOTLINX_COROUTINES_ID

  const val KOTLINX_SERIALIZATION_RELEASE_TAG = "master"
  const val KOTLINX_SERIALIZATION_RELEASE_LABEL = "v1.8.1"
  const val KOTLINX_SERIALIZATION_ID = "kotlinx.serialization"
  const val KOTLINX_SERIALIZATION_TITLE = KOTLINX_SERIALIZATION_ID

  const val KOTLINX_DATETIME_RELEASE_TAG = "latest-release"
  const val KOTLINX_DATETIME_RELEASE_LABEL = "v0.7.0"
  const val KOTLINX_DATETIME_ID = "kotlinx-datetime"
  const val KOTLINX_DATETIME_TITLE = KOTLINX_DATETIME_ID

  const val KOTLINX_IO_RELEASE_TAG = "whyoleg/dokka2-sync"
  const val KOTLINX_IO_RELEASE_LABEL = "0.7.0"
  const val KOTLINX_IO_ID = "kotlinx-io"
  const val KOTLINX_IO_TITLE = KOTLINX_IO_ID

  const val KOTLIN_RELEASE_TAG = "whyoleg/dokka2-sync"
  const val KOTLIN_RELEASE_LABEL = "2.1.20"

  const val CORE_API_BUILD_ID = "Kotlin_KotlinRelease_220_LibraryReferenceLatestDocs"
  const val CORE_API_TITLE = "Core API"

  const val KOTLINX_METADATA_ID = "kotlinx-metadata-jvm"
  const val KOTLINX_METADATA_RELEASE_TAG = KOTLIN_RELEASE_TAG
  const val KOTLINX_METADATA_TITLE = KOTLINX_METADATA_ID

  val KGP_REFERENCE = KotlinGradleAPI {
    addVersion("2.1.20", VCS.branch("whyoleg/dokka2-sync"))
    addVersion("2.2.0", VCS.branch("2.2.0"))
  }

  val API_COMPOSE = ComposeMultiplatformCore {
    addVersion("1.8.0", "api-reference/1.8")
  }

  const val SEARCH_APP_ID = "7961PKYRXV"
  const val SEARCH_INDEX_NAME = "prod_KOTLINLANG_WEBHELP"

  val API_URLS = listOf(
    "api/core",
    "api/$KOTLINX_COROUTINES_ID",
    "api/$KOTLINX_SERIALIZATION_ID",
    "api/$KOTLINX_DATETIME_ID",
    "api/$KOTLINX_IO_ID",
    "api/$KOTLINX_METADATA_ID",
    "api/${KGP_REFERENCE.urlPart}",
    "api/${API_COMPOSE.urlPart}",
  )
}
