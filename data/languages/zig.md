## Why it exists

Zig is meant to replace C. Its overview says that "Zig competes with C instead of depending on it" and that "there is no hidden control flow, no hidden memory allocations, no preprocessor, and no macros" ([Zig overview](https://ziglang.org/learn/overview/)). The project's argument against C++, Rust and D is that "C++, Rust, and D have such a large number of features that they can be distracting" ([Why Zig](https://ziglang.org/learn/why_zig_rust_d_cpp/)). Wikipedia names Andrew Kelley as the designer and says Zig was designed to replace C "while maintaining C ABI compatibility" ([Wikipedia](https://en.wikipedia.org/wiki/Zig_(programming_language))). The first release is dated 8 February 2016 ([GitHub](https://github.com/topics/zig-lang)).

## What it trades away

Zig trades convenience for visible control. It avoids implicit calls such as operator overloading and exceptions, and it leaves heap management to the library and the application, so the programmer writes more of the code by hand ([Why Zig](https://ziglang.org/learn/why_zig_rust_d_cpp/)). The language is also still before 1.0. Its news page lists 0.16.0 on 14 April 2026 and 0.17.0 on 2 October 2026, so code that works on one release can need edits for the next ([Zig news](https://ziglang.org/news/)).

## Where it won

Ghostty, a terminal emulator, has a shared core written in Zig, and its Linux app is written in Zig as well ([Ghostty](https://ghostty.org/docs/about)). Uber uses the Zig toolchain as its C and C++ compiler. Its engineering blog says that since January 2023 the Zig toolchain compiles all of the C and C++ code in the Go monorepo for Linux targets ([Uber Engineering](https://www.uber.com/en-KR/blog/bootstrapping-ubers-infrastructure-on-arm64-with-zig/)). The project itself emphasises "out of the box cross-compilation to most major platforms" ([Why Zig](https://ziglang.org/learn/why_zig_rust_d_cpp/)).
