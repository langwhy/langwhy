## Why it exists

In January 1999 Anders Hejlsberg formed a team at Microsoft to build a new language, then called COOL, for the runtime that became .NET; by the time the .NET project was announced at the Professional Developers Conference in July 2000 it had been renamed C# ([Wikipedia](https://en.wikipedia.org/wiki/C_Sharp_(programming_language))). Microsoft's Java path was ending in court at the same time: in January 2001 it settled Sun's Java lawsuit, and the 1996 licence between the two companies was terminated ([InfoWorld](https://www.infoworld.com/article/2159673/sun-microsoft-settle-java-lawsuit.html)). Hejlsberg had designed Delphi at Borland and worked on Visual J++ at Microsoft ([Artima](https://www.artima.com/intv/csdes.html)), and in July 2000 he said C# is "not a Java clone" ([Wikipedia](https://en.wikipedia.org/wiki/C_Sharp_(programming_language))). Microsoft promoted .NET that month as a platform "designed for any programming language" ([Microsoft](https://news.microsoft.com/source/2000/07/11/microsoft-announces-groundswell-of-support-for-net-platform)).

## What it trades away

C# trades a large runtime for safety and tooling. Code is garbage-collected and runs on the .NET common runtime, so it gets a big standard library and strong tooling, but it also carries a runtime's startup time and memory overhead. Microsoft open-sourced .NET Core in 2014 ([Microsoft .NET blog](https://devblogs.microsoft.com/dotnet/net-core-is-open-source)), and its website now describes .NET as running on Windows, Linux and macOS ([.NET](https://dotnet.microsoft.com)). Latency-sensitive code still needs tuning that C or Rust code does not.

## Where it won

Unity, the game engine, uses C# for gameplay scripts, so game logic in Unity projects is written in C# ([Unity manual](https://docs.unity.com/en-us/engine/6000.3/manual/scripting/get-started/intro-to)). On the server, Stack Overflow's 2016 web tier ran on IIS, ASP.NET MVC 5.2.3 and .NET 4.6.1 ([Nick Craver](https://netlify.nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/)). The same post says the service tier ran IIS 8.5 on Windows Server 2012 R2, so production was Windows-first.
