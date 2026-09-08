# Deadblood · 烬途

当前可运行的是 **v4 浏览器功能原型（JavaScript + Canvas 2D）**。Godot + Blender Demo 仍处于制作计划阶段；仓库尚无 `project.godot`、Godot 场景或 `.blend` 文件。动作、美术和可玩性尚未通过商业品质验收。

## 立即运行现有原型

前提：Git、Node.js 22（与当前 CI 一致）。项目没有第三方 npm 依赖，不需要 `npm install` 或构建。

```bash
git clone https://github.com/eldenmoon/deadblood.git
cd deadblood
npm run dev -- --host 127.0.0.1
```

在同一台机器的浏览器打开 http://127.0.0.1:4173/ 。终端保持运行，按 `Ctrl+C` 停止。校验命令为 `npm run check` 和 `npm test`。

[Mac mini M4 配置与启动](docs/mac-mini-setup.md) · [Demo 制作计划](docs/demo-production-plan.md) · [最新需求与质量门槛](docs/requirements.md)

## 仓库用途与整理边界

| 当前目录 | 用途与处理 |
| --- | --- |
| `dist/` | 原型的手写源代码，目录名虽然像构建输出，但不能当缓存删除 |
| `dist/assets/` | 原型实际引用的 9 张 WebP；与代码一起保留，供复现和视觉参考 |
| `tests/` | 行为回归及开发浏览器工具；Godot 迁移时复用测试场景与验收规则，JavaScript 测试不能直接运行 GDScript |
| `scripts/` | 当前原型启动脚本 |
| `docs/` | 需求、故事、资产清单、历史研究、制作计划与配置说明 |

后续在同一仓库新增 `game/`（Godot）、`art-src/`（可编辑源资产）、`tools/`（离线导出工具）；这些目录在开始实际制作时创建。现阶段保留可运行原型，不做无收益的目录搬迁。Godot 样板稳定后，才讨论将旧应用移入专门的原型目录，并同步修改启动、测试与部署路径。

