package documentation.builds

import documentation.vcsRoots.KotlinMultiplatformVCS
import jetbrains.buildServer.configs.kotlin.CheckoutMode

object KotlinMultiplatform: WritersideBuilder (
    module = "kotlin-multiplatform-docs",
    instance = "mpd",
    customInit = {
        name = "Kotlin Multiplatform Documentation"
        vcs {
            root(KotlinMultiplatformVCS)
            cleanCheckout = true
            checkoutMode = CheckoutMode.ON_AGENT
        }
    }
)
