package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS

object KotlinMultiplatform: WritersideBuilder (
    module = "kotlin-multiplatform-docs",
    instance = "mpd",
    customInit = {
        name = "Kotlin Multiplatform Documentation"
        vcs {
            root(KotlinMultiplatformVCS)
            cleanCheckout = true
        }
    }
)
