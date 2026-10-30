## Why it exists

James Gosling started Oak at Sun Microsystems in 1991 for the Green Project, which was looking for a purpose for smart consumer electronics such as cable set-top boxes ([ibiblio timeline](https://ibiblio.org/java/slides/hope/02.html)). The devices used different processors and had very little memory, and the goal was code that did not depend on any single processor. Gosling later said the programming approach was causing cost issues for many of the manufacturers ([SD Times](https://sdtimes.com/twenty-years-of-java-through-its-creators-eyes/)). Sun made Java public on May 23, 1995 ([Azul](https://www.azul.com/?p=72322)).

## What it trades away

Java trades startup speed and memory for portability. Each program runs on a virtual machine, so every program pays for that layer before it does any work. Gosling admitted the language "tried too hard to be compatible with C++", including operator overloading, which shows how much of the C++ inheritance came along for the ride ([SD Times](https://sdtimes.com/twenty-years-of-java-through-its-creators-eyes/)). Large deployments accept the cost. Netflix runs about 2,800 Java applications on a standard OpenJDK build from Azul ([InfoQ talk](https://www.infoq.com/presentations/netflix-java/)), but a team that needs a tiny binary or a fast start should look elsewhere.

## Where it won

Java won on the server. Netflix runs about 2,800 Java applications, mostly microservices ([InfoQ talk](https://www.infoq.com/presentations/netflix-java/)). Apache Hadoop, the distributed data framework, is implemented in Java, although its jobs can be written in other languages ([Apache Hadoop docs](https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html)). Elasticsearch ships its own OpenJDK inside each distribution ([Elastic docs](https://www.elastic.co/docs/deploy-manage/deploy/self-managed/installing-elasticsearch)). On Android, Google's platform SDK still supports Java next to Kotlin, though Google now recommends Kotlin for new apps ([Android developers](https://developer.android.com/kotlin/first)).
