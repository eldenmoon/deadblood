# Changelog

## Repository orientation and Mac setup — 2026-09-08 — documentation only

- Add a prominent current-prototype startup command and clarify that `dist/` contains authored source.
- Add Mac mini M4 setup instructions and distinguish the running JS prototype from the not-yet-created Godot/Blender project.
- Document runtime-asset retention, source-asset availability and the fixed v4 reference snapshot.
- Keep runtime files, asset paths, existing tests and deployment unchanged. Mac instructions were reviewed against repository scripts and official documentation, not executed on the user's Mac.

## Demo production plan — 2026-09-08 — documentation only

- Add a proposed Blender-to-2D/Godot production workflow, D0–D4 deliverables, user/AI responsibilities, conditional schedule and first implementation task.
- Link the plan from the requirements. No engine migration, asset production or runtime change was performed.

## Design review — 2026-09-08 — documentation only

- Record the user's Steam target and the request to discuss the plan before implementation.
- Reopen animation, weapon handling, combat feedback and environmental art acceptance after user playtest feedback.
- Add R09–R12 and a lasting art requirement covering believable window/door/ladder integration, material consistency, occlusion and editable source assets.
- Record screenshot/source findings and proposed production gates. Engine migration, original IP direction and slice scope remain proposals.
- No runtime, asset or deployment change; no new playthrough or browser regression claimed.

## 1.4.0 — 长夜猎行 v4 — 2026-09-07

- Split Central Yharnam into connected streets, dry dock/canal, optional bridge and cemetery.
- Add ladders, discovery-gated wall climbing, hazardous gaps, secrets, recipes and return passages.
- Add protagonist opening, NPC return visits, exclusive brooch choice, event journal and dynamic chapter remembrance.
- Replace canvas text with sharp DOM labels and add three generated NPC/equipment/effect atlases.
- Rebuild inventory around a rarity icon grid, equipped slots, item detail, crafting and skill panels.
- Add six weapon classes, actual offhand dual damage, four equipable arts, stamina and revised supplies.
- Distinguish Gascoigne timed gun parry from Cleric Beast head-stagger openings; add layered impact feedback.
- Add local automatic saves and v3-to-v4 compatibility while retaining JSON backups.
- Verify 48 behavior tests and 14 controlled browser scenario groups; subjective difficulty remains open to playtest feedback.

## 1.3.0 — 长夜猎行 v3

Two-chapter prototype, six hunter weapons, outfits/sets/gems, gun parry/rally, two bosses, a short music-box quest and JSON saves. Fix visible embedded-browser RAF stalling with a shared-clock watchdog.

## Earlier prototypes

Original sanctuary combat and inventory; replace initial Three.js presentation with authored pixel sprites. Repair negative roll/heal timers and post-dodge input loss. Historical source commits remain in the development repository.
