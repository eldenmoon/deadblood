# 长夜猎行：调研与横版改编

调研日期：2026-09-07。此文件区分原作参考与本作的实现选择。美术为新生成素材，剧情文字、地图坐标、掉落表与战斗数值为本作编写。

## 关卡与叙事

《血源诅咒》的猎人梦境是成长、工坊、商店与传送枢纽。初访可获得武器；获得灵视后人偶可帮助角色成长。它不应被当成塞满小怪的第一张战斗地图。参考：[Hunter’s Dream](https://www.bloodborne-wiki.com/2015/03/dream-refuge.html)、[Doll](https://www.bloodborne-wiki.com/2015/03/doll.html)。

本作梦境设人偶、老猎人、工坊、觉醒墓碑。人偶给予起步资源并提供生命成长，老猎人讲解反击回血与枪反。为缩短原型教学，未复制灵视解锁条件；未提前安排杰尔曼或月之存在等终局战斗。

亚南中心通过街道、广场、大桥、水渠和捷径形成相互连接的探索区域。圣职者野兽为可选 Boss；墓园里的加斯科因神父是推进原作流程的必经 Boss。参考：[Central Yharnam](https://www.bloodborne-wiki.com/2015/03/central-yharnam.html)、[Cleric Beast](https://www.bloodborne-wiki.com/2015/03/cleric-beast.html)、[Father Gascoigne](https://www.bloodborne-wiki.com/2015/03/father-gascoigne.html)。

本作将其改编为上方大桥支线和下方水渠主线。街道台阶通往大桥；地面道路始终可以绕过可选 Boss。水渠有返回街口的升降机交互，解锁后墓碑可直接前往水渠。墓园前有第二处灯火。神父倒下后，玩家还需向右推开欧顿之门，完成剧情并回到梦境。

女孩交付音乐盒的线索参考原作支线。本作使用原创对话，音乐盒简化为每场神父战可用一次的失衡效果，没有复制原作全部支线结局与触发条件。参考：[Tiny Music Box mechanics](https://www.bloodborne-wiki.com/2015/05/sand-box-page.html)。

## 敌人编排

原作亚南中的猎民、火枪手、猎犬、乌鸦、砖块巨汉和刽子手提供了不同的观察与应对节奏。“小怪 / 精英”在这里是为了本作掉落和战斗编排而使用的分类，不是声称原作具有同名稀有度系统。参考：[Enemies](https://www.bloodborne-wiki.com/p/enemies.html)、[Brick minion](https://www.bloodborne-wiki.com/2015/03/brick-troll.html)、[Executioner](https://www.bloodborne-wiki.com/2015/03/executioner.html)。

| 本作类型 | 行为差异 | 奖励定位 |
| --- | --- | --- |
| 持炬猎民 | 近身蓄力挥砍，可打断 | 锯刀与回响 |
| 火枪猎民 | 长前摇瞄准、水平弹道 | 手杖与水银弹补充循环 |
| 染疫猎犬 | 快速接近、前冲扑咬 | 猎兽类装备 |
| 食腐乌鸦 | 低位慢速啄击，成组布置 | 轻型装备与材料 |
| 砖块巨汉 | 砖击交替冲压，轻击不打断蓄力 | 必掉一件传说装备、更多血石 |
| 刽子手 | 重斧横扫与追加一击 | 必掉一件传说装备、更多血石 |
| 圣职者野兽 | 大桥范围扫击、冲击波，半血追加连击 | 史诗圣钟重锤、6 血石 |
| 加斯科因神父 | 斧与枪、长斧追加攻击、低血兽化追击 | 史诗守墓长镰、6 血石、主线通路 |

本作选取上述 8 类而非复现亚南的全部敌人；原作还存在其他猎民变体、下水道敌人等。原作神父的人形到兽形转变、野兽大范围攻击与狭长桥面是设计参考；具体阈值、动作数量和招式数值均针对横版操作重新设计。

## 装备与战斗

官方资料强调血源的变形武器、不同攻击距离与连招，以及受伤后及时反击夺回生命的 Regain 系统。参考：[PlayStation — combat details](https://blog.playstation.com/2014/08/13/bloodborne-on-ps4-new-combat-details/)、[PlayStation — transforming cane](https://blog.playstation.com/2014/11/20/new-bloodborne-weapon-and-hunter-emerge/)。

本作保留原有三段连招、二段跳、翻滚取消和两件主动技能，新增 6 件猎人武器。V 切换新武器的形态：展开后范围与伤害增加，出招变慢。F 消耗水银弹，命中可枪反敌人蓄力末段会制造处决窗口；靠近按 J 处决。受伤后 3.5 秒内的近战命中可夺回部分最近损失的生命。大桥野兽不使用普通枪反规则。

DNF 的装备强化会提升装备属性，消耗金币与材料，原作的部分强化区间存在失败及惩罚；装备还具有品质与套装成长。参考：[DFO — equipment reinforcement](https://www.dfoneople.com/gameinfo/guide/Advanced-Game-Information/Equipment-System)、[DFO — items and equipment](https://www.dfoneople.com/news/updates/4388/Items-and-Equipment)。

本作借鉴可辨识的品质、词缀、套装和强化循环，使用五档品质、最高 +6 的确定性强化、一个可替换的武器宝石槽，以及夜猎 / 教会 / 兽痕三套衣装与符印。每个词缀、宝石和套装均接入实际战斗公式。未复制 DNF 的复杂版本养成、付费系统、强化失败或装备销毁。

普通怪提供回响和血石，并有概率掉落装备或宝石；精英保证装备掉落；两位 Boss 的史诗奖励直接收入背包，避免剧情推进时漏捡。旧装备可保留或分解，已装备物品不能分解。死亡保留装备和强化，回响留在死亡位置，重返后可拾回。普通敌人会随休整或重访复苏，Boss 与捷径进度在本次游戏中保留。

提供 JSON 进度导出 / 读取，读取在安全的梦境恢复。游戏没有账号、联网匹配或云端自动存档；刷新前需导出文件。
