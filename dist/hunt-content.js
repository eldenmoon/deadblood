// Original horizontal adaptation; source notes are in docs/hunt-research.md.
export const HUNT_WEAPONS = [
 {name:'锯肉刀',family:0,type:'锯刀',tag:'变形 · 猎兽',color:'#d8b698',damage:19,range:1.8,durations:[.31,.34,.48],active:[.1,.12,.17],mult:[1,1.2,1.9],combo:['锯切','反手斩','撕裂回旋'],desc:'对兽类伤害 +25%。变形后展开刀刃，扩大攻击范围。',crit:'闪避后的首击必定暴击。',trait:'serrated'},
 {name:'猎人斧',family:1,type:'斧',tag:'变形 · 重击',color:'#bcc9d1',damage:28,range:2,durations:[.43,.46,.65],active:[.16,.18,.25],mult:[1,1.2,2.25],combo:['横劈','逆劈','蓄力旋斩'],desc:'第三段造成强硬直。长柄形态拥有更大的扫击范围。',crit:'击中蓄力中的敌人必定暴击。',trait:'heavy'},
 {name:'螺纹手杖',family:2,type:'鞭杖',tag:'变形 · 远距',color:'#d6c5ef',damage:20,range:2.5,durations:[.34,.37,.5],active:[.11,.13,.18],mult:[1,1.15,1.85],combo:['杖刺','抽击','链刃横扫'],desc:'展开链刃成为长鞭；第三段使敌人减速。',crit:'距离超过 2.1 米时必定暴击。',trait:'chain'},
 {name:'焚炉锯刃',family:0,type:'锯刀',tag:'灼烧 · 连击',color:'#ff9871',damage:22,range:1.9,durations:[.32,.34,.49],active:[.1,.12,.17],mult:[1,1.2,1.95],combo:['火切','燃斩','焚炉回旋'],desc:'每次命中附加灼烧，与追焰词缀形成配合。',crit:'闪避后的首击必定暴击。',trait:'fire'},
 {name:'圣钟重锤',family:1,type:'锤剑',tag:'史诗 · 破势',color:'#efd18a',damage:31,range:2.1,durations:[.45,.48,.7],active:[.17,.19,.27],mult:[1,1.3,2.35],combo:['钟鸣','崩击','镇魂重落'],desc:'第三段额外造成目标最大生命 3% 的伤害，最多 60。',crit:'击中蓄力中的敌人必定暴击。',trait:'bell'},
 {name:'守墓长镰',family:2,type:'镰',tag:'史诗 · 收割',color:'#aee5df',damage:27,range:3,durations:[.4,.43,.6],active:[.14,.16,.22],mult:[1,1.25,2.1],combo:['勾魂','回割','送葬'],desc:'对生命低于 35% 的敌人额外造成 25% 伤害。',crit:'距离超过 2.1 米时必定暴击。',trait:'reaper'}
];
export const SETS={hunter:{name:'夜猎',desc:'2 件：反击回血量 +50%，枪反处决伤害 +25%'},church:{name:'教会',desc:'2 件：受到的伤害 -12%，血瓶回复量 +15%'},beast:{name:'兽痕',desc:'2 件：变形攻击伤害 +20%，灼烧伤害 +50%'}};
export const ATTIRE=[
 {name:'夜猎长衣',kind:'attire',slot:'coat',set:'hunter',desc:'最大生命 +20；每次强化再 +5'},
 {name:'猎人印记',kind:'attire',slot:'rune',set:'hunter',desc:'武器伤害 +6%；每次强化再 +2%'},
 {name:'教会礼服',kind:'attire',slot:'coat',set:'church',desc:'最大生命 +28；每次强化再 +5'},
 {name:'圣愈符印',kind:'attire',slot:'rune',set:'church',desc:'武器伤害 +6%；每次强化再 +2%'},
 {name:'兽痕披肩',kind:'attire',slot:'coat',set:'beast',desc:'最大生命 +16；每次强化再 +5'},
 {name:'狂猎爪符',kind:'attire',slot:'rune',set:'beast',desc:'武器伤害 +6%；每次强化再 +2%'}
];
export const GEMS={blood:{name:'赤血宝石',desc:'武器伤害 +12%'},fire:{name:'余烬宝石',desc:'命中施加 3 秒灼烧'},mercy:{name:'怜悯宝石',desc:'近战命中回复 1 点生命'}};
export const ENEMY_TYPES={
 huntsman:{name:'持炬猎民',row:0,hp:85,h:1.8,damage:17,speed:2,reach:1.7,windup:.7,recover:.7,drop:[3,6]},
 rifle:{name:'火枪猎民',row:1,hp:65,h:1.8,damage:16,speed:0,reach:10,windup:1.05,recover:1.2,drop:[5]},
 hound:{name:'染疫猎犬',row:2,hp:54,h:.9,damage:13,speed:4.1,reach:2.3,windup:.48,recover:.75,beast:true,drop:[3]},
 crow:{name:'食腐乌鸦',row:3,hp:42,h:.8,damage:10,speed:.65,reach:1.5,windup:.6,recover:.9,beast:true,drop:[5]},
 troll:{name:'砖块巨汉',row:4,hp:240,h:2.5,damage:27,speed:1.8,reach:2.7,windup:1,recover:1.15,elite:true,drop:[4,6]},
 executioner:{name:'刽子手',row:5,hp:310,h:2.5,damage:30,speed:2.1,reach:2.6,windup:.9,recover:1.05,elite:true,drop:[4,7]},
 cleric:{name:'圣职者野兽',row:6,hp:1200,h:3.5,damage:29,speed:2.7,reach:3.1,windup:.9,recover:1.1,boss:true,beast:true,drop:[7]},
 gascoigne:{name:'加斯科因神父',row:7,hp:980,h:2.1,damage:24,speed:3.5,reach:2.4,windup:.7,recover:.85,boss:true,drop:[8]}
};
const floor=(x,y,w,h=5)=>({x,y,w,h});
export const CHAPTERS={
 dream:{id:'dream',name:'猎人梦境',subtitle:'I · HUNTER’S DREAM',width:42,start:6,exit:40,background:'dream',platforms:[floor(0,0,42),floor(19,1.6,7,.6),floor(27,2.8,7,.6)],enemies:[],chests:[],points:[
  {id:'doll',x:9,y:0,name:'人偶 · 血之回响',kind:'dialogue'},
  {id:'workshop',x:15,y:0,name:'工坊 · 强化与镶嵌',kind:'workshop'},
  {id:'mentor',x:23,y:1.6,name:'老猎人 · 长夜的来信',kind:'dialogue'},
  {id:'travel',x:33,y:0,name:'觉醒墓碑 · 选择目的地',kind:'travel'}
 ]},
 yharnam:{id:'yharnam',name:'亚南中心',subtitle:'II · CENTRAL YHARNAM',width:164,start:5,exit:159,background:'yharnam',
 platforms:[floor(0,0,164),floor(24,2,7,.6),floor(30,4,9,.6),floor(37,6,8,.6),floor(43,8,47,.8),floor(71,2,9,.6),floor(77,4,8,.6),floor(83,6,7,.6),floor(94,2.2,9,.6),floor(108,3.6,8,.6),floor(116,1.8,8,.6)],
 enemies:[{x:18,type:'huntsman'},{x:26,type:'huntsman'},{x:32,type:'rifle'},{x:39,type:'hound'},{x:46,type:'crow'},{x:49,type:'crow'},{x:53,type:'troll'},
 {x:49,y:8,type:'hound'},{x:57,y:8,type:'hound'},{x:64,y:8,type:'troll'},{x:79,y:8,type:'cleric',arenaStart:69,arenaEnd:89},
 {x:70,type:'hound'},{x:78,type:'rifle'},{x:87,type:'huntsman'},{x:99,type:'crow'},{x:103,type:'crow'},{x:112,type:'executioner'},
 {x:119,type:'rifle'},{x:125,type:'huntsman'},{x:146,type:'gascoigne',arenaStart:134,arenaEnd:159}],
 chests:[{id:'supplies',x:12,y:0,kind:'materials',amount:3,rarity:1},{id:'roof',x:35,y:4,kind:'weapon',weapon:5,rarity:2,level:2,affix:'frost'},
 {id:'huntercoat',x:61,y:0,kind:'attire',attire:0,rarity:2},{id:'huntersign',x:98,y:2.2,kind:'attire',attire:1,rarity:2},
 {id:'cellar',x:112,y:3.6,kind:'weapon',weapon:6,rarity:3,level:3,affix:'embers'},{id:'gemcache',x:122,y:1.8,kind:'gem',gem:'fire',rarity:2}],
 points:[{id:'lampStart',x:5,y:0,name:'亚南之灯 · 休整 / 返回梦境',kind:'lamp'},
 {id:'girl',x:41,y:0,name:'窗后的女孩 · 寻找父亲',kind:'dialogue'},
 {id:'shortcut',x:90,y:0,name:'升降机 · 开启返回街口的捷径',kind:'shortcut'},
 {id:'lampTomb',x:130,y:0,name:'墓园前灯 · 休整 / 返回梦境',kind:'lamp'},
 {id:'ending',x:161,y:0,name:'欧顿之门 · 黎明之前',kind:'ending'}]
 }
};
export const STORY={
 doll:{speaker:'人偶',title:'愿你在醒来后，仍记得自己',text:['血疗留下的寒意还在手心。你再睁眼时，城市的钟声已经远去，只剩白花在墓碑间起伏。','人偶递来一枚猎人印记：亚南的居民把兽疫当成外来者带来的诅咒，而狩猎之夜已经太久没有结束。','带上工坊的武器，去寻找通往欧顿礼拜堂的路。回响可以使你成长，血石可以让刀刃更锋利。'],button:'接受猎人的赠礼'},
 mentor:{speaker:'老猎人',title:'先活着回来',text:['“猎物倒下后，不要只看它留下的血。看看那些仍然紧闭的窗。”','受伤后，血条中浅色的部分尚未消逝。尽快用近战反击，就能把它夺回来。敌人蓄力快结束时开枪，贴近后用攻击完成处决。','大桥上的野兽不是唯一的道路。下方水渠通向墓园；那里的猎人，或许已经忘记了自己为何举起斧头。'],button:'记住他的提醒'},
 girl:{speaker:'窗后的女孩',title:'一支熟悉的曲子',text:['窗后传来很轻的声音：“你也是猎人吗？父亲很久没有回来。夜里，他有时会忘记我们的声音。”','一只小音乐盒从窗缝中递了出来。黄铜盖上磨损的刻痕，像一段被反复握紧的记忆。','你答应留意墓园的方向。获得「小音乐盒」：与神父交战时按 C，可使他短暂失衡；每次战斗只能使用一次。'],button:'收下音乐盒'},
 ending:{speaker:'猎人手记',title:'门后仍是长夜',text:['墓园归于安静。那把斧头的主人，终于不再回应远处的钟。你带着染尘的徽记推开欧顿之门。','这一夜的尽头不是答案。血疗、教会、失踪的猎人——每条线索都伸向城市更深处。','亚南中心主线已完成。返回梦境领取奖励，或重返大桥挑战圣职者野兽。'],button:'返回梦境 · 完成本章'}
};
