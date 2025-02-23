+++
title = "Writing a CHIP-8 emulator"
date = "2025-01-18"
modified = "2025-02-21"
author = "theRookieCoder"
tags = ["chip8", "superchip", "emulator", "rust", "c", "c++"]
description = "A devlog of my experience writing a desktop CHIP-8 emulator in C, porting it to the Arduboy, porting the desktop app to Rust, adding support for emulating SUPER-CHIP, and finally porting the SUPER-CHIP emulator to C++."
+++

{{< image src="meme.avif" alt="CHIP-8 Meme" >}}

I first heard of CHIP-8 when I was beginning to learn Rust. A Redditor suggested it as a reasonably-sized but simple project to get started with a new progamming language. I tried to write it in Rust, but was unable to even get the obligatory *IBM logo* program to run; likely due to a lack of Rust knowledge, inexperience with programming, or both. Anyways, I bookmarked the tutorial with the intent of trying it out some other day, and moved on to other projects.

Wellll, 3 years have passed since then, and I have become much better at Rust and programming in general. About a year ago, I started learning C in Harvard's [CS50x](https://cs50.harvard.edu/x) course, and I really liked its simplicity and closeness to the bare metal. After completing the course's C assignments, and creating a [small Arduino project](https://github.com/theRookieCoder/ardudraw), I yearned for more C (as one does).


# Creating the Emulator

## Resources Used

I followed [Tobias Langhoff's guide](https://tobiasvl.github.io/blog/write-a-chip-8-emulator), which points out implementation details to watch out for, and common pitfalls; it is an excellent resource for implementing features iteratively.

Later on, I discovered [Timendus' test suite](https://github.com/Timendus/chip8-test-suite), which I wish I had known about earlier. It is invaluable for checking the implementation of the more nuanced behaviour of the CHIP-8 and its derivatives, such as carry flag behaviour, and implementation-specific quirks that have emerged over the years of various CHIP-8 emulators being developed for different platforms.

If you are making your own emulator, I highly recommend joining the [Emulator Development](https://discord.gg/rcgsvtk7Xv) Discord server, and making use of the [#chip-8](https://discord.com/channels/465585922579103744/465586212804100106) and [#resources-systems](https://discord.com/channels/465585922579103744/482208284032499713) channels. There are active and experienced people there who can help you with issues in your emulator. Use the websites linked in the server if you would like to find more resources and documentation about the CHIP-8.

I do not recommend using a search engine to find resources, because they often surface incorrect/outdated websites. Use the links in the EmuDev server, and ask in the #chip-8 channel if you are really struggling to find out about something.

## Initial Implementation

The first step I took was defining variables for the most crucial components of the system; <abbr title="Random Access Memory">RAM</abbr>, the display buffer, and the program counter (`PC`), index (`I`), and variable (`V0`-`VF`) registers. I dumped these into global scope for the moment; I decided to worry about separating the frontend and core later.

I copied the font from Tobias' guide into a constant, and loaded the font into RAM beginning at address `0x050`. Then, I loaded the ROM file specified in the command-line argument into RAM, beginning at address `0x200`.

The execution loop of the CHIP-8 is quite simple.

1. Fetch 2 bytes from RAM at the address in the program counter, and store it in a 16-bit `instruction` variable. Keep in mind that the CHIP-8 is big-endian, i.e. the first byte (the one with the lesser address) is the more significant byte.

2. Increment the program counter by 2, since we just loaded 2 bytes.

3. "Decode" the instruction. CHIP-8 instructions pack the opcode and operands into a single 16-bit number. So, we need to mask out parts of it to determine the operands.

    | Mask   | Desc&shy;rip&shy;tion     | Usage                                    |
    | ------ | ------------------------- | ---------------------------------------- |
    | `_x__` | 2nd nibble                | `x`th variable register, written as `Vx` |
    | `__y_` | 3rd nibble                | `y`th variable register, written as `Vy` |
    | `___n` | 4th nibble                | 4-bit number (nibble)                    |
    | `__nn` | 3rd & 4th nibbles         | 8-bit number (byte)                      |
    | `_nnn` | 2nd, 3rd, and 4th nibbles | 12-bit number                            |

    The purpose of the last 3 operands depends on the opcode.  
    I extracted the operands by masking out the required nibble(s) using an `AND` operation (`&` in C), and bit-shifting them to the units place. I used `#define` for these instead of dedicated variables, but remember to add an extra pair of parentheses around the entire expression when using `#define`!

4. Determine the opcode to execute. The first nibble, and sometimes `n` or `nn`, is used to specify the opcode. I used nested switch statements for this, which is a terrible idea in hindsight. I kept forgetting to add `break`, and I initially used multiple `default` blocks to catch illegal instructions. A language with more powerful pattern matching would fare better here.

The instructions you should start off with are.

- `00E0`: Clear the display (no operands)
- `1nnn`: Jump to address `nnn`, i.e. set `PC` to `nnn`
- `6xnn`: Set `Vx` to `nn`
- `7xnn`: Add `nn` to `Vx`
- `Annn`: Set `I` to `nnn`
- `Dxyn`: Draw

Of these, the draw instruction is the most complex to implement. In fact, I would go as far as to say it is the most complex instruction the CHIP-8 has, and I made a few mistakes when implementing it. Despite Tobias mentioning in a yellow box to use `Vx` and `Vy` instead of `x` and `y` directly, I still made that mistake. Another mistake I made is that I forgot to reset the x-coordinate for every row, i.e. each time the y-coordinate is incremented. The other 5 instructions should be trivial to implement.

At first, I used the terminal as a display, using pipes to demarcate the pixels and the Unicode block character to represent a pixel that is on. With this, it should be possible to run [Timendus' CHIP-8 splash screen](https://github.com/Timendus/chip8-test-suite#chip-8-splash-screen) and the venerable *IBM Logo* programs. Here is a recording of the first time my program successfully ran and displayed the IBM logo.

<script src="https://asciinema.org/a/698540.js" id="asciicast-698540" async="true"></script>

## Completing the Instruction Set

After that, I began implementing more instructions, going in the order of Tobias' guide. As expected, I made many mistakes. Here they are in no particular order.

1. For the call subroutine instruction `2nnn`, I made a silly mistake and assigned `nnn` to the program counter before pushing `PC` onto the stack.
2. I completely forgot to implement `8XYE`.
3. The font instruction assigned the wrong address to `I`. I did not consider that each character takes up 5 bytes, and you have to multiply `Vx` by 5 when calculating the address offset.

I also had tons of bugs with flag calculations. [Timendus' flags test](https://github.com/Timendus/chip8-test-suite#flags-test) was really helpful for checking this.

4. You should locally buffer either `Vx` and `Vy`, or the carry/overflow flag. You do not want the assigned value to affect the flag calculation, or vice versa.  
    For example, consider the instruction `8xy4` (add with carry). If either `x` or `y` are `F`, such as with `8FA4`, it becomes tricky because the flag variable itself is being used as an operand. If you do not buffer the variable, you are going to
    - use the result of the flag calculation (`0` or `1`) when doing the addition, instead of using the value that was originally in `VF` or,
    - miscalculate the flag since you already overrode `Vx` with the result.
5. I did not realise that `VF` should *always* be overridden, even if it is used as an operand in the instruction.  
    Again with `8FA4`, you should first fetch the values of `VF` and `VA`, add and assign them to `VF`, then override `VF` with `0` or `1` depending on whether the addition overflowed. This means that the value of the addition is not actually used when `x` is `F`.  
    I reckon this behaviour is a side effect of the CHIP-8's lack of a dedicated carry flag.
6. The overflow flag for subtraction should be set even if the result is `0`, i.e. `Vx` and `Vy` are equal. In other words, the check for the overflow flag should be a slack inequality. This was not documented in Tobias' guide, and a website I was referring to misleadingly specified strict inequality. I have read online that this behaviour from the original COSMAC VIP is often overlooked due to its insignificance.

## Integrating a Windowed Front End

I decided to implement a desktop frontend first, and then port the code to the Arduboy, since it would be much easier to debug on a computer. I chose [SDL3](https://wiki.libsdl.org/SDL3/FrontPage) as the media interface library. I did not set up any fancy build system since I wanted to keep it simple; I have a [`justfile`](https://just.systems/man/en) that uses `clang` to compile, and `pkg-config` to fetch the `sdl3` headers. The disadvantage with this setup is that it is not cross-platform, but it should work on any <abbr title="UNIX like">*NIX</abbr> platform as long as the necessary programs and libraries are installed.

I used global variables for the frontend too, and I chose to use [main callbacks](https://wiki.libsdl.org/SDL3/README/main-functions#main-callbacks-in-sdl3), a new feature in SDL3. Since rendering the pixels as-is would result in a *tiny* window, I set the actual window size to a default of `1280x640`, and set the [logical presentation](https://wiki.libsdl.org/SDL3/SDL_SetRenderLogicalPresentation) to `64x32`. This would allow me to treat the window in my code as if its resolution was `64x32`, and let SDL automatically scale and stretch/letterbox the content to the actual window's resolution. I found SDL's API super easy to use; excluding setup, I was able to paint the display buffer to the screen with just 7 lines of code.

In between developing other features, I made some minor improvements to the SDL frontend.

- Change the colour scheme of the display to be more pleasing, ~~stolen from~~ inspired by [J. Massung's emulator](https://github.com/massung/CHIP-8).
- Use the plus and minus keys to change the emulation frequency.
- Use the space bar to pause execution.
- Simplify input handling to use an array and for loops rather than massive switch statements.
- Switch to using nanoseconds instead of milliseconds to time the emulation more precisely.
- Buffer inputs for 1 frame (16.67 ms).
- Make some tweaks to pass [Timendus' quirks test](https://github.com/timendus/chip8-test-suite#quirks-test) for the original CHIP-8.
- Use the SUPER-CHIP's better-looking font.
- Redraw the display whenever any window event occurs.

## Separating the Core

I had been playtesting various games, and they seemed to work well. So, I decided it was time to refactor the core into a separate file. I started by moving the machine state variables into a struct, `MachineState`. Since dynamic allocation was not necessary, I initialised the machine state on the stack using `static`. I added separate functions for executing an instruction and ticking the timers.

## Further Refinements

I posted about my emulator, the Arduboy port, and a draft of this article in the EmuDev server's #chip-8 channel, and they provided some very helpful feedback about my implementation. I made more general improvements to my emulator, and some changes based on these suggestions.

- For the aforementioned flag instructions, it is recommended to buffer the overflow/carry flag rather than the registers.
- For instructions `Ex9E` and `ExA1`, only the least significant nibble of the `Vx` register should be used when checking for key input.
- The "Amiga specific behaviour" Tobias talked about in his guide is a myth, and should not be implemented.
- I implemented key release detection for `Fx0A` within the core.
- I added an illegal instruction handler to the core so that embedded systems without an easily accessible console can alert the user.


# Arduboy Port

The [Arduboy](https://arduboy.com) is a credit-card sized, GameBoy-inspired device that uses the same chip and design as the [Arduino Leonardo](https://docs.arduino.cc/hardware/leonardo) internally. It is an embedded system, and if I want to port the emulator to it, I need to make the core more flexible and configurable.

## Difficulties

The most limiting factor with the Arduboy is its measly 2.5 <abbr title="Kibibyte, 1024 bytes">KiB</abbr> of RAM, less than what the original COSMAC VIP from 1977 had! There is also the fact that it is much harder to debug; there are no sanitisers to catch illegal memory access (or an OS to catch `segfault`s), no `gdb`/`lldb` to debug the program, no `valgrind` to assess memory safety, etc. This was my first non-trivial project in a non memory-safe language and on an embedded system, and it was quite an adventure.

I struggled to figure out how to instantiate the machine state struct, and I had so much trouble implementing a function that redirected `printf` to the serial interface because I did not understand how to use C's variable arguments API.

[Peter Brown](https://github.com/tiberiusbrown)'s Arduboy simulator [Ardens](https://tiberiusbrown.github.io/Ardens) was quite helpful since it pauses at illegal memory access, stack overflows, etc. Even though I do not understand AVR assembly, I could use the surrounding function calls to roughly figure out where in the program the fault occurred. Make sure you use the `.elf` file so that you have debug symbols in the simulator.

## Adapting the Core

Anyways, back to the emulator. Key input handling, pixel querying and toggling, and clearing the display were made into configurable function pointers, and I removed the display buffer from the machine state since it took up too much RAM. I made the size of the emulated RAM configurable at compile time using the `CORE_RAM_SIZE` macro, with a default of 4096 or `0x1000`. Many CHIP-8 programs can run on less than 4 KiB of RAM.

## Implementing the Arduboy Front End

After a few days of frustrating debugging, I eventually got an initial working implementation. Key input was implemented using a per-program configurable keymap, which maps to the Arduboy's 4-button D-pad and <kbd>A</kbd> & <kbd>B</kbd> buttons. Support for sound was next, which is a simple 440 Hz square wave tone.

I added a program selection menu at startup, and included 4 programs with the emulator. I also added an option to upload a program to RAM from a computer over serial. You need to select "Load from Computer" in the Arduboy's startup menu, run [the Python script](https://github.com/theRookieCoder/ChipBoy8/blob/main/chipboy8.py) with the path to the ROM file, type in the keys to map the Arduboy's buttons to, and wait for the program to transfer. This feature was particularly frustrating to implement because it is hard to keep two computers in-sync and waiting for each other. This was exacerbated by the design of the Arduino [`Serial`](https://docs.arduino.cc/language-reference/en/functions/communication/serial) class, which does not have a blocking method for reading.

## Optimising the Memory Layout

In the CHIP-8's memory map, addresses `0x000`--`0x200` are unused (apart from the font, which is 80 bytes) since that is where the COSMAC VIP stored its interpreter. This amounts to 432 unused bytes, which is around 17% of the Arduboy's total RAM. We cannot let these precious bytes go to waste, so I devised a solution to modify the memory map of the emulator.

The font can be placed anywhere in RAM, so I placed it just before where the program starts. Since the program starts at `0x200` and the font takes up `0x50` bytes, I placed it at `0x1B0`. Now, whenever the program uses addresses past the configured `CORE_RAM_SIZE`, we can make it wrap around to the beginning of the emulated RAM like a ring buffer. This effectively increases our usable program memory from `CORE_RAM_SIZE - 0x200` to `CORE_RAM_SIZE - 0x50`; that is 432 more bytes of usable program memory!

{{< figure src="memory-layout.svg" alt="ChipBoy8 Optimised Memory Layout" >}}

This required some modification of the code. The core itself was easy to modify, but for program loading I had to replace `Serial#readBytesUntil` with a custom for loop, and I had to split the `memcpy_P` into 2 parts based on whether the program wraps around RAM buffer.

With this, the emulator is pretty much complete! It passes all the tests as expected, and plays games quite well.


# SUPER-CHIP Emulator in Rust

In 1991, Erik Bryntse introduced SUPER-CHIP ([v1.0](https://groups.google.com/g/comp.sys.handhelds/c/RuzVNccds2Q/m/TcvLEWuY9scJ) and [v1.1](https://groups.google.com/g/comp.sys.handhelds/c/sDY9zFb6KUo/m/JcYBK2_yerMJ)), a CHIP-8 emulator for the [HP-48 series](https://www.hpcc.org/calculators/hp48.html) of graphing calculators with additional features. It included a new 128x64 high resolution mode, support for 16x16 sprites in the draw instruction, a larger font, persistent storage and retrieval of upto 8 of the variable registers, display scrolling, and a proper exit instruction. I decided to write an emulator in Rust that supported both the CHIP-8 and SUPER-CHIP.

## Rust Port

I started off with the core of the emulator by roughly translating the C implementation. I was able to improve instruction decoding using pattern matching, but Rust requires explicit casts (`val as T`) to convert into smaller types, which made the code messier. For the frontend I used SDL3 again, but without main callbacks since the Rust library did not have all the new features yet.

This was when I discovered a bug with my timing. I was playing Tetris, and I noticed the pieces would glitch out when I rotated them.

{{< video src="glitched-tetris-pieces" >}}

## Timing Bug

I implemented the execution loop by creating two separate timers, one for the 60 Hz delay and sound timers, and another for the instruction timer. This approach should not be used since it is possible for a different amount of instructions to run between two timer ticks. For example, at 600 instruction per second, there is supposed to be a constant 10 instructions per timer tick (or "frame"). With the method I was using, it is possible for the timers to drift, and 9 or 11 instructions may execute between timer ticks. If the instruction frequency is not a multiple of 60, it can also lead to "leap" instructions. This leads to bugs with certain timing sensitive games like Tetris. 

The recommended approach, which I learned from the EmuDev server, is to run at a fixed 60 Hz. In each frame, you should decrement the timers, and execute a constant amount of instructions at once (<abbr title="Instructions per Frame">IPF</abbr>). This also resolves the 100% single-core usage issue, since the CPU can sleep for the rest of the frame and busy-wait for less time.

I implemented the new approach in the Rust code, and it fixed the glitches. I ported the new timing to the Arduboy emulator too, since it was suffering from the same issue, although less frequently. With this bug fix, the Rust port's CHIP-8 implementation was complete.

## SUPER-CHIP Features

The first order of business was to increase the display buffer to `128x64`. In low resolution mode, which is backwards compatible with the CHIP-8, the emulator must scale the "legacy" display coordinates by 2 and toggle pixels in 2x2 blocks. I took the opportunity to improve the drawing code as well.

Despite claiming backwards compatibility, certain instructions worked differently in the SUPER-CHIP emulator compared to the original COSMAC VIP's CHIP-8 emulator. These are called "quirks", and the SUPER-CHIP's are the following.

- `8xy1`, `8xy2`, and `8xy3` do not reset `VF`
- `8xy6` and `8xyE` use `Vx` instead of `Vy`
- `Bnnn` jumps to `nnn + Vx` instead of `nnn + V0`
- `Fx55` and `Fx66` do not increment `I`

I implemented these, and chose which mode to use based on whether the ROM file had the extension `ch8` (CHIP-8) or `sc8` (SCHIP). I ran [Timendus' quirks test](https://github.com/timendus/chip8-test-suite#quirks-test) for both the original CHIP-8 and the modern SUPER-CHIP, and the only test that did not pass was the original CHIP-8's display wait behaviour.

I implemented the new SUPER-CHIP instructions as well. However, for the moment I left out the persistent flag storage instructions, `Fx75` and `Fx85`. When implementing the scrolling instructions, I felt that Rust's slice methods and slice indexing made it particularly convenient to implement. Again, the most complex instruction was the draw instruction, which had 3 "modes" now; low-resolution, high-resolution, and 16-pixel sprite.


# SUPER-CHIP Port to C++

After experiencing the limitations of C, I was interested in learning C++. I decided to port just the SUPER-CHIP part of the Rust emulator to C++, and use SDL3 again. I chose to use a build system this time, which was CMake.

My favourite improvements over C are namespaces and classes. I created the `core` namespace, with the machine state and constants like the display dimensions. The core methods are namespaced within the class too. I used classes to abstract away the SDL code, making use of the class destructor to implicitly clean up SDL at the end of the scope.

References meant that there were no longer any pointers to deal with, which I was glad about since I found pointers confusing at times, coming from Rust and its references. `std::array`s did not degrade into pointers like C-style arrays, so I could avoid pointer arithmetic. STL's functional features like interators were a breath of fresh air compared to C, albeit confusing and unintuitive at times, and safe abstractions over functions like `memcpy` and `memmove` are welcome additions. Like Rust's slice methods, STL's move and fill methods made display scrolling easy to implement.

One major frustration I had was with CMake, which was horrible to learn and use. The official documentation is unhelpful, tutorials that use modern features are sparse, and there is a confluddling number of ways to achieve the same thing.

C++ was confusing at times too. One behaviour that tripped me up was that it copies values by default, in contrast to Rust's move by default. This really cemented in me that I should be using references wherever possible, especially in range-based for loops. Coming from Rust, I dislike the implementation of `auto`, although I understand that with the looser typing and polymorphism, it would be very difficult to make it work properly.

I thought that IDE support for C++ in VS Code was poor. C++ is a complex language with many features, and I felt that VS Code and its extensions did not provide as much help as rust-analyzer for Rust would, for example. I was able to use [JetBrains CLion](https://www.jetbrains.com/clion) after my GitHub [Student Developer Pack](https://education.github.com/pack) was approved, and I find that it is much more helpful, with a significantly better experience out of the box. Unfortunately it is a paid product, unless you are a student.

# Potential Features and Further Optimisations

1. I have yet to implement sound for any of the desktop versions.
2. The Arduboy's ATmega32u4 has 32 KiB of flash memory, of which 15 KiB is still free. We can pack even more games into this space, but they would need to be less than 1 KiB and playable with a D-pad and 2 buttons. Contact me on Discord at `therookiecoder` if you have game suggestions.
3. The [`Arduboy2`](https://docs.arduino.cc/libraries/arduboy2) library has an internal screen buffer for the Arduboy's`128x64` display that takes up 1 KiB when packed into bytes. Since the CHIP-8 only has a `64x32` display, it should be possible to replace it with a display buffer that only takes up 256 bytes.
4. Implement the CHIP-8's display wait behaviour.
5. Port the SUPER-CHIP emulator to the Arduboy.
6. Add support for the XO-CHIP, although it would be near impossible to port this to the Arduboy without significant compromises.
