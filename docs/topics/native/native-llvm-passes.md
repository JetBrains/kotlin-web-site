[//]: # (title: Advanced tips for customizing LLVM backend)

<show-structure depth="1"/>

## Customizing how Kotlin/Native uses LLVM

The Kotlin/Native compiler uses [LLVM](https://llvm.org/) to optimize and generate binary executables for the different
target platforms. A noticeable part of the compilation time is also spent in LLVM, and for large apps, this can end up
taking unacceptably long. 

Before proceeding, add the `-Xprofile-phases` compiler argument to your build and run the `linkRelease*` task and
examine the log output. This will generate a lot of output in the build log; tens of thousands of lines. At the end of
the log, there will be sections with LLVM profiling. Here is an excerpt from such a run of a simple Kotlin/Native
program:

```
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

The default behavior for a release binary compilation is to run the same LLVM optimization passes that clang would for
C++. The Kotlin/Native compiler runs two separate sequences of LLVM optimizations; the module passes and the link-time
passes. In the above log, the two are called `ModuleBitcodeOptimization` and `LTOBitcodeOptimization`. For a typical
compilation, the two pipelines are run back to back, and the only real distinction is in what LLVM optimization passes
they run. In the log above, the formatted tables are output from the LLVM optimizations, with timing for each pass.

### Customize LLVM optimization passes

If one of the passes above stands out as taking unreasonably long, one possibility is to skip that particular pass. This
might hurt runtime performance, so we should check for changes in benchmarks performance afterward. There is no direct
way to disable a given pass. Instead, we must provide a new list of passes to run. This is done by using the following
compiler options:

| **Option**                 | **Default value for release binary** |
|----------------------------|--------------------------------------|
| `-Xllvm-module-passes=...` | `"default<O3>"`                      |
| `-Xllvm-lto-passes=...`    | `"internalize,globaldce,lto<O3>"`    |

The default values are unfolded to a long list of actual passes to run, from which we need to exclude the undesired pass
or passes. To find out what the actual passes are, we need to run the
[`opt`](https://llvm.org/docs/CommandGuide/opt.html) tool, which is automatically downloaded with the LLVM distribution
in `~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin`. E.g., to find out what the link-time passes are,
we need to run

    opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null

This prints out a warning and a very long string of passes, where the exact passes depends on the version of LLVM. There
are two differences from what `opt` prints out and what the Kotlin/Native compiler runs. First, since `opt` is a debug
tool, it includes one or more `verify` passes, which are not normally run. Second, Kotlin/Native disables the `devirt`
passes, since these are already done better by the Kotlin compiler itself.

After disabling any passes, we should always rerun performance tests, to check if the runtime performance degradation is
acceptable.

