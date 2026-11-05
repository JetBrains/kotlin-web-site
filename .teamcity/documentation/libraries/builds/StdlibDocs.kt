package documentation.libraries.builds

import common.extensions.dependsOnDokkaTemplate
import common.extensions.isProjectPlayground
import documentation.libraries.vcsRoots.STDLIB_DOCS_CHECKOUT_RULES
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.CheckoutMode
import jetbrains.buildServer.configs.kotlin.ParameterDisplay
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

private const val INIT_SCRIPT = "%system.teamcity.build.tempDir%/stdlib-docs.init.gradle"

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

/**
 * Tag to put on a historical run by hand once its docs are checked; the latest build takes the newest run with it.
 * Untagged runs are never published, so a rebuild replaces the published version only after it is tagged.
 */
fun historicalTag(version: String) = version

/** How a branch of `kotlin-stdlib-docs` is driven. */
enum class StdlibDocsLayout {
    /** Dokka Gradle plugin in V1 mode with versioned tasks (branches up to 2.3.20). */
    LEGACY,

    /** Dokka Gradle plugin V2 with `buildSrc` conventions and the `isLatest` property (2.4.20 and later). */
    DOKKA2,
}

class StdlibDocsVersion(
    /** Version shown in the selector, e.g. `2.4`. */
    val version: String,
    /** Released Kotlin version whose artifacts are documented, e.g. `2.4.20`. */
    val deployVersion: String,
    /** Branch of JetBrains/kotlin containing the docs build for this version. */
    val branch: String,
    val layout: StdlibDocsLayout,
    /** Overrides the branch's `dokka_version`; `null` keeps the branch default. */
    val dokkaVersion: String? = null,
)

/**
 * Shared steps of both builds. The caller defines `stdlib.version`, `stdlib.deployVersion`, `stdlib.layout` and
 * `stdlib.dokkaVersion`; they are run parameters in the historical build, so the Gradle task and the
 * layout-specific Gradle arguments are computed by a step instead of in the DSL.
 */
