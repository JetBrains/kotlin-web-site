object BuildParams {
  const val DOKKA_TEMPLATES_VERSION = "1.9.10"

  const val KOTLINX_COROUTINES_RELEASE_TAG = "1.10.0"
  const val KOTLINX_COROUTINES_ID = "kotlinx.coroutines"
  const val KOTLINX_SERIALIZATION_RELEASE_TAG = "v1.8.0-RC"
  const val KOTLINX_SERIALIZATION_ID = "kotlinx.serialization"
  const val KOTLINX_DATETIME_RELEASE_TAG = "v0.6.1"
  const val KOTLINX_DATETIME_ID = "kotlinx-datetime"
  const val KOTLINX_IO_RELEASE_TAG = "0.6.0"
  const val KOTLINX_IO_ID = "kotlinx-io"
  const val KOTLINX_METADATA_ID = "kotlinx-metadata-jvm"
  const val KOTLIN_CORE_API_BUILD_ID = "Kotlin_KotlinRelease_210_LibraryReferenceLatestDocs"
  const val KOTLIN_RELEASE_TAG = "v2.1.0"
  const val KGP_ID = "kotlin-gradle-plugin"
  val KGP_RELEASE_TAG = if (KOTLIN_RELEASE_TAG >= "v2.1.0") KOTLIN_RELEASE_TAG else "2.1.0"

  const val SEARCH_APP_ID = "7961PKYRXV"
  const val SEARCH_INDEX_NAME = "prod_KOTLINLANG_WEBHELP"

  val API_URLS = listOf(
    "api/core",
    "api/$KOTLINX_COROUTINES_ID",
    "api/$KOTLINX_SERIALIZATION_ID",
    "api/$KOTLINX_DATETIME_ID",
    "api/$KOTLINX_IO_ID",
    "api/$KGP_ID",
    "api/$KOTLINX_METADATA_ID",
  )
}
