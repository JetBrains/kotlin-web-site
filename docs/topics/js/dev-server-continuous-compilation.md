[//]: # (title: Development server and continuous compilation)

Instead of manually compiling and executing a Kotlin/JS project every time you want to see the changes you made,
you can use the _continuous compilation_ mode. Instead of using the regular `run` command, invoke the Gradle wrapper
in _continuous_ mode:

```bash
./gradlew run --continuous
```

If you are working in IntelliJ IDEA, you can pass the same flag via the _run configuration_. After running the Gradle
`run` task for the first time from the IDE, IntelliJ IDEA automatically generates a run configuration for it,
which you can edit:

![Editing run configurations in IntelliJ IDEA](edit-configurations.png)

Enabling continuous mode via the __Run/Debug Configurations__ dialog is as easy as adding the `--continuous` flag to the
arguments for the run configuration:

![Adding the continuous flag to a run configuration in IntelliJ IDEA](run-debug-configurations.png)

When executing this run configuration, you can note that the Gradle process continues watching for changes to the program:

![Gradle waiting for changes](waiting-for-changes.png)

Once a change has been detected, the program will be recompiled automatically. If you still have the page open in the browser,
the development server will trigger an automatic reload of the page, and the changes will become visible.
This is thanks to the integrated `webpack-dev-server` that is managed by the Kotlin/JS Gradle plugin.