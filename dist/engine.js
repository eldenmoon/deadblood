export const WEAPONS = [
 {id:0,name:'流火刀',type:'刀',tag:'迅捷 · 灼烧',color:'#ff9f67',damage:17,range:1.65,durations:[.30,.30,.46],active:[.09,.10,.16],mult:[1,1.15,1.8],combo:['横斩','逆斩','烈焰回旋'],desc:'快攻压制。第三段回旋斩施加 3 秒灼烧。',crit:'翻滚后 0.9 秒内，首击必定暴击。'},
 {id:1,name:'霜痕剑',type:'剑',tag:'均衡 · 破防',color:'#8adee8',damage:24,range:2,durations:[.38,.40,.55],active:[.13,.13,.21],mult:[1,1.2,2.1],combo:['起手斩','上挑','断空重斩'],desc:'攻守平衡。第三段重斩破防，延长敌人硬直。',crit:'击中正在蓄力的敌人，必定暴击。'},
 {id:2,name:'逐星枪',type:'枪',tag:'长距 · 穿刺',color:'#d4b0ff',damage:21,range:3.1,durations:[.40,.38,.58],active:[.13,.12,.20],mult:[1,1.1,2],combo:['直刺','连刺','贯星突进'],desc:'长距离穿刺。第三段突进可同时击中多个敌人。',crit:'距离超过 2.1 米时，枪尖命中必定暴击。'}
];
export const STATS=[{name:'暴虐',color:'#ed687d'},{name:'战术',color:'#b18aef'},{name:'生存',color:'#79bf81'}];
export const AFFIXES={embers:{name:'追焰',desc:'对灼烧中的敌人伤害 +35%'},frost:{name:'寒锋',desc:'命中使敌人减速 2 秒'},execution:{name:'处决',desc:'对生命低于 35% 的敌人伤害 +30%'}};
export const weaponStat=id=>[0,2,1][WEAPONS[id]?.family??id];
export const weaponFamily=id=>WEAPONS[id]?.family??id;
export const RARITIES=[{name:'普通',color:'#b8c5c9',bonus:0},{name:'精良',color:'#72d6b0',bonus:.25},{name:'稀有',color:'#c298ff',bonus:.55}];
export const LEVEL = {width:116,start:3,exit:113,
 platforms:[{x:0,y:0,w:22,h:5},{x:24,y:0,w:25,h:5},{x:51,y:0,w:28,h:5},{x:81,y:0,w:35,h:5},
 {x:10,y:2.4,w:5,h:.65},{x:17,y:4.5,w:5,h:.65},{x:29,y:2.5,w:6,h:.65},{x:37,y:4.8,w:7,h:.65},{x:54,y:2.6,w:6,h:.65},{x:64,y:4.6,w:5,h:.65},{x:72,y:2.4,w:5,h:.65},{x:87,y:2.8,w:5,h:.65}],
 enemies:[{x:14,type:'swordsman'},{x:20,y:4.5,type:'archer'},{x:29,type:'swordsman'},{x:35,type:'shield'},{x:41,y:4.8,type:'archer'},{x:46,type:'swordsman'},{x:56,type:'shield'},{x:61,type:'swordsman'},{x:67,y:4.6,type:'archer'},{x:74,type:'shield'},{x:86,type:'swordsman'},{x:100,type:'boss'}],
 chests:[{x:7,y:0,kind:'weapon',weapon:2,rarity:1},{x:19,y:4.5,kind:'weapon',weapon:2,rarity:1},{x:33,y:2.5,kind:'scroll',rarity:1},{x:42,y:4.8,kind:'charm',rarity:2},{x:58,y:2.6,kind:'weapon',weapon:1,rarity:2},{x:75,y:2.4,kind:'flask',rarity:1}],
 checkpoint:82};
