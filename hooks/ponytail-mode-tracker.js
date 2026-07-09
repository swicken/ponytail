#!/usr/bin/env node
// ponytail — UserPromptSubmit hook to track which ponytail mode is active
// Inspects user input for /ponytail commands and writes mode to flag file

const { getDefaultMode, writeDefaultMode } = require('./ponytail-config');
const { getPonytailInstructions } = require('./ponytail-instructions');
const { clearMode, readMode, setMode, writeHookOutput } = require('./ponytail-runtime');

let input = '';
let done = false;

function finish() {
  if (done) return;
  done = true;
  try {
    // Strip UTF-8 BOM some shells prepend when piping (breaks JSON.parse)
    const data = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = (data.prompt || '').trim().toLowerCase();

    // Match /ponytail commands
    if (/^[/@$]ponytail/.test(prompt)) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0].replace(/^[@$]/, '/');
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/ponytail-review' || cmd === '/ponytail:ponytail-review') {
        mode = 'review';
      } else if (cmd === '/ponytail' || cmd === '/ponytail:ponytail') {
        // `/ponytail default <mode>` persists across sessions; plain switches
        // stay session-scoped, so this is the only path that writes config.
        if (arg === 'default') {
          const dmode = writeDefaultMode(parts[2]);
          if (dmode) {
            writeHookOutput('UserPromptSubmit', dmode, 'PONYTAIL DEFAULT SET — new sessions start in ' + dmode + '.');
          }
          return;
        }
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'full') mode = 'full';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'off') mode = 'off';
        else if (arg === '') {
          // Bare /ponytail reports the active level, doesn't reset it.
          const current = readMode() || getDefaultMode();
          writeHookOutput('UserPromptSubmit', current, 'PONYTAIL MODE ACTIVE — level: ' + current);
          return;
        } else mode = getDefaultMode();
      }

      if (mode && mode !== 'off') {
        setMode(mode);
        // Re-inject the ruleset filtered to the new level. SessionStart only loaded
        // the startup level, so without this a mid-session switch moves the badge but
        // not the rules the model actually sees.
        writeHookOutput(
          'UserPromptSubmit',
          mode,
          'PONYTAIL MODE CHANGED — level: ' + mode + '\n\n' + getPonytailInstructions(mode),
        );
        return;
      } else if (mode === 'off') {
        clearMode();
        writeHookOutput('UserPromptSubmit', 'off', 'PONYTAIL MODE OFF');
        return;
      }
    }

    // Deactivate only on a standalone phrase — mentioning "stop ponytail"
    // mid-sentence ("don't stop ponytail") must not kill the mode.
    if (/^["']?(stop ponytail|normal mode)["']?[.!]?$/.test(prompt)) {
      clearMode();
      writeHookOutput('UserPromptSubmit', 'off', 'PONYTAIL MODE OFF');
    }
  } catch (e) {
    // Silent fail
  }
}

process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', finish);
// Never hang the session on a swallowed pipe: recover on error or timeout.
process.stdin.on('error', finish);
setTimeout(finish, 2000).unref();
