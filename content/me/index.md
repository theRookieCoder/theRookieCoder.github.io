+++
title = "Hi there!"
author = "theRookieCoder"
modified = "2025-02-23"
Toc = false
+++

Welcome to the page about myself! I suppose you want to learn more about me... interesting choice.

I like to read story books, my preferred genres are science fiction (surprise surprise) and fantasy. Some of my favourite books are
- [The Witcher](https://www.goodreads.com/series/40911-the-witcher)
- [Harry Potter](https://www.goodreads.com/series/45175-harry-potter)
- [River of Ink](https://www.goodreads.com/series/201124-river-of-ink)
- [Chronicle of the Dark Star](https://www.goodreads.com/series/179730-chronicle-of-the-dark-star)
- [Maze Runner](https://www.goodreads.com/series/110451-the-maze-runner)
- [39 Clues](https://www.goodreads.com/series/45556-the-39-clues) and its spinoff series

Twisty puzzles are awesome, particularly when it involves a lot of thinking. I can solve the 2x2, 3x3, 4x4, 5x5, 7x7 (mostly), Square-1, and Mirror Cube. At one point, I was averaging around 30 seconds to solve a 3x3.

I play video games on occasion. I've spent significant time on
- [Minecraft](https://minecraft.net)
- [The Legend of Zelda: Breath of the Wild](https://zelda.nintendo.com/breath-of-the-wild)
- [The Legend of Zelda: Tears of the Kingdom](https://zelda.nintendo.com/tears-of-the-kingdom)
- [osu!](https://osu.ppy.sh)

Oh and did I mention I like mathematics. I love having tools to model real world problems, and solve them precisely. But I don't plan on pursuing maths academically, high school maths was enough fun for me.

But beyond all of that, my **passion** is computers. To say that I love computers would be an understatement; my friends like to say that my one and only beloved is my laptop. The ability to generalise solutions to problems is what attracted 10 year old me to programming, and is what still motivates me to this day.

# My Story with Computers

My dad likes to code at home as a hobby. A few years ago, he was learning Swift to create apps, and I approached him to learn about what he was doing. He opened a <abbr title="Read-Eval-Print Loop; for coding iteractively">REPL</abbr> and showed me how you can assign numbers to letters (variables) and compute the result of operations on them. I was amazed, and the part of this that attracted me the most was that the computer didn't care what values were in the variables, it computed the result regardless. While I had used computer before, this experience made me understand their significance, and I was excited to take advantage of this.

The first language I learned was Python. At the time, I was learning to use the guess and check method to solve a specific type of word problem (this was before we learned algebra). So, the first program I made solved this type of word problem by getting the given values from the user, trying a few estimates, and printing out the answer. After this, I created a few more programs with Python. For example, I made a program that randomly generates test questions for me to practise using a <abbr title="Japanese abacus">soroban</abbr>.

I got an Arduino and Raspberry Pi the next year, and I really liked the idea of controlling electronic devices in the real world using code. But the programming really ramped up when I was 13. My dad had bought a course online for Flutter, and he encouraged me to try out app development as well. After completing Secondary 1, I had a break of a few months as I moved countries, and I thoroughly utilised this time to learn Flutter.

My approach to learning has always been hands-on. I do not have the patience to read tutorials or watch courses, I prefer to start a project and learn along the way. My first Flutter project was an app that logged blood pressure and stored it in Google Drive. You can have a look at [BP Logger](https://github.com/theRookieCoder/bp_logger) on GitHub. It taught me a lot about interfacing with APIs on the internet, setting up Google sign-in using Firebase, and creating functional and beautiful UIs in Flutter. I also published a library, [Drive Helper](https://pub.dev/packages/drive_helper), to isolate the sign in and file read/write, and make it available for others to use.

The next leap for me was Rust. I had seen many memes about Rust on [r/ProgrammerHumor](https://www.reddit.com/r/ProgrammerHumor), and in 2021 I decided to see what the fuss was about. As usual, I started off with a simple program, which was calculating the fibonacci series. It was around this time that [Modrinth](https://modrinth.com), a Minecraft mod hosting website, announced that they had made their API public. It had been my dream for a long time to create a mod manager of my own, and I wanted to seize this opportunity to create a CLI mod manager for Modrinth mods. Hence, [ferium](https://github.com/gorilla-devs/ferium) was born. It is my most successful project to-date, with more than 100,000 downloads, hundreds of active users, and inclusion in many popular package managers. I also released [Ferinth](https://github.com/gorilla-devs/ferinth) and [Furse](https://lib.rs/crates/furse) on [crates.io](https://crates.io), which are Rust bindings to the Modrinth and CurseForge REST APIs respectively.

In November 2023, my school held a science exhibit, and I teamed up with 3 other friends to create a computer science project. We noticed that everyday, a security guard at the gate manually writes down the arrival and departure times of every school bus. So, we decided to create an app to automate this process. We used [Firebase](https://firebase.google.com) with [Cloud Firestore](https://firebase.google.com/products/firestore) as our data storage backend, and [Flutter](https://flutter.dev) for our frontend app. The database stored "schedules", which are the expected bus timings, and the app could scan QR codes with the bus numbers and log their actual arrival/departure time. We presented our project at the science exhibit, and our computer science teacher gave us the opportunity to give a presentation (<a href="tobuz-app-presentation.pdf" target="_blank">slides</a>) about the project to members of the school administration and the senior secondary computer science students.

In June 2024, my computer science teacher approached my friend and I with an opportunity; we could develop the electronic voting software for the student council election. However, we had examinations coming up the next week, and the election was just two weeks away. Did we succeed? Read [my article](/posts/vow-polling) to find out. Just kidding, I won't leave you in suspense, although I recommend you read the article to get the full story. The election went quite smoothly, and we successfully recorded every single vote.

This year, I wanted to learn more C and C++. So, I created a few CHIP-8 and SUPER-CHIP emulators in C, Rust, and C++ for desktop OSs and the [Arduboy](https://arduboy.com). I wrote [an article](/posts/chip8) about my experience too.

And that brings us to the present. After graduating from high school, I want to work on updating and enhancing my existing projects, and I am planning on creating an online multiplayer chess game with my friend in the upcoming months. I will be going to university for a computer science degree in a few months too!
