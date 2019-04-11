[[include pages-includes/docs/tutorials/native/lets-create-gradle-build.md]]
[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-from-c-code.md]]

You may also download the project skeleton directly from 
[[include pages-includes/docs/tutorials/native/mapping-primitive-data-types-from-c-link.md]]


The project file configures the C interop as an additional step of the build.
Let's move the `interop.def` file to the `src/nativeInterop/cinterop` directory.
Gradle recommends using conventions instead of configurations,
for example, the sources path `src/nativeMain/kotlin` and the 
`.def` file are expected to both be in `src/nativeInterop/cinterop/interop.def`.
By default, all the symbols from C are imported to the `interop` package,
we may want to import the whole package in our `.kt` files.
Check out the [kotlin-multiplatform](/docs/reference/building-mpp-with-gradle.html)
plugin documentation to learn about all the different ways you could configure it.