export class Game {
 constructor({random=Math.random}={}){this.random=random;this.listeners=[];this.serial=0;this.reset();}
 onEvent(fn){this.listeners.push(fn);return()=>this.listeners=this.listeners.filter(x=>x!==fn);}
 emit(type,data={}){for(const fn of this.listeners)fn({type,...data});}
 reset(){this.level=LEVEL;this.mode='title';this.time=0;this.kills=0;this.gold=0;this.hitstop=0;this.comboHits=0;this.comboClock=0;this.pendingLoot=null;this.pendingScroll=null;this.checkpoint=false;this.bossActive=false;this.loot=[];this.projectiles=[];this.effects=[];this.chests=LEVEL.chests.map((c,i)=>({...c,id:'chest'+i,open:false}));
 this.p={x:LEVEL.start,y:0,vx:0,vy:0,h:1.65,w:.58,hp:120,maxHp:120,dir:1,ground:true,jumps:0,coyote:.1,jumpBuffer:0,inv:0,roll:0,rollCd:0,rollCrit:0,attack:null,buffer:0,lastCombo:0,comboUntil:0,weapon:0,slots:[0,1],stats:[1,1,1],weapons:[{rarity:0,level:1,affix:null},{rarity:0,level:1,affix:null},{rarity:0,level:1,affix:null}],armor:0,charm:0,flasks:3,heal:0,skillCd:0,skill2Cd:0,kb:0};
 this.enemies=LEVEL.enemies.map((e,i)=>{let boss=(e.boss||e.type==='boss'),shield=e.type==='shield';return {...e,y:e.y||0,home:e.x,baseY:e.y||0,id:i,maxHp:boss?850:shield?105:70,hp:boss?850:shield?105:70,h:boss?2.9:1.6,w:boss?1.2:.6,vx:0,vy:0,dir:-1,ground:true,state:'idle',timer:0,cooldown:.6+i*.12,stun:0,flash:0,burn:0,burnTick:0,slow:0,attackCount:0,phase:1,dead:false};});this.emit('reset');}
 start(){this.mode='playing';this.emit('start');}
 pause(mode='paused'){if(this.mode==='playing'){this.mode=mode;this.p.buffer=0;this.p.jumpBuffer=0;this.emit('pause');}}
 resume(){if(['paused','inventory','help','loot','scroll','workshop','travel','dialogue','journal','lamp'].includes(this.mode)){this.mode='playing';this.pendingLoot=null;this.pendingScroll=null;this.emit('resume');}}
 equip(n){if(n<0||n>=WEAPONS.length||!this.p.slots.includes(n)||!['playing','inventory','title','paused'].includes(this.mode))return;if(this.mode==='playing'&&(this.p.attack||this.p.roll||this.p.heal))return;this.p.attack=null;this.p.weapon=n;this.p.lastCombo=0;this.p.buffer=0;this.emit('equip',{weapon:n});}
 action(a){let p=this.p;if(this.mode!=='playing')return;
 if(a==='attack'){p.buffer=.23;if(!p.attack&&!p.roll&&!p.heal)this.beginAttack();}
 if(a==='jump'){p.jumpBuffer=.14;if(p.heal>0)p.heal=0;}
 if(a==='roll'&&p.rollCd<=0){p.heal=0;p.attack=null;p.buffer=0;p.roll=.34;p.rollCd=.67;p.inv=Math.max(p.inv,.31);p.rollCrit=1.2;p.vy=p.ground?0:p.vy*.5;this.emit('roll',{x:p.x,y:p.y});}
 if(a==='heal'&&p.flasks>0&&p.hp<p.maxHp&&!p.attack&&!p.roll&&!p.heal){p.heal=.75;this.emit('healing');}
 if(a==='skill'&&p.skillCd<=0&&!p.roll&&!p.heal){p.skillCd=7;p.attack=null;p.buffer=0;this.emit('skill',{x:p.x,y:p.y+.7});let n=0;for(const e of this.enemies){if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<4.7){this.hitEnemy(e,38+p.charm*8,true,1,p.dir);e.burn=3;n++;}}if(n)this.hitstop=.06;}
 if(a==='frost'&&p.skill2Cd<=0&&p.roll<=0&&p.heal<=0){p.skill2Cd=6;this.emit('frost',{x:p.x,y:p.y+.8});for(const e of this.enemies){if(!e.dead&&Math.abs(e.x-p.x)<5&&Math.abs(e.y-p.y)<3){this.hitEnemy(e,20,false,.25,p.dir);e.slow=3;}}}
 if(a==='interact')this.interact();
 }
 beginAttack(){let p=this.p,w=WEAPONS[p.weapon];const combo=this.time<p.comboUntil?(p.lastCombo+1)%3:0;p.attack={weapon:p.weapon,combo,t:0,hit:new Set(),duration:w.durations[combo],rollCritical:weaponFamily(p.weapon)===0&&p.rollCrit>0};if(weaponFamily(p.weapon)===0)p.rollCrit=0;p.lastCombo=combo;p.comboUntil=this.time+w.durations[combo]+.48;p.buffer=0;this.emit('attack',{x:p.x,y:p.y,dir:p.dir,weapon:p.weapon,combo});}
 gearDamage(id,gear=this.p.weapons[id]){return Math.round((WEAPONS[id].damage*(1+RARITIES[gear.rarity].bonus)*(1+.12*((gear.level||1)-1))+this.p.charm*3)*Math.pow(1.15,this.p.stats[weaponStat(id)]-1));}
 statDamage(){return this.gearDamage(this.p.weapon);}
 hurt(amount,dir=0){let p=this.p;if(p.inv>0||p.hp<=0||this.mode!=='playing')return false;p.hp=Math.max(0,p.hp-Math.max(1,Math.round(amount*(1-p.armor*.13))));p.inv=.8;p.attack=null;p.heal=0;p.buffer=0;p.kb=.22;p.vx=dir*5;p.vy=4;p.ground=false;this.comboHits=0;this.emit('hurt',{x:p.x,y:p.y+1,amount});this.hitstop=.05;if(!p.hp){this.mode='dead';this.emit('dead');}return true;}
 hitEnemy(e,damage,crit,stun,dir){if(e.dead)return;const p=this.p,shield=e.type==='shield'&&e.dir!==dir&&e.state!=='windup';const actual=Math.round(damage*(shield&&stun<.7?.45:1));e.hp-=actual;e.flash=.15;e.stun=Math.max(e.stun,(e.boss||e.type==='boss')?Math.min(.16,stun):stun);e.vx=dir*((e.boss||e.type==='boss')?.7:4.5);if(!(e.boss||e.type==='boss')&&stun>0)e.state='idle';this.comboHits++;this.comboClock=3;this.emit('hit',{x:e.x,y:e.y+e.h,damage:actual,crit,shield,dir});if(e.hp<=0){e.dead=true;e.hp=0;this.kills++;this.gold+=(e.boss||e.type==='boss')?100:12+Math.floor(this.random()*12);this.emit('kill',{x:e.x,y:e.y+1,boss:(e.boss||e.type==='boss')});if((e.boss||e.type==='boss')){this.bossActive=false;this.emit('bossDefeated');}else if(this.level===LEVEL&&this.kills%3===0)this.loot.push({id:'loot'+this.serial++,x:e.x,y:e.baseY,kind:'weapon',weapon:(this.kills/3)%3,rarity:this.kills>=9?2:1,level:1+Math.floor(e.x/35),affix:['embers','frost','execution'][Math.floor(this.random()*3)]});}}
 attackUpdate(dt){let p=this.p,a=p.attack;if(!a)return;const w=WEAPONS[a.weapon];let before=a.t;a.t+=dt;if(a.t>=w.active[a.combo]*(a.speedFactor||1)&&before<w.active[a.combo]*(a.speedFactor||1)+.13){if(weaponFamily(a.weapon)===2&&a.combo===2)p.x+=p.dir*dt*9;for(const e of this.enemies){if(e.dead||a.hit.has(e.id))continue;let dx=(e.x-p.x)*p.dir,dy=Math.abs((e.y+e.h*.48)-(p.y+.9));let behind=weaponFamily(a.weapon)===0&&a.combo===2?-1.2:-.3;if(dx>behind&&dx<(this.attackRange?this.attackRange(a.weapon):w.range)+e.w*.5&&dy<1.35){a.hit.add(e.id);let crit=(weaponFamily(a.weapon)===0&&a.rollCritical)||(weaponFamily(a.weapon)===1&&e.state==='windup')||(weaponFamily(a.weapon)===2&&dx>2.1)||this.random()<.06+p.charm*.035;let dmg=this.statDamage()*w.mult[a.combo]*(crit?1.65:1);if(this.modifyMeleeDamage)dmg=this.modifyMeleeDamage(dmg,e,a);const affix=p.weapons[a.weapon].affix;if(affix==='embers'&&e.burn>0)dmg*=1.35;if(affix==='execution'&&e.hp/e.maxHp<.35)dmg*=1.3;this.hitEnemy(e,dmg,crit,a.combo===2?.8:.28,p.dir);if(this.onMeleeHit)this.onMeleeHit(e,dmg,a);if(affix==='frost')e.slow=2;if(weaponFamily(a.weapon)===0&&a.combo===2)e.burn=3;this.hitstop=a.combo===2?.065:.035;}}}
 if(a.t>=a.duration){p.attack=null;if(p.buffer>0)this.beginAttack();}}
 moveBody(b,dt,platforms=this.level.platforms){let oldY=b.y;b.x+=b.vx*dt;b.vy-=27*dt;b.y+=b.vy*dt;b.ground=false;for(const s of platforms){if(b.vy<=0&&oldY>=s.y-.06&&b.y<=s.y&&b.x+b.w/2>s.x&&b.x-b.w/2<s.x+s.w){b.y=s.y;b.vy=0;b.ground=true;if(b===this.p)b.jumps=0;break;}}b.x=Math.max(.5,Math.min(this.level.width-.5,b.x));}
 tick(dt,input={}){if(this.mode!=='playing')return;dt=Math.min(dt,.04);if(this.hitstop>0){this.hitstop-=dt;return;}this.time+=dt;let p=this.p;
 for(const k of ['inv','rollCd','rollCrit','buffer','jumpBuffer','skillCd','skill2Cd','kb'])p[k]=Math.max(0,p[k]-dt);
 this.comboClock-=dt;if(this.comboClock<=0)this.comboHits=0;
 if(p.heal>0){p.heal=Math.max(0,p.heal-dt);p.vx*=.75;if(p.heal<=0){p.flasks--;p.hp=Math.min(p.maxHp,p.hp+Math.round(p.maxHp*.55));this.emit('heal',{x:p.x,y:p.y+1});}}
 let move=(input.right?1:0)-(input.left?1:0);if(p.roll>0){p.roll=Math.max(0,p.roll-dt);p.vx=p.dir*12;}else if(p.kb<=0&&!p.heal){let speed=p.attack?2.1:6.8;p.vx+=(move*speed-p.vx)*Math.min(1,dt*22);if(move&&!p.attack)p.dir=move;}
 p.coyote=p.ground?.10:Math.max(0,p.coyote-dt);
 if(p.jumpBuffer>0&&!p.heal&&!p.roll&&(p.coyote>0||p.jumps<2)){p.jumps=p.coyote>0?1:Math.max(1,p.jumps)+1;p.vy=p.jumps===1?10.8:10.3;p.ground=false;p.coyote=0;p.jumpBuffer=0;this.emit('jump',{x:p.x,y:p.y,double:p.jumps===2});}
 if(!p.attack&&p.buffer>0&&p.roll<=0&&p.heal<=0&&p.kb<=0)this.beginAttack();this.moveBody(p,dt);if(this.level===LEVEL&&this.bossActive)p.x=Math.max(94,p.x);this.attackUpdate(dt);
 if(this.level===LEVEL){if(p.y<-6){p.x=this.checkpoint?83:Math.max(3,Math.floor(p.x/24)*24+2);p.y=2;p.vy=0;p.inv=0;this.hurt(24);}
 if(!this.checkpoint&&p.x>LEVEL.checkpoint){this.checkpoint=true;p.hp=p.maxHp;p.flasks=Math.max(p.flasks,2);this.emit('checkpoint');}
 if(!this.bossActive&&p.x>94&&!this.enemies.at(-1).dead){this.bossActive=true;this.emit('boss');}}else this.updateWorld(dt);
 for(const e of this.enemies)this.enemyTick(e,dt);
 for(const b of this.projectiles){b.x+=b.vx*dt;b.life-=dt;if(Math.abs(b.x-p.x)<.48&&Math.abs(b.y-(p.y+.85))<.75){this.hurt(b.damage,Math.sign(b.vx));b.life=0;}}
 this.projectiles=this.projectiles.filter(b=>b.life>0);
 if(this.level===LEVEL&&p.x>LEVEL.exit&&this.enemies.at(-1).dead){this.mode='won';this.emit('won');}
 }
 enemyTick(e,dt){if(e.dead)return;e.slow=Math.max(0,e.slow-dt);if(e.slow>0)dt*=.55;let p=this.p;e.flash=Math.max(0,e.flash-dt);e.cooldown=Math.max(0,e.cooldown-dt);
 if(e.burn>0){e.burn-=dt;e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=.5;this.hitEnemy(e,4,false,0,p.dir);if(e.dead)return;}}
 if(e.stun>0){e.stun-=dt;e.vx*=.85;if(!(e.boss||e.type==='boss')){this.moveBody(e,dt);if(e.y<-5){e.y=e.baseY;e.x=e.home;e.vy=0;}}return;}
 const dx=p.x-e.x,dy=p.y-e.y,d=Math.abs(dx),boss=(e.boss||e.type==='boss');
 if(boss&&!this.bossActive)return;
 if(boss&&e.hp<e.maxHp*.5&&e.phase===1){e.phase=2;this.emit('bossPhase');}
 if(e.state==='windup'){e.timer-=dt;e.vx=0;if(e.timer<=0){e.state='strike';e.timer=boss?.38:.22;e.attackCount++;
 if(e.type==='archer'){this.projectiles.push({id:this.serial++,x:e.x+e.dir*.6,y:e.y+1.05,vx:e.dir*9,life:2,damage:15});this.emit('shoot',{x:e.x,y:e.y+1});}
 else if(boss&&e.attackCount%3===0){this.emit('slam',{x:e.x,y:e.y});for(let dir of [-1,1])this.projectiles.push({id:this.serial++,x:e.x,y:e.y+.5,vx:dir*(e.phase===2?11:8),life:2,damage:22});if(d<3.6&&Math.abs(dy)<1.4)this.hurt(26,e.dir);}
 else {if(d<(boss?3:1.8)&&Math.abs(dy)<(boss?2.3:1.65)&&(dx*e.dir>-.3))this.hurt(boss?28:e.type==='shield'?20:15,e.dir);this.emit('enemyAttack',{x:e.x,y:e.y+1,dir:e.dir,boss});}}
 }else if(e.state==='strike'){e.timer-=dt;e.vx=e.type==='archer'?0:e.dir*(boss?3.8:1.8);if(e.timer<=0){e.state='recover';e.timer=boss?(e.phase===2?.55:.9):.65;}}
 else if(e.state==='recover'){e.timer-=dt;e.vx=0;if(e.timer<=0){e.state='idle';e.cooldown=boss?.25:.35;}}
 else if(d<(boss?20:9)&&Math.abs(dy)<(e.type==='archer'?7:2.7)){
 e.dir=Math.sign(dx)||e.dir;let reach=e.type==='archer'?9:boss?2.7:1.45;
 if(d<reach&&e.cooldown<=0){e.state='windup';e.timer=boss?(e.phase===2?.48:.78):e.type==='archer'?.95:.62;e.vx=0;this.emit('telegraph',{id:e.id});}
 else{e.vx=e.type==='archer'?0:e.dir*(boss?(e.phase===2?4:2.8):e.type==='shield'?1.8:2.5);}
 }else{e.vx=0;}
 let next=e.x+e.vx*dt;const onPlatform=this.level.platforms.find(s=>Math.abs(e.y-s.y)<.1&&e.x>s.x&&e.x<s.x+s.w);
 if(onPlatform&&(next<onPlatform.x+.45||next>onPlatform.x+onPlatform.w-.45))e.vx=0;
 if(boss)e.x=Math.max(95,Math.min(111,e.x));this.moveBody(e,dt);if(e.y<-5){e.x=e.home;e.y=e.baseY;e.vy=0;}
 }
 nearby(){let p=this.p;let chest=this.chests.find(c=>!c.open&&Math.abs(c.x-p.x)<1.8&&Math.abs(c.y-p.y)<1.8);if(chest)return{...chest,isChest:true};return this.loot.find(c=>Math.abs(c.x-p.x)<1.8&&Math.abs(c.y-p.y)<1.8)||null;}
 interact(){let c=this.nearby();if(!c)return;let p=this.p;if(c.isChest){this.chests.find(x=>x.id===c.id).open=true;this.loot.push({...c,id:'loot'+this.serial++,isChest:false,level:1+Math.floor(c.x/35),affix:c.kind==='weapon'?['embers','frost','execution'][Math.floor(this.random()*3)]:null});this.emit('chest',{x:c.x,y:c.y+1});return;}
 if(c.kind==='weapon'){this.pendingLoot=c.id;this.pause('loot');return;}
 if(c.kind==='scroll'){this.pendingScroll=c.id;this.pause('scroll');return;}
 this.loot=this.loot.filter(x=>x.id!==c.id);
 if(c.kind==='armor'){let old=p.maxHp;p.armor=Math.max(p.armor,c.rarity);p.maxHp=120+p.armor*25;p.hp+=p.maxHp-old;this.emit('pickup',{label:'守望者护甲 · 减伤与生命提升'});}
 if(c.kind==='charm'){p.charm=Math.max(p.charm,c.rarity);this.emit('pickup',{label:'余烬护符 · 伤害与暴击率提升'});}
 if(c.kind==='flask'){p.flasks=Math.min(5,p.flasks+2);this.emit('pickup',{label:'回复药剂 +2'});}
 }
 chooseLoot(slot){
  if(this.mode!=='loot'||![0,1].includes(slot))return false;
  let item=this.loot.find(l=>l.id===this.pendingLoot),p=this.p;if(!item)return false;
  if(p.slots.some((id,i)=>id===item.weapon&&i!==slot))return false;
  const previous=p.slots[slot],old={...p.weapons[previous]};
  this.loot=this.loot.filter(l=>l.id!==item.id);
  this.loot.push({...old,id:'loot'+this.serial++,kind:'weapon',weapon:previous,x:p.x+p.dir*.8,y:p.y});
  p.weapons[item.weapon]={rarity:item.rarity,level:item.level||1,affix:item.affix||null};p.slots[slot]=item.weapon;p.weapon=item.weapon;p.attack=null;p.buffer=0;p.lastCombo=0;p.comboUntil=0;
  this.pendingLoot=null;this.mode='playing';this.emit('pickup',{label:RARITIES[item.rarity].name+' · '+WEAPONS[item.weapon].name});return true;
 }
 chooseScroll(stat){if(this.mode!=='scroll'||![0,1,2].includes(stat))return false;const item=this.loot.find(l=>l.id===this.pendingScroll);if(!item)return false;this.loot=this.loot.filter(l=>l.id!==item.id);this.p.stats[stat]++;this.p.maxHp+=12;this.p.hp=Math.min(this.p.maxHp,this.p.hp+12);this.pendingScroll=null;this.mode='playing';this.emit('pickup',{label:STATS[stat].name+' +1 · 对应武器伤害 +15%'});return true;}

}
