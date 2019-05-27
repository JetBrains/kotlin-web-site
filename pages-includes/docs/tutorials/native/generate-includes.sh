#!/bin/bash

set -e -x -u
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
ROOT="$( cd "${DIR}" && cd "../../../.." && pwd)"

echo "Root directory is $ROOT"

EXTERNAL="$ROOT/external"
SAMPLES_REPO="$EXTERNAL/kotlin-web-site-samples"

if [[ ! -d "$EXTERNAL" ]] ; then
    mkdir "$EXTERNAL"
fi

if [[ ! -d "$SAMPLES_REPO" ]] ; then
   git clone https://github.com/kotlin/web-site-samples.git "$SAMPLES_REPO"
else
   git "--git-dir=$SAMPLES_REPO/.git" fetch
fi

function generate_code_block {
  code_target="$DIR/$1-code.md"
  link_target="$DIR/$1-link.md"

  branch="$2"
  remoteBranch="origin/$branch"
  lang=$3
  os=$4
  fileInBranch=$5

  zipUrl=https://github.com/kotlin/web-site-samples/archive/$branch.zip
  code="$(git "--git-dir=$SAMPLES_REPO/.git" show $remoteBranch:$fileInBranch)"
  code="$(echo "$code" | sed '/./,$!d' | sed -e :a -e '/^\n*$/{$d;N;};/\n$/ba')"

  echo ""                                                                          >> $code_target
  echo "<div class=\"multi-language-sample\" data-lang=\"$lang\" data-os=\"$os\">" >> $code_target
  echo "<div class=\"sample\" markdown=\"1\" theme=\"idea\" mode=\"$lang\" data-highlight-only>"   >> $code_target
  echo ""                                                                          >> $code_target
  echo '```'                                                                       >> $code_target
  echo "$code"                                                                     >> $code_target
  echo '```'                                                                       >> $code_target
  echo ""                                                                          >> $code_target
  echo "</div>"                                                                    >> $code_target
  echo "</div>"                                                                    >> $code_target
  echo ""                                                                          >> $code_target

  echo "<span class=\"multi-language-span\" data-lang=\"$lang\" data-os=\"$os\">"  >> $link_target
  echo "[GitHub]($zipUrl)." >> $link_target
  echo "</span>" >> $link_target
}


rm -f $DIR/*-code.md
rm -f $DIR/*-link.md

generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-groovy-macos   groovy macos   build.gradle
generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-groovy-linux   groovy linux   build.gradle
generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-groovy-windows groovy windows build.gradle

generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-kotlin-macos   kotlin macos   build.gradle.kts
generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-kotlin-linux   kotlin linux   build.gradle.kts
generate_code_block "basic-kotlin-native-app-codeblocks" mpp-kn-app-kotlin-windows kotlin windows build.gradle.kts


generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-groovy-macos-c   groovy macos   build.gradle
generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-groovy-linux-c   groovy linux   build.gradle
generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-groovy-windows-c groovy windows build.gradle

generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-kotlin-macos-c   kotlin macos   build.gradle.kts
generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-kotlin-linux-c   kotlin linux   build.gradle.kts
generate_code_block "mapping-primitive-data-types-from-c" mpp-kn-app-kotlin-windows-c kotlin windows build.gradle.kts


generate_code_block "dynamic-library"  mpp-kn-shared-lib-groovy-linux   groovy linux   build.gradle
generate_code_block "dynamic-library"  mpp-kn-shared-lib-groovy-macos   groovy macos   build.gradle
generate_code_block "dynamic-library"  mpp-kn-shared-lib-groovy-windows groovy windows build.gradle

generate_code_block "dynamic-library"  mpp-kn-shared-lib-kotlin-linux   kotlin linux   build.gradle.kts
generate_code_block "dynamic-library"  mpp-kn-shared-lib-kotlin-macos   kotlin macos   build.gradle.kts
generate_code_block "dynamic-library"  mpp-kn-shared-lib-kotlin-windows kotlin windows build.gradle.kts

generate_code_block "apple-framework"  mpp-kn-framework-groovy-macos-mac      groovy macos   build.gradle
generate_code_block "apple-framework"  mpp-kn-framework-kotlin-macos-mac      kotlin macos   build.gradle.kts
