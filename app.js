'use strict';
const $=(selector,scope=document)=>scope.querySelector(selector);
const desktop=$('#desktop'),workspace=$('#workspace'),windows=$('#windows');
let topZ=10;
const templates={
 about:`<div style="text-align:center"><div style="font-size:55px">☻</div><h2>MONO OS</h2><p>Version 1.0 · 1984 Edition</p><hr><p>MEMORY: 512 KB<br>DISPLAY: 1-BIT<br>STATUS: ONLINE</p><button class="action" data-close>OK</button></div>`,
 files:`<p>Macintosh HD — 4 items</p><button class="file-row" data-file="System Folder">▣ System Folder</button><button class="file-row" data-file="Documents">▤ Documents</button><button class="file-row" data-file="Games">♟ Games</button><button class="file-row" data-file="SECRET.TXT">★ SECRET.TXT</button><p id="file-result" role="status"></p>`,
 notes:`<label for="note-text">Untitled.txt</label><textarea id="note-text" placeholder="Write something..."></textarea><button class="action" id="save-note">SAVE</button> <span id="note-status" role="status"></span>`,
 calc:`<div class="calc-display" id="display">0</div><div class="keys">${['C','7','8','/','9','4','5','*','6','1','2','-','3','0','.','+','='].map(k=>`<button data-key="${k}" ${k==='='?'style="grid-column:span 4;background:#111;color:#fff"':''}>${k}</button>`).join('')}</div>`,
 terminal:`<p>MONO SHELL v1.0 — type help</p><div class="terminal-output" id="terminal-output" aria-live="polite"></div><form class="terminal-form"><span>&gt;</span><input aria-label="Terminal command" autocomplete="off"><button class="action">RUN</button></form>`
};
const titles={about:'About This Computer',files:'Macintosh HD',notes:'Notepad',calc:'Calculator',terminal:'Terminal'};
function openWindow(name){
 let win=document.getElementById('win-'+name);
 if(win){win.hidden=false;win.style.zIndex=++topZ;return}
 win=document.createElement('section');win.className='window';win.id='win-'+name;win.setAttribute('aria-label',titles[name]);win.style.zIndex=++topZ;
 win.innerHTML=`<div class="titlebar"><button class="close" aria-label="Close window">×</button><strong>${titles[name]}</strong></div><div class="content">${templates[name]}</div>`;
 windows.append(win);$('.close',win).onclick=()=>win.remove();
 win.addEventListener('pointerdown',()=>win.style.zIndex=++topZ);
 win.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>win.remove());
 enableDrag(win);
 if(name==='notes')setupNotes(win);
 if(name==='files')setupFiles(win);
 if(name==='calc')setupCalculator(win);
 if(name==='terminal')setupTerminal(win);
}
function enableDrag(win){const bar=$('.titlebar',win);let origin;
 bar.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;const wr=win.getBoundingClientRect(),dr=workspace.getBoundingClientRect();origin={x:e.clientX,y:e.clientY,left:wr.left-dr.left,top:wr.top-dr.top};bar.setPointerCapture(e.pointerId)});
 bar.addEventListener('pointermove',e=>{if(!origin)return;win.style.left=Math.max(0,Math.min(workspace.clientWidth-win.offsetWidth-6,origin.left+e.clientX-origin.x))+'px';win.style.top=Math.max(0,Math.min(workspace.clientHeight-win.offsetHeight-6,origin.top+e.clientY-origin.y))+'px'});
 for(const type of ['pointerup','pointercancel'])bar.addEventListener(type,()=>origin=null);
}
function setupNotes(win){const area=$('#note-text',win),status=$('#note-status',win);try{area.value=localStorage.getItem('mono-note')||''}catch{}$('#save-note',win).onclick=()=>{try{localStorage.setItem('mono-note',area.value);status.textContent='SAVED ✓'}catch{status.textContent='Storage unavailable'}}}
function setupFiles(win){win.querySelectorAll('[data-file]').forEach(b=>b.onclick=()=>{$('#file-result',win).textContent=b.dataset.file==='SECRET.TXT'?'★ YOU FOUND THE SECRET! ★':b.dataset.file+' — folder opened (demo)'})}
function setupCalculator(win){let expression='',fresh=false;const display=$('#display',win);
 win.querySelectorAll('[data-key]').forEach(b=>b.onclick=()=>{const key=b.dataset.key;
 if(key==='C'){expression='';fresh=false;display.textContent='0';return}
 if(key==='='){try{const tokens=expression.match(/\d+(?:\.\d+)?|[+*/-]/g)||[];if(tokens.join('')!==expression||tokens.length<3)throw Error();const numbers=[],ops=[],priority=o=>'+-'.includes(o)?1:2;const apply=()=>{const op=ops.pop(),b=numbers.pop(),a=numbers.pop();if(a===undefined||b===undefined)throw Error();numbers.push(op==='+'?a+b:op==='-'?a-b:op==='*'?a*b:a/b)};for(const token of tokens){if(/^\d/.test(token))numbers.push(Number(token));else{while(ops.length&&priority(ops.at(-1))>=priority(token))apply();ops.push(token)}}while(ops.length)apply();if(numbers.length!==1||!Number.isFinite(numbers[0]))throw Error();expression=String(Number(numbers[0].toPrecision(10)));display.textContent=expression;fresh=true}catch{expression='';display.textContent='Error';fresh=true}return}
 if(fresh&&/[\d.]/.test(key)){expression='';fresh=false}
 if(/[+*/-]/.test(key)){if(!expression||/[+*/-]$/.test(expression))return;fresh=false}
 if(key==='.'&&/(?:^|[+*/-])\d*\.\d*$/.test(expression))return;
 if(expression.length>22)return;expression+=key;display.textContent=expression;
 })}
function setupTerminal(win){const form=$('.terminal-form',win),input=$('input',form),out=$('#terminal-output',win);form.onsubmit=e=>{e.preventDefault();const cmd=input.value.trim().toLowerCase();input.value='';if(cmd==='clear'){out.textContent='';return}const commands={help:'help, date, whoami, ls, about, clear',date:new Date().toLocaleString(),whoami:'guest@mono-os',ls:'System  Documents  Games  SECRET.TXT',about:'MONO OS v1.0 — fictional operating system'};out.textContent+='> '+cmd+'\n'+(commands[cmd]||'Unknown command. Type help.')+'\n';out.scrollTop=out.scrollHeight}}
$('#start').onclick=()=>{$('#boot').hidden=true;desktop.hidden=false;openWindow('about')};$('#home').onclick=()=>openWindow('about');document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openWindow(b.dataset.open));
function updateClock(){$('#clock').textContent=new Date().toLocaleTimeString('ja-JP',{hour:'2-digit',minute:'2-digit'})}updateClock();setInterval(updateClock,30000);
