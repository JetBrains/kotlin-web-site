package documentation.libraries.builds

import common.extensions.dependsOnDokkaTemplate
import common.extensions.isProjectPlayground
import common.sanitizeId
import documentation.libraries.vcsRoots.STDLIB_DOCS_CHECKOUT_RULES
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.RelativeId
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import jetbrains.buildServer.configs.kotlin.buildSteps.script
import jetbrains.buildServer.configs.kotlin.triggers.vcs
import jetbrains.buildServer.configs.kotlin.vcs.GitVcsRoot
import references.builds.stdlib.StdlibPrepareDokkaTemplates

private const val DOCS_PROJECT_DIR = "libraries/tools/kotlin-stdlib-docs"
private const val TEMPLATES_DIR = "dokka-templates"
private const val OUTPUT_DIR = "stdlib-docs-out"
private const val PREVIOUS_DIR = "stdlib-docs-previous"
private const val DEPENDENCIES_DIR = "stdlib-docs-deps"

/** Released Kotlin artifacts whose sources and klibs `kotlin_big:extractLibs` downloads. */
private const val KOTLIN_LIBS_REPO = "https://repo1.maven.org/maven2"

/** Older legacy docs builds default to the Space repository, which no longer serves Dokka dev builds. */
private const val DOKKA_DEV_REPO = "https://redirector.kotlinlang.org/maven/dokka-dev"

/** Agents provide only JDK 21. Gradle runs on it and every Java toolchain in the docs build is forced to it. */
private const val JDK_ENV_VAR = "JDK_21_0"
private const val JVM_TOOLCHAIN = "21"

/** Current Gradle release, used instead of the branch wrapper (8.14 on every branch from 1.6.20 to 2.4.20). Empty keeps the wrapper. */
private const val GRADLE_VERSION = "9.8.2"

private const val INIT_SCRIPT = "%teamcity.build.tempDir%/stdlib-docs.init.gradle"

/**
 * The docs plugins under `plugins/` pin `kotlin { jvmToolchain(8) }` on every branch, and agents have no JDK 8.
 * This init script replaces the toolchain after each project is evaluated, so branches build unchanged.
 * Groovy keeps it independent of the Kotlin Gradle plugin classes, which are not on the init script classpath.
 */
// language=groovy
private val INIT_SCRIPT_CONTENT = """
    def toolchain = Integer.parseInt(gradle.startParameter.projectProperties.get("stdlibDocsJvmToolchain") ?: JavaVersion.current().majorVersion)
    allprojects { project ->
        project.plugins.withId("org.jetbrains.kotlin.jvm") {
            project.afterEvaluate {
                project.kotlin.jvmToolchain(toolchain)
                project.logger.lifecycle("stdlib docs: ${'$'}{project.path} uses JVM toolchain ${'$'}toolchain")
            }
        }
    }
""".trimIndent()

/** Artifact of a historical build; contains `all-libs/<language version>/`. */
const val PREVIOUS_VERSIONS_ARTIFACT = "previous-versions.zip"

/** Artifact of the latest build; contains `all-libs/`, the same layout as the Kotlin Release `LibraryReferenceLatestDocs` build. */
const val LATEST_VERSION_ARTIFACT = "latest-version.zip"

/** How a branch of `kotlin-stdlib-docs` is driven. */
enum class StdlibDocsLayout {
    /** Dokka Gradle plugin in V1 mode with versioned tasks (branches up to 2.3.20). */
    LEGACY,

    /** Dokka Gradle plugin V2 with `buildSrc` conventions and the `isLatest` property (2.4.20 and later). */
    DOKKA2,
}

class StdlibDocsVersion(
    /** Version shown in the selector, e.g. `2.2`. */
    val version: String,
    /** Released Kotlin version whose artifacts are documented, e.g. `2.2.21`. */
    val deployVersion: String,
    /** Branch of JetBrains/kotlin containing the docs build for this version. */
    val branch: String,
    val layout: StdlibDocsLayout,
    /** Overrides the branch's `dokka_version`; `null` keeps the branch default. */
    val dokkaVersion: String? = null,
) {
    val idPart = sanitizeId(version)
}

