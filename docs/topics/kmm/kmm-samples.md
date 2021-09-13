[//]: # (title: Samples)
[//]: # (auxiliary-id: Samples)

This is a curated list of Kotlin Multiplatform Mobile (KMM) samples.

Do you have a great idea for a sample, or one you would like to add to the list?  
Feel free to [reach out to us](mailto:kmm.feedback@kotlinlang.org) and tell us about it!

<table>
    <tr>
      <td>Sample name</td>
      <td>What's shared?</td>
      <td>Popular libraries used</td>
      <td>UI Framework</td>
      <td>iOS integration</td>
      <td>Platform APIs</td>
      <td>Tests</td>
      <td>JS target</td>
      <td>Features</td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/Kotlin/kmm-basic-sample">kmm-basic-sample</a></strong>
      </td>
      <td>Algorithms</td>
      <td>-</td>
      <td>XML, SwiftUI</td>
      <td>Xcode build phases</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td><ul><li><code>expect</code>/<code>actual</code> declarations</li></ul></td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/Kotlin/kmm-production-sample">kmm-production-sample</a></strong>
      </td>
      <td>Models, Networking, Data Storage, UI State</td>
      <td>SQLDelight, Ktor, DateTime, multiplatform-settings, Napier, kotlinx.serialization</td>
      <td>Jetpack Compose, SwiftUI</td>
      <td>Xcode build phases</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td><ul><li>Redux for sharing UI State</li>
<li>Published to Google Play and AppStore</li></ul></td>
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
      <td>-</td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/icerockdev/moko-template">moko-template</a></strong>
      </td>
      <td>Models, Networking, Data Storage, ViewModels</td>
      <td>Moko Libraries, Ktor, multiplatform-settings</td>
      <td>-</td>
      <td>CocoaPods</td>
      <td>-</td>
      <td>✅</td>
      <td>-</td>
      <td><ul><li>Modular architecture</li>
<li>Shared features: Resource management, Runtime permissions access, Media access, UI lists management</li><li>Network layer generation from OpenAPI.</li></ul></td>
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
      <td>✅</td>
      <td><ul>Targets list:<li> Android Wear OS</li><li>iOS</li><li>watchOS</li><li>macOS Desktop (Compose for Desktop)</li><li>Web (Compose for Web)</li><li>Web (Kotlin/JS + React Wrapper)</li><li>JVM</li></ul>
</td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://gitlab.com/terrakok/gitlab-client">GitFox SDK</a></strong>
      </td>
      <td>Models, Networking, Interactors</td>
      <td>Ktor</td>
      <td>XML, UIKit</td>
      <td>Xcode build phases</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>
        <ul>
            <li>Integrated into Flutter app</li>
        </ul>
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
      <td>✅</td>
      <td>
        <ul>
            <li>Implements the MVI pattern and the unidirectional data flow</li>
            <li>Uses Kotlin's StateFlow to trigger UI layer recompositions</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/mitchtabian/Food2Fork-KMM">Food2Fork-KMM</a></strong>
      </td>
      <td>Models, Networking, Data Storage, Interactors</td>
      <td>SQLDelight, Ktor, DateTime</td>
      <td>Jetpack Compose, SwiftUI</td>
      <td>CocoaPods</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
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
      <td>-</td>
      <td><ul><li><a href="https://www.youtube.com/watch?v=_Q62iJoNOfg&amp;list=PLlFc5cFwUnmy_oVc9YQzjasSNoAk4hk_C&amp;index=2">Video tutorial</a></li></ul></td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/CurrencyConverterCalculator/CCC">Currency Converter Calculator</a></strong>
      </td>
      <td>Models, Networking, Data Storage, Algorithms, ViewModels</td>
      <td>Ktor, SQLDelight, koin, moko-resources, kotlinx.datetime, multiplatform-settings</td>
      <td>XML, SwiftUI</td>
      <td>CocoaPods</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td><ul><li>Logic shared with the backend</li></ul></td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/Kotlin/kmm-with-cocoapods-sample">kmm-with-cocoapods-sample</a></strong>
      </td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>CocoaPods</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>
        <strong><a href="https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample">kmm-with-cocoapods-multitarget-xcode-sample</a></strong>
      </td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>CocoaPods</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
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
      <td>✅</td>
      <td><ul><li>Demonstrates how to create a multiplatform library</li></ul></td>
</tr>
</table>