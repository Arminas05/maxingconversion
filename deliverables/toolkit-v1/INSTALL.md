# Installing your two skills

You bought two Claude Skills:

- `sales-page-builder/SKILL.md` — writes a working HTML sales page from an offer
- `vsl-script-builder/SKILL.md` — writes a full video sales letter script from an offer

A "skill" is a set of instructions Claude follows for a specific task. Once
installed, you just describe your offer in plain language and ask for a page
or a script — you don't need to know anything about prompting.

## What you need

An account with Claude that supports custom Skills. This changes from time
to time on Anthropic's side, so if you're not sure your current plan
supports it, check on Anthropic's own site before assuming — that's outside
our control and we're not going to pretend otherwise.

## If you use Claude Code (the CLI / desktop app)

1. Find your project's `.claude/skills/` folder (create it if it doesn't
   exist yet, at the root of the project you're working in).
2. Copy the two folders from this download — `sales-page-builder/` and
   `vsl-script-builder/` — into that `.claude/skills/` folder, so you end up
   with:
   ```
   your-project/.claude/skills/sales-page-builder/SKILL.md
   your-project/.claude/skills/vsl-script-builder/SKILL.md
   ```
3. Restart Claude Code (or start a new session) so it picks up the new
   skills.
4. Type `/sales-page-builder` or `/vsl-script-builder`, or just describe
   what you want ("build me a sales page for my $97 course") — Claude will
   recognize when to use the skill.

## If you use claude.ai directly

Custom Skills support on claude.ai depends on your plan and may change over
time. If your plan supports uploading custom Skills, upload each `SKILL.md`
file there following Anthropic's current instructions for adding a Skill.
If your plan doesn't support it yet, the Claude Code route above always
works and is free to set up.

## Using them

You don't need to memorize anything from these files. Just tell Claude what
you're selling — the offer, who it's for, and the price if there is one —
and ask it to build the page or write the script. The skill asks you
whatever else it needs before it writes anything.

## Support

Problems installing, or the skill isn't behaving as described? Email the
address on your receipt — that's a real reply, not a helpdesk queue.
