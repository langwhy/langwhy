## Every language is a deal

A processor only follows tiny instructions: add two numbers, copy this, jump there. Nobody writes
those by hand anymore. People write code in a programming language, and another program turns it
into instructions the processor can follow. Each language decides how that happens, and every
decision gives you something and takes something away. No language wins every decision, so people
keep making new ones for the jobs the old ones handle badly. [PLDB](https://pldb.io/), a public
database of languages, lists more than 3,400 programming languages.

Think of an online shop. The page you click on runs JavaScript in your browser. The server behind it
might run Go or Python. The orders sit in a database you ask questions in SQL. Three places, three
languages, because each place wants something different. This site calls those places **slots**,
and every language card says how well the language fills each of the 13.

## How the code gets run

There are three common ways, and they decide speed and convenience.

- **Compiled ahead of time.** A compiler turns the whole program into machine code before it runs.
  The result starts fast and runs fast, but every change needs a new build, and you build once per
  kind of computer. C, C++, Rust, Go and Swift work this way.
- **Compiled for a virtual machine.** The compiler produces bytecode for a pretend computer, the
  virtual machine, which runs on many real ones. Java's class files are
  [hardware- and operating system-independent](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-1.html).
  The virtual machine has to be installed and costs memory. Java, Kotlin, C# and Elixir work this way.
- **Interpreted.** An interpreter reads the code and carries it out while the program runs. Nothing
  has to be built, so you change a line and run it again at once, but the extra layer makes it
  slower. Python, Ruby, PHP, Lua and Bash work this way.

TypeScript takes a fourth road: it is translated into JavaScript, which the browser then runs.

## Who cleans up memory

A running program keeps borrowing memory and has to give it back, or the computer runs out. The
[Rust book](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html) sums up the three
classic answers: some languages have garbage collection that looks for memory no longer in use
while the program runs, in others the programmer frees memory by hand, and Rust uses ownership
rules that the compiler checks.

- **By hand** (C, C++, Zig): nothing runs in the background, so the program is small and its timing
  is exact. One forgotten step can crash it or open a security hole.
- **A garbage collector** (Java, Go, JavaScript, C#): a whole family of bugs disappears, but the
  collector needs memory and time of its own and runs when it decides to.
- **Reference counting** (Swift, Python): each piece of memory counts its users and frees itself when
  the count reaches zero.
- **Ownership** (Rust): the compiler proves the program frees everything correctly. No collector runs,
  but the rules take a while to learn.

## Checked before or while running

Every value has a kind: a number, a piece of text, a list. A language with **static types** checks
that kinds match before the program runs; TypeScript calls itself a
[static type checker](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
for this reason. A language with **dynamic types** checks while the program runs, so writing is
quicker and some mistakes show up only when that line runs. Python allows type hints, but
[no type checking happens at runtime](https://peps.python.org/pep-0484/); a separate tool checks them.

## Doing many things at once

A web server may talk to ten thousand visitors at the same moment. Languages handle that in
different ways: threads managed by the operating system (Java, C++), lighter threads managed by
the language itself, such as Go's [goroutines](https://go.dev/doc/effective_go), async code that
starts slow work and moves on until it finishes (JavaScript), or small isolated workers that only
send each other messages, like Elixir's [processes](https://hexdocs.pm/elixir/processes.html).

## So why can't one language do everything?

Because of those deals, and because every place where code runs has its own rules. A language
tuned to be quick to write pays for it in speed. A language that gives exact control over memory
makes mistakes easier. A browser accepts only JavaScript and WebAssembly. When a language does not
fit a slot, its card names one of the seven reasons below.