/**
 * Legacy branches register `all-libs_<version>` for every entry of their hardcoded `versions` list, and
 * `buildAllVersions` runs all of them (the 1.6.20 branch lists 1.0–1.6). Running the single versioned task lets
 * several historical builds share one branch while each produces only its own version. Its child tasks for
 * kotlin-stdlib, kotlin-test and kotlin-reflect, and the library download, run as its dependencies.
 *
 * Dokka 2 branches document only the branch's `kotlinLanguageVersion`, so the branch decides the version.
 */
private fun gradleTask(target: StdlibDocsVersion, latest: Boolean) = when (target.layout) {
    StdlibDocsLayout.LEGACY -> if (latest) "buildLatestVersion" else "all-libs_${target.version}"
    StdlibDocsLayout.DOKKA2 -> ":dokkaGeneratePublicationHtml"
}

private fun BuildType.stdlibDocsBuild(target: StdlibDocsVersion, root: GitVcsRoot, latest: Boolean) {
    params {
        param("stdlib.deployVersion", target.deployVersion)
        param("stdlib.githubRevision", "v${target.deployVersion}")
        param("stdlib.kotlinLibsRepo", KOTLIN_LIBS_REPO)
        param("stdlib.jdkHome", "%env.$JDK_ENV_VAR%")
        param("stdlib.jvmToolchain", JVM_TOOLCHAIN)
        // Gradle 9 removed APIs that old Dokka V1-mode code may use; set this to empty for a branch that fails on it.
        param("stdlib.gradleVersion", GRADLE_VERSION)
        param("stdlib.gradleTasks", "cleanDocs ${gradleTask(target, latest)}")
    }

    vcs {
        root(root, STDLIB_DOCS_CHECKOUT_RULES)
        checkoutMode = CheckoutMode.ON_AGENT
    }

    requirements {
        equals("teamcity.agent.jvm.os.name", "Linux")
        exists("env.$JDK_ENV_VAR")
        // Dokka runs in a separate process with a 6 GB heap next to the Gradle daemon.
        noLessThan("teamcity.agent.hardware.memorySizeMb", "15000")
    }

    steps {
        script {
            id = "step-prepare-gradle"
            name = "Prepare Gradle"
            // language=bash
            scriptContent = """
                set -eu
                cat > "$INIT_SCRIPT" <<'INIT_SCRIPT_EOF'
                ${INIT_SCRIPT_CONTENT.prependIndent("                ").trimStart()}
                INIT_SCRIPT_EOF

                gradle_version="%stdlib.gradleVersion%"
                wrapper="$DOCS_PROJECT_DIR/gradle/wrapper/gradle-wrapper.properties"
                if [ -n "${'$'}gradle_version" ]; then
                    # The agent checkout resets tracked files before the next build, so this edit doesn't persist.
                    sed -i -e "s|^distributionUrl=.*|distributionUrl=https\\://services.gradle.org/distributions/gradle-${'$'}gradle_version-bin.zip|" \
                        -e '/^distributionSha256Sum=/d' "${'$'}wrapper"
                fi
                echo "Gradle wrapper:"
                grep '^distributionUrl=' "${'$'}wrapper"
            """.trimIndent()
        }
        gradle {
            id = "step-build-stdlib-docs"
            name = "Build ${target.version} docs"
            workingDir = DOCS_PROJECT_DIR
            useGradleWrapper = true
            jdkHome = "%stdlib.jdkHome%"
            tasks = "%stdlib.gradleTasks%"
            gradleParams = listOfNotNull(
                "-PdeployVersion=%stdlib.deployVersion%",
                "-PgithubRevision=%stdlib.githubRevision%",
                "-PkotlinLibsRepo=%stdlib.kotlinLibsRepo%",
                "-PtemplatesDir=%teamcity.build.checkoutDir%/$TEMPLATES_DIR",
                "-PdocsBuildDir=%teamcity.build.checkoutDir%/$OUTPUT_DIR",
                "-PdocsPreviousVersionsDir=%teamcity.build.checkoutDir%/$PREVIOUS_DIR",
                if (target.layout == StdlibDocsLayout.DOKKA2) "-PisLatest=$latest" else null,
                if (target.layout == StdlibDocsLayout.LEGACY) "-Pdokka_repository=$DOKKA_DEV_REPO" else null,
                target.dokkaVersion?.let { "-Pdokka_version=$it" },
                "--init-script $INIT_SCRIPT",
                "-PstdlibDocsJvmToolchain=%stdlib.jvmToolchain%",
                "-Porg.gradle.java.installations.fromEnv=$JDK_ENV_VAR",
                "-Porg.gradle.java.installations.auto-download=false",
                "--no-daemon",
                "--stacktrace",
            ).joinToString(" ")
        }
    }

    dependencies {
        dependsOnDokkaTemplate(StdlibPrepareDokkaTemplates, TEMPLATES_DIR)
    }
}

