[//]: # (title: License files for the Kotlin/Native binaries)

Like many other open-source projects, Kotlin relies on third-party code, meaning that the Kotlin project includes some code
not developed by JetBrains or the Kotlin programming language contributors.
Sometimes it is derived work, such as code rewritten from C++ to Kotlin.

>  You can find licenses for the third-party work used in Kotlin in our GitHub repository:
>
> * [Kotlin compiler](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{type="note"}

In particular, the Kotlin/Native compiler produces binaries that can include third-party code, data, or derived work.
This means that the Kotlin/Native-compiled binaries are subject to the terms and conditions of the third-party licenses.

In practice, if you distribute a Kotlin/Native-compiled [final binary](multiplatform-build-native-binaries.md),
you should always include necessary license files in your binary distribution. The files should be accessible
to users of your distribution in a readable form.

Always include the following license files for the corresponding projects:

<table>
   <tr>
      <th>Project</th>
      <th>Files to be included</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony copyright notice</a></li>
         </list>
        </td>
   </tr>
   <tr>
        <td><a href="https://harmony.apache.org/">Apache Harmony</a></td>
   </tr>
   <tr>
        <td><a href="https://www.gwtproject.org/">GWT</a></td>
   </tr>
   <tr>
        <td><a href="https://guava.dev">Guava</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">3-clause BSD license with copyright notice</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT license</a></p>
          <p>Always include, unless you use the system memory allocator (the <code>-Xallocator=std</code> compiler option is set). For more information on allocators, see <a href="native-memory-manager.md">Kotlin/Native memory management</a></p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode character database</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a></td>
   </tr>
</table>

Specific targets require additional license files:

| Project                                                               | Targets  | Files to be included                                                                                                                                                                                                                                                                                                              | 
|-----------------------------------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | `mingw*` | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime license</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads license</a></li></list> |
| [Musl (math implementation)](https://musl.libc.org/)                  | `wasm32` | [Musl copyright notice](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/main/cpp/math/COPYRIGHT)                                                                                                                                                                                                        |

> None of these libraries require the distributed Kotlin/Native binaries to be open-sourced.
>
{type="note"}
