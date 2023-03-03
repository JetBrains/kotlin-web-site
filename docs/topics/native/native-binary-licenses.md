[//]: # (title: License files for the Kotlin/Native binaries)

Like many other open-source projects, Kotlin relies on third-party work. This means that the Kotlin project also
includes the code developed not by JetBrains s.r.o. or the Kotlin programming language contributors. Sometimes it is not
the exact code but derived work, like the code rewritten from C++ to Kotlin.

> You can find licenses for the third-party work used in the Kotlin compiler in
> our [GitHub repository](https://github.com/JetBrains/kotlin/tree/master/license/third_party).
>
{type="tip"}

In particular, the Kotlin/Native compiler produces binaries that can include third-party code, data, or derived work.
This means that the Kotlin/Native-compiled binaries are subject to the terms and conditions of the corresponding
licenses.

In practice, if you distribute a Kotlin/Native-compiled [final binary](https://kotlinlang.org/docs/multiplatform-build-native-binaries.html),
you should always include necessary license files into your binary distribution. The files in a readable form should be
accessible to users of your distribution.

> You can find licenses for the third-party work used in Kotlin/Native in
> our [GitHub repository](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party).
>
{type="tip"}

Always include the following license files for the corresponding projects:

<table>
   <tr>
      <th>Project</th>
      <th>Files to be included</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="3">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Copyright notice</a></li>
         </list>
        </td>
   </tr>
   <tr>
        <td><a href="https://harmony.apache.org/">Harmony</a></td>
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
          <p>Always include, unless you use the system memory allocator (the <code>-Xallocator=std</code> compiler option is set)</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode character database</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a></td>
   </tr>
</table>

Specific targets additionally require the following license files:

| Project                                                               | Targets  | Files to be included                                                                                                                                                                                                                                                                                                                       | 
|-----------------------------------------------------------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 headers and runtime libraries](https://www.mingw-w64.org/) | `mingw*` | <list><ul><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 runtime license</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">MinGW-w64 copyright</a></li></ul></list> |
| [Musl (math implementation)](https://musl.libc.org/)                  | `wasm32` | [Copyright notice](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/main/cpp/math/COPYRIGHT)                                                                                                                                                                                                                      |

> None of these libraries require the distributed Kotlin/Native binaries to be open-sourced.
>
{type="note"}
