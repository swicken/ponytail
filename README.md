<p align="center">
  <img src="assets/logo.png" width="220" alt="Ponytail, the lazy senior dev">
</p>

<h1 align="center">Ponytail</h1>

<p align="center">
  <em>He says nothing. He deletes the three files you didn't need. It still works.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/swicken/ponytail?style=flat-square&color=111111&label=stars" alt="Stars">
  <img src="https://img.shields.io/badge/works%20with-11%20agents-111111?style=flat-square" alt="Works with 11 agents">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
</p>

> **A fork of [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail).**
> Dietrich built the lazy senior dev — the concept, the ladder, the icon, the
> benchmarks. This fork sands down the parts the [Reddit
> thread](https://www.reddit.com/r/ClaudeAI/comments/1u3k2ed/i_gave_claude_code_a_lazy_senior_dev_mode_and_it/)
> kept catching on: it makes the goal **readability and scope control**, not
> line count. See [What this fork changes](#what-this-fork-changes).

---

You know him. Long ponytail. Oval glasses. Has been at the company longer than the version control. You show him fifty lines; he looks at them, says nothing, and replaces them with the five that were doing the work.

Ponytail puts him inside your AI agent.

## Before / after

You ask for a date picker. Your agent installs flatpickr, writes a wrapper component, adds a stylesheet, and starts a discussion about timezones.

With ponytail:

```html
<!-- ponytail: browser has one -->
<input type="date">
```

More survivors in [examples/](examples/).

## What this fork changes

The original's pitch — and its most-quoted example — leaned hard on *fewer
lines*. The thread's best feedback was that line count is the wrong target:
the real wins are scope and readability. This fork rewrites the rules to say
so, and fixes the example everyone roasted.

- **Readability is the constraint, not line count.** The ladder no longer ends
  at *"make it one line"*; it ends at *"collapse it, as far as it still reads at
  a glance."* Terse is not the same as clever — a clear ten lines beats a
  cryptic one.
- **Scope control is a first-class rule.** Do what was asked and stop. No
  drive-by refactors, renames, or reformatting of files you weren't sent to.
  Spot something else worth fixing? Name it in one line and leave it. (New
  worked example: [examples/scope-control.md](examples/scope-control.md).)
- **Duplication earns one abstraction.** Skipping abstraction is lazy until the
  same line is pasted into ten call sites — that's ten edits later, not less
  code. DRY when the repetition is *real*, never on spec.
- **The email example actually validates nothing — and says so.**
  [examples/email-validation.md](examples/email-validation.md) now leads with
  the round-trip confirmation (the only real test), demotes the one-liner that
  waves through `xx!rr@tt55**@pp@..`, and adds the trust boundary the original
  skipped: an address like `"victim@x.com\nBcc: attacker@evil.com"` is a
  header-injection, so strip newlines before it goes near a mail header.

Everything else — the character, the ladder, the intensity levels, the
multi-agent support, the benchmarks — is Dietrich's. Credit where it's due.

## Numbers

Five everyday tasks (email validator, debounce, CSV sum, countdown timer, rate limiter), three models, three arms: no skill, the [caveman](https://github.com/JuliusBrussee/caveman) skill, and ponytail. Ten runs per cell, median reported. (Benchmarks are inherited from upstream.)

<p align="center">
  <img src="assets/benchmark-3model.svg" width="860" alt="Median lines of code per arm across Haiku, Sonnet and Opus; ponytail writes far less code than the no-skill baseline">
</p>

Less code, less cost, and faster than a no-skill agent, on every model — but
the line count is a *symptom*, not the goal. The point is fewer moving parts:
less surface for bugs to hide in, less for the next reader to hold in their
head. Every shortcut ponytail takes is marked in the code with a `ponytail:`
comment naming its upgrade path. Reproduce it yourself: `npx promptfoo eval -c benchmarks/promptfooconfig.yaml`. Method and raw numbers: [benchmarks/](benchmarks/). Production-grade tasks, where an unconstrained agent bloats far more, are written up in [benchmarks/results/](benchmarks/results/).

## How it works

Before writing code, the agent stops at the first rung that holds:

```
1. Does this need to exist?   → no: skip it (YAGNI)
2. Stdlib does it?            → use it
3. Native platform feature?   → use it
4. Installed dependency?      → use it
5. Collapse to less?          → as far as it still reads at a glance
6. Only then: the minimum that works
```

Lazy, not negligent: trust-boundary validation, data-loss handling, security, and accessibility are never on the chopping block. And lazy is about scope, not speed-typing — it does the thing you asked for and doesn't go on a side quest through the rest of your repo.

## Install

The most effort ponytail will ever ask of you:

### Claude Code

```
/plugin marketplace add swicken/ponytail
/plugin install ponytail@ponytail
```

### Codex

```bash
codex plugin marketplace add swicken/ponytail
codex
```

Open `/plugins`, select the Ponytail marketplace, and install Ponytail. Then
open `/hooks`, review and trust its two lifecycle hooks, and start a new thread.

### Pi agent harness

```
pi install git:github.com/swicken/ponytail
```

### OpenCode

Run OpenCode from a checkout of this repo (the plugin reuses its `hooks/` and `skills/`), and add to `opencode.json`:

```json
{ "plugin": ["./.opencode/plugins/ponytail.mjs"] }
```

Injects the ruleset every turn at the active level; adds `/ponytail`, `/ponytail-review`, and `/ponytail-audit`. OpenCode also auto-loads this repo's `AGENTS.md`, so the rules hold even without the plugin. The plugin adds the `lite/full/ultra/off` levels.

### Gemini CLI

```bash
gemini extensions install https://github.com/swicken/ponytail
```

Loads the ruleset as always-on context every session and registers `/ponytail` and `/ponytail-review`; the `skills/` ship too, activated when a task needs them.

That was it. He'd be proud. He won't say it.

Active every session. `/ponytail-review` finds what to delete in your diff, `/ponytail-audit` does the same for the whole repo. `/ponytail ultra` exists for when the codebase has wronged you personally. `/ponytail-help` explains the rest.

In Codex, invoke the skills as `@ponytail`, `@ponytail-review`,
`@ponytail-audit`, and `@ponytail-help`. Startup and mode-change text shows the
current mode.

Cursor, Windsurf, Cline, Copilot, Aider, Kiro: copy the matching rules file from this repo ([`.cursor/rules/`](.cursor/rules/), [`.windsurf/rules/`](.windsurf/rules/), [`.clinerules/`](.clinerules/), [`.github/copilot-instructions.md`](.github/copilot-instructions.md), [`AGENTS.md`](AGENTS.md), [`.kiro/steering/`](.kiro/steering/)).

Kiro: copy `.kiro/steering/ponytail.md` to `~/.kiro/steering/` (global) or `.kiro/steering/` in your project.

GitHub Copilot CLI: it already reads `AGENTS.md` and `.github/copilot-instructions.md` in a project, or copy the rules into `~/.copilot/copilot-instructions.md` to run ponytail in every project.

Which files map to which agent: [Agent portability](docs/agent-portability.md).

## Development

`AGENTS.md` is the single source for the compact rule copies. After editing it,
regenerate the per-agent copies (Cursor, Windsurf, Cline, Copilot, Kiro):

```bash
node scripts/sync-rule-copies.js          # regenerate the copies
node scripts/sync-rule-copies.js --check  # verify they're in sync (CI)
```

## Credits

Original by [Dietrich Gebert](https://github.com/DietrichGebert/ponytail) — the
concept, the ladder, the icon, the benchmarks, the charm. This fork by
[Scott Wicken](https://github.com/swicken), applying feedback from the
[r/ClaudeAI discussion](https://www.reddit.com/r/ClaudeAI/comments/1u3k2ed/i_gave_claude_code_a_lazy_senior_dev_mode_and_it/).

## FAQ

**Does it need a config file?**
No.

**What if I really need the 120-line cache class?**
You don't. Insist anyway and he'll build it. Slowly. Correctly. While looking at you.

**Does it scale?**
The code you never wrote scales infinitely. Zero bugs, zero CVEs, 100% uptime since forever.

**Why "ponytail"?**
You know exactly why.

## License

[MIT](LICENSE). The shortest license that works.
</content>
</invoke>
