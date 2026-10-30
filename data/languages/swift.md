## Why it exists

Chris Lattner started Swift at Apple in July 2010 ([Lattner, history of Swift](https://nondot.org/sabre/)). Objective-C was C with Smalltalk-style messaging on top, so it inherited C's pointers and unchecked memory. In a 2019 podcast Lattner explained why the team did not simply fix Objective-C: "you can't retrofit memory safety into Objective-C without removing the C", and removing the C would leave something that was "not Objective-C anymore" ([Ole Begemann, Chris Lattner on the origins of Swift](https://oleb.net/2019/chris-lattner-swift-origins/)). Apple announced Swift at WWDC 2014 as a beta for iOS 8 and OS X Yosemite ([InfoQ](https://www.infoq.com/news/2014/06/apple-swift)).

## What it trades away

Swift is strongest on Apple platforms, and outside them the tooling and libraries are thinner. Its binary interface was only declared stable with Swift 5 in 2019, which means that compiled code from one compiler version could not be relied on to work with another before then ([Swift.org](https://swift.org/blog/abi-stability-and-more/)). Reference counting also means that cycles of objects have to be broken by hand with weak references.

## Where it won

Apple describes Swift as its language for all Apple platforms ([Apple](https://developer.apple.com/swift/)), and its SwiftUI framework for app interfaces has been available since iOS 13 and macOS 10.15 ([Apple SwiftUI](https://developer.apple.com/documentation/swiftui.md)). Apple released Swift as open source under the Apache 2.0 licence on 4 December 2015, with support for Linux as well as Apple platforms ([Apple press release](https://www.apple.com/nz/newsroom/2015/12/03Apple-Releases-Swift-as-Open-Source/)). Server use, with frameworks such as Vapor, is much smaller than app development.
