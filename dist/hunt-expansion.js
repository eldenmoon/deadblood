import {HUNT_WEAPONS,CHAPTERS,ENEMY_TYPES} from './hunt-content.js';
const weapon=(name,family,damage,range,type,trait,desc,color)=>({name,family,damage,range,type,trait,desc,color,tag:type+' · 工坊武装',durations:[.36,.4,.58],active:[.12,.15,.22],mult:[1,1.25,1.95],combo:['起势','追击','终式'],crit:'观察距离与精力，衔接武器和猎人秘术。'});
HUNT_WEAPONS.push(
 {...weapon('猎人手枪',2,34,12,'火枪','pistol','J 发射精准弹丸，每次耗弹 1；F 仍为独立枪反。','#e4c493'),ranged:true,ammo:1,rate:.55},
 {...weapon('黑火手炮',1,108,11,'手炮','cannon','J 发射爆破弹，命中爆炸半径 3 米；每炮耗弹 3。','#ffae72'),ranged:true,ammo:3,rate:1.5},
 weapon('乌鸦双刃',0,17,1.9,'双刃','twins','每一段都有副刃追击；第三段释放交叉刀光。','#c8c2ff'),
 weapon('锯齿步枪矛',2,26,3.2,'枪矛','bayonet','V 切换长矛与步枪；枪形态 J 射击耗弹 1。','#9bd5d5'),
 {...weapon('猎人喇叭枪',2,24,6,'霰弹枪','scatter','近距扇形弹幕，最多命中 3 个目标；耗弹 2。','#e6bd89'),ranged:true,ammo:2,rate:.85},
 {...weapon('余烬喷火器',0,22,4.5,'喷火器','flamer','前方范围喷焰并点燃敌人；每次喷射耗弹 1。','#ff9975'),ranged:true,ammo:1,rate:.38}
);
ENEMY_TYPES.rifle.drop=[9,13];ENEMY_TYPES.executioner.drop=[4,10,11];ENEMY_TYPES.troll.drop=[4,6,12];
for(const e of Object.values(ENEMY_TYPES)){e.damage=Math.round(e.damage*1.2);e.hp=Math.round(e.hp*(e.boss?1.25:1.12));}
const f=(x,y,w,h=.6)=>({x,y,w,h}), enemy=(type,x,y=0)=>({type,x,y});
const link=(id,x,y,to,spawn,label,gate)=>({id,x,y,to,spawn,gate,kind:'passage',name:label});
const lamp=(id,x,y=0)=>({id,x,y,kind:'lamp',name:'猎人之灯 · 休整 / 传送'});
const npc=(id,x,y,name)=>({id,x,y,kind:'dialogue',name});
CHAPTERS.dream.subtitle='I · 白花与契约';
CHAPTERS.dream.points.push(npc('memorial',37,0,'记忆墓碑 · 长夜纪事'));
CHAPTERS.yharnam={id:'yharnam',name:'亚南中心 · 猎民街区',subtitle:'II — 01 · 染血的来路',act:2,width:76,start:5,exit:73,background:'yharnam',
 platforms:[f(0,0,76,5),f(16,2.7,14),f(23,5.3,13),f(44,2.8,13),f(51,5.5,15),f(61,10,10)],
 ladders:[{x:20,y:0,top:2.7},{x:27,y:2.7,top:5.3},{x:48,y:0,top:2.8},{x:54,y:2.8,top:5.5}],walls:[{x:62,y:5.5,top:10}],
 enemies:[enemy('huntsman',16),enemy('huntsman',20),enemy('rifle',25,5.3),enemy('hound',30),enemy('huntsman',33),enemy('rifle',39),enemy('crow',45),enemy('crow',47),enemy('troll',51),enemy('hound',58),enemy('rifle',61,5.5),enemy('huntsman',66),enemy('executioner',69)],
 chests:[{id:'supplies',x:12,y:0,kind:'materials',amount:3,rarity:1},{id:'roof',x:32,y:5.3,kind:'weapon',weapon:5,rarity:2,level:2,affix:'frost'},{id:'crowRoof',x:68,y:10,kind:'weapon',weapon:11,rarity:3,level:3,affix:'duelist'}],
 points:[lamp('lampStart',5),npc('gilbert',9,0,'吉尔伯特 · 紧闭的窗'),npc('girl',44,2.8,'窗后的女孩'),link('toBridge',57,5.5,'bridge',4,'↑ 大桥 · 可选猎物'),link('toCanal',73,0,'aqueduct',4,'↓ 干船坞与暗渠'),link('streetGate',6,0,'tomb',5,'铁门捷径 · 从另一侧开启','shortcut')],
 signs:[{x:19,y:1,text:'W / S 攀梯 · 空格离梯'},{x:61,y:6,text:'爪痕通向高处 · 需要攀墙印记'}]};
