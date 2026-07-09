#!/usr/bin/env node
// ponytail — SubagentStart hook
//
// SessionStart context is parent-thread only and never reaches subagents, so
// without this every Task-spawned agent runs ponytail-unaware. When a mode is
// active, inject the same ruleset into each subagent.
//
// ponytail: injects into every subagent, no stdin read — synchronous and
// stall-proof. Per-agent-type scoping when someone actually needs it.

const { getPonytailInstructions } = require('./ponytail-instructions');
const { readMode, writeHookOutput } = require('./ponytail-runtime');

const mode = readMode();
if (mode && mode !== 'off') {
  try {
    writeHookOutput('SubagentStart', mode, getPonytailInstructions(mode));
  } catch (e) {
    // Silent fail — a stdout error must not surface as a hook failure.
  }
}
