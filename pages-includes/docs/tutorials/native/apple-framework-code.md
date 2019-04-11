
<div class="multi-language-sample" data-lang="groovy" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '1.3.21'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

wrapper {
  gradleVersion = "5.3.1"
  distributionType = "ALL"
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="kotlin" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```
plugins {
    kotlin("multiplatform") version "1.3.21"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      framework {
        baseName = "Demo"
      }
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "5.3.1"
  distributionType = Wrapper.DistributionType.ALL
}
```

</div>
</div>

