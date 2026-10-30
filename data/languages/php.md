## Why it exists

In 1994 Rasmus Lerdorf wrote a set of small CGI programs in C to track visits to his online résumé. He called the collection Personal Home Page Tools and released its source publicly in June 1995 ([php.net history](https://www.php.net/manual/en/history.php.php)). The first version was a set of CGI binaries written in C, not a language that ran inside a page. In 1997 Zeev Suraski and Andi Gutmans began rewriting its parser for an e-commerce application they were building for a university project, and PHP 3.0 was announced in June 1998 as the successor to PHP/FI 2.0 ([php.net history](https://www.php.net/manual/en/history.php.php)).

## What it trades away

PHP starts a script for each request and discards its state at the end. That keeps deployment simple and stops one failed request from leaking into the next, but anything that must survive between pages has to live in a database or a cache. Each major version also brings compatibility work. PHP 7.0 was up to twice as fast as PHP 5.6 after a new engine, Zend Engine 3.0, and PHP 8.0 added a JIT compiler and new type features ([php.net history](https://www.php.net/manual/en/history.php.php)).

## Where it won

WordPress shows the reach. W3Techs puts it on 39.5 % of all websites as of its October 2026 figures ([W3Techs](https://w3techs.com/technologies/details/cm-wordpress)), and WordPress's own requirements page recommends PHP 8.3 or greater ([WordPress.org](https://wordpress.org/about/requirements/)). Among websites with a known server-side language, PHP is used by 69.2 % ([W3Techs](https://w3techs.com/technologies/details/pl-php)). MediaWiki, the software that Wikipedia runs on ([MediaWiki](https://www.mediawiki.org/wiki/MediaWiki)), requires PHP 8.3.0 or later for its latest stable release ([MediaWiki](https://www.mediawiki.org/wiki/Manual:Installation_requirements)). In 2014 Facebook announced Hack as "a gradually-typed programming language for HHVM that interoperates seamlessly with PHP" ([Facebook Engineering](https://engineering.fb.com/2014/04/10/developer-tools/hack-developer-day-recap)).
