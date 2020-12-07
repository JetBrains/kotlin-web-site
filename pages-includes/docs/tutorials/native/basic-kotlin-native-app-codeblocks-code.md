<div class="multi-language-sample" data-lang="groovy" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64('native') {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '{{ site.data.releases.tutorials.native.gradle_version }}'
  distributionType = 'BIN'
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="groovy" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64('native') {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '{{ site.data.releases.tutorials.native.gradle_version }}'
  distributionType = 'BIN'
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="groovy" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}

repositories {
    mavenCentral()
}

kotlin {
  mingwX64('native') {
    binaries {
      executable()
    }
  }
}

wrapper {
  gradleVersion = '{{ site.data.releases.tutorials.native.gradle_version }}'
  distributionType = 'BIN'
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="kotlin" data-os="macos">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  macosX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.BIN
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="kotlin" data-os="linux">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  linuxX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.BIN
}
```

</div>
</div>


<div class="multi-language-sample" data-lang="kotlin" data-os="windows">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```
plugins {
    kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}

repositories {
    mavenCentral()
}

kotlin {
  mingwX64("native") {
    binaries {
      executable()
    }
  }
}

tasks.withType<Wrapper> {
  gradleVersion = "{{ site.data.releases.tutorials.native.gradle_version }}"
  distributionType = Wrapper.DistributionType.BIN
}
```

</div>
</div>
