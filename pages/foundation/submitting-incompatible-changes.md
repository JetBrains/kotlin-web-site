---
type: doc
layout: foundation
title: "Guide to Submitting Incompatible Changes"
---


# Guide to Submitting Incompatible Changes

A proposal is usually written by a developer responsible for the change or the relevant subsystems. It has to be described in the [issue tracker](https://youtrack.jetbrains.net/issues/KT?q=%23for-language-committee%20%23Unresolved%20tag:%20-language-committee-approved) and marked with the "for-language-committee" tag. To provide all the necessary details, issue in the tracker should follow the template below.

# Issue template

The issue should follow this template:

```
# Classification

Type of change: <see guide below>
Motivation types: <see guide below>
Impact types: <see guide below>
Detection and Migration modes: <see guide below>

# Background
> Optional Section. Describe the background of the issue and possibly some motivation
# Existing behaviour
> 1. (Minimal) code example
> 2. What's wrong with it
> 3. Detailed explanation of why and how this happens
> 4. Any known reasoning behind such behavior 

# Proposed changes
> 1. Proposed changes
> 2. How it fixes the issue?

# Impact
> Examples of negative effects: changes of behavior, previously compiled code forbidden, etc.
> If possible: 
> * number of impacted users
> * how common this pattern is
> * if we believe it's a rare case, why
> * is automated migration possible

# Migration plan
> Provide a detailed step-by-step migration plan
```



# Classification

This section needs to classify the change, without describing its essence. The classification is used by the Committee to quickly assess the severity of the issue. Here are the common categories to be used. 

This section can be used as a checklist of things that need to be evaluated/thought of.


## Type of change

Specify one or more of the following:
*   New errors are introduced
*   Some valid language constructs change their meaning
*   Change in the standard library
    *   API removal
        *   Affecting ABI
        *   Not affecting ABI
    *   API moved to different artifact
    *   API type signature change 
        *   Affecting ABI
        *   Not affecting ABI
    *   Contract refinement
    *   Other contract changes
*   Change in compilation strategy
    *   Change in ABI
    *   Change in the behavior of generated code
*   Change in interoperability layer(s)


## Motivation types

Specify one or more of the following:
*   User code fails with exception(s)
*   Compiler/Tooling fails with exception(s)
*   The implementation does not abide by a published spec or documentation
*   Type safety guarantees are not met (including fail-fast behavior for non-null types)
*   Separate/incremental compilation guarantees are not met
*   API stability guarantees are not met
*   ABI stability guarantees are not met
*   Implementation changes are required for implementation design/architectural reasons
*   Problematic/meaningless usage patterns need to be discouraged/blocked (e.g. counterintuitive behaviors)
    *   Code is error-prone
    *   Code can't be compiled correctly
*   Some prospective language changes are blocked
*   Inconsistency in the design (things are done differently in different contexts)
*   Redundant/outdated mechanism


## Impact types

*   **Compilation**. Some code that used to compile won't compile any more
    *   Such code always caused the compiler to fail with exception
    *   Such code always threw an exception immediately upon execution or could not link
    *   Such code inevitably caused exceptions to be thrown somewhere down the line after it was executed
    *   There were cases when such code worked with no exceptions
        *   There was a warning reported on all such code
        *   Some such code could compile without any warnings
*   **Binaries**. Some binary metadata will change after recompilation
    *   Internal (and maybe private) signatures
        *   None of them could have been called from other languages
        *   Some of them may have been callable from other languages (Java/JS/C/Swift/...)
    *   Public and/or protected signatures may change
*   **Behavior** changes
    *   Exceptions
        *   Some exceptions may change their type or place, but all code that ran without exceptions keeps doing so
            *   Some exceptions can be thrown earlier than before
            *   Some exceptions can be thrown later than before
            *   Some exceptions change their type, but not the point of execution at which they are thrown
                *   The new type is a subtype of the old one
                *   The new type is not a subtype of the old one
        *   Some code that compiled and ran without exceptions will throw exceptions in the new version
    *   The behavior in question belongs under a previously released specification, contract or official documentation
        *   By the contract, the old behavior is incorrect (thus a fix is needed)
        *   The contract doesn't specify this behavior
            *   The new behaviour needs to be specified
            *   The new behavior will remain unspecified
        *   The new behavior contradicts the contract (i.e. the contract has to be changed)
*   **Performance and code size**
    *   Some code may run slower (including "small" changes like extra checks and indirections)
    *   Some code may make more allocations or otherwise consume more memory
    *   Code size may increase
        *   The increase in code size is constant regardless of the source
        *   The increase in code size is proportional to some parameters of the source


## Detection and Migration modes

*   All code locations affected by this change can be accurately detected statically
*   Some, but not all code locations affected by this change can be accurately detected statically
*   No code locations affected by this change can be accurately detected statically
*   Migration can be fully automated
*   Some automated migration is possible
*   Migration can't be automated
