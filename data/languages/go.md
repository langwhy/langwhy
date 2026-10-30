## Why it exists

In 2007 a large Google program took 45 minutes to build. Rob Pike's account of Go's origin says that "the origin myth for Go states that it was during one of those 45 minute builds that Go was conceived" ([Pike, Go at Google](https://go.dev/talks/2012/splash.article)). The FAQ puts the underlying problem in one sentence: "One had to choose either efficient compilation, efficient execution, or ease of programming; all three were not available in the same mainstream language" ([Go FAQ](https://go.dev/doc/faq)). The aim was to combine them in one language, with concurrency and garbage collection built in. Go was launched publicly on 10 November 2009 ([Go blog](https://go.dev/blog/1year)).

## What it trades away

Go gives up manual memory control for a garbage collector, and gives up many language features for a small one. The FAQ states the goal as "the ease of programming of an interpreted, dynamically typed language with the efficiency and safety of a statically typed, compiled language" ([Go FAQ](https://go.dev/doc/faq)). Concurrency is cheap, because goroutines have "little overhead beyond the memory for the stack, which is just a few kilobytes", but the programmer gets fewer features to shape the code with and less control over memory layout.

## Where it won

Google uses Go for its web indexing services, which are written in Go, and for the Chrome optimization guide service, which is implemented in Go ([Google's Go case study](https://go.dev/solutions/google/)). CockroachDB was 89.6 percent Go code in October 2023 ([CockroachDB](https://www.cockroachlabs.com/blog/why-go-was-the-right-choice-for-cockroachdb/)). Go 1, the first stable release, came out on 28 March 2012 with a promise that programs written for it will keep compiling and running unchanged under later versions ([Go release history](https://go.dev/doc/devel/release)).
