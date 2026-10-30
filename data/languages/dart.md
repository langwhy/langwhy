## Why it exists

Google introduced Dart in October 2011. Lars Bak, a Dart team engineer, described it as a language for building web applications and set out to create "a structured yet flexible language for web programming" ([Google Code blog](https://googlecode.blogspot.com/2011/10/dart-language-for-structured-web.html)). The post said Dart could also run on top of a JavaScript engine through a compiler that translates Dart to JavaScript. In March 2015 the team said it had "decided not to integrate the Dart VM into Chrome" and would focus on compiling Dart to JavaScript ([Dart blog](https://news.dartlang.org/2015/03/dart-for-entire-web.html)).

## What it trades away

Dart trades ecosystem size for a tight Flutter stack. Outside Flutter it has a small library ecosystem and hiring pool, so a Dart team is mostly a Flutter team. On the web it is a compiler target rather than a browser language: Dart runs in the browser only as compiled JavaScript, because Chrome never shipped the Dart VM ([Dart blog](https://news.dartlang.org/2015/03/dart-for-entire-web.html)). The language itself is statically typed and garbage-collected. Dart 3 made null safety fully sound, so a non-nullable type can never hold null ([Dart 3 announcement](https://dart.cn/blog/announcing-dart-3)).

## Where it won

Flutter is where Dart won. The official Flutter showcase lists Google Pay with a case study headlined "Going global at Google Pay with Flutter", BMW Group's work on customer-facing product development, and Alibaba's account of scaling China's largest second-hand marketplace with Flutter ([Flutter showcase](https://flutter.dev/showcase)). Flutter 1.0 shipped in December 2018 alongside Dart 2.1, so the framework and the language reached developers together ([InfoQ](https://www.infoq.com/news/2018/12/flutter-1.0-released)).
