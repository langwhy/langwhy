## Why it exists

In 1979 Bjarne Stroustrup started the work that became C++, with the goal of writing "efficient systems programs in the styles encouraged by Simula67" ([Stroustrup, C++ FAQ](https://www.stroustrup.com/bs_faq.html)). He was using Simula to simulate a distributed operating system. In a lecture transcript on his site he says Simula "simply ran too slow", and that "it was too expensive, so I had to translate it to a lower level language" ([Stroustrup, Gillies lecture](https://stroustrup.com/gillies.htm)). He wanted Simula's type system and object-oriented design married to the strengths of C. The first version, "C with Classes", began in April 1979 ([Computer History Museum](https://softwarepreservation.computerhistory.org/c_plus_plus/)).

## What it trades away

C++ kept C's unchecked pointers and undefined behaviour, because Stroustrup considered C "the best systems programming language available" at the time ([Stroustrup, C++ FAQ](https://www.stroustrup.com/bs_faq.html)). On top of that it adds classes, templates, operator overloading and many more features, so a programmer has many ways to use the language and many ways to misuse it. Heavy template code makes compile times and error messages long. The cost is size and complexity, paid by everyone who reads the code, and the unsafe parts stay in the language for compatibility with C.

## Where it won

V8, Google's JavaScript and WebAssembly engine, is written in C++ and is used in Chrome and Node.js ([V8](https://v8.dev/docs)). LLVM, the compiler framework, is written using the subset of C++ documented in its coding standards ([LLVM](https://llvm.org/docs/GettingStarted.html)). The language became an ISO standard when ISO/IEC 14882:1998 was published on 1 September 1998 ([Stroustrup, ISO press release](https://www.stroustrup.com/iso_pressrelease2.html)), and the current standard, C++23, finished its technical work in 2023 ([ISO C++](https://isocpp.org/std/the-standard)).
