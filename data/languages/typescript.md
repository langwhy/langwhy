## Why it exists

In October 2012 Microsoft previewed TypeScript, a JavaScript-like language that compiles to plain JavaScript ([TechCrunch](https://techcrunch.com/2012/10/01/microsoft-previews-new-javascript-like-programming-language-typescript/)). Anders Hejlsberg argued that building large JavaScript applications successfully was simply too difficult. He also said JavaScript's dynamic type system made it impossible to build an IDE like Visual Studio that worked with it ([The Register](https://www.theregister.com/software/2012/11/03/microsoft-typescript-isnt-a-javascript-killer/717785)). The answer was to build on JavaScript rather than replace it: any valid JavaScript is also valid TypeScript, so existing code kept working.

## What it trades away

TypeScript adds a compile step and a second layer that has to stay in step with the code. Its types exist only at compile time, so data that arrives from a server or a user is untyped until a check runs, and the checks cover only the code the compiler sees. Projects must keep the compiler, the configuration and the type declarations for their libraries up to date. The project describes itself as a language that "builds on JavaScript, giving you better tooling at any scale" ([TypeScript](https://www.typescriptlang.org/)), and the price of that tooling is the extra layer.

## Where it won

Angular 2 was announced as built with TypeScript in March 2015 ([Microsoft TypeScript blog](https://devblogs.microsoft.com/typescript/angular-2-built-on-typescript/)). Slack moved its desktop app to TypeScript and wrote that TypeScript "was such a boon to our stability and sanity" ([Slack Engineering](https://slack.engineering/typescript-at-slack/)). Airbnb's migration had converted 86 % of its frontend, about 6 million lines, by August 2020 ([InfoQ](https://www.infoq.com/news/2020/08/airbnb-typescript-migration)). In the 2024 State of JavaScript survey, 67 % of respondents said they wrote more TypeScript than JavaScript ([State of JS](https://2024.stateofjs.com/en-US/usage/)). In the 2025 Stack Overflow survey, 43.6 % of respondents used it ([Stack Overflow](https://survey.stackoverflow.co/2025/technology/)).
