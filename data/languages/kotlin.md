## Why it exists

In July 2011 JetBrains introduced Kotlin, a new language for the JVM, after concluding that "none of them meet our needs" among the existing JVM languages ([InfoWorld](https://www.infoworld.com/article/2183154/jetbrains-readies-jvm-language-kotlin.html)). Scala had the features JetBrains wanted, but its development lead, Dmitry Jemerov, said its most obvious deficiency was very slow compilation. The published goals put Java compatibility first, then safety against null pointer errors and more concise code than Java ([InfoQ](https://www.infoq.com/news/2011/07/kotlin/)).

## What it trades away

Kotlin inherits the JVM. It compiles to the same bytecode as Java, so it starts on the same virtual machine and pays the same startup and memory costs, which matter most for short-lived scripts and small tools. The Java compatibility goal is the design choice behind this: Kotlin keeps working with Java libraries and Java conventions instead of starting from a clean slate ([InfoQ](https://www.infoq.com/news/2011/07/kotlin/)). A team gets that interoperability in exchange for the JVM's runtime model.

## Where it won

Android is the big win. Google's developer guide recommends starting new Android apps with Kotlin ([Android developers](https://developer.android.com/kotlin/first)), and Google reported in May 2019 that over half of professional Android developers used it ([Android Developers Blog](https://android-developers.googleblog.com/2019/05/google-io-2019-empowering-developers-to-build-experiences-on-Android-Play.html)). Gradle made the Kotlin DSL the default for new builds in April 2023 ([Gradle blog](https://blog.gradle.org/kotlin-dsl-is-now-the-default-for-new-gradle-builds)). On the server, Spring Boot supports Kotlin on the same JVM stack as Java and requires Kotlin 2.2 or later ([Spring Boot docs](https://docs.spring.io/spring-boot/reference/features/kotlin.html)).
