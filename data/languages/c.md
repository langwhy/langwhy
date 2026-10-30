## Why it exists

In 1969 Ken Thompson created the B language at Bell Labs. B was BCPL "squeezed into 8K bytes of memory and filtered through Thompson's brain", and it had no types. The PDP-11 exposed its limits. Dennis Ritchie wrote that the machine's byte addressing "exposed several inadequacies of B's semantic model", and that "a typing scheme was necessary to cope with characters and byte addressing" ([Ritchie, The Development of the C Language](https://csapp.cs.cmu.edu/2e/docs/chistory.html)). C added the types int and char, with arrays and pointers to them, and in 1973 the Unix kernel was rewritten in it.

## What it trades away

C gives the programmer the machine with almost nothing in between. It has no runtime bounds checks and no rules about who owns a piece of memory, so buffer overflows and use-after-free bugs are the programmer's job to prevent. The compiler may accept code with undefined behaviour without an error, and the standard leaves many details to each implementation, so the same code can behave differently on different compilers. The ISO working group still revises the language and adopted C23 in 2024 ([WG14](https://www.open-std.org/jtc1/sc22/wg14/)).

## Where it won

The Linux kernel is written in the C programming language, and its documentation says it is typically compiled with gcc in the GNU dialect of ISO C11 ([Linux kernel docs](https://docs.kernel.org/process/programming-language.html)). Unix followed the same path. Ritchie's account says that "writing the Unix kernel in C had given us enough confidence" in the language, and the kernel for the PDP-11 was rewritten in C in 1973 ([Ritchie](https://csapp.cs.cmu.edu/2e/docs/chistory.html)).