CHAPTERS.aqueduct={id:'aqueduct',name:'亚南中心 · 干船坞与暗渠',subtitle:'II — 02 · 被遗弃的人',act:2,width:82,start:4,exit:78,background:'yharnam',
 platforms:[f(0,0,24,5),f(29,0,24,5),f(58,0,24,5),f(4,3,13),f(14,6,13),f(22,9,12),f(37,3,11),f(46,6,12),f(65,3,12)],
 ladders:[{x:8,y:0,top:3},{x:16,y:3,top:6},{x:25,y:6,top:9},{x:41,y:0,top:3},{x:49,y:3,top:6},{x:69,y:0,top:3}],
 hazards:[{x:24,w:5,y:-1.2},{x:53,w:5,y:-1.2}],
 enemies:[enemy('crow',11),enemy('crow',13),enemy('huntsman',21),enemy('rifle',22,6),enemy('hound',31),enemy('hound',34),enemy('troll',39),enemy('rifle',44,3),enemy('crow',47,6),enemy('crow',50,6),enemy('executioner',62),enemy('rifle',70),enemy('hound',75)],
 chests:[{id:'huntercoat',x:19,y:0,kind:'attire',attire:0,rarity:2},{id:'huntersign',x:54,y:6,kind:'attire',attire:1,rarity:2},{id:'gemcache',x:74,y:3,kind:'gem',gem:'fire',rarity:2}],
 points:[link('canalBack',2,0,'yharnam',71,'↑ 返回猎民街区'),npc('eileen',31,9,'乌鸦猎人 · 隐蔽阁楼'),{id:'hanging',x:18,y:6,kind:'secret',flag:'spearPlan',name:'悬挂的猎人遗物 · J 斩断绳索'},{id:'badge',x:65,y:0,kind:'key',flag:'badge',name:'锯肉猎人徽章 · 解锁枪炮配方'},{id:'wallCache',x:48,y:0,kind:'secret',flag:'wallCache',name:'裂纹砖墙 · J 破坏'},link('canalExit',79,0,'tomb',5,'→ 墓园前庭')],
 signs:[{x:26,y:0,text:'暗渠深坑 · 跳跃穿越'},{x:24,y:7,text:'阁楼深处有羽毛'}]};
CHAPTERS.bridge={id:'bridge',name:'亚南中心 · 大桥',subtitle:'II — 支线 · 钟声中的兽',act:2,width:55,start:4,exit:52,background:'yharnam',platforms:[f(0,0,55,5),f(7,2.5,17),f(17,4.8,9)],ladders:[{x:11,y:0,top:2.5},{x:21,y:2.5,top:4.8}],
 enemies:[enemy('hound',12),enemy('hound',16),enemy('rifle',22,4.8),enemy('troll',26),{...enemy('cleric',42),arenaStart:32,arenaEnd:52}],
 chests:[{id:'bridgeShards',x:24,y:4.8,kind:'materials',amount:5,rarity:2}],points:[link('bridgeBack',2,0,'yharnam',56,'↓ 返回猎民街区'),lamp('bridgeLamp',29)],signs:[{x:31,y:1,text:'巨兽无法普通枪反 · 收招时 F 累积头部失衡'}]};
CHAPTERS.tomb={id:'tomb',name:'亚南中心 · 欧顿墓园',subtitle:'II — 03 · 那首未唱完的歌',act:2,width:64,start:5,exit:61,background:'yharnam',platforms:[f(0,0,64,5),f(12,2.8,15),f(20,5.5,10),f(37,2.3,5),f(48,2.3,5)],ladders:[{x:16,y:0,top:2.8},{x:24,y:2.8,top:5.5}],
 enemies:[enemy('hound',14),enemy('huntsman',18),enemy('rifle',26,5.5),enemy('executioner',27),{...enemy('gascoigne',45),arenaStart:33,arenaEnd:58}],chests:[],
 points:[link('tombBack',2,0,'aqueduct',77,'← 返回暗渠'),lamp('lampTomb',7),{id:'shortcut',x:10,y:0,kind:'lever',flag:'shortcut',name:'开启街区铁门捷径'},link('tombGate',11,0,'yharnam',7,'← 街区铁门','shortcut'),{id:'brooch',x:55,y:2.3,kind:'key',flag:'brooch',gate:'boss-gascoigne',name:'红宝石胸针 · 薇奥拉'},{id:'ending',x:61,y:0,kind:'ending',name:'欧顿之门 · 结束本章'}],signs:[{x:31,y:1,text:'神父三阶段均可 F 枪反 · 金色预警时开枪'}]};
