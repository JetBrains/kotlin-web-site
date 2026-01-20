[//]: # (title: What's new in Kotlin %kotlinEapVersion%)



_[Released: %kotlinEapReleaseDate%](eap.md#build-details)_

<!--
> This document doesn't cover all of the features of the Early Access Preview (EAP) release,
> but it highlights some major improvements.
>
> See the full list of changes in the [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%).
>
{style="note"}

-->

The Kotlin %kotlinEapVersion% release is out!

## New stable features
<primary-label ref="stable"/>

The following features are [Stable](components-stability.md#stability-levels-explained) in this release.

### Support for `io.vertx.codegen.annotations.Nullable` annotation
<secondary-label ref="jvm"/>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend lectus at tellus vehicula, eget congue velit congue.
Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas porta cursus lacus ut maximus. Mauris vitae lorem sed
est tempor sagittis sit amet nec ex. Donec gravida metus vitae dignissim condimentum. Duis eu augue ante. In commodo risus
nec tempus viverra. Cras lobortis augue nisl.

```
function dropRight(array, n=1) {
    const length = array == null ? 0 : array.length
    n = length - toInteger(n)
    return length ? slice(array, 0, n < 0 ? 0 : n) : []
}

function castArray(...args) {
    if (!args.length) {
        return []
    }
    const value = args[0]
    return Array.isArray(value) ? value : [value]
}
```

Quisque id nibh vel tortor consectetur rutrum vel fringilla mauris. Donec eu hendrerit odio. Morbi in ante erat. Etiam 
iaculis ante sed semper dictum. Ut sagittis ligula nunc, ac consequat purus fermentum in. Sed ex lacus, aliquam nec est at,
tristique vulputate neque. Donec volutpat at arcu vel aliquam. Aliquam bibendum metus ut lorem rhoncus tempor. Pellentesque
quis neque vestibulum, facilisis est eget, pulvinar nisi. Nunc finibus neque vel augue accumsan, et interdum nulla imperdiet.
Etiam interdum mauris in odio ullamcorper porta.

### Ability to cancel some build operations
<secondary-label ref="gradle"/>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eleifend lectus at tellus vehicula, eget congue velit congue.
Interdum et malesuada fames ac ante ipsum primis in faucibus. 

Maecenas porta cursus lacus ut maximus. Mauris vitae lorem sed
est tempor sagittis sit amet nec ex. Donec gravida metus vitae dignissim condimentum. Duis eu augue ante. In commodo risus
nec tempus viverra. Cras lobortis augue nisl.

## New experimental features
<primary-label ref="experimental-exp"/>

The following pre-stable features are available in this release. This includes features with [Beta](components-stability.md#stability-levels-explained), [Alpha](components-stability.md#stability-levels-explained), and [Experimental](components-stability.md#stability-levels-explained) status.

### New interop mode for klibs
<secondary-label ref="native"/>

Curabitur elit risus, sollicitudin vitae aliquet vitae, egestas nec purus. Orci varius natoque penatibus et magnis dis
parturient montes, nascetur ridiculus mus. Sed id malesuada magna. Cras at mollis diam, ac feugiat elit. Aenean a erat 
facilisis, viverra est tempus, ullamcorper est. Integer fringilla nisi at augue commodo commodo. Donec at lacus sodales,
lobortis lorem eu, tristique elit. Vivamus sit amet tincidunt metus. Donec auctor aliquet velit vitae placerat.

Suspendisse congue odio et nibh venenatis, nec molestie purus fermentum. Aliquam vel diam feugiat, pellentesque arcu non,
bibendum diam. Curabitur id lorem faucibus, porttitor leo vel, vehicula diam. Maecenas et felis varius, scelerisque magna
vitae, iaculis felis. Etiam faucibus eget risus nec pulvinar. Pellentesque tincidunt lacus vitae iaculis hendrerit. Nunc
ac viverra est. Nullam efficitur velit at elit imperdiet, a suscipit sem hendrerit. Nunc et lectus sed nibh ultricies 
molestie. Mauris eu turpis in ante ornare tincidunt. Duis vitae pharetra sapien. Suspendisse non posuere magna. Aenean 
feugiat est neque, eu commodo ante dignissim quis.

```
function chunk(array, size = 1) {
    size = Math.max(toInteger(size), 0)
    const length = array == null ? 0 : array.length
    if (!length || size < 1) {
        return []
    }
    let index = 0
    let resIndex = 0
    const result = new Array(Math.ceil(length / size))

    while (index < length) {
        result[resIndex++] = slice(array, index, (index += size))
    }
    return result
}      
```

## Kotlin/JVM compilation uses Build tools API by default
<secondary-label ref="gradle"/>

Quisque sed nisi vel lacus efficitur faucibus. Quisque sed arcu nec nulla tincidunt commodo. Etiam venenatis nibh non 
enim bibendum, non eleifend ante mollis. Praesent quis felis sit amet purus commodo pretium. Nulla augue velit, scelerisque
porttitor semper nec, eleifend placerat eros. 

Aliquam varius mauris magna, id ultrices odio aliquam non. Proin mattis augue et diam congue, sed feugiat elit dictum. 
Nulla rutrum id elit ut bibendum. In convallis lacinia elit, vitae finibus dolor malesuada eu. Curabitur id vulputate 
mauris, ac auctor ex. Donec tempus aliquam ante et malesuada.

## Improved memory consumption in Kotlin/Wasm projects
<secondary-label ref="wasm"/>

Proin justo arcu, venenatis ac rutrum sit amet, iaculis id leo. Mauris imperdiet lobortis neque vel dignissim. Aenean non
facilisis ligula, et porttitor augue. Morbi iaculis enim eleifend neque suscipit condimentum. 

Aliquam facilisis congue bibendum. Nullam sed iaculis ante, non sodales ligula. Etiam tempor felis id erat hendrerit 
scelerisque. Fusce in tortor mi. Proin pharetra, ligula ut eleifend porta, augue libero sagittis libero, eget faucibus 
risus nibh id nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus.

## IDE support

The Kotlin plugins that support %kotlinEapVersion% are bundled in the latest versions of IntelliJ IDEA and Android Studio.
You don't need to update the Kotlin plugin in your IDE.
All you need to do is [change the Kotlin version](configure-build-for-eap.md) to %kotlinEapVersion% in your build scripts.

See [Update to a new release](releases.md#update-to-a-new-kotlin-version) for details.