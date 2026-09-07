import {Game,WEAPONS,RARITIES,AFFIXES,LEVEL,weaponFamily} from './engine.js';
import {SKILLS,RECIPES,FLAG_NAMES,storyFor,questNotes} from './hunt-expansion.js';
import {HUNT_WEAPONS,CHAPTERS,ENEMY_TYPES,ATTIRE,SETS,GEMS,STORY} from './hunt-content.js';

HUNT_WEAPONS.forEach(w=>{if(!WEAPONS.some(x=>x.name===w.name))WEAPONS.push({...w,id:WEAPONS.length});});
if(RARITIES.length===3)RARITIES.push({name:'传说',color:'#f1b26d',bonus:.8},{name:'史诗',color:'#f5d874',bonus:1.05});
Object.assign(AFFIXES,{serrated:{name:'猎兽',desc:'对兽类伤害 +25%'},rally:{name:'血返',desc:'近战反击回血量 +40%'},duelist:{name:'决斗',desc:'枪反处决伤害 +30%'}});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const copy=v=>JSON.parse(JSON.stringify(v));

export class HuntGame extends Game {
 constructor(options){super(options);this.campaignReady=true;this.newCampaign();}
 reset(){super.reset();if(this.campaignReady)this.newCampaign();}
 newCampaign(){
  super.reset();this.flags={};this.worlds={};this.bag=[];this.materials=4;this.gems={blood:1,fire:0,mercy:0};this.gold=80;this.growth=0;this.lostEchoes=null;this.dialogue=null;this.returnLamp=5;this.lamp={area:'yharnam',x:5,y:0};this.visitedLamps={yharnam:{area:'yharnam',x:5,y:0}};this.journal=[];this.skillSlots=['flame','frost'];
  this.p.weapons=WEAPONS.map(()=>({rarity:0,level:1,affix:null,upgrade:0}));
  for(const weapon of [3,4]){const item=this.makeItem({kind:'weapon',weapon,rarity:1,level:1,upgrade:0});this.bag.push(item);this.p.weapons[weapon]=item;}
  this.p.slots=[3,4];this.p.weapon=3;this.p.coat=null;this.p.rune=null;this.p.transformed=false;this.p.gunCd=0;this.p.bullets=12;this.p.flasks=3;this.p.rally=0;this.p.rallyTime=0;this.p.baseHp=150;this.p.maxHp=150;this.p.hp=150;this.p.stamina=100;this.p.staminaDelay=0;this.p.dualWield=false;this.p.rangedCd=0;this.p.climb=null;
  this.enterChapter('dream',6,false);this.mode='title';
 }
 makeItem(data){return {id:'item'+this.serial++,level:1,upgrade:0,rarity:1,affix:null,...data};}
 enterChapter(id,x,remember=true){
  if(!CHAPTERS[id]&&id!=='sanctum')return false;
  if(remember&&this.level)this.worlds[this.chapter]={chests:copy(this.chests),loot:copy(this.loot)};
  this.chapter=id;this.flags['visited-'+id]=true;this.level=id==='sanctum'?LEVEL:CHAPTERS[id];const world=this.worlds[id];
  this.chests=world?.chests??this.level.chests.map((c,i)=>({...c,id:c.id||'chest'+i,open:false}));this.loot=world?.loot??[];
  this.enemies=this.level.enemies.map((e,i)=>this.makeEnemy(e,i));
  this.activeBoss=null;this.bossActive=false;this.checkpoint=false;this.projectiles=[];this.pendingLoot=null;this.pendingScroll=null;this.hitstop=0;this.comboHits=0;
  Object.assign(this.p,{x:x??this.level.start,y:0,vx:0,vy:0,ground:true,jumps:0,coyote:.1,jumpBuffer:0,inv:1,roll:0,rollCd:0,rollCrit:0,attack:null,buffer:0,lastCombo:0,comboUntil:0,heal:0,kb:0,rally:0,rallyTime:0,gunCd:0,skillCd:0,skill2Cd:0});
  this.p.climb=null;this.p.rangedCd=0;this.musicUsed=false;this.mode='playing';this.emit('reset');this.emit('chapter',{id,name:this.level.name||'失落圣所'});return true;
 }
 makeEnemy(e,i){
  const t=ENEMY_TYPES[e.type],boss=t?.boss||e.type==='boss',hp=t?.hp||(boss?850:e.type==='shield'?105:70);
  return {...e,id:this.chapter+'-'+i,name:t?.name||'余烬守卫',boss,elite:t?.elite||false,beast:t?.beast||false,row:t?.row,y:e.y||0,home:e.x,baseY:e.y||0,maxHp:hp,hp,h:t?.h||(boss?2.9:1.6),w:boss?1.2:.6,vx:0,vy:0,dir:-1,ground:true,state:'idle',timer:0,cooldown:.6+i*.08,stun:0,flash:0,burn:0,burnTick:0,slow:0,parry:0,attackCount:0,phase:1,dead:!!(boss&&this.flags['boss-'+e.type])};
 }
 currentBoss(){return this.enemies.find(e=>e.id===this.activeBoss)||((this.chapter==='sanctum'&&this.bossActive)?this.enemies.at(-1):null);}
 rest(){this.p.hp=this.p.maxHp;this.p.stamina=100;this.p.flasks=3;this.p.bullets=12;this.p.rally=0;this.p.rallyTime=0;this.p.heal=0;this.p.attack=null;this.p.buffer=0;}
 travel(id,x){if(!['travel','lamp','dream','won','dead','paused'].includes(this.mode)&&this.chapter!=='dream')return false;this.enterChapter(id,x);this.rest();return true;}
 respawn(){const loc=this.lamp||{area:this.chapter,x:this.level.start,y:0};this.enterChapter(loc.area,loc.x);this.p.y=loc.y;this.rest();}
 isEquipped(item){return item===this.p.coat||item===this.p.rune||this.p.slots.some(id=>this.p.weapons[id]===item);}
 equipBag(uid,slot){
  if(!['inventory','workshop'].includes(this.mode))return false;
  const item=this.bag.find(i=>i.id===uid);if(!item)return false;
  if(item.kind==='weapon'){
   if(![0,1].includes(slot)||this.p.slots.some((id,i)=>i!==slot&&id===item.weapon))return false;
   this.p.slots[slot]=item.weapon;this.p.weapons[item.weapon]=item;this.p.weapon=item.weapon;this.p.transformed=false;this.p.dualWield=false;
  }else if(item.kind==='attire'){this.p[item.slot]=item;this.recomputeHp();}else return false;
  this.p.attack=null;this.p.buffer=0;this.emit('gear');return true;
 }
 setActive(set){return this.p.coat?.set===set&&this.p.rune?.set===set;}
 equip(n){const before=this.p.weapon;super.equip(n);if(before!==this.p.weapon)this.p.transformed=false;}
 recomputeHp(){const coat=this.p.coat;let base=150+this.growth*10+(this.p.stats.reduce((a,b)=>a+b,0)-3)*12;this.p.maxHp=base+(coat?(coat.set==='church'?28:coat.set==='beast'?16:20)+coat.rarity*2+(coat.upgrade||0)*5:0);this.p.hp=Math.min(this.p.hp,this.p.maxHp);}
 gearDamage(id,gear=this.p.weapons[id]){let n=super.gearDamage(id,gear)*(1+.1*(gear.upgrade||0));if(gear.gem==='blood')n*=1.12;if(this.p.rune)n*=1.06+this.p.rune.rarity*.01+(this.p.rune.upgrade||0)*.02;return Math.round(n);}
 attackRange(id){return WEAPONS[id].range+(this.p.transformed&&id>=3?(id===5?1.4:1):0);}
 beginAttack(){const cost=WEAPONS[this.p.weapon].family===1?20:13;if(!this.spendStamina(cost+(this.p.dualWield?7:0))){this.p.buffer=0;return;}super.beginAttack();if(this.p.attack&&this.p.transformed&&this.p.weapon>=3){this.p.attack.speedFactor=1.2;this.p.attack.duration*=1.2;this.p.comboUntil=this.time+this.p.attack.duration+.48;}}
 modifyMeleeDamage(dmg,e,a){
  const gear=this.p.weapons[a.weapon],trait=WEAPONS[a.weapon].trait;
  if(this.p.transformed&&a.weapon>=3)dmg*=1.18*(this.setActive('beast')?1.2:1);
  if(e.beast&&(trait==='serrated'||gear.affix==='serrated'))dmg*=1.25;
  if(trait==='reaper'&&e.hp/e.maxHp<.35)dmg*=1.25;
  if(trait==='bell'&&a.combo===2)dmg+=Math.min(60,e.maxHp*.03);
  return dmg;
 }
 onMeleeHit(e,dmg,a){
  const p=this.p,gear=p.weapons[a.weapon],trait=WEAPONS[a.weapon].trait;
  if((p.dualWield||trait==='twins')&&!e.dead){const off=p.slots.find(id=>id!==a.weapon)??a.weapon;const extra=Math.round(this.gearDamage(p.dualWield?off:a.weapon)*.45);this.hitEnemy(e,extra,false,0,p.dir);this.emit('offhand',{x:e.x,y:e.y+1,dir:p.dir});}
  if(p.rallyTime>0&&p.rally>0){const recovered=Math.min(p.rally,Math.ceil(dmg*.3*(this.setActive('hunter')?1.5:1)*(gear.affix==='rally'?1.4:1)));p.hp=Math.min(p.maxHp,p.hp+recovered);p.rally-=recovered;}
  if(gear.gem==='mercy')p.hp=Math.min(p.maxHp,p.hp+1);
  if(trait==='fire'||gear.gem==='fire')e.burn=3;
  if(trait==='chain'&&a.combo===2)e.slow=2;
 }
 hurt(amount,dir=0){
  const before=this.p.hp;const ok=super.hurt(amount*(this.setActive('church')?.88:1),dir);
  if(ok){this.p.inv=Math.min(this.p.inv,.55);this.p.climb=null;this.p.rally=Math.min(this.p.maxHp-this.p.hp,this.p.rally+before-this.p.hp);this.p.rallyTime=3.5;
   if(this.mode==='dead'){this.lostEchoes={chapter:this.chapter,x:this.p.x,y:Math.max(0,this.p.y),amount:this.gold};this.gold=0;this.emit('echoesLost');}}
  return ok;
 }
 action(action){
  if(this.mode!=='playing')return;const p=this.p;
  if(action==='dual'){this.toggleDual();return;}
  if(action==='skill'||action==='frost'){this.castSkill(action==='skill'?0:1);return;}
  if(action==='jump'&&p.climb){p.climb=null;p.vy=10.5;p.y+=.12;p.jumps=1;p.ground=false;this.climbLock=.25;return;}
  if(action==='roll'&&p.rollCd<=0){if(!this.spendStamina(24))return;p.climb=null;}
  if(action==='attack'&&this.breakSecret())return;
  if(action==='attack'&&this.isRanged()&&!this.enemies.some(e=>!e.dead&&e.parry>0&&Math.abs(e.x-p.x)<2.4)){this.fireWeapon();return;}
  if(action==='transform'){if(p.roll>0||p.heal>0||p.kb>0)return;if(p.weapon<3||WEAPONS[p.weapon].ranged||p.weapon===11){this.emit('pickup',{label:'此武器没有变形机构；B 可切换兼容的双持组合'});return;}p.transformed=!p.transformed;p.attack=null;p.buffer=0;p.comboUntil=0;this.emit('pickup',{label:WEAPONS[p.weapon].name+' · '+(p.transformed?'展开形态：范围和伤害提高，出招略慢':'收拢形态：迅捷连击')});return;}
  if(action==='gun'){this.fireGun();return;}
  if(action==='music'){const boss=this.currentBoss();if(!this.flags.musicBox||this.musicUsed||boss?.type!=='gascoigne'){this.emit('pickup',{label:this.flags.musicBox?'音乐盒只对墓园中的神父生效，每战一次':'先与亚南窗后的女孩交谈'});return;}this.musicUsed=true;boss.stun=3;boss.parry=3;boss.state='recover';boss.timer=3;boss.vx=0;this.emit('pickup',{label:'音乐响起 · 靠近后按 J 处决'});return;}
  if(action==='attack'&&p.roll<=0&&p.heal<=0&&p.kb<=0){const target=this.enemies.find(e=>!e.dead&&e.parry>0&&Math.abs(e.x-p.x)<2.4&&Math.abs(e.y-p.y)<2);if(target){target.parry=0;target.stun=.8;p.attack=null;p.buffer=0;p.inv=Math.max(p.inv,.65);const dmg=this.statDamage()*4*(this.setActive('hunter')?1.25:1)*(p.weapons[p.weapon].affix==='duelist'?1.3:1);this.hitEnemy(target,dmg,true,.8,p.dir);this.onMeleeHit(target,dmg,{weapon:p.weapon,combo:0});this.hitstop=.12;p.stamina=Math.min(100,p.stamina+25);this.emit('visceral',{x:target.x,y:target.y+1,dir:p.dir});this.emit('pickup',{label:'内脏暴击 · '+Math.round(dmg)});return;}}
  super.action(action);
 }
 fireGun(){
  const p=this.p;if(p.gunCd>0||p.bullets<=0||p.roll>0||p.heal>0||p.kb>0)return;p.bullets--;p.gunCd=.65;p.attack=null;p.buffer=0;
  const target=this.enemies.filter(e=>!e.dead&&(!e.boss||this.activeBoss===e.id)&&(e.x-p.x)*p.dir>-.2&&(e.x-p.x)*p.dir<9&&Math.abs(e.y-p.y)<2.5).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
  this.emit('shoot',{x:p.x,y:p.y+1,dir:p.dir,player:true,endX:target?.x??p.x+p.dir*9});
  if(!target)return;
  if(target.type==='cleric'){
   this.hitEnemy(target,10,false,0,p.dir);
   if(target.state==='recover'&&target.parry<=0){target.headStress=(target.headStress||0)+1;this.emit('weakpoint',{x:target.x,y:target.y+target.h-.5});
    if(target.headStress>=3){target.headStress=0;this.openParry(target,3.2,'头部失衡 · 靠近按 J 处决');}else this.emit('pickup',{label:'头部命中 '+target.headStress+'/3 · 收招时再射击'});
   }else if(target.parry<=0)this.emit('pickup',{label:'巨兽无法普通枪反 · 等待收招再射击头部'});
  }else if(target.state==='windup'&&target.timer<=.28&&target.timer>0){this.hitEnemy(target,8,false,0,p.dir);if(!target.dead)this.openParry(target,2.4,'枪反成功 · 靠近按 J 处决');}
  else this.hitEnemy(target,8,false,0,p.dir);
 }
 openParry(e,duration,label){e.parry=duration;e.stun=duration;e.state='recover';e.timer=duration;e.vx=0;this.hitstop=.085;this.emit('parry',{x:e.x,y:e.y+1,dir:this.p.dir});this.emit('pickup',{label});}