export const SKILLS={
 flame:{name:'焚星震荡',color:'#ffa36a',damage:64,radius:4.7,cooldown:9,desc:'周身火环 · 灼烧 3 秒',row:2},
 frost:{name:'霜棘新星',color:'#ace6ff',damage:36,radius:5,cooldown:8,desc:'冰晶爆破 · 减速 3 秒',row:3},
 storm:{name:'秘法雷葬',color:'#c9adff',damage:90,radius:6,cooldown:12,desc:'前方贯穿 · 高额秘法伤害',row:3,flag:'badge'},
 blades:{name:'鸦羽刃风',color:'#91f0e0',damage:78,radius:3.6,cooldown:10,desc:'环身刃风 · 对兽类伤害 +25%',row:1,flag:'eileen'}
};
export const RECIPES=[
 {id:'pistol',weapon:9,gold:120,materials:3,rarity:2,flag:'badge'},
 {id:'cannon',weapon:10,gold:280,materials:7,rarity:3,flag:'badge'},
 {id:'twins',weapon:11,gold:180,materials:5,rarity:3,flag:'eileen'},
 {id:'spear',weapon:12,gold:160,materials:4,rarity:2,flag:'spearPlan'},
 {id:'scatter',weapon:13,gold:140,materials:4,rarity:2,flag:'badge'}
];
export const FLAG_NAMES=['gift','mentor','musicBox','shortcut','complete','boss-cleric','boss-gascoigne','boss-boss','intro','gilbert','gilbertGift','eileen','wallClimb','badge','spearPlan','wallCache','brooch','broochReturned','broochCrushed',...RECIPES.map(r=>'crafted-'+r.id),...Object.keys(CHAPTERS).map(id=>'visited-'+id)];
export function storyFor(g,id){const f=g.flags;
 const story=(speaker,title,text,choices)=>({speaker,title,text,choices});
 if(id==='intro')return story('序章 · 外乡人的血契','你为何来到亚南？',['你曾是一名替人抄写讣告的旅人。肺中的黑血让你离开故乡；一封没有署名的信，只留下“亚南的血能治愈一切”。','诊所里，年老的医师收起针管。你在契约末尾写下名字，却在药液流入手臂后忘了它的读音。火光吞没床边的兽影，苍白的小手把你拖向另一场梦。','白花在脚下摇动。一件旧猎衣、一把锯刀、一支手枪，成为你醒来的全部行李。你要找到血疗的源头，也要确认自己仍然是人。'],[{id:'wake',label:'睁开眼睛 · 猎人梦境'}]);
 if(id==='gilbert')return story('吉尔伯特 · 窗后的病人',f['boss-gascoigne']?'火焰留给仍能走路的人':'同样来自异乡',f['boss-gascoigne']?['你把墓园的钟声告诉他。窗后是一阵漫长的咳嗽；他没有问你杀了谁。','“这东西本来留给我自己。拿去吧。要是到了教会，替我看看外面的天。”一台旧喷火器从窗口缓缓推出来。',f.gilbertGift?'窗台已经空了。你记得自己答应过，回来告诉他白天是什么颜色。':'获得稀有「余烬喷火器」。他的故事暂留在这扇窗后，等待下一章。']:['紧闭的窗后传来咳嗽声。吉尔伯特也曾为治病来到亚南，如今连走下楼梯都很困难。','“大桥已经封了。要去教会，就从干船坞往下走，穿过墓园。别相信那些举着火把的人——他们比你更害怕这场病。”','你记下这个声音。若能穿过墓园，你会回来告诉他。'],[{id:'gilbert',label:f['boss-gascoigne']&&!f.gilbertGift?'接过喷火器':'记住窗后的声音'}]);
 if(id==='eileen')return story('乌鸦猎人 · 隐蔽阁楼','猎人也会成为猎物',['羽毛落在干船坞的横梁上。面具下的女人没有举起刀；她先看了看你手上的血。','“还没有忘记为什么拔刀？那就学着去看脚下以外的地方。”她在墙面留下四道爪痕，教你借砖缝向上攀援。','获得「攀墙印记」、乌鸦双刃配方与鸦羽刃风。回到街区的高墙，那里藏着上一位猎人的遗物。她与其他猎人的恩怨留待以后。'],[{id:'eileen',label:f.eileen?'告别乌鸦猎人':'学习攀墙与双刃技法'}]);
 if(id==='girl'&&f.broochReturned)return story('紧闭的窗','音乐停了',['你曾把胸针交还给女孩。她认出了背面母亲的名字，低声道谢，随后关上窗。','这次没有人回答。你不确定她去了哪里；你把这份沉默写进手记，决定以后继续寻找。'],[{id:'leave',label:'在手记中留下她的名字'}]);
 if(id==='girl'&&f.broochCrushed)return story('窗后的女孩','你选择隐去的真相',['女孩问你是否找到了母亲。你握紧手里失去胸针底座的宝石，说墓园的路还不安全。','“那我就继续等。”窗后再次响起音乐。你得到了宝石，却再也无法把完整的信物还给她。'],[{id:'leave',label:'离开窗口'}]);
 if(id==='girl'&&f.brooch)return story('窗后的女孩','薇奥拉的名字',['女孩认得你手中的音乐盒。墓园里的胸针还压在你的衣袋中；背面的名字，与盒盖的刻痕一致。','你可以把胸针交给她，也可以碾碎它，把红宝石留给自己的武器。这次选择会留下记录，不能在本轮狩猎中撤回。'],[{id:'returnBrooch',label:'归还胸针 · 告诉她墓园的事'},{id:'crushBrooch',label:'隐瞒消息 · 取出赤血宝石'},{id:'leave',label:'暂时保留，稍后决定'}]);
 if(id==='ending'||id==='memorial')return story('长夜纪事','门后的天仍然是黑的',[
 f['boss-gascoigne']?'加斯科因的斧头静静躺在墓园。音乐没能让他回家，但你记得他曾是谁。':'墓园里仍有一位猎人在等待。你还没有走完这条路。',
 f.broochReturned?'女孩收下了母亲的胸针。你兑现了承诺，也留下了一扇再无人应答的窗。':f.broochCrushed?'红宝石嵌入刀刃。女孩仍在等，你决定背负没有说出口的那句话。':f.musicBox?'音乐盒留在你身边。女孩的请求尚未得到回答；墓园上方也许还有遗物。':'街区上方的窗，你没有敲过。长夜里有人仍在等待一位愿意倾听的猎人。',
 f.gilbertGift?'吉尔伯特把火焰交给了你。你仍欠他一次关于白昼的描述。':f.gilbert?'吉尔伯特仍在窗后咳嗽。穿过墓园后，记得返回街区。':'靠近亚南之灯，有一扇尚未敲响的窗。',
 f['boss-cleric']?'大桥上的钟声终于能越过野兽的尸身。可选猎物已倒下。':'大桥上的巨兽还活着。那条支路不阻碍前行，却藏着另一份战利品。',
 '你推开的只是通往教会的第一道门。血疗来自何处？为什么梦境认得你？答案留在尚未抵达的教堂区。猎人梦境与亚南中心的记忆将保存在手记和存档中。'],[{id:id==='ending'?'finish':'leave',label:id==='ending'?'封存本章记忆 · 返回梦境':'合上纪事'}]);
 return null;
}
export function questNotes(g){const f=g.flags;return [
 {title:'主线 · 血契的来路',state:f.complete?'本章完成':'追寻中',text:f['boss-gascoigne']?'从墓园右侧推开欧顿之门；回访街区与梦境，记录这一夜。':'街区 → 干船坞暗渠 → 墓园。亚南的血疗线索指向教会。'},
 {title:'窗后的旋律',state:f.broochReturned?'归还 · 窗口沉默':f.broochCrushed?'隐瞒 · 宝石留下':f.brooch?'等待你的选择':f.musicBox?'寻找家人':'尚未相识',text:f.musicBox?'墓园战可按 C 使用音乐盒一次。神父倒下后，调查墓园右上方的遗物，再回女孩的窗。':'留意街区中段高处的窗；由梯子上行。'},
 {title:'同乡的最后一束火',state:f.gilbertGift?'本段已完成':f.gilbert?'等待回访':'尚未敲窗',text:'亚南之灯右侧，吉尔伯特指引道路。击败神父后回访，获得喷火器。'},
 {title:'羽毛指向高处',state:f.eileen?'本段已完成':'寻找隐蔽阁楼',text:'干船坞左侧连续攀梯，抵达最上层。获得攀墙后，回街区最高屋顶寻找传说双刃。'},
 {title:'失落工坊的技艺',state:f.badge?'枪炮配方解锁':'徽章遗失',text:'暗渠后段刽子手守着锯肉徽章；干船坞悬挂遗物可斩断。图纸、血石和回响在梦境合成为武器。'}
 ];}
export function iconIndex(i){if(i.kind==='weapon')return ({0:0,1:1,2:9,3:0,4:1,5:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11})[i.weapon]??0;return i.slot==='coat'?{hunter:12,church:13,beast:14}[i.set]:{hunter:15,church:16,beast:17}[i.set]??18;}
export const iconHTML=i=>`<span class="pixel-icon" style="--ix:${iconIndex(i)%5};--iy:${Math.floor(iconIndex(i)/5)}" aria-hidden="true"></span>`;
