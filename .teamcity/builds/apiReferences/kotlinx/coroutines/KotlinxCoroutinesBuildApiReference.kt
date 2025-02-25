package builds.apiReferences.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_ID
import BuildParams.KOTLINX_COROUTINES_RELEASE_LABEL
import builds.apiReferences.BuildApiPages
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.vcsRoots.KotlinxCoroutines

object KotlinxCoroutinesBuildApiReference : BuildApiPages(
    apiId = KOTLINX_COROUTINES_ID, releaseTag = KOTLINX_COROUTINES_RELEASE_LABEL, init = {
        vcs {
            root(KotlinxCoroutines)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxCoroutinesPrepareDokkaTemplates)
        }
    })