 tick(dt,input){
  this.climbInput=input||{};this.climbLock=Math.max(0,(this.climbLock||0)-dt);const active=this.mode==='playing';const before=this.time,flasks=this.p.flasks;super.tick(dt,input);if(!active||this.time===before)return;
  for(const k of ['gunCd','rallyTime','rangedCd','staminaDelay'])this.p[k]=Math.max(0,(this.p[k]||0)-dt);
  if(this.p.rallyTime<=0)this.p.rally=0;if(!this.p.attack&&!this.p.roll&&this.p.staminaDelay<=0)this.p.stamina=Math.min(100,this.p.stamina+30*dt);
  if(this.p.flasks<flasks&&this.setActive('church'))this.p.hp=Math.min(this.p.maxHp,this.p.hp+Math.round(this.p.maxHp*.15));
 }
 updateWorld(){
  const p=this.p;if(this.chapter==='dream')return;
  const boss=this.currentBoss();if(boss&&!boss.dead){p.x=clamp(p.x,boss.arenaStart,boss.arenaEnd);if(p.y<boss.baseY){p.y=boss.baseY;p.vy=0;p.ground=true;}}
  if(!this.activeBoss){const e=this.enemies.find(e=>e.boss&&!e.dead&&p.x>e.arenaStart&&p.x<e.arenaEnd&&Math.abs(p.y-e.baseY)<2);if(e){this.activeBoss=e.id;this.bossActive=true;this.musicUsed=false;this.emit('boss',{name:e.name});}}
  for(const h of this.level.hazards||[])if(p.x>h.x&&p.x<h.x+h.w&&p.y<h.y){p.x=h.x-1;p.y=0;p.vy=0;p.inv=0;p.climb=null;this.hurt(32);}
  if(p.y<-6){p.x=this.level.start;p.y=0;p.vy=0;p.inv=0;p.climb=null;this.hurt(32);}
 }
 enemyTick(e,dt){
  const def=ENEMY_TYPES[e.type];if(!def){super.enemyTick(e,dt);return;}if(e.dead)return;
  e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);e.parry=Math.max(0,e.parry-dt);e.cooldown=Math.max(0,e.cooldown-dt);
  if(e.burn>0){e.burn=Math.max(0,e.burn-dt);e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=.5;this.hitEnemy(e,this.setActive('beast')?6:4,false,0,this.p.dir);if(e.dead)return;}}
  if(e.stun>0){e.stun=Math.max(0,e.stun-dt);e.vx*=.8;this.enemyMove(e,dt);return;}
  if(e.boss&&this.activeBoss!==e.id)return;
  if(e.slow>0)dt*=.55;const p=this.p,dx=p.x-e.x,d=Math.abs(dx),dy=p.y-e.y;
  const nextPhase=e.type==='gascoigne'?(e.hp/e.maxHp<.35?3:e.hp/e.maxHp<.65?2:1):e.type==='cleric'&&e.hp/e.maxHp<.55?2:1;
  if(nextPhase>e.phase){e.phase=nextPhase;e.state='recover';e.timer=1.2;e.vx=0;if(e.phase===3){e.beast=true;e.h=2.8;}this.emit('bossPhase',{name:e.name,phase:e.phase});}
  if(e.state==='windup'){
   e.vx=0;e.timer-=dt;if(e.timer<=0){e.state='strike';e.timer=e.type==='hound'?.35:.3;e.attackCount++;e.didStrike=false;
    if(e.type==='rifle'||e.type==='gascoigne'&&e.phase<3&&e.attackCount%3===0){this.projectiles.push({id:this.serial++,x:e.x+e.dir*.6,y:e.y+1,vx:e.dir*12,life:1.5,damage:def.damage});this.emit('shoot',{x:e.x,y:e.y+1});e.didStrike=true;}
    else if(e.type==='cleric'&&e.attackCount%3===0){for(const dir of [-1,1])this.projectiles.push({id:this.serial++,x:e.x,y:e.y+.4,vx:dir*9,life:1.5,damage:25});this.emit('slam',{x:e.x,y:e.y});}
    this.emit('enemyAttack',{x:e.x,y:e.y+1,dir:e.dir,boss:e.boss});
   }
  }else if(e.state==='strike'){
   e.timer-=dt;e.vx=e.type==='hound'?e.dir*8:e.type==='gascoigne'?e.dir*(e.phase===3?8:5):e.type==='troll'&&e.attackCount%2===0?e.dir*7:e.dir*(e.boss?3:1.5);
   const reach=def.reach+(e.phase>1?.5:0);if(!e.didStrike&&d<reach&&Math.abs(dy)<(e.boss?2.8:1.7)&&dx*e.dir>-.5){this.hurt(def.damage+(e.phase-1)*3,e.dir);e.didStrike=true;}
   if(e.timer<=0){if((e.type==='executioner'||e.type==='cleric'&&e.phase===2||e.type==='gascoigne'&&e.phase>=2)&&!e.followup){e.followup=true;e.state='windup';e.timer=e.type==='gascoigne'?.4:.5;e.vx=0;}else{e.followup=false;e.state='recover';e.timer=def.recover*(e.phase===3?.65:e.phase===2?.8:1);e.vx=0;}}
  }else if(e.state==='recover'){e.timer-=dt;e.vx=0;if(e.timer<=0){e.state='idle';e.cooldown=.22;}}
  else if(d<(e.boss?30:10)&&Math.abs(dy)<(e.type==='rifle'?3:2.7)){
   e.dir=Math.sign(dx)||e.dir;
   if(d<def.reach+(e.phase>1?.5:0)&&e.cooldown<=0){e.state='windup';e.timer=def.windup*(e.phase===3?.62:e.phase===2?.8:1);e.vx=0;this.emit('telegraph',{id:e.id});}
   else e.vx=e.dir*def.speed*(e.phase===3?1.35:1);
  }else e.vx=0;
  this.enemyMove(e,dt);
 }
 enemyMove(e,dt){
  const platform=this.level.platforms.filter(s=>Math.abs(e.y-s.y)<.1&&e.x>=s.x&&e.x<=s.x+s.w).sort((a,b)=>b.y-a.y)[0];
  if(platform){const next=e.x+e.vx*dt;if(next<platform.x+.5||next>platform.x+platform.w-.5)e.vx=0;}
  this.moveBody(e,dt);if(e.boss)e.x=clamp(e.x,e.arenaStart+.7,e.arenaEnd-.7);if(e.y<e.baseY-5){e.x=e.home;e.y=e.baseY;e.vy=0;}
 }
 hitEnemy(e,...args){
  if(e.boss&&this.chapter!=='sanctum'&&this.activeBoss!==e.id)return;const alive=!e.dead;if(e.elite&&args[2]>0&&args[2]<.7)args[2]=0;super.hitEnemy(e,...args);if(!alive||!e.dead)return;
  if(e.boss){this.record('boss-'+e.type,e.name+' 倒下。你记住了这一夜。');this.flags['boss-'+e.type]=true;this.activeBoss=null;this.bossActive=false;}
  const def=ENEMY_TYPES[e.type];if(!def)return;
  if(def.boss){this.gold+=e.type==='cleric'?400:500;this.materials+=6;const item=this.makeItem({kind:'weapon',weapon:def.drop[0],rarity:4,level:3,affix:e.type==='cleric'?'embers':'duelist'});this.bag.push(item);this.emit('pickup',{label:e.name+' 已倒下 · '+WEAPONS[item.weapon].name+'（史诗）已放入背包 · 血石 +6'});}
  else {this.gold+=def.elite?70:8;this.materials+=def.elite?2:1;
   if(def.elite||this.random()<.35){let item;if(this.random()<.32)item=this.makeItem({kind:'attire',...ATTIRE[Math.floor(this.random()*ATTIRE.length)],rarity:def.elite?3:2});else item=this.makeItem({kind:'weapon',weapon:def.drop[Math.floor(this.random()*def.drop.length)],rarity:def.elite?3:1+Math.floor(this.random()*2),level:e.x>90?3:2,affix:Object.keys(AFFIXES)[Math.floor(this.random()*6)]});this.loot.push({...item,x:e.x,y:e.baseY});}
   if(this.random()<.15)this.loot.push(this.makeItem({kind:'gem',gem:['blood','fire','mercy'][Math.floor(this.random()*3)],rarity:2,x:e.x+.6,y:e.baseY}));
   if(this.kills%3===0)this.p.bullets=Math.min(20,this.p.bullets+2);
  }
 }
 nearby(){
  const near=c=>Math.abs(c.x-this.p.x)<1.8&&Math.abs(c.y-this.p.y)<1.8;
  if(this.lostEchoes?.chapter===this.chapter&&near(this.lostEchoes))return {...this.lostEchoes,kind:'echoes',name:'拾回遗落的回响'};
  const chest=this.chests.find(c=>!c.open&&near(c));if(chest)return {...chest,isChest:true};
  const loot=this.loot.find(near);if(loot)return loot;
  return this.level.points?.filter(c=>near(c)&&!(['key','secret','lever'].includes(c.kind)&&this.flags[c.flag])).sort((a,b)=>Math.hypot(a.x-this.p.x,a.y-this.p.y)-Math.hypot(b.x-this.p.x,b.y-this.p.y))[0]||null;
 }
 interact(){
  const c=this.nearby();if(!c||this.mode!=='playing')return;
  if(c.gate&&!this.flags[c.gate]){this.emit('pickup',{label:c.gate==='shortcut'?'铁门从墓园一侧锁住了':'守关猎人仍未倒下'});return;}
  if(c.kind==='passage'){if(this.currentBoss()){this.emit('pickup',{label:'先结束眼前的狩猎'});return;}const origin=this.chapter;this.enterChapter(c.to,c.spawn);const matching=this.level.points?.find(q=>q.kind==='passage'&&q.to===origin&&Math.abs(q.x-c.spawn)<3);if(matching)this.p.y=matching.y;return;}
  if(c.kind==='key'||c.kind==='lever'){this.flags[c.flag]=true;this.record(c.flag,c.name);this.emit('pickup',{label:c.name+' · 已记录在手记'});return;}
  if(c.kind==='secret'){this.emit('pickup',{label:'靠近遗物按 J 攻击'});return;}

  if(c.kind==='echoes'){this.gold+=c.amount;this.lostEchoes=null;this.emit('pickup',{label:'血之回响已拾回'});return;}
  if(c.isChest){this.chests.find(x=>x.id===c.id).open=true;this.loot.push(this.makeItem({...c,id:'loot'+this.serial++,isChest:false,...(c.kind==='attire'?ATTIRE[c.attire]:{})}));this.emit('chest',{x:c.x,y:c.y+1});return;}
  if(['weapon','attire'].includes(c.kind)){this.pendingLoot=c.id;this.pause('loot');return;}
  if(c.kind==='materials'){this.materials+=c.amount||2;this.loot=this.loot.filter(x=>x.id!==c.id);this.emit('pickup',{label:'血石碎片 +'+(c.amount||2)});return;}
  if(c.kind==='gem'){this.gems[c.gem]++;this.loot=this.loot.filter(x=>x.id!==c.id);this.emit('pickup',{label:GEMS[c.gem].name+' +1 · 回梦境可镶嵌'});return;}
  if(c.kind==='dialogue'){this.dialogue=c.id;this.pause('dialogue');return;}
  if(c.kind==='workshop'||c.kind==='travel'){this.pause(c.kind);return;}
  if(c.kind==='lamp'){this.returnLamp=c.x;this.lamp={area:this.chapter,x:c.x,y:c.y};this.visitedLamps[this.chapter]={...this.lamp};this.pause('lamp');return;}
  if(c.kind==='shortcut'){if(!this.flags.shortcut){this.flags.shortcut=true;this.emit('pickup',{label:'街口捷径已开启 · 墓碑可直接前往水渠'});}else {this.p.x=8;this.p.y=0;this.p.vx=0;this.emit('pickup',{label:'升降机回到了街口'});}return;}
  if(c.kind==='ending'){if(!this.flags['boss-gascoigne']){this.emit('pickup',{label:'墓园中的猎人仍守着这道门'});return;}this.dialogue='ending';this.pause('dialogue');return;}
  super.interact();
 }
 acceptDialogue(choice){
  if(this.mode!=='dialogue')return;const id=this.dialogue;
  if(id==='intro'){this.flags.intro=true;this.record('intro','外乡的抄书人接受血疗，在梦境醒来。');this.resume();return;}
  if(id==='gilbert'){if(this.flags['boss-gascoigne']&&!this.flags.gilbertGift){this.bag.push(this.makeItem({kind:'weapon',weapon:14,rarity:2,level:3}));this.flags.gilbertGift=true;this.record('gilbertGift','吉尔伯特把余烬喷火器交给了你。');}this.flags.gilbert=true;this.resume();return;}
  if(id==='eileen'){this.flags.eileen=true;this.flags.wallClimb=true;this.record('eileen','乌鸦猎人传授攀墙印记、双刃配方和鸦羽刃风。');this.resume();return;}
  if(id==='memorial'){this.resume();return;}
  if(id==='girl'&&this.flags.brooch){
   if(!this.flags.broochReturned&&!this.flags.broochCrushed){if(choice==='returnBrooch'){this.flags.broochReturned=true;this.record('girl-ending','你把薇奥拉的胸针交给女孩。窗后安静下来。');}else if(choice==='crushBrooch'){this.flags.broochCrushed=true;this.gems.blood++;this.record('girl-ending','你隐瞒了消息，留下赤血宝石。女孩仍在等待。');}}
   this.resume();return;
  }

  if(id==='doll'&&!this.flags.gift){this.flags.gift=true;this.materials+=2;this.gold+=70;this.emit('pickup',{label:'猎人赠礼 · 回响 +70 · 血石 +2'});}
  if(id==='girl'){this.flags.musicBox=true;this.record('musicBox','女孩交出音乐盒，请你寻找家人。');}
  if(id==='mentor')this.flags.mentor=true;
  if(id==='ending'){if(!this.flags.complete){this.flags.complete=true;this.record('complete','欧顿之门开启。主线结束，未尽的承诺仍留在亚南。');this.gold+=300;this.materials+=4;}this.enterChapter('dream');this.rest();}else this.resume();
 }
 collectLoot(){
  if(this.mode!=='loot')return false;const item=this.loot.find(x=>x.id===this.pendingLoot);if(!item||!['weapon','attire'].includes(item.kind))return false;
  this.bag.push(item);this.loot=this.loot.filter(x=>x.id!==item.id);this.pendingLoot=null;this.mode='playing';this.emit('pickup',{label:(item.name||WEAPONS[item.weapon].name)+' 已放入背包'});return true;
 }
 chooseLoot(slot){
  if(this.mode!=='loot')return false;const item=this.loot.find(x=>x.id===this.pendingLoot);if(!item)return false;
  if(item.kind==='weapon'&&(![0,1].includes(slot)||this.p.slots.some((id,i)=>i!==slot&&id===item.weapon)))return false;
  if(!this.collectLoot())return false;this.mode='inventory';const ok=this.equipBag(item.id,slot);this.mode='playing';return ok;
 }
 upgradeCost(item){const n=item.upgrade||0;return {gold:50*(n+1),materials:2+n};}
 upgrade(uid){
  if(this.mode!=='workshop'||this.chapter!=='dream')return false;const item=this.bag.find(i=>i.id===uid);if(!item||(item.upgrade||0)>=6)return false;const cost=this.upgradeCost(item);
  if(this.gold<cost.gold||this.materials<cost.materials)return false;this.gold-=cost.gold;this.materials-=cost.materials;item.upgrade=(item.upgrade||0)+1;this.recomputeHp();this.emit('gear');return true;
 }
 socket(uid,gem){
  if(this.mode!=='workshop'||this.chapter!=='dream'||!GEMS[gem])return false;const item=this.bag.find(i=>i.id===uid);if(item?.kind!=='weapon'||this.gems[gem]<=0||item.gem===gem)return false;
  this.gems[gem]--;if(item.gem)this.gems[item.gem]++;item.gem=gem;this.emit('gear');return true;
 }
 salvage(uid){if(!['inventory','workshop'].includes(this.mode))return false;const item=this.bag.find(i=>i.id===uid);if(!item||this.isEquipped(item))return false;this.materials+=1+item.rarity+(item.upgrade||0);if(item.gem)this.gems[item.gem]++;this.bag=this.bag.filter(i=>i.id!==uid);this.emit('gear');return true;}
 grow(){const cost=100+this.growth*60;if(this.mode!=='dialogue'||this.dialogue!=='doll'||this.gold<cost||this.growth>=10)return false;this.gold-=cost;this.growth++;this.recomputeHp();this.p.hp=this.p.maxHp;return true;}
 start(){super.start();if(!this.flags.intro){this.dialogue='intro';this.pause('dialogue');}}
 record(id,text){if(!this.journal.some(n=>n.id===id))this.journal.push({id,text,at:Math.floor(this.time)});}
 dialogueStory(){return storyFor(this,this.dialogue)||STORY[this.dialogue];}
 questNotes(){return questNotes(this);}
 spendStamina(n){if(this.p.stamina<n){if((this.tiredNotice||0)<this.time){this.emit('pickup',{label:'精力不足 · 松开攻击，等待恢复'});this.tiredNotice=this.time+1.5;}return false;}this.p.stamina-=n;this.p.staminaDelay=.55;return true;}
 isRanged(){return WEAPONS[this.p.weapon].ranged||this.p.weapon===12&&this.p.transformed;}
 toggleDual(){if(!['playing','inventory','workshop'].includes(this.mode)||this.p.attack||this.p.roll||this.p.heal)return false;if(this.p.slots.some(id=>WEAPONS[id].ranged)){this.emit('pickup',{label:'双持需要两个近战武器槽'});return false;}this.p.dualWield=!this.p.dualWield;this.emit('pickup',{label:this.p.dualWield?'双持开启 · 副手追击 +45%，每段额外消耗 7 精力':'双持收起'});return true;}
 fireWeapon(){const p=this.p,w=WEAPONS[p.weapon],cost=w.ammo||1;if(p.rangedCd>0||p.roll||p.heal||p.kb||p.bullets<cost)return;if(!this.spendStamina(w.trait==='cannon'?26:10))return;p.bullets-=cost;p.rangedCd=w.rate||.65;p.attack=null;p.buffer=0;
  const candidates=this.enemies.filter(e=>!e.dead&&(!e.boss||this.activeBoss===e.id)&&(e.x-p.x)*p.dir>0&&(e.x-p.x)*p.dir<(w.ranged?w.range:12)&&Math.abs(e.y-p.y)<2).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x));
  const center=candidates[0];this.emit('shoot',{x:p.x,y:p.y+1,dir:p.dir,player:true,endX:center?.x??p.x+p.dir*w.range,heavy:w.trait==='cannon'});
  let targets=w.trait==='scatter'?candidates.slice(0,3):w.trait==='flamer'?candidates:w.trait==='cannon'&&center?this.enemies.filter(e=>!e.dead&&Math.hypot(e.x-center.x,e.y-center.y)<3):candidates.slice(0,1);
  for(const e of targets){this.hitEnemy(e,this.statDamage(),false,w.trait==='cannon'?.8:0,p.dir);if(w.trait==='flamer')e.burn=3;}
  if(w.trait==='cannon')this.emit('ability',{x:center?.x??p.x+p.dir*w.range,y:center?.y??p.y,skill:'flame',radius:3});
  if(w.trait==='flamer')this.emit('ability',{x:p.x+p.dir*2,y:p.y,skill:'flame',radius:2});
 }
 castSkill(slot){const id=this.skillSlots[slot],s=SKILLS[id],p=this.p,key=slot===0?'skillCd':'skill2Cd';if(p[key]>0||p.roll||p.heal||p.kb||!this.spendStamina(25))return;p[key]=s.cooldown;p.attack=null;p.buffer=0;
  this.emit('ability',{x:p.x,y:p.y+.2,skill:id,radius:s.radius});for(const e of this.enemies){if(e.dead||Math.hypot(e.x-p.x,e.y-p.y)>s.radius||id==='storm'&&(e.x-p.x)*p.dir<0)continue;this.hitEnemy(e,s.damage*(id==='blades'&&e.beast?1.25:1),true,e.elite||e.boss?.1:.7,p.dir);if(id==='flame')e.burn=3;if(id==='frost')e.slow=3;}this.hitstop=.055;
 }
 selectSkill(slot,id){if(this.mode!=='inventory'||![0,1].includes(slot)||!SKILLS[id]||SKILLS[id].flag&&!this.flags[SKILLS[id].flag]||this.skillSlots[1-slot]===id)return false;this.skillSlots[slot]=id;return true;}
 craft(id){const r=RECIPES.find(r=>r.id===id);if(this.mode!=='workshop'||this.chapter!=='dream'||!r||!this.flags[r.flag]||this.flags['crafted-'+id]||this.gold<r.gold||this.materials<r.materials)return false;this.gold-=r.gold;this.materials-=r.materials;this.bag.push(this.makeItem({kind:'weapon',weapon:r.weapon,rarity:r.rarity,level:2,affix:r.rarity>=3?'duelist':null}));this.flags['crafted-'+id]=true;this.record('crafted-'+id,'工坊制成了'+WEAPONS[r.weapon].name+'。');this.emit('gear');return true;}
 breakSecret(){const c=this.level.points?.find(c=>c.kind==='secret'&&!this.flags[c.flag]&&Math.abs(c.x-this.p.x)<2.1&&Math.abs(c.y-this.p.y)<2);if(!c||this.p.roll||this.p.heal)return false;this.flags[c.flag]=true;if(c.flag==='wallCache'){this.materials+=5;this.gems.mercy++;}this.record(c.flag,c.flag==='spearPlan'?'斩断悬绳，发现锯齿步枪矛配方。':'敲开裂墙，取出怜悯宝石和 5 枚血石。');this.emit('chest',{x:c.x,y:c.y+1});this.emit('pickup',{label:c.flag==='spearPlan'?'获得锯齿步枪矛配方 · 前往工坊合成':'隐藏房间 · 怜悯宝石 +1 / 血石 +5'});return true;}
 moveBody(b,dt,platforms=this.level.platforms){if(b!==this.p){super.moveBody(b,dt,platforms);return;}const input=this.climbInput||{},axis=(input.up?1:0)-(input.down?1:0);
  const paths=[...(this.level.ladders||[]),...(this.flags.wallClimb?this.level.walls||[]:[])];
  if(!b.roll&&!b.attack&&!b.heal&&!b.kb&&this.climbLock<=0&&axis&&!b.climb)b.climb=paths.find(l=>Math.abs(l.x-b.x)<.85&&b.y>=l.y-.2&&b.y<=l.top+.2)||null;
  if(b.climb){const l=b.climb;b.x=l.x;b.vx=0;b.vy=0;b.y=clamp(b.y+axis*4.2*dt,l.y,l.top+.12);b.ground=false;b.jumps=0;if((b.y>=l.top&&axis>0)||(b.y<=l.y&&axis<0)){b.y=axis>0?l.top:l.y;b.climb=null;b.ground=true;this.climbLock=.15;}return;}
  super.moveBody(b,dt,platforms);
 }
 objective(){if(this.chapter==='dream')return this.flags.complete?'长夜纪事已封存 · 回访窗后的故人':!this.flags.gift?'与人偶交谈 · 工坊整备 · 墓碑启程':'从觉醒墓碑前往亚南，寻找血疗的源头';if(this.chapter==='sanctum')return '旧日试炼 · 击败余烬守卫';return ({yharnam:'沿街区探索 · 攀梯寻访窗口 · 东侧进入干船坞',aqueduct:'攀上阁楼 / 搜寻徽章 · 穿越暗渠前往墓园',bridge:'可选猎物 · 射击巨兽收招时的头部，累积失衡',tomb:this.flags['boss-gascoigne']?'调查墓园上方胸针 · 推开欧顿之门，回访故人':'点亮墓园之灯并开启捷径 · 与神父决战'})[this.chapter];}

 exportSave(){
  this.worlds[this.chapter]={chests:copy(this.chests),loot:copy(this.loot)};
  return {version:4,journal:copy(this.journal),skillSlots:[...this.skillSlots],lamp:copy(this.lamp),visitedLamps:copy(this.visitedLamps),dualWield:this.p.dualWield,flags:copy(this.flags),worlds:copy(this.worlds),bag:copy(this.bag),gold:this.gold,materials:this.materials,gems:copy(this.gems),growth:this.growth,serial:this.serial,slots:this.p.slots.map(id=>this.p.weapons[id].id),coat:this.p.coat?.id,rune:this.p.rune?.id,stats:[...this.p.stats],time:this.time,kills:this.kills,returnLamp:this.returnLamp,lostEchoes:this.lostEchoes};
 }
 importSave(raw){
  if(![3,4].includes(raw?.version)||!Array.isArray(raw.bag)||raw.bag.length>1000||!Array.isArray(raw.slots)||raw.slots.length!==2)throw Error('存档格式不正确');
  const safeItem=i=>i&&typeof i.id==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(i.id)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<RARITIES.length&&Number.isInteger(i.level)&&i.level>=1&&i.level<=10&&Number.isInteger(i.upgrade??0)&&(i.upgrade??0)>=0&&(i.upgrade??0)<=6&&(!i.affix||AFFIXES[i.affix])&&(!i.gem||GEMS[i.gem])&&(i.kind==='weapon'?Number.isInteger(i.weapon)&&!!WEAPONS[i.weapon]:i.kind==='attire'&&ATTIRE.some(a=>a.name===i.name&&a.slot===i.slot&&a.set===i.set));
  if(!raw.bag.every(safeItem)||new Set(raw.bag.map(i=>i.id)).size!==raw.bag.length)throw Error('存档装备数据不正确');
  const slots=raw.slots.map(id=>raw.bag.find(i=>i.id===id&&i.kind==='weapon'));if(slots.some(i=>!i)||slots[0].weapon===slots[1].weapon)throw Error('存档武器槽不正确');
  for(const key of ['gold','materials','growth','serial','time','kills'])if(!Number.isFinite(raw[key])||raw[key]<0||raw[key]>1e8)throw Error('存档数值不正确');
  if(!Array.isArray(raw.stats)||raw.stats.length!==3||!raw.stats.every(n=>Number.isInteger(n)&&n>=1&&n<=100))throw Error('成长数据不正确');
  if(!raw.gems||!Object.keys(GEMS).every(k=>Number.isInteger(raw.gems[k])&&raw.gems[k]>=0&&raw.gems[k]<10000))throw Error('宝石数据不正确');
  for(const w of Object.values(raw.worlds||{}))if(!w||!Array.isArray(w.chests)||!Array.isArray(w.loot))throw Error('区域进度数据不正确');
  const groundValid=(i,level)=>i&&/^[a-zA-Z0-9_-]{1,80}$/.test(i.id)&&Number.isFinite(i.x)&&i.x>=0&&i.x<=level.width&&Number.isFinite(i.y)&&i.y>=0&&i.y<=15&&(safeItem(i)||i.kind==='gem'&&!!GEMS[i.gem]||i.kind==='materials'&&Number.isInteger(i.amount)&&i.amount>0&&i.amount<100||['flask','charm','scroll'].includes(i.kind)&&Number.isInteger(i.rarity)&&i.rarity>=0&&i.rarity<=4);
  const normalize=i=>{const base=i.kind==='attire'?ATTIRE.find(a=>a.name===i.name):{kind:'weapon',weapon:i.weapon};return {...base,id:i.id,rarity:i.rarity,level:i.level,upgrade:i.upgrade||0,affix:i.affix||null,gem:i.gem||null,...(Number.isFinite(i.x)?{x:i.x,y:i.y}: {})};};
  // Read data only. Restore in the safe hub; no serialized callbacks or executable content.
  this.newCampaign();this.flags=Object.fromEntries(Object.entries(raw.flags||{}).filter(([k,v])=>FLAG_NAMES.includes(k)&&v===true));
  this.bag=raw.bag.map(normalize);this.gold=raw.gold;this.materials=raw.materials;this.growth=clamp(Math.floor(raw.growth),0,10);this.gems=copy(raw.gems);this.serial=Math.max(raw.serial,10000);this.time=raw.time;this.kills=raw.kills;this.p.stats=raw.stats.slice();
  this.p.slots=raw.slots.map(id=>{const i=this.bag.find(x=>x.id===id);this.p.weapons[i.weapon]=i;return i.weapon;});this.p.weapon=this.p.slots[0];
  this.p.coat=this.bag.find(i=>i.id===raw.coat&&i.slot==='coat')||null;this.p.rune=this.bag.find(i=>i.id===raw.rune&&i.slot==='rune')||null;
  // Rebuild chests against authored content and validate ground item fields.
  for(const [id,level] of Object.entries({...CHAPTERS,sanctum:LEVEL})){const w=raw.worlds?.[id];if(!w||raw.version===3&&id==='yharnam')continue;this.worlds[id]={chests:level.chests.map((c,i)=>({...c,id:c.id||'chest'+i,open:!!w.chests?.find(s=>s?.id===(c.id||'chest'+i))?.open})),loot:(Array.isArray(w.loot)?w.loot:[]).filter(i=>groundValid(i,level)).slice(0,200).map(i=>['weapon','attire'].includes(i.kind)?normalize(i):{id:i.id,kind:i.kind,gem:i.gem,amount:i.amount,rarity:i.rarity??1,x:i.x,y:i.y})};}
  const echo=raw.lostEchoes;this.lostEchoes=echo&&Object.keys(CHAPTERS).concat('sanctum').includes(echo.chapter)&&Number.isFinite(echo.x)&&echo.x>=0&&echo.x<170&&Number.isFinite(echo.y)&&echo.y>=0&&echo.y<15&&Number.isFinite(echo.amount)&&echo.amount>=0?{chapter:echo.chapter,x:echo.x,y:echo.y,amount:echo.amount}:null;this.returnLamp=5;
  const validLamp=l=>l&&CHAPTERS[l.area]?.points.some(p=>p.kind==='lamp'&&p.x===l.x&&p.y===l.y);
  if(validLamp(raw.lamp))this.lamp={area:raw.lamp.area,x:raw.lamp.x,y:raw.lamp.y};
  for(const [id,l] of Object.entries(raw.visitedLamps||{}))if(id===l?.area&&validLamp(l))this.visitedLamps[id]={area:id,x:l.x,y:l.y};
  this.journal=Array.isArray(raw.journal)?raw.journal.filter(n=>typeof n.id==='string'&&typeof n.text==='string').slice(0,100).map(n=>({id:n.id.slice(0,80),text:n.text.slice(0,400),at:Number.isFinite(n.at)?n.at:0})):[];
  if(Array.isArray(raw.skillSlots)&&raw.skillSlots.length===2&&new Set(raw.skillSlots).size===2&&raw.skillSlots.every(id=>SKILLS[id]&&(!SKILLS[id].flag||this.flags[SKILLS[id].flag])))this.skillSlots=[...raw.skillSlots];
  this.p.dualWield=raw.dualWield===true&&this.p.slots.every(id=>!WEAPONS[id].ranged);this.flags.intro=true;this.recomputeHp();this.enterChapter('dream',6,false);this.rest();return true;
 }
}

export {WEAPONS,RARITIES,AFFIXES,CHAPTERS,ENEMY_TYPES,ATTIRE,SETS,GEMS,STORY};
