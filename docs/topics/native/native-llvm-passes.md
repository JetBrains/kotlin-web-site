[//]: # (title: Tips for customizing LLVM backend)
<primary-label ref="advanced"/>

The Kotlin/Native compiler uses [LLVM](https://llvm.org/) to optimize and generate binary executables for different
target platforms. A noticeable part of the compilation time is also spent in LLVM, and for large apps, this can end up
taking an unacceptably long time.

You can customize how Kotlin/Native uses LLVM and adjust the list of optimization passes.

## Examine the build log

Let's take a look at the build log to understand how much compilation time is spent on LLVM optimization passes:

1. Add the `-Xprofile-phases` compiler argument to your build.
2. Run the `linkRelease*` task. By default, a release binary compilation runs the same LLVM optimization passes that clang
   would for C++.
3. Examine the generated output in the build log. The log can contain tens of thousands of lines; sections with LLVM
   profiling are at the end.

Here is an excerpt from such a run of a simple Kotlin/Native program:

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

The Kotlin/Native compiler runs two separate sequences of LLVM optimizations: the module passes and the link-time
passes. For a typical compilation, the two pipelines are run back to back, and the only real distinction is in which
LLVM optimization passes they run.

In the log above, the two LLVM optimizations are `ModuleBitcodeOptimization` and `LTOBitcodeOptimization`. The formatted
tables are the optimizations' output with timing for each pass.

## Customize LLVM optimization passes

If one of the passes above seems unreasonably long, you can skip it. However, this might hurt runtime performance, so
you should check for changes in the benchmarks' performance afterward.

There is no direct way to disable a given pass. However, you can provide a new list of passes to run by using the
following compiler options:

| **Option**             | **Default value for release binary** |
|------------------------|--------------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                      |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"`    |

The default values are unfolded to a long list of actual passes, from which you need to exclude the undesired ones.

To get the list of actual passes, run the [`opt`](https://llvm.org/docs/CommandGuide/opt.html) tool, which is
automatically downloaded with the LLVM distribution to the
`~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` directory.

For example, to get the list of the link-time passes, run:

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

This outputs a warning and a long list of passes, which depends on the LLVM version.

There are two differences between the list of passes from the `opt` tool and the passes that Kotlin/Native
compiler actually runs:

* Since `opt` is a debug tool, it includes one or more `verify` passes, which are not normally run.
* Kotlin/Native disables the `devirt` passes since the Kotlin compiler already does them itself.

After disabling any passes, always rerun performance tests to check if the runtime performance degradation is acceptable.
