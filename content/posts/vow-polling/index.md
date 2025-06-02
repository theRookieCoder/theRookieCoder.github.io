+++
title = "Zero to Election in 2 Weeks"
date = "2025-02-28"
modified = "2025-06-02"
author = "theRookieCoder"
tags = ["programming", "dart", "flutter", "firebase", "cloud-firestore"]
description = "My friend and I had the opportunity create an electronic voting app, but we only had two weeks to go from idea to production. Find out how we defied the odds and skipped classes to deliver a functional and successful app."
draft = true
+++

> You can read the <a href="vow-project-report.pdf" target="_blank">technical report</a> I wrote for this project.

It was the 12th of June; school reopened after a sweltering summer break, and I was excited to meet my friends again after almost a month. Unfortunately, we had examinations coming up in a few days, and I was *really* not looking forward to that. It was in this mixed state of emotions that my computer science teacher approached me and my friend Aadarsh.

We have a Student Council in my school, and every year students from 7th--12th grade get to vote for the Head Boy and Head Girl in an election. My computer science teacher had seen the potential in us, and asked us if we would like to create the electronic voting software for this year's election. I was pumped to say the least; finally, a new programming project!

# Planning

*Uuun*fortunately after the examinations end, there was barely a week left to election day. Knowing this, we started planning and designing the app even before the exams started.

A *problem statement* is a clear idea of what one is solving for. In software development, I think it is important to define the problem statement before starting, i.e. deciding on a set of broad goals for the project. I like to split these goals into "needs" and "wants"; the former being features you would expect in a prototype, and the latter being nice-to-haves that aren't required and have less priority.

## Overarching Goals

We discussed and agreed on this set of features.

### Needs

- Correctness; votes must be recorded accurately, and it must be possible to obtain a usable result.
- Electronic polling; votes must be cast, stored, and retrieved electronically. There must not be physical ballots.

### Wants

- Cloud storage; votes should be inspectable in real time as the election takes place.
- Double-voting prevention; the system should keep track of the attendance of voters.
- Internet-based communication; LAN communication is difficult to set up and manage, so communication should be done over the internet.

We decided to use [Flutter](https://flutter.dev) for the frontend, and [Firebase](https://firebase.google.com)'s [Cloud Firestore](https://firebase.google.com/products/firestore) for the database. These are technologies we were familiar and comfortable with, and we felt that they suited the problem quite well.

# Designing the UI

One headache with creating apps is that the UI design has to be screen-dimension agnostic, meaning it has to look good on any screen resolution the app might run on. For example, you have to use relative units in most places, lest your UI look wonky on a screen resolution you haven't tested for.

Luckily, we knew the devices we were going to run on, so we were able to use a lot of shortcuts when designing the UI. For example, we were able to include some decorative UI elements --- like the school logo, a vignette effect, and a translucent blurred background for the main UI --- within the background image.

![A background image of my school, with the school logo and vignette in the bottom right corner, and a large blurred translucent empty box in the middle for the UI](voter-background.avif)

We used plenty of `SizedBox`s and hardcoded pixel values for dimensions. It feels rather vile, but given the time constraints, and the fact that we knew the devices' dimensions precisely, I think it was a reasonable compromise.

Aadarsh decided to try using Figma to design the UI, which was a change from how I usually did it. I would start off by placing the UI elements I needed, moving them around until they looked decent, and calling it a day. Unfortunately this was not a great workflow, since moving elements around in Flutter can be frustrating, especially if you don't know where you want things to be. This is when being able to design the UI separately comes useful; you can freely move elements around and preview the changes, before having to fiddle with the code at all. This helped tremendously since the UI design and programming workflows could now be separated.

We planned the system architecture and UI design before and during the exams, and after the exams ended, we got to programming.

# The Architecture

We wanted our software to have the ability to be used at any location in the school, and be flexible too. We designed it such that each room should have a *controller*, which connects to one or more *booths*.

The *controller* is responsible for marking attendance. A teacher should enter the voter's ID or search for their name, verify that they are from the correct class, and mark their attendance. After this, a booth will open up, and the controller will be alerted about which booth was opened so that they can guide the voter. The voter then has to proceed to the booth, where the voting will happen.

# Technical Hurdles

## Firestore and Linux

Google publishes a Flutter library for interacting with Firestore called [`cloud_firestore`](https://pub.dev/packages/cloud_firestore); the library works by binding to the platform's native Firebase APIs. But it does not support Linux, even though there *are* Linux-native APIs for Firestore? Unfortunately, the computers we were going to use were running Linux; this is one of the few situations in which I am despondant about having a computer running Linux.

But all hope is not lost, there is a library called [`firedart`](https://pub.dev/packages/firedart) which provides a Firestore API written in pure Dart, meaning that it would work on any platform, including Linux. The day is saved! (or is it? You'll find out later \**foreshadowing*\*)

## Voter Data

We wanted to implement an attendance system, and for that we need a list of voters. This isn't readily available, so we contacted my computer science teacher for help. She let us download CSV files of the student and staff rolls from the school's database---with only relevant columns selected of course. But this database was far from well maintained; the format of the class column for example was very inconsistent. This was a problem as we had to upload this data to our database in a proper format.

This was when my Python skills came in handy. I banged out a script to combine the student and staff data into a single "voters" file, remove invalid rows, clean up the formatting, and split the class column into a "class" and "section". After this processing was done, including manually removing some staff that were not voters, I wrote a final Python script to upload this data to our Firestore database.

## Name Search

The controller needs to provide the voter's identity to the program to mark their attendance. While they could use the voter's student/staff ID, some voters might not have brought their ID card. To solve this, and make it easier to verify the voter's identity, we decided to implement name search.
Unfortunately, it's not possible to query Firestore with SQL-like fuzzy string search, i.e. a `LIKE "%substr%"` clause. So, we decided the simplest solution is to just keep a local cache of all documents in the `voters` collection.

While this solved the problem, it led to small issue with Firestore usage limits. The free tier allows 50,000 reads per day, and our voters collection has around 1000 documents.
If we kept using hot restart during development, we would run out of reads after around 50 restarts. This was a minor inconvenience, and we solved it by commenting out the read and using some stub data instead during development.

## Race Condition

Like most NoSQL databases, Firestore does not have an increment operation. This means that the client has to read the value in the field, and write the new value back. Since this method of updating is not atomic, it would lead to dropped votes if multiple clients tried to update the vote count at once. 
While I wracked my head on how to synchronise the various connected clients, Aadarsh suggested keeping a separate vote-count document for each client. It's such a simple solution that solves the issue, and is practical for us to use.

It's times like this where I really appreciate being in a team, it would've been impossible to make something like this solo in such a short duration. Having a good team is indispensible.

# It's Falling Apart

It was the 29th of June, this was the last weekend before voting day. We had to use this time for final touches and polishing. I open up my IDE and hit run, the application opens, 

# Who's Excited for an Election!

# Oops

# What We Can Do Better