private fun BuildType.stdlibDocsBuild(root: GitVcsRoot, latest: Boolean) {
    params {
        param("stdlib.isLatest", latest.toString())
        param("stdlib.githubRevision", "v%stdlib.deployVersion%")
        param("stdlib.kotlinLibsRepo", KOTLIN_LIBS_REPO)
        param("stdlib.jdkHome", "%env.$JDK_ENV_VAR%")
        param("stdlib.jvmToolchain", JVM_TOOLCHAIN)
        // Gradle 9 removed APIs that old Dokka V1-mode code may use; set this to empty for a branch that fails on it.
        text(
            "stdlib.gradleVersion", GRADLE_VERSION,
            label = "Gradle version",
            description = "Replaces the branch's Gradle wrapper version. Empty keeps the wrapper.",
            allowEmpty = true,
        )
        // Set by the "Resolve layout" step.
        text("stdlib.gradleTasks", "", display = ParameterDisplay.HIDDEN, allowEmpty = true)
        text("stdlib.layoutGradleParams", "", display = ParameterDisplay.HIDDEN, allowEmpty = true)
    }

    vcs {
        root(root, STDLIB_DOCS_CHECKOUT_RULES)
        checkoutMode = CheckoutMode.ON_AGENT
    }

    requirements {
        // The steps use GNU sed. Other Linux builds in this repository select agents the same way.
        contains("docker.server.osType", "linux")
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
        script {
            id = "step-resolve-layout"
            name = "Resolve layout"
            /*
             * Legacy branches register `all-libs_<version>` for every entry of their hardcoded `versions` list, and
             * `buildAllVersions` runs all of them (the 1.6.20 branch lists 1.0–1.6). Running the single versioned task
             * lets several versions share one branch while each run produces only its own version.
             * Dokka 2 branches document only the branch's `kotlinLanguageVersion`, so the branch decides the version.
             */
            // language=bash
            scriptContent = """
                set -eu
                version="%stdlib.version%"
                case "%stdlib.layout%" in
                    ${StdlibDocsLayout.LEGACY})
                        if [ "%stdlib.isLatest%" = true ]; then task=buildLatestVersion; else task="all-libs_${'$'}version"; fi
                        params="-Pdokka_repository=$DOKKA_DEV_REPO"
                        ;;
                    ${StdlibDocsLayout.DOKKA2})
                        task=":dokkaGeneratePublicationHtml"
                        params="-PisLatest=%stdlib.isLatest%"
                        ;;
                    *)
                        echo "Unknown layout '%stdlib.layout%'"
                        exit 1
                        ;;
                esac
                dokka_version="%stdlib.dokkaVersion%"
                if [ -n "${'$'}dokka_version" ]; then
                    params="${'$'}params -Pdokka_version=${'$'}dokka_version"
                fi
                echo "Tasks: cleanDocs ${'$'}task"
                echo "Layout parameters: ${'$'}params"
                echo "##teamcity[setParameter name='stdlib.gradleTasks' value='cleanDocs ${'$'}task']"
                echo "##teamcity[setParameter name='stdlib.layoutGradleParams' value='${'$'}params']"
            """.trimIndent()
        }
        gradle {
            id = "step-build-stdlib-docs"
            name = "Build docs"
            workingDir = DOCS_PROJECT_DIR
            useGradleWrapper = true
            jdkHome = "%stdlib.jdkHome%"
            tasks = "%stdlib.gradleTasks%"
            gradleParams = listOf(
                "-PdeployVersion=%stdlib.deployVersion%",
                "-PgithubRevision=%stdlib.githubRevision%",
                "-PkotlinLibsRepo=%stdlib.kotlinLibsRepo%",
                "-PtemplatesDir=%teamcity.build.checkoutDir%/$TEMPLATES_DIR",
                "-PdocsBuildDir=%teamcity.build.checkoutDir%/$OUTPUT_DIR",
                "-PdocsPreviousVersionsDir=%teamcity.build.checkoutDir%/$PREVIOUS_DIR",
                "%stdlib.layoutGradleParams%",
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
 * Builds one older version for the version selector of the latest build. Started manually with custom run parameters;
 * only `all-libs/<version>/` is published, even if the branch generated other versions too.
 */
fun stdlibHistoricalDocs(root: GitVcsRoot) = BuildType {
    val versionDir = "$OUTPUT_DIR/previous/all-libs/%stdlib.version%"

    id = RelativeId("DocumentationLibraries_Stdlib_Historical")
    name = "Historical docs"
    description = "One older Core API version, set by the run branch and parameters. Tag a good run with its version, e.g. ${historicalTag("2.3")}, to publish it"
    buildNumberPattern = "%stdlib.version%-%build.counter%"

    artifactRules = "$versionDir/** => $PREVIOUS_VERSIONS_ARTIFACT!all-libs/%stdlib.version%"

    params {
        text(
            "stdlib.version", "",
            label = "Version",
            description = "Version shown in the selector, e.g. 2.3",
            display = ParameterDisplay.PROMPT,
            regex = """\d+\.\d+""",
            validationMessage = "Use <major>.<minor>, e.g. 2.3",
        )
        text(
            "stdlib.deployVersion", "",
            label = "Kotlin release",
            description = "Released Kotlin version whose Maven Central artifacts are documented, e.g. 2.3.21",
            display = ParameterDisplay.PROMPT,
            regex = """\d+\.\d+\.\d+\S*""",
            validationMessage = "Use a released Kotlin version, e.g. 2.3.21",
        )
        select(
            "stdlib.layout", StdlibDocsLayout.LEGACY.name,
            label = "Layout",
            description = "Legacy for branches up to 2.3.20, Dokka 2 for 2.4.20 and later",
            display = ParameterDisplay.PROMPT,
            options = listOf(
                "Legacy (Dokka V1 mode)" to StdlibDocsLayout.LEGACY.name,
                "Dokka 2" to StdlibDocsLayout.DOKKA2.name,
            ),
        )
        text(
            "stdlib.dokkaVersion", "",
            label = "Dokka version",
            description = "Overrides the branch's dokka_version. Empty keeps the branch default.",
            display = ParameterDisplay.PROMPT,
            allowEmpty = true,
        )
    }

    stdlibDocsBuild(root, latest = false)

    steps {
        script {
            id = "step-check-version-output"
            name = "Check output"
            // language=bash
            scriptContent = """
                set -eu
                if [ ! -f "$versionDir/index.html" ]; then
                    echo "No docs for %stdlib.version% in $versionDir from branch %teamcity.build.branch%. Generated versions:"
                    ls "$OUTPUT_DIR/previous/all-libs" 2>/dev/null || echo "(none)"
                    echo "The branch must document %stdlib.version%: its versions list (legacy) or kotlinLanguageVersion (Dokka 2)."
                    exit 1
                fi
            """.trimIndent()
        }
    }
}

/**
 * Builds the current version with older versions merged into its selector. Each older version listed in
 * `stdlib.historicalVersions` comes from the newest run of [historical] tagged with it.
 *
 * Artifact dependencies can't be optional: one with no matching tagged build stops the build from starting.
 * The versions are a run parameter instead, and a step downloads them through the REST API.
 */
fun stdlibLatestDocs(target: StdlibDocsVersion, root: GitVcsRoot, historical: BuildType, historicalVersions: List<String>) = BuildType {
    id = RelativeId("DocumentationLibraries_Stdlib_Latest")
    name = "${target.version} latest docs"
    description = "Core API ${target.version} docs from ${target.branch} by default, Kotlin ${target.deployVersion}, " +
        "with tagged historical runs as older versions"

    artifactRules = """
        $OUTPUT_DIR/latest/** => $LATEST_VERSION_ARTIFACT
        -:$OUTPUT_DIR/latest/all-libs/not-found-version.html
    """.trimIndent()

    // RelativeId.value already resolves to the absolute ID used by the REST API.
    val historicalId = checkNotNull(historical.id).value

    params {
        param("stdlib.version", target.version)
        param("stdlib.deployVersion", target.deployVersion)
        param("stdlib.layout", target.layout.name)
        param("stdlib.dokkaVersion", target.dokkaVersion.orEmpty())
        text(
            "stdlib.historicalVersions", historicalVersions.joinToString(" "),
            label = "Older versions",
            description = "Space-separated versions for the selector, each taken from the newest historical run " +
                "tagged with it. Empty publishes no older versions.",
            allowEmpty = true,
        )
    }

    stdlibDocsBuild(root, latest = true)

    triggers {
        vcs {
            enabled = !isProjectPlayground()
            branchFilter = "+:<default>"
        }
    }

    steps.items.add(0, ScriptBuildStep {
        id = "step-download-previous-versions"
        name = "Download historical versions"
        // language=bash
        scriptContent = """
            set -eu
            rm -rf "$PREVIOUS_DIR" "$DEPENDENCIES_DIR"
            mkdir -p "$PREVIOUS_DIR" "$DEPENDENCIES_DIR"
            api="%teamcity.serverUrl%/httpAuth/app/rest/builds"
            auth="%system.teamcity.auth.userId%:%system.teamcity.auth.password%"
            missing=""
            for version in %stdlib.historicalVersions%; do
                tag="${historicalTag("${'$'}version")}"
                # Historical runs are on any branch; the REST API defaults to the default branch only.
                build="buildType:(id:$historicalId),tag:${'$'}tag,branch:(default:any),count:1"
                if ! number=${'$'}(curl -fsS -u "${'$'}auth" "${'$'}api/${'$'}build/number" 2>/dev/null); then
                    missing="${'$'}missing ${'$'}version"
                    continue
                fi
                echo "${'$'}version: historical run #${'$'}number"
                zip="${'$'}PWD/$DEPENDENCIES_DIR/${'$'}version.zip"
                curl -fsS -u "${'$'}auth" -o "${'$'}zip" "${'$'}api/${'$'}build/artifacts/files/$PREVIOUS_VERSIONS_ARTIFACT"
                (cd "$PREVIOUS_DIR" && "%stdlib.jdkHome%/bin/jar" xf "${'$'}zip")
            done
            if [ -n "${'$'}missing" ]; then
                echo "No historical run tagged with:${'$'}missing. Tag a run or remove the versions from stdlib.historicalVersions."
                exit 1
            fi
            echo "Older versions:"
            ls "$PREVIOUS_DIR/all-libs" 2>/dev/null || echo "(none)"
        """.trimIndent()
    })
}