原型完整代码和运行图的固定参考点：[v4 源码快照](https://github.com/eldenmoon/deadblood/tree/36daad0b79e01e95ef1a8b66f378ebf1f6329026)。主干文档会继续更新。资产如何保留和复用见 [资产管理](docs/assets.md)。

A browser combat/exploration prototype drawing on Bloodborne's exploration/story structure and Dead Cells/DFO combat and equipment ideas. The active renderer is Canvas 2D and has replaced the earlier Three.js prototype.

## Playable scope

Hunter’s Dream is the safe story/workshop hub. Central Yharnam now consists of four connected regions: streets, dry dock/canal, optional Great Bridge, and Oedon cemetery. There are 36 enemy placements, eight archetypes, two elite types and two bosses. Ladders, an unlockable climbing ability, upper routes, hazardous gaps, one-time secrets, five crafting recipes, a return shortcut and persistent lamps connect exploration to progression. The original sanctuary trial remains playable.

A new protagonist opening, three NPC quest segments, an exclusive brooch choice, a branching chapter remembrance, a quest journal and persistent event history provide continuity. See [the story bible](docs/story-bible.md) for current implementation, source links, adaptation boundaries and deferred story hooks. [The v3 research record](docs/hunt-research.md) describes the earlier release, some of whose map and save choices have now been replaced.

## Maintenance

[Requirements](docs/requirements.md), [roadmap](docs/roadmap.md), [asset guide](docs/assets.md), [asset manifest](docs/assets-manifest.json), [changelog](CHANGELOG.md) and AGENTS.md form the iteration baseline. Issue/PR templates and a GitHub Actions check workflow are committed. Check the repository's Actions page for the latest remote result; historical local checks do not establish current remote CI status.

## Controls

| Input | Action |
| --- | --- |
| A/D, left/right | Move |
| W/S, up/down | Climb ladder; marked wall after acquiring the ability |
| Space | Jump, double jump, detach from climbing |
| J | Three-hit melee / firearm attack / nearby visceral execution / attack secret |
| Shift/L | Dodge; costs 24 stamina and cancels attack/heal |
| F | Independent gun parry; costs one bullet |
| V | Transform supported melee weapons or rifle-spear |
| B | Toggle dual wield when both slots contain melee weapons |
| 1/2 | Select weapon slot |
| K/Q | Equipped hunter arts, selected in inventory |
| C | Music box, once per Gascoigne fight after the girl's quest |
| R | Heal with a blood vial |
| E | Talk, investigate, open/pick up, use passage or lamp |
| Tab | Inventory; slots, icons, item details and skills |
| M | Quest journal, region map and lasting story records |
| Escape | Close/pause/resume |

Touch controls include up/down climbing. Keyboard or landscape play provides more horizontal visibility. Starting a new hunt enables synthesized sound; the speaker button mutes it. Focus loss pauses play. Reduced-motion preference suppresses impact camera shake.

## Combat and equipment

100 stamina limits uninterrupted attacking, dodging and skills. Rest provides 3 vials and 12 bullets. Normal kills no longer grant guaranteed vials. Recent damage can be rallied back in melee. Gascoigne can be gun-parried in every phase in the last 0.28 seconds of windup. Cleric Beast instead requires three recovery-state head shots, then a visceral attack. HUD cues distinguish the two rules.

15 weapon definitions include six added in v4: pistol, cannon, paired blades, rifle-spear, blunderbuss and flamesprayer. Firearm attacks consume ammunition and have cooldowns; the cannon damages an area. Dual wield adds an offhand damage hit and stamina cost. Five rarities, six attire/rune pieces, three sets, six affixes, three gems and deterministic +6 upgrades change actual combat values. Five discovery-gated recipes consume resources once per blueprint. Four arts have two equip slots and distinct area/direction, damage, status and cooldown rules.

## Progress

Automatic saves remain in the current browser. The title's continue button resumes safely in the Dream. JSON export/import provides a backup and transfer mechanism; there is no cloud account sync. v4 imports v3 equipment and quest flags while replacing the old flat-map coordinates. If browser storage is unavailable, manual export remains available. Death retains gear and flags; echoes remain at the death position until recovered or replaced by the next death.

## Source and assets

- `engine.js`: core fixed-step movement, buffered melee and sanctuary.
- `campaign.js`: extended combat, climbing, quests, economy, lifecycle and save validation.
- `hunt-content.js`: base equipment, enemy and earlier story definitions.
- `hunt-expansion.js`: current region layouts, added weapons, recipes, arts, quests and branching story text.
- `hunt-ui.js`: pixel equipment grid, detail panels, crafting, skills, dialogue and journal.
- `pixel-scene.js`: integer-scaled pixel canvas and layered effect rendering.
- `main.js`: crisp DOM world labels, HUD, keyboard/touch, audio, autosave and shared-clock RAF watchdog.

Nine generated art assets are loaded. v4 adds NPC idle poses, twenty equipment icons and four rows of combat effects. Generated atlas rows use individually adjusted NPC bounds; the artwork and animations remain a prototype, with some shared enemy/weapon poses. Background art stays pixelated; text is rendered separately at native browser resolution. The unused legacy Three.js runtime was removed from the current source tree.

## Verification

`npm run check` checks seven application modules. `npm test` passes 48 behavior checks, retaining 23 original movement/combat regressions. The development-only browser harness passed 14 scenario groups covering opening, repeated actions, climbing, equipment, crafting, parry/visceral, music, pause, death/respawn, chapter ending and persistent sidequest choices. Browser fixtures control encounters and rewards; these are not an unassisted complete playthrough or final balance certification.

`tests/browser-harness.js` is outside the published directory, injected only by the development server with `?qa`. Static production has no fixture controls. No dependency installation or build is required; Sites serves `dist`. Preview uses `scripts/dev-server.mjs`.

Not implemented: additional Bloodborne maps, complete original quest scripts, procedural maps, multiplayer, controller support, cloud sync, full directional animation or final difficulty tuning.
