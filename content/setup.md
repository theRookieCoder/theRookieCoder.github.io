+++
title = "Setup"
modified = 2025-02-22
author = "theRookieCoder"
tags = []
+++

# Hardware

## Computer (Laptop)

I use the [Framework](https://frame.work) [Laptop 13](https://frame.work/laptop13), specifically the Ryzen 7040 series from 2023.

| Com&shy;ponent | Spec              |
| -------------- | ----------------- |
| CPU            | [AMD Ryzen 7840U] |
| RAM            | DDR5 5600 MHz     |
| Memory         | 2x16 GB           |
| SSD            | WD_BLACK SN850X   |
| Storage        | 1 TB              |
| Keyboard       | US English        |

[AMD Ryzen 7840U]: https://www.amd.com/en/products/processors/laptop/ryzen/7000-series/amd-ryzen-7-7840u.html

The only part of this laptop that I've changed is the WiFi card, I replaced the stock MediaTek card with an Intel AX210 as I had connectivity issues.

### Expansion Cards

- 2x USB-C
- USB-A
- Ethernet
- HDMI
- microSD card reader

I usually go with a USB-C on both sides for charging, a USB-A with my mouse's wireless receiver, and the microSD reader or ethernet. I only use the HDMI card when presenting something or connecting to secondary monitor.

# Software

For colours, I like the [Catppuccin](https://catppuccin.com) theme, specifically the Macchiato flavour. That is what I used to theme this website as well!

## Operating System

I daily-drive the latest version of [Fedora Linux](https://fedoraproject.org), and I have Windows 11 on the other partition of my dual-boot setup. On Fedora, I use KDE as my desktop environment; the only theming I have done is using the [Catppuccin](https://github.com/catppuccin/kde) colour theme.

## Browser (Firefox)

I use [Firefox](https://mozilla.org/firefox) as my browser on Linux, Windows, and Android. These are the add-ons I use

- [Bitwarden](https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager) password manager
- [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin) ad blocker
- [Stylus](https://addons.mozilla.org/en-US/firefox/addon/styl-us) theming for websites
- [Firefox Color](https://addons.mozilla.org/en-US/firefox/addon/firefox-color) theming for Firefox's UI
- [LanguageTool](https://addons.mozilla.org/en-US/firefox/addon/languagetool) spelling/grammar checker
- [SponsorBlock](https://addons.mozilla.org/en-US/firefox/addon/sponsorblock) skip sponsor sections in YouTube videos
- [Return YouTube Dislike](https://addons.mozilla.org/en-US/firefox/addon/return-youtube-dislikes)
- [Refined GitHub](https://addons.mozilla.org/en-US/firefox/addon/refined-github-)
- [Rust Search](https://addons.mozilla.org/en-US/firefox/addon/rust-search-extension) and [C/C++ Search](https://addons.mozilla.org/en-US/firefox/addon/c-c-search-extension) quickly open references/documentation

## <abbr title="Integrated Development Environment">IDE</abbr>

I primarily use [Visual Studio Code](https://code.visualstudio.com). These are the extensions I use, excluding LSPs

- [Catppuccin](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc) and [Catppuccin Perfect Icons](https://marketplace.visualstudio.com/items?itemName=thang-nm.catppuccin-perfect-icons)
- [Discord Rich Presence](https://marketplace.visualstudio.com/items?itemName=LeonardSSH.vscord)
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- [GitHub Actions](https://marketplace.visualstudio.com/items?itemName=github.vscode-github-actions) and [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
- [Live Share](https://marketplace.visualstudio.com/items?itemName=ms-vsliveshare.vsliveshare)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)

I also use [JetBrains'](https://jetbrains.com) [IntelliJ IDEA](https://jetbrains.com/idea) for Java, [CLion](https://jetbrains.com/clion) for C++, and sometimes [RustRover](https://jetbrains.com/rust) for debugging Rust. These are the extensions

- [Catppuccin Theme](https://plugins.jetbrains.com/plugin/18682-catppuccin-theme)
- [Catppuccin Icons](https://plugins.jetbrains.com/plugin/23029-catppuccin-icons)
- [VSCode Keymap](https://plugins.jetbrains.com/plugin/12062-vscode-keymap)

## Terminal and Package Management

I use [Kitty](https://sw.kovidgoyal.net/kitty) as my terminal on Linux and macOS, and Windows Terminal on Windows. For shells, I use [fish](https://fishshell.com) on Linux and macOS, and [Nushell](https://nushell.sh) and PowerShell on Windows.

On Linux, I prefer using `dnf` for packages on Fedora. On Debian and derivaties like Ubuntu, I like to use [Nala](https://github.com/volitank/nala) as the APT frontend. My second choice would be [Flatpaks](https://flatpak.org) from [Flathub](https://flathub.org), and if none of those are available, I install and manage AppImages using [Gear Lever](https://mijorus.it/projects/gearlever).

On Windows, I use [WinGet](https://learn.microsoft.com/en-us/windows/package-manager) and [Scoop](https://scoop.sh). And on macOS, I use [Homebrew](https://brew.sh).
