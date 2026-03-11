package references.builds.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_ID
import BuildParams.KOTLINX_COROUTINES_RELEASE_LABEL
import references.BuildApiPages
import references.dependsOnDokkaTemplate
import references.vcsRoots.KotlinxCoroutines

object KotlinxCoroutinesBuildApiReference : BuildApiPages(
    apiId = KOTLINX_COROUTINES_ID, releaseTag = KOTLINX_COROUTINES_RELEASE_LABEL, init = {
        vcs {
            root(KotlinxCoroutines)
        }
        dependencies {
            dependsOnDokkaTemplate(KotlinxCoroutinesPrepareDokkaTemplates)
        }
    })