/**
 * Builds one version for the version selector of later releases. Runs only as a snapshot dependency.
 * Only `all-libs/<version>/` is published, even if the branch generated other versions too.
 */
fun stdlibHistoricalDocs(target: StdlibDocsVersion, root: GitVcsRoot) = BuildType {
    val versionDir = "$OUTPUT_DIR/previous/all-libs/${target.version}"

    id = RelativeId("DocumentationLibraries_Stdlib_${target.idPart}_Historical")
    name = "${target.version} historical docs"
    description = "Core API ${target.version} docs from ${target.branch}, Kotlin ${target.deployVersion}"

    artifactRules = "$versionDir/** => $PREVIOUS_VERSIONS_ARTIFACT!all-libs/${target.version}"

    stdlibDocsBuild(target, root, latest = false)

    steps {
        script {
            id = "step-check-version-output"
            name = "Check ${target.version} output"
            // language=bash
            scriptContent = """
                set -eu
                if [ ! -f "$versionDir/index.html" ]; then
                    echo "No docs for ${target.version} in $versionDir. Generated versions:"
                    ls "$OUTPUT_DIR/previous/all-libs" 2>/dev/null || echo "(none)"
                    echo "The branch must document ${target.version}: its versions list (legacy) or kotlinLanguageVersion (Dokka 2)."
                    exit 1
                fi
            """.trimIndent()
        }
    }
}

/** Builds the current version with every historical version merged into its version selector. */
fun stdlibLatestDocs(target: StdlibDocsVersion, root: GitVcsRoot, historical: List<Pair<StdlibDocsVersion, BuildType>>) = BuildType {
    id = RelativeId("DocumentationLibraries_Stdlib_${target.idPart}_Latest")
    name = "${target.version} latest docs"
    description = "Core API ${target.version} docs from ${target.branch}, Kotlin ${target.deployVersion}, " +
        "with ${historical.joinToString { it.first.version }} as older versions"

    artifactRules = """
        $OUTPUT_DIR/latest/** => $LATEST_VERSION_ARTIFACT
        -:$OUTPUT_DIR/latest/all-libs/not-found-version.html
    """.trimIndent()

    stdlibDocsBuild(target, root, latest = true)

    triggers {
        vcs {
            enabled = !isProjectPlayground()
            branchFilter = "+:<default>"
        }
    }

    // Artifacts land in separate directories so each can be cleaned; this step merges them into one tree.
    steps.items.add(0, ScriptBuildStep {
        id = "step-merge-previous-versions"
        name = "Merge historical versions"
        // language=bash
        scriptContent = """
            set -eu
            rm -rf "$PREVIOUS_DIR"
            mkdir -p "$PREVIOUS_DIR"
            for dir in "$DEPENDENCIES_DIR"/*/; do
                [ -d "${'$'}dir" ] || continue
                cp -R "${'$'}dir". "$PREVIOUS_DIR"/
            done
            echo "Older versions:"
            ls "$PREVIOUS_DIR/all-libs" 2>/dev/null || echo "(none)"
        """.trimIndent()
    })

    dependencies {
        for ((version, build) in historical) {
            dependency(build) {
                snapshot {
                    onDependencyFailure = FailureAction.FAIL_TO_START
                    onDependencyCancel = FailureAction.CANCEL
                }
                artifacts {
                    artifactRules = "$PREVIOUS_VERSIONS_ARTIFACT!** => $DEPENDENCIES_DIR/${version.idPart}"
                    cleanDestination = true
                }
            }
        }
    }
}
