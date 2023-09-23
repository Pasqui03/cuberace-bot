# Cube Race bot on Discord

## Prefix

The prefix for commands is `/` (aka slash command).

## General Format

`/command $options`

## List of commands

### `/compete $event $attempt1 $attempt2 $attempt3 $attempt4 $attempt5`

Insert the attempts for `$event`. It requires 3 or 5 attempts, depends of `$event` value.

##### $event

The type of event, the value can be any of the following:

- 3 (required 5 attempts)
- 2 (required 5 attempts)
- 4 (required 5 attempts)
- 5 (required 5 attempts)
- 6 (required 3 attempts)
- 7 (required 3 attempts)
- oh (required 5 attempts)
- pyra (required 5 attempts)
- sq1 (required 5 attempts)
- clock (required 5 attempts)
- megaminx (required 5 attempts)
- skewb (required 5 attempts)
- 3bld (required 3 attempts)
- 4bld (required 3 attempts)
- 5bld (required 3 attempts)

##### $attempt(n)
For each attempt, requires one of these following values:

- time express in seconds and milliseconds (ss.mm)
  - examples: 10.09, 9.31, 23.01
- time express in minutes, seconds and milliseconds (MM:ss.mm)
  - examples: 1:31.21, 59:41.00, 62:27.00
- DNF
- DNS

### `/competembld $time $solvedCubes $totalCubes`

Insert the attempt for MBLD event, there's only 1 attempt for each competitor.
The results of MBLD must follow from WCA Regulation ([Article H: Multi-Blind Solving](https://www.worldcubeassociation.org/regulations/#article-H-multiple-blindfolded)).

##### $time

The `$time` value

- time express in seconds and milliseconds (ss.mm)
  - examples: 10.09, 9.31, 23.01
- time express in minutes, seconds and milliseconds (MM:ss.mm)
  - examples: 1:31.21, 59:41.00, 62:27.00

##### $solvedCubes
Value of number of solved cube

##### $totalCubes
Value of number of total number

### `/ranking $event`
Print the current ranking based on results of an event

### `/givewinnerrole`
Give the role automatically to the winner of any event

### `/reset`
Reset all results of the current ranking

### `/docs`
Prints the link of this page.

## Next version
The next version should use cron for event scheduling for this discord bot to automate the task (print scrambles, print ranking, reset the results, etc) for each week (weekly comp).