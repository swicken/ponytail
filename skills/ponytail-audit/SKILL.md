---
name: ponytail-audit
description: >
  Whole-repo deletion audit: the subtract half of ponytail-review run across
  the entire tree instead of a diff, plus repo-wide duplication. A ranked,
  payoff-first list of what to delete, simplify, de-duplicate, or replace with
  stdlib/native equivalents. Use when the user says "audit this codebase",
  "audit for over-engineering", "what can I delete from this repo", "find
  bloat", "ponytail-audit", or "/ponytail-audit". One-shot report, applies no
  fixes.
---

The deletion audit: ponytail-review's *subtract* lens, run across the whole
tree instead of a diff, plus the one thing only a repo-wide scan can see —
real duplication. Find what to delete, simplify, or de-duplicate. Rank by
payoff, heaviest cut first.

For prod-killers (security, data-loss, footguns) use `/ponytail-review` on a
diff, or a security pass — a tree-wide danger hunt is a different, noisier job.

## Tags

Subtract (from ponytail-review):

- `delete:` dead code, unused flexibility, speculative feature. Replacement: nothing.
- `stdlib:` hand-rolled thing the standard library ships. Name the function.
- `native:` dependency or code doing what the platform already does. Name the feature.
- `yagni:` abstraction with one implementation, config nobody sets, layer with one caller.
- `shrink:` same logic, fewer lines. Show the shorter form.

Plus the audit-only one:

- `dry:` the same logic in 3+ places — a bug needs N fixes. List the copies, name the one home. Invisible in a diff; this is the finding only a whole-repo scan can make.

## Hunt

Deps the stdlib or platform already ships, deps imported once or never,
single-implementation interfaces, factories with one product, wrappers that
only delegate, files exporting one thing, dead flags and config, hand-rolled
stdlib, and the same block copy-pasted across files. Start from the dependency
manifest and the largest files — highest payoff per minute.

## Don't flag

A tree-wide scan sees everything, including things that look like bloat but
aren't. Skip: generated code, vendored / third-party directories, database
migrations, and test fixtures. Public API surface gets a softer touch —
deleting an exported symbol breaks callers you can't see, so flag it as
`delete: if unused — confirm callers first`, never a clean cut. The repo's own
tests and smoke checks are the ponytail minimum, never bloat.

## Output

Rank by payoff, heaviest cut first. Lead with the handful that actually matter;
cap the list at ~15 and summarize the tail (`+N minor one-liners, ask to see
them`) rather than dumping every finding. One line each:

`<tag> <what to cut>. <replacement>. [path]`

End with `net: -<N> lines, -<M> deps possible.` Nothing to cut: `Lean already. Ship.`

## Boundaries

Deletion and duplication only. Prod-killers (security, data-loss, correctness)
go to `/ponytail-review` or a security pass, not here. Lists findings, applies
nothing. One-shot.
"stop ponytail-audit" or "normal mode" to revert.
</content>
