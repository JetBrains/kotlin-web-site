[//]: # (title: Kotlin Multiplatform for mobile samples)

This is a curated list of cross-platform mobile projects created with Kotlin Multiplatform.

> You can find even more sample projects on GitHub, see the [`kotlin-multiplatform-mobile` topic](https://github.com/topics/kotlin-multiplatform-mobile).
>
> If you want to add your Kotlin Multiplatform project to this topic and help the community,
> follow the instructions in the [GitHub documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics#adding-topics-to-your-repository).
>
{type="tip"}

<table>
  <tr>
    <td>Sample name</td>
    <td>What's shared?</td>
    <td>Popular libraries used</td>
    <td>UI Framework</td>
    <td>iOS integration</td>
    <td>Platform APIs</td>
    <td>Tests</td>
    <td>Features</td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/Kotlin/kmm-basic-sample">Kotlin Multiplatform Mobile Sample</a></strong>
    </td>
    <td>Algorithms</td>
    <td>-</td>
    <td>XML, SwiftUI</td>
    <td>Xcode build phases</td>
    <td>✅</td>
    <td>-</td>
    <td>
      <list>
        <li><code>expect</code>/<code>actual</code> declarations</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/Kotlin/kmm-production-sample">KMM RSS Reader</a></strong>
    </td>
    <td>Models, Networking, Data Storage, UI State</td>
    <td>SQLDelight, Ktor, DateTime, multiplatform-settings, Napier, kotlinx.serialization</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>Xcode build phases</td>
    <td>✅</td>
    <td>-</td>
    <td>
      <list>
        <li>Redux for sharing UI State</li>
        <li>Published to Google Play and App Store</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/KaterinaPetrova/kmm-ktor-sample">kmm-ktor-sample</a></strong>
    </td>
    <td>Networking</td>
    <td>Ktor, kotlinx.serialization, Napier</td>
    <td>XML, SwiftUI</td>
    <td>Xcode build phases</td>
    <td>-</td>
    <td>-</td>
    <td>
      <list>
        <li><a href="https://www.youtube.com/watch?v=_Q62iJoNOfg%26list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C%26index=2">Video tutorial</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td><strong><a href="https://github.com/JetBrains/compose-jb/tree/master/examples/todoapp">todoapp</a></strong></td>
    <td>Models, Networking, Presentation, Navigation and UI </td>
    <td>SQLDelight, Decompose, MVIKotlin, Reaktive</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>Xcode build phases</td>
    <td>-</td>
    <td>✅</td>
    <td>
      <list>
        <li>99% of the code is shared</li>
        <li>MVI architectural pattern</li>
        <li>Shared UI across Android, Desktop and Web via <a href="https://www.jetbrains.com/lp/compose-mpp/">Compose Multiplatform</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/KaterinaPetrova/mpp-sample-lib">mpp-sample-lib</a></strong>
    </td>
    <td>Algorithms</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>✅</td>
    <td>-</td>
    <td>
      <list>
        <li>Demonstrates how to create a multiplatform library (<a href="https://dev.to/kathrinpetrova/series/11926">tutorial</a>)</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/touchlab/KaMPKit">KaMPKit</a></strong>
    </td>
    <td>Models, Networking, Data Storage, ViewModels</td>
    <td>Koin, SQLDelight, Ktor, DateTime, multiplatform-settings, Kermit</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>CocoaPods</td>
    <td>-</td>
    <td>✅</td>
    <td>-</td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/joreilly/PeopleInSpace">PeopleInSpace</a></strong>
    </td>
    <td>Models, Networking, Data Storage</td>
    <td>Koin, SQLDelight, Ktor</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>CocoaPods, Swift Packages</td>
    <td>-</td>
    <td>✅</td>
    <td>
      <p>Target list:</p>
      <list>
        <li>Android Wear OS</li>
        <li>iOS</li>
        <li>watchOS</li>
        <li>macOS Desktop (Compose for Desktop)</li>
        <li>Web (Compose for Web)</li>
        <li>Web (Kotlin/JS + React Wrapper)</li>
        <li>JVM</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/dbaroncelli/D-KMP-sample">D-KMP-sample</a></strong>
    </td>
    <td>Networking, Data Storage, ViewModels, Navigation</td>
    <td>SQLDelight, Ktor, DateTime, multiplatform-settings</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>Xcode build phases</td>
    <td>-</td>
    <td>✅</td>
    <td>
      <list>
        <li>Implements the MVI pattern and the unidirectional data flow</li>
        <li>Uses Kotlin's StateFlow to trigger UI layer recompositions</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/mitchtabian/Food2Fork-KMM">Food2Fork Recipe App</a></strong>
    </td>
    <td>Models, Networking, Data Storage, Interactors</td>
    <td>SQLDelight, Ktor, DateTime</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>CocoaPods</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/realm/realm-kotlin-samples/tree/main/Bookshelf">Bookshelf</a></strong>
    </td>
    <td>Models, Networking, Data Storage</td>
    <td>Realm-Kotlin, Ktor, kotlinx.serialization</td>
    <td>Jetpack Compose, SwiftUI</td>
    <td>CocoaPods</td>
    <td>-</td>
    <td>-</td>
    <td>
      <list>
        <li> Uses <a href="https://www.mongodb.com/docs/realm/sdk/kotlin/">Realm</a> for data persistence </li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="https://github.com/VictorKabata/Notflix">Notflix</a></strong>
    </td>
    <td>Models, Networking, Caching, ViewModels</td>
    <td>Koin, Ktor, Multiplatform settings, kotlinx.coroutines, kotlinx.serialization, kotlinx.datetime, Napier</td>
    <td>Jetpack Compose-Android, Compose Multiplatform-Desktop</td>
    <td>-</td>
    <td>✅</td>
    <td>-</td>
    <td>
      <list>
        <li>Modular architecture</li>
        <li>Runs on desktop</li>
        <li>Sharing viewmodel</li>
      </list>
    </td>
  </tr>
</table>
