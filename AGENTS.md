# Emberfall development guide

Read README.md, docs/requirements.md and docs/story-bible.md before changing the game. The active application is in dist, despite that directory's conventional build-output name. It is authored source: do not regenerate or delete it.

## Product priorities

1. Controls must always release after roll, heal, hitstop, pause, death and area travel.
2. Story flags, prior choices and player gear must survive saves and migrations.
3. Exploration rewards must change actual movement, equipment or skill behavior.
4. Scene text belongs in native-resolution DOM, not the low-resolution canvas.
5. Keep Hunter’s Dream and Central Yharnam coherent. New map work follows the user's next approved scope; story hooks marked deferred are not implemented content.

## Structure

- engine.js owns the original simulation and legacy sanctuary regressions.
- campaign.js extends it; hunt-expansion.js is current region/story/recipe/skill data.
- hunt-ui.js owns modal UI; main.js owns inputs, HUD, audio, autosaves and the frame watchdog.
- pixel-scene.js renders art. Preserve atlas bounds and update the asset manifest when art changes.
- tests/browser-harness.js is development-only. Never move fixture controls into dist.

Use deterministic, behavioral tests for mechanics, persistence and state transitions. Use visual inspection for image/UI changes. Run npm run check and the relevant tests before committing. Run the full suite for a release. Do not assert that controlled boss fixtures are a full unassisted playthrough.

## Iteration and handoff

Update the linked requirement and CHANGELOG entry with actual behavior, validation and remaining limitations. Each PR should address a bounded player-facing problem. Preserve save version compatibility or document an explicit migration. Never silently replace an existing save schema or user equipment.

The current Sites deployment is declared in .openai/hosting.json. Follow Sites skills for preview and publishing; do not create a duplicate Site or publish test fixtures. Never commit tokens, authenticated screenshots, personal save files or private credentials. Source assets and generated asset provenance belong in the repository. GitHub becomes the continuing development source after initialization; Sites remains a deployment target.
