(function(){
"use strict";
/* ---------- Conteúdo ---------- */
const MAT = [
 {id:"port", nome:"Português", c:"--c-port", topicos:["Compreensão e interpretação de textos","Tipologia e gêneros textuais","Ortografia e acentuação gráfica","Classes de palavras","Concordância verbal e nominal","Regência verbal e nominal; crase","Pontuação","Colocação pronominal","Sintaxe do período: coordenação e subordinação","Semântica: sinonímia, antonímia e sentido figurado","Coesão e coerência","Reescrita de frases e parágrafos"]},
 {id:"mat", nome:"Raciocínio Lógico", c:"--c-mat", topicos:["Proposições e conectivos lógicos","Tabela-verdade, equivalências e negações","Quantificadores e diagramas lógicos","Lógica de argumentação","Sequências lógicas e problemas","Conjuntos e operações","Análise combinatória e probabilidade","Razão, proporção e porcentagem","Regra de três simples e composta","Problemas aritméticos: frações, decimais e equações"]},
 {id:"hist", nome:"História de PE", c:"--c-hist", topicos:["Povos indígenas e Pernambuco pré-colonial","Capitania de Pernambuco e Duarte Coelho","Economia açucareira e escravidão","Domínio holandês e governo de Nassau","Insurreição Pernambucana e Batalhas dos Guararapes","Guerra dos Mascates (1710–1711)","Revolução Pernambucana de 1817","Confederação do Equador (1824)","Revolução Praieira (1848)","Pernambuco na República","Cultura e patrimônio: frevo, maracatu, Carnaval","Geografia e regiões de Pernambuco"]},
 {id:"const", nome:"Dir. Constitucional", c:"--c-const", topicos:["Princípios fundamentais (arts. 1º a 4º)","Direitos e deveres individuais e coletivos (art. 5º)","Remédios constitucionais","Direitos sociais (arts. 6º a 11)","Nacionalidade","Direitos políticos","Organização do Estado","Administração Pública (arts. 37 a 41)","Militares dos Estados (art. 42)","Segurança Pública (art. 144)","Organização dos Poderes","Constituição do Estado de Pernambuco"]},
 {id:"info", nome:"Informática", c:"--c-info", topicos:["Windows: arquivos, pastas e atalhos","Editor de textos (Word / Writer)","Planilhas (Excel / Calc)","Apresentações (PowerPoint / Impress)","Internet e navegadores","Correio eletrônico","Redes de computadores","Segurança da informação, vírus e malware","Backup e armazenamento em nuvem","Hardware e software"]},
 {id:"red", nome:"Redação", c:"--c-red", topicos:["Estrutura do texto dissertativo-argumentativo","Introdução e tese","Desenvolvimento e argumentação","Conclusão","Coesão e conectivos na redação","Temas: segurança pública e cidadania","Correção e reescrita"]},
 {id:"dh", nome:"Direitos Humanos", c:"--c-dh", topicos:["Conceito, características e evolução histórica","Declaração Universal dos Direitos Humanos (1948)","Dimensões (gerações) dos direitos humanos","Direitos humanos na CF/88","Pacto de San José da Costa Rica","Sistema interamericano de direitos humanos","Uso da força e de armas de fogo (Princípios Básicos da ONU)","Código de Conduta para Encarregados da Aplicação da Lei","Lei de Abuso de Autoridade (Lei 13.869/2019)","Lei de Tortura (Lei 9.455/1997)","Grupos vulneráveis: ECA, Maria da Penha, Estatuto do Idoso, Igualdade Racial"]}
];
const MATBY = Object.fromEntries(MAT.map(m=>[m.id,m]));
const TIPOS = {T:"Teoria",Q:"Questões",R:"Revisão",RD:"Redação",S:"Simulado",F:"Folga"};
const DIAS = ["seg","ter","qua","qui","sex","sab","dom"];
const DIAS_N = {seg:"Segunda",ter:"Terça",qua:"Quarta",qui:"Quinta",sex:"Sexta",sab:"Sábado",dom:"Domingo"};
const GRADE_PADRAO = {
 seg:[["port","T"],["port","Q"],["const","T"],["info","T"]],
 ter:[["mat","T"],["mat","Q"],["hist","T"],["dh","T"]],
 qua:[["port","T"],["port","Q"],["const","Q"],["red","RD"]],
 qui:[["mat","T"],["mat","Q"],["info","Q"],["hist","Q"]],
 sex:[["port","Q"],["dh","Q"],["const","Q"],["mix","R"]],
 sab:[["mix","S"],["mix","S"],["mix","R"],["red","RD"]],
 dom:[["mix","R"],["mix","R"],["mix","F"],["mix","F"]]
};
const FASES = [
 {n:"Fase 1 · Base", sem:[1,4], txt:"Teoria de todos os assuntos com questões fáceis. Simulado diagnóstico nas semanas 1 e 4."},
 {n:"Fase 2 · Aprofundamento", sem:[5,8], txt:"Questões no estilo da banca, revisões programadas e redação semanal. Simulados nas semanas 6 e 8."},
 {n:"Fase 3 · Reta final", sem:[9,12], txt:"Simulado completo todo sábado, revisão geral, lei seca e duas redações por semana."}
];
const SIM_SEMANAS = [1,4,6,8,9,10,11,12];

/* ---------- Utilidades ---------- */
const $ = s=>document.querySelector(s);
const esc = s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n=>String(n).padStart(2,"0");
const iso = d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parse = s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const addDays = (d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const today = ()=>{const d=new Date();d.setHours(0,0,0,0);return d};
const diffDays = (a,b)=>Math.round((b-a)/86400000);
const fmt = s=>{const d=parse(s);return pad(d.getDate())+"/"+pad(d.getMonth()+1)};
const dayKey = d=>DIAS[(d.getDay()+6)%7];
const nextMonday = ()=>{const d=today();const k=(8-d.getDay())%7||7;return d.getDay()===1?d:addDays(d,k)};
const colorOf = id=>id==="mix"?"var(--ink-3)":"var("+MATBY[id].c+")";
const nomeOf = id=>id==="mix"?"Todas as matérias":MATBY[id].nome;
const toast = msg=>{const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2600)};
const topicId = (m,i)=>m+"-"+i;

/* ---------- Estado e armazenamento ---------- */
const DEF = {
 config:{inicio:iso(nextMonday()), prova:iso(addDays(nextMonday(),84)), foco:50, pausa:10},
 grade:{dias:JSON.parse(JSON.stringify(GRADE_PADRAO))},
 feitos:{m:{}},
 topicos:{m:{}},
 simulados:{items:[]},
 pdfs:{items:[]},
 questoes:{custom:[],resp:{},provas:[],ativo:null,f:{m:[],a:"",b:[],t:"",s:"",y:"",q:""},exemplos:true,oficiais:true}
};
const S = JSON.parse(JSON.stringify(DEF));
let db=null, assets=null, cloud=false;
const LS="qgpmpe:";
function lsGet(k){try{const v=localStorage.getItem(LS+k);return v?JSON.parse(v):null}catch(e){return null}}
let quotaWarned=false;
function lsSet(k,v){try{localStorage.setItem(LS+k,JSON.stringify(v));markSaved()}catch(e){if(!quotaWarned){quotaWarned=true;toast("O navegador está sem espaço para salvar. Baixe um backup e remova PDFs antigos.")}}}
function markSaved(onde){const el=document.getElementById("saved");if(!el)return;const d=new Date();const h=pad(d.getHours())+":"+pad(d.getMinutes());
  if(onde==="nuvem"){el.textContent="Sincronizado "+h;el.dataset.s="ok"}
  else if(onde==="offline"){el.textContent="Salvo no aparelho "+h+" · sem conexão";el.dataset.s="off"}
  else if(!db||el.dataset.s!=="ok"){el.textContent="Salvo "+h;el.dataset.s=""}
  el.hidden=false}
const saving={}, queued={};
async function save(key){
  lsSet(key,S[key]);
  if(!db) return;
  if(saving[key]){queued[key]=true;return}
  saving[key]=true;
  try{await db.doc("estado/"+key).set(S[key]);markSaved("nuvem")}catch(e){if(e&&e.code==="senha")toast("A senha da nuvem mudou. Entre de novo em Ajustes.");else markSaved("offline")}
  saving[key]=false;
  if(queued[key]){queued[key]=false;save(key)}
}
const deb={};
function saveSoon(key,ms){lsSet(key,S[key]);clearTimeout(deb[key]);deb[key]=setTimeout(()=>{delete deb[key];save(key)},ms||600)}
function flushAll(){for(const k of Object.keys(deb)){clearTimeout(deb[k]);delete deb[k];save(k)}try{flushNotes()}catch(e){}persistTimer()}
document.addEventListener("visibilitychange",()=>{if(document.hidden)flushAll()});
window.addEventListener("pagehide",flushAll);
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persisted().then(ok=>{if(!ok)navigator.storage.persist()})}catch(e){}
for(const k of Object.keys(DEF)){const v=lsGet(k);if(v)S[k]=Object.assign(JSON.parse(JSON.stringify(DEF[k])),v)}
/* Matemática virou Raciocínio Lógico: remapeia o progresso dos assuntos antigos pelo nome */
(function(){if(S.topicos.rlm)return;
  const OLD=["Conjuntos e operações","Números racionais, frações e decimais","Razão e proporção","Regra de três simples e composta","Porcentagem","Juros simples e compostos","Equações e sistemas do 1º e 2º grau","Funções do 1º e 2º grau","Geometria plana: áreas e perímetros","Proposições e conectivos lógicos","Tabela-verdade, equivalências e negações","Sequências lógicas e problemas","Análise combinatória e probabilidade"];
  const REN={"Razão e proporção":"Razão, proporção e porcentagem","Porcentagem":"Razão, proporção e porcentagem","Números racionais, frações e decimais":"Problemas aritméticos: frações, decimais e equações","Equações e sistemas do 1º e 2º grau":"Problemas aritméticos: frações, decimais e equações"};
  const NEW=MATBY.mat.topicos,nm={};
  for(const [k,v] of Object.entries(S.topicos.m))if(!k.startsWith("mat-"))nm[k]=v;
  for(const [k,v] of Object.entries(S.topicos.m)){if(!k.startsWith("mat-"))continue;const o=OLD[+k.slice(4)];const i=NEW.indexOf(REN[o]||o);if(i>=0&&!nm["mat-"+i])nm["mat-"+i]=v}
  S.topicos.m=nm;S.topicos.rlm=1;lsSet("topicos",S.topicos)})();

/* IndexedDB para PDFs quando o armazenamento do artifact não estiver disponível */
function idb(){return new Promise((res,rej)=>{try{const r=indexedDB.open("qgpmpe",1);r.onupgradeneeded=()=>r.result.createObjectStore("pdf");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
async function idbPut(id,blob){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction("pdf","readwrite");t.objectStore("pdf").put(blob,id);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
async function idbGet(id){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction("pdf");const r=t.objectStore("pdf").get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbDel(id){const d=await idb();return new Promise(res=>{const t=d.transaction("pdf","readwrite");t.objectStore("pdf").delete(id);t.oncomplete=res;t.onerror=res})}

/* ---------- Navegação ---------- */
const VIEWS=["hoje","grade","cronograma","edital","questoes","simulados","pdfs","ajustes"];
function route(){
  const h=(location.hash||"#hoje").slice(1);const v=VIEWS.includes(h)?h:"hoje";
  VIEWS.forEach(x=>$("#v-"+x).hidden=x!==v);
  document.querySelectorAll("#tabs a").forEach(a=>a.setAttribute("aria-current",a.getAttribute("href")==="#"+v?"page":"false"));
  render(v);
}
window.addEventListener("hashchange",route);
function renderAll(){renderCountdown();const h=(location.hash||"#hoje").slice(1);render(VIEWS.includes(h)?h:"hoje")}
function render(v){
  renderCountdown();
  ({hoje:rHoje,grade:rGrade,cronograma:rCrono,edital:rEdital,questoes:rQuest,simulados:rSim,pdfs:rPdfs,ajustes:rAjustes})[v]();
}

/* ---------- Cálculos ---------- */
function semanaAtual(){const n=Math.floor(diffDays(parse(S.config.inicio),today())/7)+1;return n}
function topicState(id){return S.topicos.m[id]}
function revisoesDevidas(){
  const out=[];const t=today();
  for(const m of MAT) m.topicos.forEach((nome,i)=>{
    const st=topicState(topicId(m.id,i)); if(!st||!st.d) return;
    const n=st.r||0; if(n>=3) return;
    const due=addDays(parse(st.d),[1,7,30][n]);
    if(due<=t) out.push({m,i,nome,n,due,late:diffDays(due,t)});
  });
  return out.sort((a,b)=>b.late-a.late);
}
function cobertura(mid){const m=MATBY[mid];const f=m.topicos.filter((_,i)=>topicState(topicId(mid,i))?.d).length;return [f,m.topicos.length]}
function planoSemanas(){
  /* Distribui os assuntos de cada matéria pelas semanas 1 a 8; semanas 9-12 = revisão */
  const w=Array.from({length:12},()=>({}));
  for(const m of MAT){
    const n=m.topicos.length;
    m.topicos.forEach((_,i)=>{const s=Math.min(7,Math.floor(i*8/n));(w[s][m.id]=w[s][m.id]||[]).push(i)});
  }
  return w;
}
function simPct(s){let a=0,t=0;for(const m of MAT){const r=s.r[m.id];if(r&&r[1]>0){a+=+r[0]||0;t+=+r[1]||0}}return t?a/t*100:null}

/* ---------- Topo ---------- */
function renderCountdown(){
  const d=diffDays(today(),parse(S.config.prova));
  $("#countdown").innerHTML=d>=0?`<b class="num">${d}</b><span>dias para a prova<br><span style="opacity:.7">${fmt(S.config.prova)}</span></span>`:`<span>Prova em ${fmt(S.config.prova)}</span>`;
}

/* ---------- Hoje ---------- */
let timerBlock=null;
function rHoje(){
  const t=today(), k=dayKey(t), key=iso(t);
  const sem=semanaAtual();
  {const ub=lsGet("ultimoBackup");const temProg=Object.keys(S.feitos.m).length||Object.keys(S.topicos.m).length||S.simulados.items.length;
   const dias=ub?diffDays(parse(ub.em.slice(0,10)),t):null;
   $("#hoje-backup").innerHTML=temProg&&(dias==null||dias>=7)?`<div class="notice backup-nudge"><span style="flex:1;min-width:200px">${dias==null?"Você ainda não fez nenhum backup.":`Seu último backup foi há ${dias} dias.`} ${db?"O progresso fica na nuvem; um backup é uma cópia extra que fica com você.":"O progresso fica salvo neste aparelho; um backup protege contra limpeza de dados ou troca de aparelho."}</span><a class="btn" href="#ajustes">Fazer backup</a></div>`:"";}
  $("#hoje-titulo").textContent=DIAS_N[k]+", "+fmt(key);
  const fase=FASES.find(f=>sem>=f.sem[0]&&sem<=f.sem[1]);
  $("#hoje-sub").textContent= sem<1?`O cronograma começa em ${fmt(S.config.inicio)}. Você já pode adiantar os blocos.`: sem>12?"Cronograma de 12 semanas concluído. Mantenha simulados e revisões até a prova.":`Semana ${sem} de 12 · ${fase.n}`;
  const blocos=S.grade.dias[k]||[];
  const feitos=S.feitos.m[key]||[];
  const isSim = k==="sab" && SIM_SEMANAS.includes(sem);
  let html="";
  blocos.forEach(([mid,tp],i)=>{
    if(tp==="F") return;
    let tipo=tp, titulo=nomeOf(mid);
    if(tp==="S"&&!isSim){tipo="Q";titulo="Questões mistas"}
    if(tp==="S") titulo="Simulado completo";
    if(tp==="R"&&mid==="mix") titulo="Revisão da semana";
    const done=feitos.includes(i);
    html+=`<div class="block${done?" done":""}" style="--c:${colorOf(mid)}">
      <input type="checkbox" class="check" data-b="${i}" ${done?"checked":""} aria-label="Concluir bloco ${i+1}">
      <div style="min-width:0"><div class="bt">${esc(titulo)}</div><div class="bs">Bloco ${i+1} · ${TIPOS[tipo]} · ${S.config.foco} min</div></div>
      <button class="ghost" data-tb="${i}" data-label="${esc(titulo+" · "+TIPOS[tipo])}">Cronometrar</button></div>`;
  });
  $("#hoje-blocks").innerHTML=html||`<div class="empty">Dia de folga na grade. Descanse ou faça uma revisão leve.</div>`;
  const total=blocos.filter(b=>b[1]!=="F").length;
  $("#hoje-count").textContent=`${feitos.length} de ${total} concluídos`;
  $("#hoje-blocks").querySelectorAll("input[data-b]").forEach(cb=>cb.onchange=()=>{
    const i=+cb.dataset.b; let arr=(S.feitos.m[key]||[]).slice();
    arr=cb.checked?[...new Set([...arr,i])]:arr.filter(x=>x!==i);
    S.feitos.m[key]=arr; save("feitos"); rHoje();
  });
  $("#hoje-blocks").querySelectorAll("button[data-tb]").forEach(b=>b.onclick=()=>{timerBlock={key,i:+b.dataset.tb};$("#t-what").textContent=b.dataset.label;resetTimer();startTimer()});

  const revs=revisoesDevidas();
  $("#hoje-revs").innerHTML=revs.length?revs.slice(0,8).map(r=>`<div class="rev${r.late>0?" late":""}"><div style="min-width:0"><span class="chip"><span class="dot" style="--c:var(${r.m.c})"></span>${esc(r.m.nome)}</span> <span>${esc(r.nome)}</span><div class="small muted">Revisão ${["de 24h","de 7 dias","de 30 dias"][r.n]}${r.late>0?` · atrasada ${r.late} dia${r.late>1?"s":""}`:""}</div></div><button data-rv="${r.m.id}|${r.i}">Revisei</button></div>`).join("")+(revs.length>8?`<div class="small muted">E mais ${revs.length-8} no edital.</div>`:""):`<div class="empty">Nenhuma revisão vencendo hoje. Marque assuntos estudados no edital para gerar revisões.</div>`;
  $("#hoje-revs").querySelectorAll("[data-rv]").forEach(b=>b.onclick=()=>{const [m,i]=b.dataset.rv.split("|");const id=topicId(m,i);const st=Object.assign({},S.topicos.m[id]);st.r=(st.r||0)+1;st.d2=iso(today());S.topicos.m[id]=st;save("topicos");toast("Revisão registrada");rHoje()});

  $("#hoje-prog").innerHTML=MAT.map(m=>{const [f,t]=cobertura(m.id);return `<div><div class="l"><span>${esc(m.nome)}</span><span class="num muted">${f}/${t}</span></div><div class="bar" style="--c:var(${m.c})"><i style="width:${f/t*100}%"></i></div></div>`}).join("");

  // semana
  const mon=addDays(t,-((t.getDay()+6)%7));let feitosSem=0,totSem=0;
  for(let d=0;d<7;d++){const dk=DIAS[d];const n=(S.grade.dias[dk]||[]).filter(b=>b[1]!=="F").length;totSem+=n;feitosSem+=(S.feitos.m[iso(addDays(mon,d))]||[]).length}
  const horas=(feitosSem*S.config.foco/60).toFixed(1).replace(".",",");
  $("#hoje-semana").innerHTML=`<div style="font-family:var(--f-display);font-size:40px;line-height:1" class="num">${feitosSem}<span class="muted" style="font-size:22px">/${totSem} blocos</span></div><div class="bar"><i style="width:${totSem?feitosSem/totSem*100:0}%;background:var(--sol)"></i></div><div class="small muted">${horas} h de foco nesta semana.${k!=="sab"&&SIM_SEMANAS.includes(sem)?" Sábado tem simulado.":""}${isSim?" Hoje é dia de simulado.":""}</div>`;

  const sims=S.simulados.items.slice().sort((a,b)=>a.data<b.data?1:-1);
  if(sims.length){const s=sims[0],p=simPct(s),prev=sims[1]?simPct(sims[1]):null;
    $("#hoje-sim").innerHTML=`<div style="font-family:var(--f-display);font-size:40px;line-height:1" class="num">${p==null?"–":p.toFixed(0)+"%"}</div><div class="small muted">${esc(s.nome||"Simulado")} · ${fmt(s.data)}${prev!=null&&p!=null?` · ${p>=prev?"+":""}${(p-prev).toFixed(0)} p.p. sobre o anterior`:""}</div><a href="#simulados" class="small">Ver evolução</a>`;
  } else $("#hoje-sim").innerHTML=`<div class="empty">Nenhum simulado registrado. O primeiro é no sábado da semana 1.</div>`;
}

/* Cronômetro */
let tState={phase:"foco",left:null,running:false,iv:null};
function fmtClock(s){return pad(Math.floor(s/60))+":"+pad(s%60)}
function resetTimer(){clearInterval(tState.iv);tState={phase:"foco",left:S.config.foco*60,running:false,iv:null};paintTimer();persistTimer()}
function persistTimer(){lsSet("timer",{phase:tState.phase,left:tState.left,running:tState.running,end:tState.end||null,block:timerBlock,what:$("#t-what").textContent})}
function restoreTimer(){
  const t=lsGet("timer");if(!t){resetTimer();return}
  tState={phase:t.phase||"foco",left:t.left??S.config.foco*60,running:false,iv:null};timerBlock=t.block||null;if(t.what)$("#t-what").textContent=t.what;
  if(t.running&&t.end){const left=Math.round((t.end-Date.now())/1000);if(left>0){tState.left=left;startTimer();return}tState.left=0;paintTimer();phaseEnd();return}
  paintTimer();
}
function paintTimer(){if(tState.left==null)tState.left=S.config.foco*60;$("#t-clock").textContent=fmtClock(tState.left);$("#t-phase").textContent=tState.phase==="foco"?"Foco":"Pausa";$("#t-start").textContent=tState.running?"Pausar":"Iniciar"}
function startTimer(){
  if(tState.running){clearInterval(tState.iv);tState.running=false;tState.end=null;paintTimer();persistTimer();return}
  tState.running=true;const end=Date.now()+tState.left*1000;tState.end=end;persistTimer();
  tState.iv=setInterval(()=>{tState.left=Math.max(0,Math.round((end-Date.now())/1000));paintTimer();if(tState.left===0){clearInterval(tState.iv);tState.running=false;phaseEnd()}},500);paintTimer();
}
function beep(){try{const a=new (window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator();const g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.1;o.start();setTimeout(()=>{o.stop();a.close()},400)}catch(e){}}
function phaseEnd(){
  beep();
  if(tState.phase==="foco"){
    if(timerBlock){const arr=S.feitos.m[timerBlock.key]||[];if(!arr.includes(timerBlock.i)){S.feitos.m[timerBlock.key]=[...arr,timerBlock.i];save("feitos")}}
    toast("Bloco concluído. Hora da pausa.");tState.phase="pausa";tState.left=S.config.pausa*60;
  } else {toast("Pausa encerrada. Próximo bloco.");tState.phase="foco";tState.left=S.config.foco*60}
  tState.end=null;paintTimer();persistTimer(); if(!$("#v-hoje").hidden) rHoje();
}
$("#t-start").onclick=startTimer;$("#t-reset").onclick=resetTimer;
$("#t-skip").onclick=()=>{clearInterval(tState.iv);tState.running=false;phaseEnd()};

/* ---------- Grade ---------- */
let gradeConfirm=false;
function rGrade(){
  const n=Math.max(...DIAS.map(d=>S.grade.dias[d].length));
  const tk=dayKey(today());
  let h="<thead><tr>"+DIAS.map(d=>`<th class="${d===tk?"today":""}">${DIAS_N[d]}</th>`).join("")+"</tr></thead><tbody>";
  for(let i=0;i<n;i++){
    h+="<tr>"+DIAS.map(d=>{const b=S.grade.dias[d][i];if(!b)return"<td></td>";const [mid,tp]=b;
      return `<td><div class="cell" style="--c:${tp==="F"?"var(--line)":colorOf(mid)}">
      <span class="eyebrow">Bloco ${i+1}</span>
      <select data-d="${d}" data-i="${i}" data-f="m" aria-label="Matéria ${DIAS_N[d]} bloco ${i+1}"><option value="mix"${mid==="mix"?" selected":""}>Todas</option>${MAT.map(m=>`<option value="${m.id}"${m.id===mid?" selected":""}>${esc(m.nome)}</option>`).join("")}</select>
      <select data-d="${d}" data-i="${i}" data-f="t" aria-label="Tipo ${DIAS_N[d]} bloco ${i+1}">${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}"${k===tp?" selected":""}>${v}</option>`).join("")}</select></div></td>`}).join("")+"</tr>";
  }
  $("#grade-table").innerHTML=h+"</tbody>";
  $("#grade-table").querySelectorAll("select").forEach(s=>s.onchange=()=>{const b=S.grade.dias[s.dataset.d][+s.dataset.i];b[s.dataset.f==="m"?0:1]=s.value;save("grade");rGrade()});
  $("#legend").innerHTML=MAT.map(m=>`<span class="chip"><span class="dot" style="--c:var(${m.c})"></span>${esc(m.nome)}</span>`).join("");
  const cont={};let tot=0;DIAS.forEach(d=>S.grade.dias[d].forEach(([m,t])=>{if(t==="F")return;tot++;cont[m]=(cont[m]||0)+1}));
  $("#grade-total").textContent=`${tot} blocos por semana (${(tot*S.config.foco/60).toFixed(0)} h de foco). `+MAT.map(m=>`${m.nome}: ${cont[m.id]||0}`).join(" · ")+(cont.mix?` · Mistos: ${cont.mix}`:"");
  $("#g-confirm").innerHTML=gradeConfirm?`<div class="confirm notice" style="margin-bottom:10px">Restaurar a grade padrão apaga suas mudanças na grade. <button class="danger" id="g-yes">Restaurar</button><button id="g-no">Cancelar</button></div>`:"";
  if(gradeConfirm){$("#g-yes").onclick=()=>{S.grade.dias=JSON.parse(JSON.stringify(GRADE_PADRAO));gradeConfirm=false;save("grade");rGrade();toast("Grade padrão restaurada")};$("#g-no").onclick=()=>{gradeConfirm=false;rGrade()}}
}
$("#g-add").onclick=()=>{DIAS.forEach(d=>{if(S.grade.dias[d].length<8)S.grade.dias[d].push(["mix","Q"])});save("grade");rGrade()};
$("#g-rem").onclick=()=>{DIAS.forEach(d=>{if(S.grade.dias[d].length>1)S.grade.dias[d].pop()});save("grade");rGrade()};
$("#g-reset").onclick=()=>{gradeConfirm=true;rGrade()};

/* ---------- Cronograma ---------- */
const openWeeks=new Set();
function rCrono(){
  const sem=semanaAtual();
  $("#phases").innerHTML=FASES.map(f=>`<div class="phase-card${sem>=f.sem[0]&&sem<=f.sem[1]?" now":""}"><div class="eyebrow">Semanas ${f.sem[0]}–${f.sem[1]}</div><h3>${f.n}</h3><p class="small" style="margin:6px 0 0">${f.txt}</p></div>`).join("");
  const plano=planoSemanas();const ini=parse(S.config.inicio);
  if(!openWeeks.size&&sem>=1&&sem<=12)openWeeks.add(sem);
  $("#weeks").innerHTML=plano.map((w,ix)=>{
    const n=ix+1, a=addDays(ini,ix*7), b=addDays(a,6);
    let itens=[], feitos=0;
    for(const m of MAT)(w[m.id]||[]).forEach(i=>{itens.push([m,i]);if(topicState(topicId(m.id,i))?.d)feitos++});
    const fase=FASES.find(f=>n>=f.sem[0]&&n<=f.sem[1]);
    const meta = n>8 ? (n===12?"Revisão final, lei seca (CF arts. 5º, 37, 42, 144) e descanso na véspera.":"Revisão geral de todas as matérias com foco nos erros dos simulados. Duas redações.") : `${itens.length} assuntos · ${feitos} concluídos`;
    const body = n>8 ? `<div class="small">Use os blocos de teoria para revisar os assuntos com mais erros. Refaça as questões erradas dos simulados anteriores. Escreva duas redações e corrija.</div>`
      : `<div class="wk-topics">${MAT.filter(m=>w[m.id]).map(m=>`<div class="grp" style="--c:var(${m.c})"><span class="eyebrow">${esc(m.nome)}</span>${w[m.id].map(i=>{const id=topicId(m.id,i);const ok=!!topicState(id)?.d;return `<label class="tline"><input type="checkbox" data-tp="${id}" ${ok?"checked":""}><span>${esc(m.topicos[i])}</span></label>`}).join("")}</div>`).join("")}</div>`;
    return `<details class="wk${n===sem?" current":""}" data-w="${n}" ${openWeeks.has(n)?"open":""}><summary><span class="wn num">${n}</span><span style="min-width:0"><strong>${fmt(iso(a))} a ${fmt(iso(b))}</strong> <span class="small muted">· ${fase.n.split(" · ")[1]}</span><br><span class="small muted">${meta}</span></span><span>${SIM_SEMANAS.includes(n)?`<span class="sim-flag">Simulado sáb ${fmt(iso(addDays(a,5)))}</span>`:""}</span></summary><div class="wbody">${body}</div></details>`;
  }).join("");
  $("#weeks").querySelectorAll("details").forEach(d=>d.ontoggle=()=>{const n=+d.dataset.w;d.open?openWeeks.add(n):openWeeks.delete(n)});
  bindTopicChecks($("#weeks"),rCrono);
}
function bindTopicChecks(root,rerender){
  root.querySelectorAll("input[data-tp]").forEach(cb=>cb.onchange=()=>{
    const id=cb.dataset.tp;
    if(cb.checked)S.topicos.m[id]={d:iso(today()),r:0};else delete S.topicos.m[id];
    save("topicos");if(cb.checked)toast("Revisões agendadas: amanhã, em 7 e em 30 dias");rerender();
  });
}

/* ---------- Edital ---------- */
function rEdital(){
  $("#subjects").innerHTML=MAT.map(m=>{const [f,t]=cobertura(m.id);
    return `<div class="panel subj" style="--c:var(${m.c});display:grid;gap:8px"><div class="spread"><h3>${esc(m.nome)}</h3><span class="num small muted">${f}/${t}</span></div><div class="bar" style="--c:var(${m.c})"><i style="width:${f/t*100}%"></i></div><div>${m.topicos.map((nome,i)=>{const id=topicId(m.id,i);const st=topicState(id);
      return `<div class="topic"><input type="checkbox" data-tp="${id}" ${st?.d?"checked":""} aria-label="${esc(nome)}"><span>${esc(nome)}${st?.d?`<br><span class="small muted">Estudado em ${fmt(st.d)}</span>`:""}</span><span class="revpips" title="Revisões feitas: ${st?.r||0} de 3">${[0,1,2].map(k=>`<i class="${(st?.r||0)>k?"on":""}"></i>`).join("")}</span></div>`}).join("")}</div></div>`}).join("");
  bindTopicChecks($("#subjects"),rEdital);
}

/* ---------- Simulados ---------- */
function buildSimFields(){
  $("#sim-fields").innerHTML=MAT.filter(m=>m.id!=="red").map(m=>`<label class="f"><span><span class="dot" style="--c:var(${m.c});display:inline-block;margin-right:4px"></span>${esc(m.nome)}</span><span class="pair"><input type="number" min="0" id="sa-${m.id}" placeholder="acertos" aria-label="Acertos ${esc(m.nome)}"><span class="muted">/</span><input type="number" min="0" id="st-${m.id}" placeholder="questões" aria-label="Questões ${esc(m.nome)}"></span></label>`).join("");
  $("#sim-data").value=iso(today());
}
$("#sim-form").addEventListener("submit",e=>{
  e.preventDefault();const r={};let any=false;
  for(const m of MAT){if(m.id==="red")continue;const a=+$("#sa-"+m.id).value||0,t=+$("#st-"+m.id).value||0;if(t>0){if(a>t){toast(`${m.nome}: acertos maiores que o total de questões.`);return}r[m.id]=[a,t];any=true}}
  if(!any){toast("Preencha o total de questões de pelo menos uma matéria.");return}
  const rd=$("#sim-redacao").value;
  S.simulados.items.push({id:Date.now().toString(36),data:$("#sim-data").value,nome:$("#sim-nome").value.trim(),r,red:rd===""?null:+rd});
  save("simulados");e.target.reset();buildSimFields();toast("Simulado salvo");rSim();
});
let simDel=null;
function rSim(){
  const items=S.simulados.items.slice().sort((a,b)=>a.data<b.data?-1:1);
  // gráfico de linha
  const pts=items.map(s=>({s,p:simPct(s)})).filter(x=>x.p!=null);
  const box=$("#sim-chart");
  if(pts.length<1){box.innerHTML=`<div class="empty">A linha aparece depois do primeiro simulado registrado.</div>`}
  else{
    const W=560,H=240,L=40,R=16,T=14,B=30;const iw=W-L-R,ih=H-T-B;
    const x=i=>L+(pts.length===1?iw/2:i*iw/(pts.length-1)); const y=p=>T+ih-(p/100)*ih;
    let g="";[0,25,50,75,100].forEach(v=>{g+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L-8}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="var(--ink-3)">${v}%</text>`});
    const step=Math.ceil(pts.length/6);
    pts.forEach((d,i)=>{if(i%step===0||i===pts.length-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--ink-3)">${fmt(d.s.data)}</text>`});
    const path=pts.map((d,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(d.p).toFixed(1)).join(" ");
    const area=pts.length>1?`<path d="${path} L${x(pts.length-1)} ${y(0)} L${x(0)} ${y(0)} Z" fill="var(--navy)" opacity=".10"/>`:"";
    const last=pts[pts.length-1];
    g+=area+`<path d="${path}" fill="none" stroke="var(--c-port)" stroke-width="2" stroke-linejoin="round"/>`;
    pts.forEach((d,i)=>{g+=`<circle cx="${x(i)}" cy="${y(d.p)}" r="${i===pts.length-1?5:4}" fill="var(--c-port)" stroke="var(--surface)" stroke-width="2"/>`});
    g+=`<text x="${Math.min(x(pts.length-1),W-R-4)}" y="${y(last.p)-10}" text-anchor="end" font-size="12" font-weight="600" fill="var(--ink)">${last.p.toFixed(0)}%</text>`;
    pts.forEach((d,i)=>{const w=pts.length===1?iw:iw/(pts.length-1);g+=`<rect class="hit" data-i="${i}" x="${x(i)-w/2}" y="${T}" width="${w}" height="${ih}" fill="transparent"/>`});
    box.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Aproveitamento total por simulado">${g}</svg><div class="tip" hidden></div>`;
    const tip=box.querySelector(".tip");
    box.querySelectorAll(".hit").forEach(r=>{r.addEventListener("mouseenter",()=>{const i=+r.dataset.i,d=pts[i];const svg=box.querySelector("svg").getBoundingClientRect();const k=svg.width/W;tip.innerHTML=`<b>${d.p.toFixed(1).replace(".",",")}%</b> · ${esc(d.s.nome||"Simulado")} · ${fmt(d.s.data)}`;tip.style.left=x(i)*k+"px";tip.style.top=y(d.p)*k+"px";tip.hidden=false});r.addEventListener("mouseleave",()=>tip.hidden=true)});
  }
  // barras por matéria (média dos 3 últimos)
  const recent=items.slice(-3);
  const bars=MAT.filter(m=>m.id!=="red").map(m=>{let a=0,t=0;recent.forEach(s=>{const r=s.r[m.id];if(r){a+=r[0];t+=r[1]}});return {m,p:t?a/t*100:null}});
  const reds=recent.filter(s=>s.red!=null);
  $("#sim-bars").innerHTML=recent.length?bars.map(b=>`<div class="hbar"><span>${esc(b.m.nome)}</span><div class="bar" style="height:10px"><i style="width:${b.p??0}%;background:var(--navy)"></i></div><span class="num" style="text-align:right">${b.p==null?"–":b.p.toFixed(0)+"%"}</span></div>`).join("")+(reds.length?`<div class="hbar"><span>Redação</span><div class="bar" style="height:10px"><i style="width:${reds.reduce((s,x)=>s+x.red,0)/reds.length*10}%;background:var(--navy)"></i></div><span class="num" style="text-align:right">${(reds.reduce((s,x)=>s+x.red,0)/reds.length).toFixed(1).replace(".",",")}</span></div>`:"")+`<p class="small muted" style="margin:4px 0 0">Matérias abaixo de 60% merecem blocos extras de questões na próxima semana.</p>`:`<div class="empty">Sem simulados ainda.</div>`;
  // tabela
  const rows=items.slice().reverse();
  $("#sim-table").innerHTML=rows.length?`<table class="data"><thead><tr><th>Data</th><th>Simulado</th>${MAT.filter(m=>m.id!=="red").map(m=>`<th style="text-align:right">${esc(m.nome.split(" ")[0].replace(".",""))}</th>`).join("")}<th style="text-align:right">Redação</th><th style="text-align:right">Total</th><th></th></tr></thead><tbody>${rows.map(s=>{const p=simPct(s);return `<tr><td class="num">${fmt(s.data)}</td><td>${esc(s.nome||"Simulado")}</td>${MAT.filter(m=>m.id!=="red").map(m=>{const r=s.r[m.id];return `<td class="n">${r?r[0]+"/"+r[1]:"–"}</td>`}).join("")}<td class="n">${s.red==null?"–":String(s.red).replace(".",",")}</td><td class="n"><b>${p==null?"–":p.toFixed(0)+"%"}</b></td><td>${simDel===s.id?`<span class="confirm"><button class="danger" data-sy="${s.id}">Apagar</button><button data-sn>Cancelar</button></span>`:`<button class="ghost" data-sd="${s.id}" aria-label="Apagar simulado">Apagar</button>`}</td></tr>`}).join("")}</tbody></table>`:`<div class="empty">Os simulados registrados aparecem aqui.</div>`;
  $("#sim-table").querySelectorAll("[data-sd]").forEach(b=>b.onclick=()=>{simDel=b.dataset.sd;rSim()});
  $("#sim-table").querySelectorAll("[data-sn]").forEach(b=>b.onclick=()=>{simDel=null;rSim()});
  $("#sim-table").querySelectorAll("[data-sy]").forEach(b=>b.onclick=()=>{S.simulados.items=S.simulados.items.filter(s=>s.id!==b.dataset.sy);simDel=null;save("simulados");rSim()});
}

/* ---------- Questões ---------- */
const QSEED=[
 {id:"s-p1",m:"port",a:"Regência verbal e nominal; crase",t:"me",e:"Assinale a alternativa em que o acento grave indicativo de crase está empregado de acordo com a norma-padrão.",o:["O policial foi à pé até a viatura.","O relatório foi entregue à todas as equipes.","O candidato chegou à delegacia antes das oito horas.","A equipe começou à patrulhar o bairro cedo.","O soldado ficou frente à frente com o suspeito."],g:2,c:"“Chegar a” + “a delegacia” = à. Não há crase antes de palavra masculina (pé), de pronome indefinido (todas), de verbo (patrulhar) nem em expressões com palavras repetidas (frente a frente)."},
 {id:"s-p2",m:"port",a:"Concordância verbal e nominal",t:"ce",e:"Na frase “Fazem dois anos que o concurso foi realizado”, a concordância verbal está de acordo com a norma-padrão.",g:false,c:"Errado. O verbo “fazer” indicando tempo decorrido é impessoal e fica no singular: “Faz dois anos que…”."},
 {id:"s-p3",m:"port",a:"Colocação pronominal",t:"me",e:"Assinale a frase correta quanto à colocação pronominal, segundo a norma-padrão.",o:["Me disseram que a prova será adiada.","Não conheço-o pessoalmente.","Ninguém avisou-nos do horário.","Quando o vi, reconheci-o imediatamente.","O candidato tinha esforçado-se muito."],g:3,c:"“Quando” (conjunção subordinativa) atrai o pronome: “quando o vi”. Na oração principal, iniciada pelo verbo, usa-se ênclise: “reconheci-o”. Não se inicia frase com pronome oblíquo (A), palavras negativas atraem o pronome (B e C) e não há ênclise com particípio (E)."},
 {id:"s-p4",m:"port",a:"Pontuação",t:"ce",e:"Em “Os candidatos, aprovados na primeira fase, farão o teste físico”, a retirada das vírgulas altera o sentido da frase.",g:true,c:"Certo. Com vírgulas, o trecho é explicativo (todos os candidatos foram aprovados). Sem vírgulas, passa a ser restritivo (só os aprovados farão o teste)."},
 {id:"s-p5",m:"port",a:"Semântica: sinonímia, antonímia e sentido figurado",t:"me",e:"Na frase “O soldado agiu com prudência diante da ocorrência”, a palavra “prudência” pode ser substituída, sem alteração de sentido, por:",o:["imprudência","cautela","rapidez","ousadia","indiferença"],g:1,c:"Prudência é sinônimo de cautela, precaução. “Imprudência” é o antônimo."},
 {id:"s-p6",m:"port",a:"Regência verbal e nominal; crase",t:"me",e:"Assinale a alternativa correta quanto à regência verbal, segundo a norma-padrão.",o:["Prefiro estudar do que trabalhar.","Assisti o jogo ontem à noite.","O cidadão obedeceu às leis de trânsito.","Esqueci do compromisso.","Ele aspirava o cargo de sargento."],g:2,c:"“Obedecer” pede a preposição “a”: obedecer às leis. Corrigindo as outras: prefiro estudar a trabalhar; assisti ao jogo; esqueci o compromisso (ou esqueci-me do); aspirava ao cargo."},
 {id:"s-m1",m:"mat",a:"Razão, proporção e porcentagem",t:"me",e:"Um produto custava R$ 200,00. Ele sofreu um aumento de 10% e, em seguida, um desconto de 10% sobre o novo preço. O preço final é:",o:["R$ 200,00","R$ 198,00","R$ 202,00","R$ 180,00","R$ 196,00"],g:1,c:"200 × 1,10 = 220. Depois, 220 × 0,90 = 198. Aumento e desconto de mesma taxa não se anulam."},
 {id:"s-m2",m:"mat",a:"Regra de três simples e composta",t:"me",e:"Seis operários constroem um muro em 10 dias. Mantido o mesmo ritmo de trabalho, quantos dias 4 operários levariam para construir o mesmo muro?",o:["12","15","8","18","20"],g:1,c:"Grandezas inversamente proporcionais: 6 × 10 = 4 × x, logo x = 15 dias."},
 {id:"s-m3",m:"mat",a:"Tabela-verdade, equivalências e negações",t:"ce",e:"A negação da proposição “Todo policial é disciplinado” é “Nenhum policial é disciplinado”.",g:false,c:"Errado. A negação de “Todo A é B” é “Algum A não é B”: “Algum policial não é disciplinado”."},
 {id:"s-m4",m:"mat",a:"Tabela-verdade, equivalências e negações",t:"me",e:"Uma proposição logicamente equivalente a “Se chove, então a rua fica molhada” é:",o:["Se a rua fica molhada, então chove.","Se não chove, então a rua não fica molhada.","Se a rua não fica molhada, então não chove.","Chove e a rua não fica molhada.","Não chove e a rua fica molhada."],g:2,c:"A contrapositiva (~q → ~p) é equivalente a p → q. Outra equivalência é “Não chove ou a rua fica molhada”. A alternativa D é a negação."},
 {id:"s-m6",m:"mat",a:"Análise combinatória e probabilidade",t:"ce",e:"Ao lançar dois dados comuns, não viciados, a probabilidade de a soma das faces ser 7 é de 1/6.",g:true,c:"Certo. São 36 resultados possíveis e 6 dão soma 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6/36 = 1/6."},
 {id:"s-m7",m:"mat",a:"Sequências lógicas e problemas",t:"me",e:"Na sequência 2, 6, 12, 20, 30, …, o próximo termo é:",o:["40","42","44","36","48"],g:1,c:"As diferenças crescem de 2 em 2: +4, +6, +8, +10, então o próximo é +12: 30 + 12 = 42."},
 {id:"s-m8",m:"mat",a:"Quantificadores e diagramas lógicos",t:"ce",e:"Considere as premissas: “Todo soldado é disciplinado” e “Algum atleta é soldado”. A partir delas, conclui-se corretamente que algum atleta é disciplinado.",g:true,c:"Certo. O atleta que é soldado está dentro do conjunto dos soldados, que está inteiro dentro do conjunto dos disciplinados. Logo, esse atleta é disciplinado."},
 {id:"s-m9",m:"mat",a:"Lógica de argumentação",t:"me",e:"Considere o argumento: “Se Pedro estuda, então passa no concurso. Pedro não passou no concurso.” Uma conclusão válida é:",o:["Pedro estudou.","Pedro não estudou.","Pedro passará no próximo concurso.","Pedro estudou, mas não o suficiente.","Nada se pode concluir."],g:1,c:"Modus tollens: de p → q e ~q, conclui-se ~p. Se ele não passou, não estudou."},
 {id:"s-h1",m:"hist",a:"Insurreição Pernambucana e Batalhas dos Guararapes",t:"me",e:"As Batalhas dos Guararapes (1648 e 1649) estão associadas a qual episódio da história de Pernambuco?",o:["Guerra dos Mascates","Insurreição Pernambucana contra o domínio holandês","Revolução Praieira","Confederação do Equador","Revolução Pernambucana de 1817"],g:1,c:"As batalhas foram decisivas na Insurreição Pernambucana, que levou à expulsão dos holandeses em 1654."},
 {id:"s-h2",m:"hist",a:"Domínio holandês e governo de Nassau",t:"ce",e:"Durante o governo de Maurício de Nassau (1637–1644), o Recife passou por obras urbanas e recebeu artistas e cientistas europeus.",g:true,c:"Certo. Nassau promoveu obras como pontes e palácios e trouxe pintores e naturalistas, como Frans Post e Albert Eckhout."},
 {id:"s-h3",m:"hist",a:"Guerra dos Mascates (1710–1711)",t:"me",e:"A Guerra dos Mascates (1710–1711) opôs:",o:["senhores de engenho de Olinda e comerciantes portugueses do Recife","indígenas e missionários jesuítas","holandeses e portugueses","liberais e conservadores do Império","escravizados e senhores de engenho"],g:0,c:"O conflito começou com a elevação do Recife à condição de vila, o que contrariou a aristocracia açucareira de Olinda. “Mascates” era o apelido dado aos comerciantes do Recife."},
 {id:"s-h4",m:"hist",a:"Confederação do Equador (1824)",t:"ce",e:"A Confederação do Equador (1824) foi um movimento republicano e separatista que reagiu ao autoritarismo de D. Pedro I após a outorga da Constituição de 1824.",g:true,c:"Certo. Teve Frei Caneca entre seus líderes e foi duramente reprimida."},
 {id:"s-h5",m:"hist",a:"Capitania de Pernambuco e Duarte Coelho",t:"me",e:"O primeiro donatário da Capitania de Pernambuco (Nova Lusitânia) foi:",o:["Martim Afonso de Sousa","Duarte Coelho","Tomé de Sousa","Mem de Sá","Vasco Fernandes Coutinho"],g:1,c:"Duarte Coelho recebeu a capitania em 1534 e fundou Olinda. Tomé de Sousa foi o primeiro governador-geral."},
 {id:"s-h6",m:"hist",a:"Revolução Pernambucana de 1817",t:"ce",e:"A Revolução Pernambucana de 1817 ocorreu após a Independência do Brasil e tinha como objetivo restaurar o poder português.",g:false,c:"Errado. Ocorreu antes da Independência (1822), foi contra a Coroa portuguesa e tinha caráter republicano."},
 {id:"s-h7",m:"hist",a:"Revolução Praieira (1848)",t:"me",e:"A Revolução Praieira (1848), última grande revolta do período imperial em Pernambuco, recebeu esse nome porque:",o:["seus líderes se reuniam na praia de Boa Viagem","o jornal do grupo liberal ficava na Rua da Praia, no Recife","o movimento começou na ilha de Itamaracá","era formada principalmente por pescadores","defendia a construção de novos portos"],g:1,c:"O jornal Diário Novo, dos liberais, funcionava na Rua da Praia. Daí o nome “praieiros”."},
 {id:"s-c1",m:"const",a:"Princípios fundamentais (arts. 1º a 4º)",t:"me",e:"São fundamentos da República Federativa do Brasil, conforme o art. 1º da CF/88, EXCETO:",o:["a soberania","a cidadania","a dignidade da pessoa humana","o pluralismo político","garantir o desenvolvimento nacional"],g:4,c:"“Garantir o desenvolvimento nacional” é objetivo fundamental (art. 3º). Os fundamentos são soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa e pluralismo político (SO-CI-DI-VA-PLU)."},
 {id:"s-c2",m:"const",a:"Direitos e deveres individuais e coletivos (art. 5º)",t:"ce",e:"Segundo a CF/88, a casa é asilo inviolável do indivíduo, ninguém nela podendo penetrar sem consentimento do morador, salvo em caso de flagrante delito ou desastre, para prestar socorro, ou, durante o dia, por determinação judicial.",g:true,c:"Certo. É o texto do art. 5º, XI. Atenção: a ordem judicial só autoriza a entrada durante o dia."},
 {id:"s-c3",m:"const",a:"Remédios constitucionais",t:"me",e:"O remédio constitucional adequado para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros ou bancos de dados de entidades governamentais ou de caráter público, é o:",o:["habeas corpus","mandado de segurança","habeas data","mandado de injunção","ação popular"],g:2,c:"Habeas data (art. 5º, LXXII). Habeas corpus protege a liberdade de locomoção; mandado de injunção supre falta de norma regulamentadora."},
 {id:"s-c4",m:"const",a:"Militares dos Estados (art. 42)",t:"ce",e:"De acordo com a CF/88, os membros das Polícias Militares e Corpos de Bombeiros Militares, instituições organizadas com base na hierarquia e disciplina, são militares dos Estados, do Distrito Federal e dos Territórios.",g:true,c:"Certo. É o caput do art. 42."},
 {id:"s-c5",m:"const",a:"Segurança Pública (art. 144)",t:"me",e:"Conforme o art. 144 da CF/88, cabem às polícias militares:",o:["as funções de polícia judiciária e a apuração de infrações penais","a polícia ostensiva e a preservação da ordem pública","o patrulhamento ostensivo das rodovias federais","exclusivamente a execução de atividades de defesa civil","a segurança dos estabelecimentos penais"],g:1,c:"Art. 144, § 5º. Polícia judiciária é das polícias civis; rodovias federais, da PRF; defesa civil, dos bombeiros militares; estabelecimentos penais, das polícias penais."},
 {id:"s-c6",m:"const",a:"Administração Pública (arts. 37 a 41)",t:"ce",e:"Os princípios expressos da Administração Pública no caput do art. 37 da CF/88 são legalidade, impessoalidade, moralidade, publicidade e eficiência.",g:true,c:"Certo. Mnemônico: LIMPE."},
 {id:"s-c7",m:"const",a:"Militares dos Estados (art. 42)",t:"ce",e:"Ao militar são proibidas a sindicalização e a greve, vedação que se aplica também aos policiais militares estaduais.",g:true,c:"Certo. Art. 142, § 3º, IV, aplicado aos militares dos Estados pelo art. 42, § 1º."},
 {id:"s-i1",m:"info",a:"Windows: arquivos, pastas e atalhos",t:"me",e:"No Windows e na maioria dos programas, o atalho Ctrl + Z serve para:",o:["refazer a última ação","desfazer a última ação","colar","recortar","salvar o arquivo"],g:1,c:"Ctrl + Z desfaz. Ctrl + Y refaz, Ctrl + V cola, Ctrl + X recorta e Ctrl + S (ou Ctrl + B no Word em português) salva."},
 {id:"s-i2",m:"info",a:"Planilhas (Excel / Calc)",t:"me",e:"Em uma planilha do Excel, as células A1, A2 e A3 contêm, respectivamente, 2, 4 e 6. A fórmula =SOMA(A1:A3) retorna:",o:["6","12","4","3","246"],g:1,c:"O intervalo A1:A3 inclui as três células: 2 + 4 + 6 = 12."},
 {id:"s-i3",m:"info",a:"Segurança da informação, vírus e malware",t:"ce",e:"Phishing é uma técnica em que o golpista tenta obter dados pessoais e financeiros da vítima por meio de mensagens e páginas falsas que imitam instituições conhecidas.",g:true,c:"Certo. É um golpe de engenharia social, normalmente por e-mail, SMS ou mensageiros."},
 {id:"s-i4",m:"info",a:"Correio eletrônico",t:"me",e:"Ao enviar um e-mail, o campo que permite incluir destinatários que receberão a mensagem sem que os demais vejam seus endereços é o:",o:["Para","Cc","Cco","Assunto","Anexo"],g:2,c:"Cco (cópia carbono oculta). Os endereços em Cc ficam visíveis para todos."},
 {id:"s-i5",m:"info",a:"Backup e armazenamento em nuvem",t:"ce",e:"O backup incremental copia todos os arquivos selecionados, independentemente de terem sido alterados desde o último backup.",g:false,c:"Errado. Isso descreve o backup completo (normal). O incremental copia só o que mudou desde o último backup, seja completo ou incremental."},
 {id:"s-i6",m:"info",a:"Planilhas (Excel / Calc)",t:"me",e:"No Excel em português, a fórmula que calcula a média dos valores das células B2 até B10 é:",o:["=MÉDIA(B2:B10)","=SOMA(B2;B10)/2","=MED(B2:B10)","=MÉDIA(B2;B10)","=MEDIA[B2:B10]"],g:0,c:"Dois-pontos indicam intervalo. Ponto e vírgula separa células avulsas, então =MÉDIA(B2;B10) usaria só duas células. MED calcula a mediana."},
 {id:"s-d1",m:"dh",a:"Declaração Universal dos Direitos Humanos (1948)",t:"me",e:"A Declaração Universal dos Direitos Humanos foi adotada pela Assembleia Geral da ONU em:",o:["1945","1948","1966","1969","1988"],g:1,c:"10 de dezembro de 1948. Em 1945 foi criada a ONU; em 1966, os Pactos Internacionais; em 1969, o Pacto de San José."},
 {id:"s-d2",m:"dh",a:"Dimensões (gerações) dos direitos humanos",t:"ce",e:"Os direitos de primeira dimensão estão ligados à liberdade, como os direitos civis e políticos, e exigem principalmente uma abstenção do Estado.",g:true,c:"Certo. Primeira dimensão: liberdade. Segunda: igualdade (direitos sociais, prestações do Estado). Terceira: fraternidade (direitos difusos)."},
 {id:"s-d3",m:"dh",a:"Lei de Tortura (Lei 9.455/1997)",t:"me",e:"De acordo com a CF/88, o crime de tortura é:",o:["afiançável e suscetível de graça","inafiançável e insuscetível de graça ou anistia","imprescritível","punido apenas com multa","de menor potencial ofensivo"],g:1,c:"Art. 5º, XLIII. Atenção: a tortura não é imprescritível. Imprescritíveis são o racismo e a ação de grupos armados contra a ordem constitucional."},
 {id:"s-d4",m:"dh",a:"Pacto de San José da Costa Rica",t:"ce",e:"Pacto de San José da Costa Rica é o nome pelo qual também é conhecida a Convenção Americana sobre Direitos Humanos, de 1969.",g:true,c:"Certo. O Brasil a promulgou em 1992 (Decreto 678)."},
 {id:"s-d5",m:"dh",a:"Uso da força e de armas de fogo (Princípios Básicos da ONU)",t:"me",e:"Segundo os Princípios Básicos sobre o Uso da Força e Armas de Fogo pelos Funcionários Responsáveis pela Aplicação da Lei (ONU, 1990), esses funcionários devem, sempre que possível:",o:["usar a arma de fogo como primeiro recurso","recorrer a meios não violentos antes de usar a força e armas de fogo","dispensar a advertência prévia em qualquer situação","aplicar a proporcionalidade apenas contra adultos","adiar o socorro aos feridos para preservar o local"],g:1,c:"Os Princípios determinam o uso de meios não violentos antes da força, proporcionalidade, advertência quando possível e socorro rápido aos feridos."},
 {id:"s-d6",m:"dh",a:"Lei de Abuso de Autoridade (Lei 13.869/2019)",t:"ce",e:"Segundo a Lei 13.869/2019, a divergência na interpretação de lei ou na avaliação de fatos e provas, por si só, não configura abuso de autoridade.",g:true,c:"Certo. Art. 1º, § 2º, da lei."}
];
QSEED.forEach(q=>q.b="Exemplos do QG");
const QOFC=(window.QG_OFICIAIS&&Array.isArray(window.QG_OFICIAIS.questoes))?window.QG_OFICIAIS.questoes:[];
const QFONTES=(window.QG_OFICIAIS&&window.QG_OFICIAIS.fontes)||[];
const QBUILT=new Set(QSEED.concat(QOFC).map(q=>q.id));
const QBANCAS=["Cebraspe","FGV","Vunesp","FCC","IBFC","Instituto AOCP","IAUPE","Idecan","Consulplan","Fundatec","Quadrix","Cesgranrio"];
const QMAT=MAT.filter(m=>m.id!=="red");
const LET="ABCDE";
const QF0=()=>({m:[],a:"",b:[],t:"",s:"",y:"",q:""});
const ICON_CUT=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/></svg>`;
let qTab="resolver",qPage=0,qOrder=null,qSel={},qShown={},qStrike={},qEdit=null,qProvaIdx=0,qView=null,qTick=null,qPaused=false,qCfg=null,qRevF="all",qParsed=null,qbPage=0,qbDel=null,qbDelAll=false,qpDel=null,qbKeep=null;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const qNorm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim();
const qB=q=>q.b||"Sem banca";
const qNewId=()=>"u"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function fmtDur(s){s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${pad(m)}:${pad(x)}`:`${pad(m)}:${pad(x)}`}
function qAll(){return (S.questoes.oficiais!==false?QOFC:[]).concat(S.questoes.exemplos!==false?QSEED:[],S.questoes.custom)}
function qIndex(){const m={};QSEED.forEach(q=>m[q.id]=q);QOFC.forEach(q=>m[q.id]=q);S.questoes.custom.forEach(q=>m[q.id]=q);return m}
function qLast(id){const h=S.questoes.resp[id];return h&&h.length?h[h.length-1]:null}
function qRecord(q,ans,src){const ok=ans===q.g;const h=S.questoes.resp[q.id]||(S.questoes.resp[q.id]=[]);h.push([Date.now(),ans,ok?1:0,src||"r"]);if(h.length>8)h.splice(0,h.length-8);return ok}
function qAnsLabel(q,a){return a==null?"em branco":q.t==="ce"?(a?"Certo":"Errado"):LET[a]}
function qBancas(){return [...new Set(qAll().map(qB))].sort((a,b)=>a.localeCompare(b,"pt"))}
function qFilter(f,list){
  const txt=qNorm(f.q);
  return (list||qAll()).filter(q=>{
    if(f.m.length&&!f.m.includes(q.m))return false;
    if(f.a&&q.a!==f.a)return false;
    if(f.b.length&&!f.b.includes(qB(q)))return false;
    if(f.t&&q.t!==f.t)return false;
    if(f.y&&String(q.y||"")!==f.y)return false;
    if(f.s){const l=qLast(q.id);if(f.s==="nova"&&l)return false;if(f.s==="errei"&&!(l&&!l[2]))return false;if(f.s==="acertei"&&!(l&&l[2]))return false}
    if(txt&&!qNorm(q.e+" "+(q.o||[]).join(" ")+" "+(q.a||"")+" "+qB(q)).includes(txt))return false;
    return true;
  });
}
const qParseAns=s=>s==="C"?true:s==="E"?false:+s;

/* Cartão de questão: mode r = resolver, p = simulado em andamento, rev = correção */
function qCard(q,num,o){
  const m=MATBY[q.m]||{nome:q.m,c:"--ink-3"};
  const sel=o.sel,show=o.mode==="rev"||(o.mode==="r"&&o.show);const st=qStrike[q.id]||[];
  const dis=show;
  const cls=v=>{let c="";if(show){if(v===q.g)c+=" right";else if(v===sel)c+=" wrong"}if(!show&&st.includes(v))c+=" struck";return c};
  let opts;
  if(q.t==="ce")opts=`<div class="ce">${[true,false].map(v=>`<button type="button" class="opt${cls(v)}" data-ans="${v?"C":"E"}" aria-pressed="${sel===v}" ${dis?"disabled":""}><b>${v?"C":"E"}</b><span>${v?"Certo":"Errado"}</span></button>`).join("")}</div>`;
  else opts=`<div class="qopts">${(q.o||[]).map((t,i)=>`<div class="optrow"><button type="button" class="opt${cls(i)}" data-ans="${i}" aria-pressed="${sel===i}" ${dis?"disabled":""}><b>${LET[i]}</b><span>${esc(t)}</span></button>${dis?"":`<button type="button" class="strike" data-strike="${i}" title="Riscar alternativa" aria-label="Riscar alternativa ${LET[i]}" aria-pressed="${st.includes(i)}">${ICON_CUT}</button>`}</div>`).join("")}</div>`;
  const h=S.questoes.resp[q.id]||[];
  const hist=o.mode==="r"&&h.length?`<span class="qhist">Você acertou ${h.filter(x=>x[2]).length} de ${h.length}</span>`:"";
  let foot="";
  if(o.mode==="r"){
    const custom=!QBUILT.has(q.id);
    foot=`<div class="row">${show?`<span class="qres ${sel===q.g?"ok":"no"}">${sel===q.g?"Você acertou!":"Você errou. Gabarito: "+qAnsLabel(q,q.g)}</span><button type="button" data-act="refazer">Refazer</button>`:`<button type="button" class="primary" data-act="responder" ${sel==null?"disabled":""}>Responder</button>`}${custom?`<button type="button" class="ghost" data-act="editar" style="margin-left:auto">Editar</button>`:""}</div>`;
  }else if(o.mode==="rev"){
    foot=`<div class="row"><span class="qres ${sel==null?"":sel===q.g?"ok":"no"}">${sel==null?"Em branco. Gabarito: "+qAnsLabel(q,q.g):sel===q.g?"Acertou":"Errou. Você marcou "+qAnsLabel(q,sel)+", gabarito "+qAnsLabel(q,q.g)}</span></div>`;
  }
  const com=show?(q.c?`<div class="qcom"><b>Comentário.</b> ${esc(q.c)}</div>`:`<div class="qcom muted">Sem comentário para esta questão.</div>`):"";
  return `<article class="q" data-qid="${esc(q.id)}" data-num="${num}" style="--c:var(${m.c})">
    <header class="qh"><span class="qn">${num}</span><span class="chip"><span class="dot"></span>${esc(m.nome)}</span>${q.a?`<span>${esc(q.a)}</span>`:""}<span class="tag">${esc(qB(q))}${q.p?" · "+esc(q.p):q.y?" · "+q.y:""}</span><span class="tag">${q.t==="ce"?"Certo/Errado":"A–"+LET[Math.max(1,(q.o||[]).length-1)]}</span>${hist}</header>
    ${q.x?`<details class="qx"><summary>${esc(q.x.split("\n")[0])} · texto de apoio</summary><div>${esc(q.x.split("\n").slice(1).join("\n").trim())}</div></details>`:""}<div class="qe">${esc(q.e)}</div>${opts}${foot}${com}</article>`;
}

function rQuest(){
  const a=S.questoes.ativo;
  rQResumo();
  if(a&&!qPaused)return rQProva();
  clearInterval(qTick);qTick=null;
  if(qView)return rQResult();
  const tabs=[["resolver","Resolver"],["gerar","Gerar simulado"],["banco","Meu banco"],["desempenho","Desempenho"]];
  $("#q-root").innerHTML=`${a?`<div class="continue"><div style="flex:1;min-width:200px"><span class="k">Simulado pausado</span><strong>${esc(a.nome)}</strong><span class="small" style="opacity:.8">${a.resp.filter(v=>v!=null).length} de ${a.qids.length} respondidas · ${fmtDur(a.gasto)} de prova</span></div><button type="button" id="qa-go">Continuar</button><button type="button" class="ghost" id="qa-del" style="color:#fff">Descartar</button></div><div id="qa-confirm"></div>`:""}
    <div class="segs" role="tablist" aria-label="Seções de questões">${tabs.map(([k,n])=>`<button type="button" role="tab" data-qt="${k}" aria-selected="${qTab===k}">${n}</button>`).join("")}</div>
    <div id="q-tab" style="display:grid;gap:16px"></div>`;
  document.querySelectorAll("[data-qt]").forEach(b=>b.onclick=()=>{qTab=b.dataset.qt;if(qTab!=="banco")qEdit=null;rQuest()});
  if(a){$("#qa-go").onclick=()=>{qPaused=false;rQuest();window.scrollTo(0,0)};
    $("#qa-del").onclick=()=>{$("#qa-confirm").innerHTML=`<div class="confirm notice">Descartar o simulado em andamento? As respostas dele serão perdidas. <button type="button" class="danger" id="qa-y">Descartar</button><button type="button" id="qa-n">Cancelar</button></div>`;$("#qa-n").onclick=()=>$("#qa-confirm").innerHTML="";$("#qa-y").onclick=()=>{S.questoes.ativo=null;qPaused=false;save("questoes");rQuest()}}}
  ({resolver:rQResolver,gerar:rQGerar,banco:rQBanco,desempenho:rQDesemp})[qTab]();
}

/* Resolver */
function rQResolver(){
  $("#q-tab").innerHTML=`<div class="panel" style="display:grid;gap:14px">
    <div class="spread"><h3>Filtros</h3><button type="button" class="ghost" id="qf-clear">Limpar filtros</button></div>
    <div style="display:grid;gap:6px"><div class="eyebrow">Matéria</div><div class="filters" id="qf-m"></div></div>
    <div style="display:grid;gap:6px"><div class="eyebrow">Banca</div><div class="filters" id="qf-b"></div></div>
    <div class="qfilters">
      <label class="f">Assunto<select id="qf-a"></select></label>
      <label class="f">Modelo<select id="qf-t"><option value="">Todos</option><option value="me">Múltipla escolha (A a E)</option><option value="ce">Certo ou errado</option></select></label>
      <label class="f">Situação<select id="qf-s"><option value="">Todas</option><option value="nova">Nunca resolvidas</option><option value="errei">Errei na última vez</option><option value="acertei">Acertei na última vez</option></select></label>
      <label class="f">Ano<select id="qf-y"></select></label>
      <label class="f">Buscar no texto<input type="search" id="qf-q" placeholder="Palavra-chave"></label>
    </div></div>
    <div class="spread"><span class="small muted num" id="qf-count"></span><button type="button" id="qf-shuf">${qOrder?"Ordem original":"Embaralhar"}</button></div>
    <div class="qlist" id="q-list"></div><div class="pager" id="q-pager"></div>`;
  qFillFilters();qList();
  const f=S.questoes.f;
  const changed=refill=>{qPage=0;saveSoon("questoes");if(refill)qFillFilters();qList()};
  $("#qf-m").onclick=e=>{const b=e.target.closest("[data-m]");if(!b)return;const k=f.m.indexOf(b.dataset.m);k<0?f.m.push(b.dataset.m):f.m.splice(k,1);changed(true)};
  $("#qf-b").onclick=e=>{const b=e.target.closest("[data-b]");if(!b)return;const k=f.b.indexOf(b.dataset.b);k<0?f.b.push(b.dataset.b):f.b.splice(k,1);changed(true)};
  $("#qf-a").onchange=e=>{f.a=e.target.value;changed()};
  $("#qf-t").onchange=e=>{f.t=e.target.value;changed()};
  $("#qf-s").onchange=e=>{f.s=e.target.value;changed()};
  $("#qf-y").onchange=e=>{f.y=e.target.value;changed()};
  $("#qf-q").oninput=e=>{f.q=e.target.value;changed()};
  $("#qf-clear").onclick=()=>{S.questoes.f=QF0();saveSoon("questoes");qPage=0;rQResolver()};
  $("#qf-shuf").onclick=()=>{if(qOrder)qOrder=null;else{qOrder={};shuffle(qAll()).forEach((q,i)=>qOrder[q.id]=i)}qPage=0;rQResolver()};
  $("#q-list").onclick=e=>qCardClick(e,"r");
  $("#q-pager").onclick=e=>{const b=e.target.closest("[data-pg]");if(!b)return;qPage+=b.dataset.pg==="next"?1:-1;qList();$("#qf-count").scrollIntoView({block:"start",behavior:"smooth"})};
}
function qFillFilters(){
  const f=S.questoes.f,all=qAll();
  f.b=f.b.filter(b=>qBancas().includes(b));
  $("#qf-m").innerHTML=QMAT.map(m=>`<button type="button" class="fchip" data-m="${m.id}" aria-pressed="${f.m.includes(m.id)}"><span class="dot" style="--c:var(${m.c});display:inline-block;margin-right:6px"></span>${esc(m.nome)}</button>`).join("");
  $("#qf-b").innerHTML=qBancas().map(b=>`<button type="button" class="fchip" data-b="${esc(b)}" aria-pressed="${f.b.includes(b)}">${esc(b)}</button>`).join("");
  const ms=f.m.length?f.m:QMAT.map(m=>m.id);
  $("#qf-a").innerHTML=`<option value="">Todos</option>`+ms.map(id=>{const m=MATBY[id];const cnt={};m.topicos.forEach(t=>cnt[t]=0);all.forEach(q=>{if(q.m===id&&q.a)cnt[q.a]=(cnt[q.a]||0)+1});return `<optgroup label="${esc(m.nome)}">${Object.entries(cnt).map(([a,n])=>`<option value="${esc(a)}">${esc(a)} (${n})</option>`).join("")}</optgroup>`}).join("");
  const sa=$("#qf-a");sa.value=f.a;if(sa.selectedIndex<0||sa.value!==f.a){sa.selectedIndex=0;f.a=""}
  const ys=[...new Set(all.map(q=>q.y).filter(Boolean))].sort((a,b)=>b-a);
  $("#qf-y").innerHTML=`<option value="">Todos</option>`+ys.map(y=>`<option>${y}</option>`).join("");
  $("#qf-y").value=f.y;if($("#qf-y").value!==f.y){f.y="";$("#qf-y").value=""}
  $("#qf-t").value=f.t;$("#qf-s").value=f.s;$("#qf-q").value=f.q;
}
function qList(){
  const f=S.questoes.f;let list=qFilter(f);
  if(qOrder)list=list.slice().sort((a,b)=>(qOrder[a.id]??1e9)-(qOrder[b.id]??1e9));
  const per=10,pages=Math.max(1,Math.ceil(list.length/per));if(qPage>=pages)qPage=pages-1;if(qPage<0)qPage=0;
  const sl=list.slice(qPage*per,qPage*per+per);
  $("#qf-count").textContent=`${list.length} ${list.length===1?"questão encontrada":"questões encontradas"}`;
  $("#q-list").innerHTML=sl.length?sl.map((q,i)=>qCard(q,qPage*per+i+1,{mode:"r",sel:qSel[q.id],show:qShown[q.id]})).join(""):`<div class="empty">Nenhuma questão com esses filtros. ${qAll().length?"Tente limpar os filtros ou adicione questões em Meu banco.":"Adicione questões em Meu banco."}</div>`;
  $("#q-pager").innerHTML=pages>1?`<button type="button" data-pg="prev" ${qPage===0?"disabled":""}>Anterior</button><span class="small muted num">Página ${qPage+1} de ${pages}</span><button type="button" data-pg="next" ${qPage>=pages-1?"disabled":""}>Próxima</button>`:"";
}
function qCardClick(e,mode){
  const art=e.target.closest("[data-qid]");if(!art)return;const id=art.dataset.qid;const q=qIndex()[id];if(!q)return;
  const st=e.target.closest("[data-strike]");
  if(st){const i=+st.dataset.strike;const a=qStrike[id]||(qStrike[id]=[]);const k=a.indexOf(i);k<0?a.push(i):a.splice(k,1);return mode==="p"?rQProva():qRefresh(art,q)}
  const op=e.target.closest("[data-ans]");
  if(op&&!op.disabled){const v=qParseAns(op.dataset.ans);
    if(mode==="p"){const a=S.questoes.ativo;a.resp[qProvaIdx]=a.resp[qProvaIdx]===v?null:v;saveSoon("questoes");return rQProva()}
    qSel[id]=qSel[id]===v?undefined:v;return qRefresh(art,q)}
  const act=e.target.closest("[data-act]");if(!act)return;
  if(act.dataset.act==="responder"){if(qSel[id]==null)return;qRecord(q,qSel[id],"r");qShown[id]=true;saveSoon("questoes");qRefresh(art,q);rQResumo()}
  else if(act.dataset.act==="refazer"){delete qShown[id];delete qSel[id];delete qStrike[id];qRefresh(art,q)}
  else if(act.dataset.act==="editar"){qEdit=id;qTab="banco";rQuest();window.scrollTo(0,0)}
}
function rQResumo(){const all=qAll();let tot=0,ok=0;for(const h of Object.values(S.questoes.resp))for(const x of h){tot++;ok+=x[2]}$("#q-resumo").textContent=`${all.length} ${all.length===1?"questão":"questões"} no banco${tot?` · ${Math.round(ok/tot*100)}% de acerto em ${tot} ${tot===1?"resposta":"respostas"}`:""}`}
function qRefresh(art,q){art.outerHTML=qCard(q,art.dataset.num,{mode:"r",sel:qSel[q.id],show:qShown[q.id]})}

/* Gerar simulado */
function qCfgDef(){return {nome:"",n:Object.fromEntries(QMAT.map(m=>[m.id,0])),b:[],t:"",prio:"mix",tempo:"",penal:false,log:true}}
function qPool(c,mid){return qFilter({m:[mid],a:"",b:c.b,t:c.t,y:"",q:"",s:c.prio==="nova"?"nova":c.prio==="errei"?"errei":""})}
function rQGerar(){
  if(!qCfg)qCfg=qCfgDef();const c=qCfg;c.b=c.b.filter(b=>qBancas().includes(b));
  $("#q-tab").innerHTML=`<div class="grid2">
   <div class="panel" style="display:grid;gap:14px;align-content:start">
     <h3>Montar simulado</h3>
     <label class="f">Nome<input type="text" id="g-nome" placeholder="Simulado de questões ${fmt(iso(today()))}"></label>
     <div style="display:grid;gap:6px"><div class="eyebrow">Banca</div><div class="filters" id="g-b">${qBancas().map(b=>`<button type="button" class="fchip" data-b="${esc(b)}" aria-pressed="${c.b.includes(b)}">${esc(b)}</button>`).join("")}</div><span class="small muted">Sem nenhuma marcada, entram todas.</span></div>
     <div class="qfilters">
       <label class="f">Modelo<select id="g-t"><option value="">Misturar os dois</option><option value="me">Só múltipla escolha (A a E)</option><option value="ce">Só certo ou errado</option></select></label>
       <label class="f">Quais questões<select id="g-prio"><option value="mix">Todas, sorteadas</option><option value="errfirst">Priorizar as que errei e as inéditas</option><option value="nova">Só as nunca resolvidas</option><option value="errei">Só as que errei</option></select></label>
     </div>
     <div style="display:grid;gap:8px"><div class="spread"><div class="eyebrow">Questões por matéria</div><div class="row" style="gap:6px"><span class="small muted">Distribuir:</span>${[10,20,40].map(n=>`<button type="button" class="fchip" data-pre="${n}">${n}</button>`).join("")}<button type="button" class="fchip" data-pre="all">Todas</button><button type="button" class="fchip" data-pre="0">Zerar</button></div></div><div class="gmat" id="g-mat"></div></div>
   </div>
   <div class="panel" style="display:grid;gap:14px;align-content:start">
     <h3>Regras</h3>
     <div class="row" style="align-items:end"><label class="f">Tempo limite (minutos)<input type="number" id="g-tempo" min="0" max="600" placeholder="Sem limite" style="width:150px"></label><button type="button" class="ghost" id="g-3min">3 min por questão</button></div>
     <label class="row small" style="gap:8px;flex-wrap:nowrap;align-items:flex-start"><input type="checkbox" id="g-penal" style="margin-top:3px"> <span>Certo ou errado: cada erro anula um acerto (estilo Cebraspe)</span></label>
     <label class="row small" style="gap:8px;flex-wrap:nowrap;align-items:flex-start"><input type="checkbox" id="g-log" style="margin-top:3px"> <span>Registrar o resultado na aba Simulados</span></label>
     <div><span class="big num" id="g-total">0</span> <span class="small muted">questões no simulado</span></div>
     <button type="button" class="primary" id="g-start">Gerar e começar</button>
     <p class="status" id="g-status" style="margin:0"></p>
   </div></div>`;
  $("#g-nome").value=c.nome;$("#g-t").value=c.t;$("#g-prio").value=c.prio;$("#g-tempo").value=c.tempo;$("#g-penal").checked=c.penal;$("#g-log").checked=c.log;
  const avail=()=>Object.fromEntries(QMAT.map(m=>[m.id,qPool(c,m.id).length]));
  const total=()=>{const t=QMAT.reduce((s,m)=>s+(c.n[m.id]||0),0);$("#g-total").textContent=t;return t};
  const mats=()=>{const av=avail();QMAT.forEach(m=>{c.n[m.id]=Math.min(c.n[m.id]||0,av[m.id])});
    $("#g-mat").innerHTML=QMAT.map(m=>`<label class="gm" style="--c:var(${m.c})"><span>${esc(m.nome)}</span><span class="small muted num">${av[m.id]} disponíve${av[m.id]===1?"l":"is"}</span><input type="number" min="0" max="${av[m.id]}" value="${c.n[m.id]||0}" data-gm="${m.id}" aria-label="Questões de ${esc(m.nome)}" ${av[m.id]?"":"disabled"}></label>`).join("");total()};
  mats();
  $("#g-mat").oninput=e=>{const i=e.target.closest("[data-gm]");if(!i)return;const mx=+i.max;let v=Math.max(0,Math.floor(+i.value||0));if(v>mx)v=mx;c.n[i.dataset.gm]=v;total()};
  $("#g-mat").onchange=e=>{const i=e.target.closest("[data-gm]");if(i)i.value=c.n[i.dataset.gm]};
  $("#g-b").onclick=e=>{const b=e.target.closest("[data-b]");if(!b)return;const k=c.b.indexOf(b.dataset.b);k<0?c.b.push(b.dataset.b):c.b.splice(k,1);b.setAttribute("aria-pressed",k<0);mats()};
  $("#g-t").onchange=e=>{c.t=e.target.value;mats()};
  $("#g-prio").onchange=e=>{c.prio=e.target.value;mats()};
  $("#g-nome").oninput=e=>c.nome=e.target.value;
  $("#g-tempo").oninput=e=>c.tempo=e.target.value;
  $("#g-penal").onchange=e=>c.penal=e.target.checked;
  $("#g-log").onchange=e=>c.log=e.target.checked;
  $("#g-3min").onclick=()=>{const t=total();if(!t){$("#g-status").textContent="Escolha as questões primeiro.";return}c.tempo=String(t*3);$("#g-tempo").value=c.tempo};
  document.querySelectorAll("[data-pre]").forEach(b=>b.onclick=()=>{const av=avail();const p=b.dataset.pre;
    if(p==="all"){QMAT.forEach(m=>c.n[m.id]=av[m.id])}
    else{QMAT.forEach(m=>c.n[m.id]=0);let left=+p;let progress=true;while(left>0&&progress){progress=false;for(const m of QMAT){if(left>0&&c.n[m.id]<av[m.id]){c.n[m.id]++;left--;progress=true}}}}
    mats()});
  $("#g-start").onclick=()=>{
    const ids=[];
    for(const m of QMAT){const k=c.n[m.id]||0;if(!k)continue;let pool=shuffle(qPool(c,m.id));
      if(c.prio==="errfirst"){const g=q=>{const l=qLast(q.id);return !l?1:l[2]?2:0};pool.sort((a,b)=>g(a)-g(b))}
      ids.push(...pool.slice(0,k).map(q=>q.id))}
    if(!ids.length){$("#g-status").textContent="Escolha quantas questões quer de pelo menos uma matéria.";return}
    const tempo=Math.max(0,+c.tempo||0);
    S.questoes.ativo={id:"q"+Date.now().toString(36),nome:c.nome.trim()||`Simulado de questões ${fmt(iso(today()))}`,qids:ids,resp:ids.map(()=>null),flag:[],gasto:0,limite:tempo*60,penal:c.penal,log:c.log};
    qProvaIdx=0;qPaused=false;qStrike={};save("questoes");rQuest();window.scrollTo(0,0);
  };
}

/* Simulado em andamento */
function qTimeUI(){const a=S.questoes.ativo,el=$("#p-time");if(!a||!el)return;
  if(a.limite){const r=a.limite-a.gasto;el.textContent=fmtDur(r);el.classList.toggle("low",r<=300);el.title="Tempo restante"}
  else{el.textContent=fmtDur(a.gasto);el.title="Tempo de prova"}}
function qStartTick(){if(qTick)return;qTick=setInterval(()=>{const a=S.questoes.ativo;
  if(!a||qPaused){clearInterval(qTick);qTick=null;return}
  if($("#v-questoes").hidden||document.hidden)return;
  a.gasto++;qTimeUI();if(a.gasto%10===0)saveSoon("questoes",2000);
  if(a.limite&&a.gasto>=a.limite){toast("Tempo esgotado. O simulado foi finalizado.");qFinish()}},1000)}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&S.questoes.ativo)lsSet("questoes",S.questoes)});
function rQProva(){
  const a=S.questoes.ativo,idx=qIndex(),n=a.qids.length;
  if(qProvaIdx>=n)qProvaIdx=n-1;if(qProvaIdx<0)qProvaIdx=0;
  const q=idx[a.qids[qProvaIdx]],fl=a.flag.includes(qProvaIdx);
  const answered=a.resp.filter(v=>v!=null).length;
  $("#q-root").innerHTML=`<div class="pbar" id="pbar"><div style="flex:1;min-width:160px"><div class="eyebrow" style="color:rgba(255,255,255,.7)">Simulado em andamento</div><strong style="overflow-wrap:anywhere">${esc(a.nome)}</strong></div>
      <div class="ptime num" id="p-time"></div><div class="small num">${answered}/${n} respondidas</div>
      <button type="button" id="p-pause">Pausar</button><button type="button" class="pfin" id="p-fin">Finalizar</button></div>
    <div id="p-confirm"></div>
    <div class="playout"><div style="display:grid;gap:12px;min-width:0">
      <div id="p-card">${q?qCard(q,qProvaIdx+1,{mode:"p",sel:a.resp[qProvaIdx]}):`<div class="empty">A questão ${qProvaIdx+1} foi removida do banco. Ela conta como em branco.</div>`}</div>
      <div class="spread"><button type="button" id="p-prev" ${qProvaIdx===0?"disabled":""}>← Anterior</button><button type="button" id="p-flag" aria-pressed="${fl}" class="${fl?"flagged":""}">${fl?"Marcada para revisar":"Marcar para revisar"}</button><button type="button" class="primary" id="p-next">${qProvaIdx===n-1?"Finalizar":"Próxima →"}</button></div>
      <p class="small muted" style="margin:0">Atalhos: A a E marcam a alternativa; C ou E nas de certo/errado; setas ← → mudam de questão. A tesoura risca alternativas que você descartou.</p>
    </div>
    <div class="panel" style="display:grid;gap:10px"><h3>Cartão-resposta</h3>
      <div class="sheet" id="p-sheet">${a.qids.map((id,i)=>`<button type="button" data-go="${i}" class="${a.resp[i]!=null?"ans":""}${i===qProvaIdx?" cur":""}${a.flag.includes(i)?" flag":""}" aria-label="Questão ${i+1}${a.resp[i]!=null?", respondida":""}${a.flag.includes(i)?", marcada para revisar":""}">${i+1}</button>`).join("")}</div>
      <div class="small muted row" style="gap:12px"><span><i class="sw sw-ans"></i>respondida</span><span><i class="sw sw-flag"></i>para revisar</span></div>
    </div></div>`;
  $("#pbar").style.top=($("header.top").offsetHeight+8)+"px";
  qTimeUI();qStartTick();
  $("#p-card").onclick=e=>qCardClick(e,"p");
  $("#p-sheet").onclick=e=>{const b=e.target.closest("[data-go]");if(b){qProvaIdx=+b.dataset.go;rQProva()}};
  $("#p-prev").onclick=()=>{qProvaIdx--;rQProva()};
  $("#p-next").onclick=()=>{if(qProvaIdx===n-1)qAskFinish();else{qProvaIdx++;rQProva()}};
  $("#p-flag").onclick=()=>{const k=a.flag.indexOf(qProvaIdx);k<0?a.flag.push(qProvaIdx):a.flag.splice(k,1);saveSoon("questoes");rQProva()};
  $("#p-pause").onclick=()=>{qPaused=true;save("questoes");rQuest();toast("Simulado pausado. O relógio parou.")};
  $("#p-fin").onclick=qAskFinish;
}
function qAskFinish(){const a=S.questoes.ativo;const bl=a.resp.filter(v=>v==null).length,fl=a.flag.length;
  $("#p-confirm").innerHTML=`<div class="confirm notice">${bl?`Faltam ${bl} ${bl===1?"questão":"questões"} sem resposta.`:"Todas as questões foram respondidas."}${fl?` ${fl} marcada${fl===1?"":"s"} para revisar.`:""} Finalizar e ver a correção? <button type="button" class="primary" id="pf-y">Finalizar</button><button type="button" id="pf-n">Continuar prova</button></div>`;
  $("#pf-n").onclick=()=>$("#p-confirm").innerHTML="";$("#pf-y").onclick=qFinish;
  $("#p-confirm").scrollIntoView({block:"center",behavior:"smooth"})}
function qFinish(){
  const a=S.questoes.ativo;if(!a)return;const idx=qIndex();
  clearInterval(qTick);qTick=null;
  const res={};let ok=0,err=0,bl=0,ceErr=0;
  a.qids.forEach((id,i)=>{const q=idx[id];const ans=a.resp[i];if(!q){bl++;return}
    const r=res[q.m]||(res[q.m]={a:0,e:0,t:0});r.t++;
    if(ans==null){bl++;return}
    if(qRecord(q,ans,"s")){r.a++;ok++}else{r.e++;err++;if(q.t==="ce")ceErr++}});
  const pr={id:a.id,nome:a.nome,data:iso(today()),qids:a.qids,resp:a.resp,gasto:a.gasto,limite:a.limite,penal:a.penal,res,ok,err,bl,ceErr};
  S.questoes.provas.push(pr);S.questoes.ativo=null;qPaused=false;qStrike={};
  if(a.log&&Object.keys(res).length){S.simulados.items.push({id:a.id,data:pr.data,nome:a.nome,r:Object.fromEntries(Object.entries(res).map(([k,v])=>[k,[v.a,v.t]])),red:null});save("simulados")}
  save("questoes");qView=pr.id;qRevF="all";rQuest();window.scrollTo(0,0);
}
document.addEventListener("keydown",e=>{
  if(!S.questoes.ativo||qPaused||$("#v-questoes").hidden||!$("#reader").hidden)return;
  if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;
  const a=S.questoes.ativo,q=qIndex()[a.qids[qProvaIdx]];
  if(e.key==="ArrowRight"&&qProvaIdx<a.qids.length-1){e.preventDefault();qProvaIdx++;rQProva();return}
  if(e.key==="ArrowLeft"&&qProvaIdx>0){e.preventDefault();qProvaIdx--;rQProva();return}
  if(!q)return;const k=e.key.toUpperCase();let v=null;
  if(q.t==="ce"){if(k==="C")v=true;else if(k==="E")v=false}
  else{const i=LET.indexOf(k);if(i>=0&&i<(q.o||[]).length&&k.length===1)v=i}
  if(v!==null){a.resp[qProvaIdx]=a.resp[qProvaIdx]===v?null:v;saveSoon("questoes");rQProva()}
});

/* Resultado e correção */
function rQResult(){
  const p=S.questoes.provas.find(x=>x.id===qView);if(!p){qView=null;return rQuest()}
  const idx=qIndex(),tot=p.qids.length,pct=tot?p.ok/tot*100:0;
  const liq=p.penal?p.ok-(p.ceErr||0):null;
  const items=p.qids.map((id,i)=>({q:idx[id],i,ans:p.resp[i]}));
  const pick=items.filter(x=>qRevF==="all"||(qRevF==="err"&&x.q&&x.ans!=null&&x.ans!==x.q.g)||(qRevF==="bl"&&x.ans==null)||(qRevF==="ok"&&x.q&&x.ans===x.q.g));
  const redo=items.filter(x=>x.q&&(x.ans==null||x.ans!==x.q.g));
  $("#q-root").innerHTML=`<div class="spread"><div><div class="eyebrow">Resultado</div><h3 style="font-size:22px">${esc(p.nome)}</h3><span class="small muted">${fmt(p.data)} · ${fmtDur(p.gasto)} de prova${p.limite?` (limite ${fmtDur(p.limite)})`:""}</span></div><button type="button" id="r-back">Voltar às questões</button></div>
    <div class="grid2">
      <div class="panel" style="display:grid;gap:14px;align-content:start">
        <div class="row" style="gap:28px;align-items:flex-end"><div><div class="big num">${pct.toFixed(0)}%</div><div class="small muted">de acerto</div></div>
        <div class="small" style="display:grid;gap:2px"><span><b class="num" style="color:var(--good)">${p.ok}</b> acertos</span><span><b class="num" style="color:var(--red)">${p.err}</b> erros</span><span><b class="num">${p.bl}</b> em branco</span>${liq!=null?`<span><b class="num">${liq}</b> de nota líquida (erros em certo/errado descontados)</span>`:""}</div></div>
        <div class="bar" style="height:10px"><i style="width:${pct}%;background:var(--good)"></i></div>
        <div class="row"><button type="button" class="primary" id="r-redo" ${redo.length?"":"disabled"}>Refazer erradas e em branco (${redo.length})</button></div>
      </div>
      <div class="panel" style="display:grid;gap:10px"><h3>Por matéria</h3><div class="hbars">${QMAT.filter(m=>p.res[m.id]).map(m=>{const r=p.res[m.id];const pc=r.t?r.a/r.t*100:0;return `<div class="hbar"><span>${esc(m.nome)}</span><div class="bar" style="height:10px"><i style="width:${pc}%;background:var(${m.c})"></i></div><span class="num" style="text-align:right">${r.a}/${r.t}</span></div>`}).join("")}</div></div>
    </div>
    <div class="spread"><h3>Correção</h3><div class="filters" id="r-f">${[["all","Todas"],["err","Erradas"],["bl","Em branco"],["ok","Certas"]].map(([k,n])=>`<button type="button" class="fchip" data-rf="${k}" aria-pressed="${qRevF===k}">${n}</button>`).join("")}</div></div>
    <div class="qlist">${pick.length?pick.map(x=>x.q?qCard(x.q,x.i+1,{mode:"rev",sel:x.ans}):`<div class="empty">Questão ${x.i+1}: removida do banco.</div>`).join(""):`<div class="empty">Nenhuma questão neste filtro.</div>`}</div>`;
  $("#r-back").onclick=()=>{qView=null;rQuest();window.scrollTo(0,0)};
  $("#r-f").onclick=e=>{const b=e.target.closest("[data-rf]");if(b){qRevF=b.dataset.rf;rQResult()}};
  $("#r-redo").onclick=()=>{if(S.questoes.ativo){toast("Finalize ou descarte o simulado pausado antes.");return}
    const ids=redo.map(x=>x.q.id);
    S.questoes.ativo={id:"q"+Date.now().toString(36),nome:"Refazer: "+p.nome,qids:ids,resp:ids.map(()=>null),flag:[],gasto:0,limite:0,penal:p.penal,log:false};
    qView=null;qProvaIdx=0;qPaused=false;qStrike={};save("questoes");rQuest();window.scrollTo(0,0)};
}

/* Desempenho */
function rQDesemp(){
  const idx=qIndex();const byM={},byB={},byA={};let tot=0,ok=0,feitas=0,errLast=0;
  for(const [id,h] of Object.entries(S.questoes.resp)){const q=idx[id];if(!q||!h.length)continue;feitas++;if(!h[h.length-1][2])errLast++;
    for(const x of h){tot++;ok+=x[2];
      const add=(o,k)=>{const r=o[k]||(o[k]={a:0,t:0});r.t++;r.a+=x[2]};
      add(byM,q.m);add(byB,qB(q));if(q.a)add(byA,q.m+"|"+q.a)}}
  const provas=S.questoes.provas.slice().reverse();
  const bar=(lab,r,c)=>{const pc=r.t?r.a/r.t*100:0;return `<div class="hbar"><span>${lab}</span><div class="bar" style="height:10px"><i style="width:${pc}%;background:${c}"></i></div><span class="num" style="text-align:right">${Math.round(pc)}%</span></div>`};
  const fracos=Object.entries(byA).map(([k,r])=>{const [m,a]=k.split("|");return {m,a,r,pc:r.a/r.t}}).filter(x=>x.r.a<x.r.t).sort((x,y)=>x.pc-y.pc||y.r.t-x.r.t).slice(0,8);
  $("#q-tab").innerHTML=`<div class="stats">
      <div class="stat"><span class="eyebrow">Questões resolvidas</span><b class="num">${feitas}</b><span class="small muted">de ${qAll().length} no banco</span></div>
      <div class="stat"><span class="eyebrow">Aproveitamento</span><b class="num">${tot?Math.round(ok/tot*100)+"%":"–"}</b><span class="small muted">${ok} acertos em ${tot} respostas</span></div>
      <div class="stat"><span class="eyebrow">Para refazer</span><b class="num">${errLast}</b><span class="small muted">erradas na última tentativa</span></div>
      <div class="stat"><span class="eyebrow">Simulados gerados</span><b class="num">${S.questoes.provas.length}</b><span class="small muted">finalizados</span></div>
    </div>
    ${errLast?`<div><button type="button" class="primary" id="qd-redo">Resolver as ${errLast} que errei</button></div>`:""}
    <div class="grid2">
      <div class="panel" style="display:grid;gap:10px"><h3>Acerto por matéria</h3>${tot?`<div class="hbars">${QMAT.filter(m=>byM[m.id]).map(m=>bar(esc(m.nome),byM[m.id],`var(${m.c})`)).join("")}</div>`:`<div class="empty">Resolva algumas questões para ver seu desempenho.</div>`}</div>
      <div class="panel" style="display:grid;gap:10px"><h3>Acerto por banca</h3>${tot?`<div class="hbars">${Object.entries(byB).sort((a,b)=>b[1].t-a[1].t).map(([b,r])=>bar(esc(b),r,"var(--navy)")).join("")}</div>`:`<div class="empty">Aparece quando houver respostas.</div>`}</div>
    </div>
    <div class="panel" style="display:grid;gap:10px"><h3>Assuntos para reforçar</h3>${fracos.length?`<div style="display:grid;gap:6px">${fracos.map(x=>`<div class="rev"><span><span class="dot" style="--c:var(${MATBY[x.m].c});display:inline-block;margin-right:8px"></span>${esc(x.a)} <span class="muted small">· ${esc(MATBY[x.m].nome)} · ${Math.round(x.pc*100)}% em ${x.r.t}</span></span><button type="button" data-tr="${esc(x.m+"|"+x.a)}">Treinar</button></div>`).join("")}</div>`:`<div class="empty">Nenhum assunto com erros ainda.</div>`}</div>
    <div class="panel" style="display:grid;gap:10px"><h3>Simulados gerados</h3><div class="tablewrap" id="qd-prov">${provas.length?`<table class="data"><thead><tr><th>Data</th><th>Simulado</th><th style="text-align:right">Questões</th><th style="text-align:right">Acertos</th><th style="text-align:right">%</th><th style="text-align:right">Tempo</th><th></th></tr></thead><tbody>${provas.map(p=>{const t=p.qids.length;return `<tr><td class="num">${fmt(p.data)}</td><td>${esc(p.nome)}</td><td class="n">${t}</td><td class="n">${p.ok}</td><td class="n"><b>${t?Math.round(p.ok/t*100):0}%</b></td><td class="n">${fmtDur(p.gasto)}</td><td style="text-align:right;white-space:nowrap">${qpDel===p.id?`<span class="confirm" style="justify-content:flex-end">Excluir? <button type="button" class="danger" data-pdy="${p.id}">Sim</button><button type="button" data-pdn="1">Não</button></span>`:`<button type="button" data-pv="${p.id}">Ver correção</button> <button type="button" class="ghost danger" data-pd="${p.id}" aria-label="Excluir simulado">Excluir</button>`}</td></tr>`}).join("")}</tbody></table>`:`<div class="empty">Seus simulados gerados aparecem aqui, com a correção completa.</div>`}</div></div>`;
  $("#qd-redo")&&($("#qd-redo").onclick=()=>{S.questoes.f=Object.assign(QF0(),{s:"errei"});qPage=0;qTab="resolver";saveSoon("questoes");rQuest()});
  $("#q-tab").querySelectorAll("[data-tr]").forEach(b=>b.onclick=()=>{const [m,a]=b.dataset.tr.split("|");S.questoes.f=Object.assign(QF0(),{m:[m],a});qPage=0;qTab="resolver";saveSoon("questoes");rQuest();window.scrollTo(0,0)});
  $("#qd-prov").onclick=e=>{const t=e.target;
    if(t.dataset.pv){qView=t.dataset.pv;qRevF="all";rQuest();window.scrollTo(0,0)}
    else if(t.dataset.pd){qpDel=t.dataset.pd;rQDesemp()}
    else if(t.dataset.pdn){qpDel=null;rQDesemp()}
    else if(t.dataset.pdy){S.questoes.provas=S.questoes.provas.filter(p=>p.id!==t.dataset.pdy);qpDel=null;save("questoes");rQDesemp();toast("Simulado excluído. O registro na aba Simulados continua lá.")}};
}

/* Meu banco: cadastro, importação e lista */
const QFMT=`Banca: IAUPE | Ano: 2018 | Matéria: Português | Assunto: Crase
Assinale a alternativa em que o acento grave está correto.
A) Fui à pé.
B) Refiro-me à você.
C) Chegamos à cidade cedo.
D) Começou à chover.
E) Ficou frente à frente.
Gabarito: C
Comentário: chegar a + a cidade = à.
---
Matéria: Dir. Constitucional | Assunto: Segurança Pública (art. 144)
Às polícias militares cabem a polícia ostensiva e a preservação da ordem pública.
Gabarito: Certo`;
function qMatOf(s){const n=qNorm(s);if(!n)return null;if(MATBY[n]&&n!=="red")return n;
  for(const [id,re] of [["port",/portug|lingua/],["mat",/matem|rlm|racioc|logic/],["hist",/hist|pernamb/],["const",/constitu/],["info",/inform|computa/],["dh",/humanos|^dh$/]])if(re.test(n))return id;return null}
function qGabSet(q,gab){const gn=qNorm(gab==null?"":String(gab));const p=[];
  if(q.o&&q.o.length){q.t="me";const L=gn.match(/^(?:letra|alternativa)?\s*\(?([a-e])\)?$/);const i=L?LET.indexOf(L[1].toUpperCase()):-1;
    if(i>=0&&i<q.o.length)q.g=i;else p.push(gab?`gabarito “${gab}” não bate com as alternativas`:"sem gabarito");
    if(q.o.length<2)p.push("menos de 2 alternativas")}
  else{q.t="ce";delete q.o;if(/^(c|certo|certa|v|verdadeiro|true)$/.test(gn))q.g=true;else if(/^(e|errado|errada|f|falso|false)$/.test(gn))q.g=false;else p.push(gab?`gabarito “${gab}” deveria ser Certo ou Errado`:"sem gabarito")}
  return p}
function qParseText(txt,def){
  const blocks=[[]];
  for(const l of txt.replace(/\r/g,"").split("\n")){if(/^\s*-{3,}\s*$/.test(l))blocks.push([]);else blocks[blocks.length-1].push(l)}
  const ok=[],bad=[];let n=0;
  for(const lines of blocks){if(!lines.join("").trim())continue;n++;
    const q={m:def.m||null,a:"",b:def.b||"",y:def.y||null,e:"",o:[],g:null,c:""};let gab=null,mode="e",mbad=null;const en=[];
    for(const raw of lines){const line=raw.trim();
      if(mode==="c"){q.c+=(q.c?"\n":"")+raw.trimEnd();continue}
      if(!line){if(mode==="e"&&en.length)en.push("");continue}
      const kv=line.split(/\s+\|\s+/).map(p=>p.match(/^(mat[eé]ria|disciplina|assunto|banca|ano|gabarito|resposta|coment[aá]rio|justificativa)\s*:\s*(.*)$/i));
      if(kv.every(Boolean)){for(const k of kv){const key=qNorm(k[1]),val=k[2].trim();
          if(key.startsWith("mat")||key==="disciplina"){const id=qMatOf(val);if(id)q.m=id;else mbad=val}
          else if(key==="assunto")q.a=val;else if(key==="banca")q.b=val;else if(key==="ano")q.y=parseInt(val)||null;
          else if(key==="gabarito"||key==="resposta")gab=val;else{mode="c";q.c=val}}
        continue}
      const alt=line.match(/^\(?([A-Ea-e])\s*[\)\.\-–—:]\s*(.*)$/);
      if(alt&&LET.indexOf(alt[1].toUpperCase())===q.o.length&&(q.o.length||en.length)){q.o.push(alt[2]);mode="o";continue}
      if(mode==="o"){q.o[q.o.length-1]+=" "+line;continue}
      en.push(line)}
    q.e=en.join("\n").replace(/\n{3,}/g,"\n\n").trim();q.c=q.c.trim();
    const p=[];if(!q.e)p.push("sem enunciado");p.push(...qGabSet(q,gab));
    if(!q.m)p.push(mbad?`matéria “${mbad}” não reconhecida`:"sem matéria");
    if(p.length)bad.push({n,t:q.e.slice(0,70),p});else ok.push(q)}
  return {ok,bad}}
function qFromJson(arr,def){const ok=[],bad=[];
  arr.forEach((o,k)=>{if(!o||typeof o!=="object"){bad.push({n:k+1,t:"",p:["item inválido"]});return}
    const q={m:qMatOf(o.materia??o.m)||def.m||null,a:String(o.assunto??o.a??""),b:String(o.banca??o.b??def.b??""),y:parseInt(o.ano??o.y)||def.y||null,e:String(o.enunciado??o.e??"").trim(),x:String(o.texto??o.x??"").trim()||undefined,o:(o.alternativas??o.o??[]).map(String),g:null,c:String(o.comentario??o.c??"").trim()};
    let g=o.gabarito??o.g;if(typeof g==="number")g=LET[g];if(typeof g==="boolean")g=g?"C":"E";
    const p=[];if(!q.e)p.push("sem enunciado");p.push(...qGabSet(q,g));if(!q.m)p.push("sem matéria");
    if(p.length)bad.push({n:k+1,t:q.e.slice(0,70),p});else ok.push(q)});
  return {ok,bad}}
function qToJson(q){return {materia:MATBY[q.m]?.nome||q.m,assunto:q.a||"",banca:q.b||"",ano:q.y||null,tipo:q.t==="ce"?"certo_errado":"multipla_escolha",enunciado:q.e,texto:q.x||"",alternativas:q.t==="ce"?[]:q.o,gabarito:qAnsLabel(q,q.g),comentario:q.c||""}}
function rQBanco(){
  const mOpts=QMAT.map(m=>`<option value="${m.id}">${esc(m.nome)}</option>`).join("");
  $("#q-tab").innerHTML=`<div class="grid2">
    <form class="panel" id="qb-form" style="display:grid;gap:12px;align-content:start" novalidate>
      <div class="spread"><h3 id="qb-title">Adicionar questão</h3><button type="button" class="ghost" id="qb-cancel" hidden>Cancelar edição</button></div>
      <div class="qfilters">
        <label class="f">Matéria<select id="qb-m">${mOpts}</select></label>
        <label class="f">Assunto<input type="text" id="qb-a" list="qb-al" placeholder="Ex.: Crase"></label>
        <label class="f">Banca<input type="text" id="qb-b" list="qb-bl" placeholder="Ex.: IAUPE"></label>
        <label class="f">Ano<input type="number" id="qb-y" min="1980" max="2100" placeholder="Ex.: 2023"></label>
      </div><datalist id="qb-al"></datalist><datalist id="qb-bl">${[...new Set(QBANCAS.concat(S.questoes.custom.map(q=>q.b).filter(Boolean)))].map(b=>`<option value="${esc(b)}">`).join("")}</datalist>
      <div class="row" role="radiogroup" aria-label="Modelo da questão"><label class="row small" style="gap:6px"><input type="radio" name="qb-t" value="me" checked> Múltipla escolha (A a E)</label><label class="row small" style="gap:6px"><input type="radio" name="qb-t" value="ce"> Certo ou errado</label></div>
      <label class="f">Enunciado<textarea id="qb-e" rows="5" placeholder="Texto da questão. Se houver texto de apoio, cole aqui também."></textarea></label>
      <div id="qb-me" style="display:grid;gap:6px"><span class="small muted">Escreva as alternativas (E é opcional) e marque a correta.</span>${[0,1,2,3,4].map(i=>`<div class="altrow"><input type="radio" name="qb-g" value="${i}" aria-label="Alternativa ${LET[i]} é a correta"><b>${LET[i]}</b><input type="text" id="qb-o${i}" aria-label="Alternativa ${LET[i]}"></div>`).join("")}</div>
      <div id="qb-ce" class="row" hidden><span class="small">Gabarito:</span><label class="row small" style="gap:6px"><input type="radio" name="qb-gc" value="C"> Certo</label><label class="row small" style="gap:6px"><input type="radio" name="qb-gc" value="E"> Errado</label></div>
      <label class="f">Comentário ou justificativa (opcional)<textarea id="qb-c" rows="3"></textarea></label>
      <div class="row"><button type="submit" class="primary" id="qb-save">Adicionar questão</button><span class="status" id="qb-status"></span></div>
    </form>
    <div class="panel" style="display:grid;gap:12px;align-content:start">
      <h3>Importar várias de uma vez</h3>
      <p class="small muted" style="margin:0">Cole questões de provas anteriores ou de PDFs. Separe cada questão com uma linha só com <span class="tag">---</span>. Sem alternativas, a questão vira certo ou errado.</p>
      <details><summary class="small" style="cursor:pointer;font-weight:600">Ver formato com exemplo</summary><pre class="fmt">${esc(QFMT)}</pre><button type="button" class="ghost" id="qi-ex">Colar o exemplo na caixa</button></details>
      <div class="qfilters">
        <label class="f">Matéria padrão<select id="qi-m"><option value="">Usar a linha Matéria:</option>${mOpts}</select></label>
        <label class="f">Banca padrão<input type="text" id="qi-b" list="qb-bl" placeholder="Opcional"></label>
        <label class="f">Ano padrão<input type="number" id="qi-y" min="1980" max="2100" placeholder="Opcional"></label>
      </div>
      <textarea id="qi-text" rows="9" placeholder="Cole aqui as questões…" style="font-family:var(--f-mono);font-size:13px"></textarea>
      <div class="row"><button type="button" class="primary" id="qi-parse">Ler questões</button><input type="file" id="qi-file" accept=".json,.txt,application/json,text/plain" class="sr"><label class="btn" for="qi-file">Abrir arquivo .txt ou .json</label></div>
      <div id="qi-prev"></div>
    </div></div>
    <div class="panel" style="display:grid;gap:12px">
      <div class="spread"><h3>Suas questões</h3><div class="row"><button type="button" id="qb-export" ${S.questoes.custom.length?"":"disabled"}>Exportar (.json)</button></div></div>
      ${QOFC.length?`<label class="row small" style="gap:8px;flex-wrap:nowrap;align-items:flex-start"><input type="checkbox" id="qb-of" style="margin-top:3px" ${S.questoes.oficiais!==false?"checked":""}> <span>Usar as ${QOFC.length} questões oficiais de provas anteriores da PM-PE, com gabarito definitivo da banca. Fontes: ${QFONTES.map(f=>`<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.nome)}</a>`).join(" · ")}</span></label>`:""}
      <label class="row small" style="gap:8px"><input type="checkbox" id="qb-ex" ${S.questoes.exemplos!==false?"checked":""}> Mostrar as ${QSEED.length} questões de exemplo do QG (feitas para treino, não são de provas reais)</label>
      <div id="qb-list"></div>
    </div>`;
  const setTipo=t=>{document.querySelector(`input[name="qb-t"][value="${t}"]`).checked=true;$("#qb-me").hidden=t!=="me";$("#qb-ce").hidden=t!=="ce"};
  const fillAssuntos=()=>{const m=MATBY[$("#qb-m").value];const set=new Set(m.topicos);S.questoes.custom.forEach(q=>{if(q.m===m.id&&q.a)set.add(q.a)});$("#qb-al").innerHTML=[...set].map(a=>`<option value="${esc(a)}">`).join("")};
  document.querySelectorAll('input[name="qb-t"]').forEach(r=>r.onchange=()=>setTipo(r.value));
  $("#qb-m").onchange=fillAssuntos;
  const ed=qEdit&&S.questoes.custom.find(q=>q.id===qEdit);
  if(ed){$("#qb-title").textContent="Editar questão";$("#qb-save").textContent="Salvar alterações";$("#qb-cancel").hidden=false;
    $("#qb-m").value=ed.m;$("#qb-a").value=ed.a||"";$("#qb-b").value=ed.b||"";$("#qb-y").value=ed.y||"";setTipo(ed.t);$("#qb-e").value=ed.e;$("#qb-c").value=ed.c||"";
    if(ed.t==="me"){ed.o.forEach((t,i)=>$("#qb-o"+i).value=t);document.querySelector(`input[name="qb-g"][value="${ed.g}"]`).checked=true}
    else document.querySelector(`input[name="qb-gc"][value="${ed.g?"C":"E"}"]`).checked=true}
  else{qEdit=null;if(qbKeep){$("#qb-m").value=qbKeep.m;$("#qb-b").value=qbKeep.b;$("#qb-y").value=qbKeep.y;setTipo(qbKeep.t)}}
  fillAssuntos();
  $("#qb-cancel").onclick=()=>{qEdit=null;rQBanco()};
  $("#qb-form").onsubmit=e=>{e.preventDefault();const st=$("#qb-status");
    const t=document.querySelector('input[name="qb-t"]:checked').value;const en=$("#qb-e").value.trim();
    if(!en){st.textContent="Escreva o enunciado.";$("#qb-e").focus();return}
    const q={id:ed?ed.id:qNewId(),m:$("#qb-m").value,a:$("#qb-a").value.trim(),b:$("#qb-b").value.trim(),y:parseInt($("#qb-y").value)||null,t,e:en,c:$("#qb-c").value.trim(),em:ed?ed.em:Date.now()};
    if(t==="me"){const o=[0,1,2,3,4].map(i=>$("#qb-o"+i).value.trim());while(o.length&&!o[o.length-1])o.pop();
      if(o.length<2||o.some(x=>!x)){st.textContent="Preencha as alternativas em ordem, de A até pelo menos B, sem pular letras.";return}
      const g=document.querySelector('input[name="qb-g"]:checked');if(!g||+g.value>=o.length){st.textContent="Marque qual alternativa é a correta.";return}
      q.o=o;q.g=+g.value}
    else{const g=document.querySelector('input[name="qb-gc"]:checked');if(!g){st.textContent="Marque se a afirmação é certa ou errada.";return}q.g=g.value==="C"}
    if(ed){const i=S.questoes.custom.findIndex(x=>x.id===ed.id);S.questoes.custom[i]=q;delete qShown[q.id];delete qSel[q.id]}else S.questoes.custom.push(q);
    qbKeep={m:q.m,b:q.b,y:q.y||"",t:q.t};qEdit=null;save("questoes");toast(ed?"Questão atualizada":"Questão adicionada");rQBanco();rQResumo();
    if(!ed)$("#qb-e").focus()};
  // importação
  $("#qi-ex").onclick=()=>{$("#qi-text").value=QFMT;$("#qi-text").focus()};
  const def=()=>({m:$("#qi-m").value||null,b:$("#qi-b").value.trim(),y:parseInt($("#qi-y").value)||null});
  const showPrev=r=>{qParsed=r.ok;
    const keyOf=q=>q.m+"|"+qNorm(q.e);const have=new Set(qAll().map(keyOf));const dup=r.ok.filter(q=>have.has(keyOf(q))).length;
    $("#qi-prev").innerHTML=`<div class="notice" style="display:grid;gap:8px"><div><b>${r.ok.length} ${r.ok.length===1?"questão pronta":"questões prontas"}</b> para adicionar${dup?` (${dup} já ${dup===1?"existe":"existem"} no banco e ${dup===1?"será ignorada":"serão ignoradas"})`:""}.${r.bad.length?` ${r.bad.length} com problema:`:""}</div>
      ${r.bad.length?`<ul class="small" style="margin:0;padding-left:18px">${r.bad.slice(0,8).map(b=>`<li>Questão ${b.n}${b.t?` (“${esc(b.t)}…”)`:""}: ${esc(b.p.join("; "))}</li>`).join("")}${r.bad.length>8?`<li>e mais ${r.bad.length-8}</li>`:""}</ul>`:""}
      ${r.ok.length?`<div class="small muted">${r.ok.slice(0,5).map(q=>`${esc(MATBY[q.m].nome)} · ${q.t==="ce"?"C/E":"A–"+LET[q.o.length-1]} · gab. ${qAnsLabel(q,q.g)} · ${esc(q.e.slice(0,60))}…`).join("<br>")}${r.ok.length>5?"<br>…":""}</div>`:""}
      <div class="row">${r.ok.length-dup>0?`<button type="button" class="primary" id="qi-add">Adicionar ${r.ok.length-dup}</button>`:""}<button type="button" id="qi-x">Descartar</button></div></div>`;
    $("#qi-x").onclick=()=>{qParsed=null;$("#qi-prev").innerHTML=""};
    $("#qi-add")&&($("#qi-add").onclick=()=>{const have2=new Set(qAll().map(keyOf));let k=0;
      for(const q of qParsed){if(have2.has(keyOf(q)))continue;have2.add(keyOf(q));q.id=qNewId();q.em=Date.now()+k;S.questoes.custom.push(q);k++}
      qParsed=null;save("questoes");toast(`${k} ${k===1?"questão adicionada":"questões adicionadas"}`);rQBanco();rQResumo()})};
  $("#qi-parse").onclick=()=>{const t=$("#qi-text").value;if(!t.trim()){toast("Cole as questões na caixa primeiro.");return}
    const s=t.trim();if(s[0]==="["||s[0]==="{"){try{const j=JSON.parse(s);return showPrev(qFromJson(Array.isArray(j)?j:j.questoes||[],def()))}catch(e){}}
    showPrev(qParseText(t,def()))};
  $("#qi-file").onchange=async e=>{const f=e.target.files[0];e.target.value="";if(!f)return;const t=await f.text();
    if(/\.json$/i.test(f.name)||/^\s*[\[{]/.test(t)){try{const j=JSON.parse(t);showPrev(qFromJson(Array.isArray(j)?j:j.questoes||[],def()))}catch(err){toast("Não consegui ler esse JSON.")}}
    else{$("#qi-text").value=t;showPrev(qParseText(t,def()))}};
  $("#qb-export").onclick=()=>saveFile(`questoes-qg-pmpe-${iso(today())}.json`,new Blob([JSON.stringify({app:"qg-pmpe-questoes",questoes:S.questoes.custom.map(qToJson)},null,1)],{type:"application/json"}));
  $("#qb-ex").onchange=e=>{S.questoes.exemplos=e.target.checked;save("questoes");rQResumo()};
  $("#qb-of")&&($("#qb-of").onchange=e=>{S.questoes.oficiais=e.target.checked;save("questoes");rQResumo()});
  qbList();
}
function qbList(){
  const L=S.questoes.custom.slice().sort((a,b)=>(b.em||0)-(a.em||0));const per=20,pages=Math.max(1,Math.ceil(L.length/per));if(qbPage>=pages)qbPage=pages-1;
  const sl=L.slice(qbPage*per,qbPage*per+per);
  $("#qb-list").innerHTML=L.length?`<div class="tablewrap"><table class="data"><thead><tr><th>Questão</th><th>Matéria</th><th>Banca</th><th>Modelo</th><th>Gab.</th><th></th></tr></thead><tbody>${sl.map(q=>`<tr><td style="max-width:420px">${esc(q.e.length>110?q.e.slice(0,110)+"…":q.e)}</td><td style="white-space:nowrap"><span class="dot" style="--c:var(${MATBY[q.m]?.c});display:inline-block;margin-right:6px"></span>${esc(MATBY[q.m]?.nome||q.m)}</td><td>${esc(q.b||"–")}${q.y?" · "+q.y:""}</td><td>${q.t==="ce"?"C/E":"A–"+LET[q.o.length-1]}</td><td><b>${qAnsLabel(q,q.g)}</b></td><td style="text-align:right;white-space:nowrap">${qbDel===q.id?`<span class="confirm" style="justify-content:flex-end">Excluir? <button type="button" class="danger" data-dy="${q.id}">Sim</button><button type="button" data-dn="1">Não</button></span>`:`<button type="button" data-ed="${q.id}">Editar</button> <button type="button" class="ghost danger" data-dd="${q.id}">Excluir</button>`}</td></tr>`).join("")}</tbody></table></div>
    <div class="spread"><span class="small muted num">${L.length} ${L.length===1?"questão sua":"questões suas"}</span>${pages>1?`<div class="pager"><button type="button" data-bp="-1" ${qbPage===0?"disabled":""}>Anterior</button><span class="small muted num">${qbPage+1} de ${pages}</span><button type="button" data-bp="1" ${qbPage>=pages-1?"disabled":""}>Próxima</button></div>`:""}
    ${qbDelAll?`<span class="confirm">Excluir todas as ${L.length} questões que você adicionou? <button type="button" class="danger" data-da="y">Excluir todas</button><button type="button" data-da="n">Cancelar</button></span>`:`<button type="button" class="ghost danger" data-da="ask">Excluir todas</button>`}</div>`
    :`<div class="empty">Você ainda não adicionou questões. Use o formulário ou cole várias de uma vez na importação.</div>`;
  $("#qb-list").onclick=e=>{const t=e.target.closest("button");if(!t)return;const d=t.dataset;
    if(d.ed){qEdit=d.ed;rQBanco();$("#qb-form").scrollIntoView({behavior:"smooth"})}
    else if(d.dd){qbDel=d.dd;qbList()}
    else if(d.dn){qbDel=null;qbList()}
    else if(d.dy){S.questoes.custom=S.questoes.custom.filter(q=>q.id!==d.dy);delete S.questoes.resp[d.dy];if(qEdit===d.dy)qEdit=null;qbDel=null;save("questoes");qbList();rQResumo();toast("Questão excluída")}
    else if(d.bp){qbPage+=+d.bp;qbList()}
    else if(d.da==="ask"){qbDelAll=true;qbList()}
    else if(d.da==="n"){qbDelAll=false;qbList()}
    else if(d.da==="y"){S.questoes.custom.forEach(q=>delete S.questoes.resp[q.id]);S.questoes.custom=[];qbDelAll=false;qEdit=null;save("questoes");rQBanco();rQResumo();toast("Suas questões foram excluídas")}};
}

/* ---------- PDFs ---------- */
const pdfjs=window.pdfjsLib;
if(pdfjs){pdfjs.GlobalWorkerOptions.workerSrc="vendor/pdf.worker.min.js"}
const DPR_MAX=2, MAX_PIX=12e6;
const R={id:null,doc:null,base:null,sizes:[],wraps:[],fit:"width",zoom:1,scale:1,page:1,io:null,tio:null,tasks:{},notesDirty:false,thumbsBuilt:false,token:0};
let pdfFilter="";
R.fit="auto";R.sideOpen=true;R.tab="lib";
try{const p=JSON.parse(localStorage.getItem(LS+"reader2")||"{}");if(p.fit)R.fit=p.fit;R.notesOpen=!!p.notes;if(p.side===false)R.sideOpen=false;if(p.tab)R.tab=p.tab}catch(e){}
function readerPrefs(){try{localStorage.setItem(LS+"reader2",JSON.stringify({fit:R.fit,notes:R.notesOpen,side:R.sideOpen,tab:R.tab}))}catch(e){}}
function pdfOptions(){return MAT.map(m=>`<option value="${m.id}">${esc(m.nome)}</option>`).join("")+`<option value="geral">Geral / Edital</option>`}
function matNome(id){return id==="geral"?"Geral / Edital":(MATBY[id]?.nome||"Geral")}
function matCor(id){return id==="geral"?"var(--ink-3)":"var("+(MATBY[id]?.c||"--ink-3")+")"}
function matSigla(id){return id==="geral"?"ED":({port:"PT",mat:"RLM",hist:"PE",const:"CF",info:"TI",red:"RD",dh:"DH"})[id]||"PDF"}
function capa(id){try{return localStorage.getItem(LS+"capa-"+id)}catch(e){return null}}

function rPdfs(){
  if(!$("#pdf-materia").options.length)$("#pdf-materia").innerHTML=pdfOptions();
  const used=[...new Set(S.pdfs.items.map(p=>p.materia))];
  $("#pdf-filters").innerHTML=S.pdfs.items.length?[["","Todos"],...[...MAT.map(m=>[m.id,m.nome]),["geral","Geral / Edital"]].filter(([id])=>used.includes(id))].map(([id,n])=>`<button class="fchip" data-f="${id}" aria-pressed="${pdfFilter===id}">${esc(n)}${id?` <span class="muted num">${S.pdfs.items.filter(p=>p.materia===id).length}</span>`:""}</button>`).join(""):"";
  $("#pdf-filters").querySelectorAll("[data-f]").forEach(b=>b.onclick=()=>{pdfFilter=b.dataset.f;rPdfs()});
  if(pdfFilter&&!used.includes(pdfFilter))pdfFilter="";
  const list=S.pdfs.items.filter(p=>!pdfFilter||p.materia===pdfFilter).sort((a,b)=>(b.aberto||b.criado)>(a.aberto||a.criado)?1:-1);
  $("#pdf-list").innerHTML=list.length?list.map(p=>{const c=capa(p.id);const pct=p.paginas?Math.round((p.lida||0)/p.paginas*100):0;
    return `<button class="card" style="--c:${matCor(p.materia)}" data-open="${p.id}">
      <div class="cover">${c?`<img src="${c}" alt="">`:`<div class="ph">${matSigla(p.materia)}</div>`}<span class="badge"><span class="dot" style="--c:${matCor(p.materia)}"></span>${esc(matNome(p.materia))}</span></div>
      <div class="meta"><span class="nm">${esc(p.nome)}</span>
      <span class="small muted">${p.paginas?`Pág. ${p.pagina||1} de ${p.paginas} · ${pct}% lido`:"Ainda não aberto"}${p.local?" · só neste navegador":""}</span>
      ${p.paginas?`<span class="bar" style="height:4px"><i style="width:${pct}%;background:var(--good)"></i></span>`:""}</div></button>`}).join(""):`<div class="empty" style="grid-column:1/-1">${S.pdfs.items.length?"Nenhum PDF nesta matéria.":"Nenhum PDF anexado ainda. Comece pela apostila de Português ou pelo edital."}</div>`;
  $("#pdf-list").querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openPdf(b.dataset.open));
  const last=S.pdfs.items.filter(p=>p.aberto).sort((a,b)=>b.aberto>a.aberto?1:-1)[0];
  $("#pdf-continue").innerHTML=last?`<div class="continue"><div style="flex:1;min-width:200px"><div class="k">Continuar lendo</div><strong>${esc(last.nome)}</strong><span class="small" style="opacity:.8">${esc(matNome(last.materia))} · página ${last.pagina||1}${last.paginas?` de ${last.paginas}`:""}</span></div><button data-cont="${last.id}">Abrir na página ${last.pagina||1}</button></div>`:"";
  const cb=$("#pdf-continue [data-cont]");if(cb)cb.onclick=()=>openPdf(cb.dataset.cont);
  $("#pdf-status").textContent=assets?"Os arquivos ficam salvos neste QG e abrem em qualquer dispositivo.":"Os PDFs ficam salvos neste navegador, neste computador.";
}
async function handleFiles(files){
  const arr=[...files].filter(f=>f.type==="application/pdf"||/\.pdf$/i.test(f.name));
  if(!arr.length){toast("Escolha arquivos em PDF.");return}
  const materia=$("#pdf-materia").value;let ok=0;
  for(const f of arr){
    if(f.size>20*1024*1024){toast(`${f.name} passa de 20 MB. Divida o arquivo e tente de novo.`);continue}
    $("#pdf-status").textContent=`Enviando ${f.name}…`;
    const id="p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const rec={id,nome:f.name.replace(/\.pdf$/i,""),materia,tamanho:f.size,criado:new Date().toISOString(),pagina:1,lida:0};
    try{
      if(assets){const up=await assets.upload(f,{type:"application/pdf"});rec.asset=up.id}
      else{await idbPut(id,f);rec.local=true}
      S.pdfs.items.push(rec);await save("pdfs");ok++;
    }catch(e){
      const c=e&&e.code;toast(c==="too_large"?`${f.name} passa do limite de 20 MB.`:c==="offline"?`Sem conexão. ${f.name} não foi enviado.`:`Não foi possível salvar ${f.name}. Tente de novo.`);
    }
  }
  $("#pdf-input").value="";rPdfs();
  if(ok)toast(ok>1?`${ok} PDFs salvos na biblioteca`:"PDF salvo na biblioteca");
}
$("#pdf-input").onchange=e=>handleFiles(e.target.files);
const libSec=$("#v-pdfs"), drop=$("#drop");
libSec.addEventListener("dragover",e=>{e.preventDefault();drop.classList.add("over")});
libSec.addEventListener("dragleave",e=>{if(!libSec.contains(e.relatedTarget))drop.classList.remove("over")});
libSec.addEventListener("drop",e=>{e.preventDefault();drop.classList.remove("over");handleFiles(e.dataTransfer.files)});

/* Leitor */
const FIT_IC={width:'<path d="M3 12h18"/><path d="m7 8-4 4 4 4"/><path d="m17 8 4 4-4 4"/>',page:'<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 8h6M9 12h6M9 16h4"/>'};
function paintFit(){$("#r-fitsel").value=R.fit}
function calcScale(){
  const box=$("#r-pages");const sm=innerWidth<=640;
  const aw=box.clientWidth-(sm?12:24), ah=box.clientHeight-(sm?20:36);
  const fitW=aw/R.base.w, fitP=Math.min(fitW,ah/R.base.h);
  const real=96/72; /* 100% = tamanho real da página, como nos leitores de PDF */
  const base=R.fit==="width"?fitW:R.fit==="page"?fitP:Math.min(fitW,real);
  return Math.max(.15,base*R.zoom);
}
async function openPdf(id){
  const p=S.pdfs.items.find(x=>x.id===id);if(!p)return;
  if(!pdfjs){toast("O leitor de PDF não carregou. Recarregue a página.");return}
  await flushNotes();
  closeDoc();
  const tok=++R.token;
  R.id=id;R.zoom=1;R.page=p.pagina||1;R.thumbsBuilt=false;
  $("#reader").hidden=false;document.body.classList.add("reading");
  $("#r-name").innerHTML=`${esc(p.nome)}<small>${esc(matNome(p.materia))}</small>`;
  $("#r-total").textContent="–";$("#r-prog").style.width="0";
  $("#r-pages").innerHTML=`<div class="r-msg">Abrindo PDF…</div>`;$("#r-thumbbox").innerHTML="";
  $("#r-npanel").hidden=!(R.notesOpen&&innerWidth>900);$("#r-side").hidden=!(R.sideOpen&&innerWidth>900);
  $("#r-notes").setAttribute("aria-pressed",String(!$("#r-npanel").hidden));$("#r-thumbs").setAttribute("aria-pressed",String(!$("#r-side").hidden));
  setTab(R.tab,true);renderSideLib();
  $("#v-confirm").innerHTML="";$("#n-status").textContent="";$("#v-notes").value="";
  paintFit();loadNotes(id);updateLida();
  try{
    let data;
    if(p.local){const blob=await idbGet(id);if(!blob)throw new Error("missing");data=new Uint8Array(await blob.arrayBuffer())}
    else{if(!assets)throw new Error("offline");const blob=await assets.baixar(p.asset);data=new Uint8Array(await blob.arrayBuffer())}
    const doc=await pdfjs.getDocument({data}).promise;
    if(tok!==R.token){doc.destroy();return}
    R.doc=doc;
    const first=await doc.getPage(1);const vp=first.getViewport({scale:1});
    R.base={w:vp.width,h:vp.height};R.sizes=Array.from({length:doc.numPages},()=>({w:vp.width,h:vp.height}));
    $("#r-total").textContent=doc.numPages;$("#r-page").max=doc.numPages;
    if(R.page>doc.numPages)R.page=1;
    p.paginas=doc.numPages;p.aberto=new Date().toISOString();saveSoon("pdfs",1500);
    buildPages();
    if(!$("#r-side").hidden&&R.tab==="pg")buildThumbs();
    if(!capa(id))makeCover(first,id);
  }catch(e){
    if(tok!==R.token)return;
    $("#r-pages").innerHTML=`<div class="r-msg">${p.local?"Este PDF foi salvo em outro navegador e não está disponível aqui.":(assets?"Não foi possível abrir o PDF. Verifique a conexão e tente de novo.":"Conecte a nuvem em Ajustes para abrir este PDF.")}</div>`;
  }
}
async function makeCover(page,id){
  try{const vp0=page.getViewport({scale:1});const vp=page.getViewport({scale:360/vp0.width});const cv=document.createElement("canvas");cv.width=vp.width;cv.height=Math.min(vp.height,vp.width*0.75);
    const ctx=cv.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);await page.render({canvasContext:ctx,viewport:vp}).promise;
    localStorage.setItem(LS+"capa-"+id,cv.toDataURL("image/jpeg",.72));}catch(e){}
}
function buildPages(){
  const box=$("#r-pages");box.innerHTML="";R.wraps=[];
  const frag=document.createDocumentFragment();
  for(let i=0;i<R.doc.numPages;i++){const w=document.createElement("div");w.className="pg-wrap";w.dataset.n=i+1;w.innerHTML=`<span class="pn">${i+1}</span>`;R.wraps.push(w);frag.appendChild(w)}
  box.appendChild(frag);
  layout();
  if(R.io)R.io.disconnect();
  R.io=new IntersectionObserver(es=>{for(const e of es){const n=+e.target.dataset.n;if(e.isIntersecting)renderPg(n);else freePg(n)}},{root:box,rootMargin:"1500px 0px"});
  R.wraps.forEach(w=>R.io.observe(w));
  goTo(R.page,true);
}
function layout(){
  R.scale=calcScale();
  R.wraps.forEach((w,i)=>{const s=R.sizes[i];w.style.width=Math.floor(s.w*R.scale)+"px";w.style.height=Math.floor(s.h*R.scale)+"px";w.dataset.dirty="1"});
  $("#r-zoom").textContent=Math.round(R.scale*72/96*100)+"%";
}
async function renderPg(n){
  const w=R.wraps[n-1];if(!w||!R.doc)return;
  if(w.dataset.done===String(R.scale))return;
  const scale=R.scale,doc=R.doc;
  if(R.tasks[n]){try{R.tasks[n].cancel()}catch(e){}}
  try{
    const page=await doc.getPage(n);if(doc!==R.doc)return;
    const vp1=page.getViewport({scale:1});
    if(Math.abs(vp1.width-R.sizes[n-1].w)>1||Math.abs(vp1.height-R.sizes[n-1].h)>1){R.sizes[n-1]={w:vp1.width,h:vp1.height};w.style.width=Math.floor(vp1.width*scale)+"px";w.style.height=Math.floor(vp1.height*scale)+"px"}
    let dpr=Math.min(DPR_MAX,window.devicePixelRatio||1);const area=vp1.width*vp1.height*scale*scale;if(area*dpr*dpr>MAX_PIX)dpr=Math.sqrt(MAX_PIX/area);
    const vp=page.getViewport({scale:scale*dpr});
    const cv=document.createElement("canvas");cv.width=Math.floor(vp.width);cv.height=Math.floor(vp.height);
    const task=page.render({canvasContext:cv.getContext("2d"),viewport:vp});R.tasks[n]=task;
    await task.promise;delete R.tasks[n];
    if(doc!==R.doc||scale!==R.scale)return;
    const old=w.querySelector("canvas");if(old)old.remove();
    w.prepend(cv);w.dataset.done=String(scale);
  }catch(e){}
}
function freePg(n){const w=R.wraps[n-1];if(!w)return;if(R.tasks[n]){try{R.tasks[n].cancel()}catch(e){}delete R.tasks[n]}const c=w.querySelector("canvas");if(c){c.width=0;c.height=0;c.remove()}delete w.dataset.done}
function rerenderVisible(){
  const box=$("#r-pages"),top=box.scrollTop-1500,bot=box.scrollTop+box.clientHeight+1500;
  R.wraps.forEach((w,i)=>{const y=w.offsetTop;if(y+w.offsetHeight>top&&y<bot)renderPg(i+1);else freePg(i+1)});
}
function relayoutKeep(){
  if(!R.doc)return;const box=$("#r-pages");const w=R.wraps[R.page-1];
  const frac=w?(box.scrollTop-w.offsetTop)/Math.max(1,w.offsetHeight):0;
  layout();
  const w2=R.wraps[R.page-1];if(w2)box.scrollTop=w2.offsetTop+frac*w2.offsetHeight;
  rerenderVisible();
}
function goTo(n,instant){
  if(!R.doc)return;n=Math.min(R.doc.numPages,Math.max(1,n|0||1));
  const w=R.wraps[n-1];if(!w)return;
  $("#r-pages").scrollTo({top:w.offsetTop-(innerWidth<=640?10:18),behavior:instant||matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  setPage(n);
}
function setPage(n){
  if(n===R.page&&$("#r-page").value==n&&R.doc)return paintProg();
  R.page=n;if(document.activeElement!==$("#r-page"))$("#r-page").value=n;paintProg();
  const p=S.pdfs.items.find(x=>x.id===R.id);if(p&&p.pagina!==n){p.pagina=n;saveSoon("pdfs",2500)}
  document.querySelectorAll("#r-thumbbox .thumb.on").forEach(t=>t.classList.remove("on"));
  const t=document.querySelector(`#r-thumbbox .thumb[data-n="${n}"]`);if(t){t.classList.add("on");const tb=$("#r-thumbbox");if(t.offsetTop<tb.scrollTop||t.offsetTop+t.offsetHeight>tb.scrollTop+tb.clientHeight)tb.scrollTop=t.offsetTop-tb.clientHeight/2}
}
function paintProg(){if(!R.doc)return;$("#r-prog").style.width=(R.page/R.doc.numPages*100)+"%";const sm=document.querySelector("#r-lib .sitem.on .sm");if(sm)sm.textContent=`Pág. ${R.page} de ${R.doc.numPages}`}
let scrollRaf=0;
$("#r-pages").addEventListener("scroll",()=>{if(scrollRaf)return;scrollRaf=requestAnimationFrame(()=>{scrollRaf=0;if(!R.wraps.length)return;
  const box=$("#r-pages"),probe=box.scrollTop+box.clientHeight*.35;
  let lo=0,hi=R.wraps.length-1;while(lo<hi){const mid=(lo+hi)>>1;const w=R.wraps[mid];if(w.offsetTop+w.offsetHeight<probe)lo=mid+1;else hi=mid}
  setPage(lo+1)})},{passive:true});
function zoomBy(f){R.zoom=Math.min(5,Math.max(.25,R.zoom*f));relayoutKeep()}
$("#r-prev").onclick=()=>goTo(R.page-1);$("#r-next").onclick=()=>goTo(R.page+1);
$("#r-page").onchange=e=>goTo(+e.target.value);
$("#r-page").onkeydown=e=>{if(e.key==="Enter"){goTo(+e.target.value);e.target.blur()}};
$("#r-zin").onclick=()=>zoomBy(1.2);$("#r-zout").onclick=()=>zoomBy(1/1.2);
$("#r-zoom").onclick=()=>{R.zoom=1;relayoutKeep()};
$("#r-fitsel").onchange=e=>{R.fit=e.target.value;R.zoom=1;readerPrefs();relayoutKeep();goTo(R.page,true);e.target.blur()};
$("#r-pages").addEventListener("wheel",e=>{if(!(e.ctrlKey||e.metaKey)||!R.doc)return;e.preventDefault();clearTimeout(R._wz);R._pendZ=(R._pendZ||1)*Math.exp(-e.deltaY*.01);R._wz=setTimeout(()=>{zoomBy(R._pendZ);R._pendZ=1},60)},{passive:false});
function togglePanel(sel,btn,other,otherBtn){
  const el=$(sel);el.hidden=!el.hidden;$(btn).setAttribute("aria-pressed",String(!el.hidden));
  if(!el.hidden&&innerWidth<=900){$(other).hidden=true;$(otherBtn).setAttribute("aria-pressed","false")}
  if(innerWidth>900){R.notesOpen=!$("#r-npanel").hidden;R.sideOpen=!$("#r-side").hidden}readerPrefs();
  if(innerWidth>900)requestAnimationFrame(relayoutKeep);
}
$("#r-notes").onclick=()=>{togglePanel("#r-npanel","#r-notes","#r-side","#r-thumbs");if(!$("#r-npanel").hidden)$("#v-notes").focus()};
$("#r-thumbs").onclick=()=>{togglePanel("#r-side","#r-thumbs","#r-npanel","#r-notes");if(!$("#r-side").hidden&&R.tab==="pg")buildThumbs()};
function setTab(t,quiet){R.tab=t;$("#st-lib").setAttribute("aria-selected",String(t==="lib"));$("#st-pg").setAttribute("aria-selected",String(t==="pg"));
  $("#r-lib").hidden=t!=="lib";$("#r-thumbbox").hidden=t!=="pg";if(t==="pg")buildThumbs();if(!quiet)readerPrefs()}
$("#st-lib").onclick=()=>setTab("lib");$("#st-pg").onclick=()=>setTab("pg");
function closeSideMobile(){if(innerWidth<=900){$("#r-side").hidden=true;$("#r-thumbs").setAttribute("aria-pressed","false")}}
function renderSideLib(){
  const groups=[...MAT.map(m=>[m.id,m.nome]),["geral","Geral / Edital"]];
  let h="";
  for(const [gid,gn] of groups){const its=S.pdfs.items.filter(p=>p.materia===gid);if(!its.length)continue;
    h+=`<div class="sgrp">${esc(gn)}</div>`+its.map(p=>{const pct=p.paginas?Math.round((p.lida||0)/p.paginas*100):0;
      return `<button class="sitem${p.id===R.id?" on":""}" style="--c:${matCor(p.materia)}" data-sid="${p.id}"${p.id===R.id?' aria-current="true"':""}><span class="st"></span><span style="min-width:0"><span class="sn">${esc(p.nome)}</span><span class="sm">${p.paginas?`Pág. ${p.id===R.id?R.page:(p.pagina||1)} de ${p.paginas}`:"Ainda não aberto"}</span>${p.paginas?`<span class="sb"><i style="width:${pct}%"></i></span>`:""}</span></button>`}).join("")}
  $("#r-lib").innerHTML=h||`<div class="sm" style="padding:12px;color:var(--rd-ink-2)">Nenhum PDF.</div>`;
  $("#r-lib").querySelectorAll("[data-sid]").forEach(b=>b.onclick=()=>{closeSideMobile();if(b.dataset.sid!==R.id)openPdf(b.dataset.sid)});
}
$("#r-fs").onclick=()=>{try{if(document.fullscreenElement)document.exitFullscreen();else{const p=$("#reader").requestFullscreen?.();if(p&&p.catch)p.catch(()=>toast("Tela cheia indisponível aqui."))}}catch(e){toast("Tela cheia indisponível aqui.")}};
document.addEventListener("fullscreenchange",()=>setTimeout(relayoutKeep,100));
function buildThumbs(){
  if(R.thumbsBuilt||!R.doc)return;R.thumbsBuilt=true;
  const tb=$("#r-thumbbox");tb.innerHTML=R.sizes.map((s,i)=>`<button class="thumb${i+1===R.page?" on":""}" data-n="${i+1}" aria-label="Página ${i+1}"><span class="tc" style="--ar:${(s.w/s.h).toFixed(3)}"></span>${i+1}</button>`).join("");
  tb.querySelectorAll(".thumb").forEach(b=>b.onclick=()=>{goTo(+b.dataset.n);closeSideMobile()});
  if(R.tio)R.tio.disconnect();
  const doc=R.doc;
  R.tio=new IntersectionObserver(es=>{es.forEach(async e=>{if(!e.isIntersecting)return;R.tio.unobserve(e.target);const n=+e.target.dataset.n;
    try{const page=await doc.getPage(n);if(doc!==R.doc)return;const v1=page.getViewport({scale:1});const vp=page.getViewport({scale:240/v1.width});const cv=document.createElement("canvas");cv.width=vp.width;cv.height=vp.height;await page.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;e.target.querySelector(".tc").appendChild(cv)}catch(err){}})},{root:tb,rootMargin:"400px 0px"});
  tb.querySelectorAll(".thumb").forEach(t=>R.tio.observe(t));
  setPage(R.page);
}
function closeDoc(){
  Object.values(R.tasks).forEach(t=>{try{t.cancel()}catch(e){}});R.tasks={};
  if(R.io){R.io.disconnect();R.io=null}if(R.tio){R.tio.disconnect();R.tio=null}
  R.wraps.forEach((w,i)=>freePg(i+1));R.wraps=[];
  if(R.doc){R.doc.destroy();R.doc=null}
}
async function closeReader(){
  await flushNotes();R.token++;closeDoc();R.id=null;
  if(document.fullscreenElement){try{document.exitFullscreen()}catch(e){}}
  $("#reader").hidden=true;document.body.classList.remove("reading");$("#r-pages").innerHTML="";rPdfs();
}
$("#r-close").onclick=closeReader;
document.addEventListener("keydown",e=>{
  if($("#reader").hidden)return;
  const typing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);
  if(e.key==="Escape"){if(typing&&e.target.id==="v-notes"){e.target.blur();return}closeReader();return}
  if(typing)return;
  if(e.key==="ArrowRight"){e.preventDefault();goTo(R.page+1)}
  else if(e.key==="ArrowLeft"){e.preventDefault();goTo(R.page-1)}
  else if(e.key==="+"||e.key==="="){e.preventDefault();zoomBy(1.2)}
  else if(e.key==="-"){e.preventDefault();zoomBy(1/1.2)}
  else if(e.key==="Home"){e.preventDefault();goTo(1)}
  else if(e.key==="End"){e.preventDefault();goTo(R.doc?R.doc.numPages:1)}
});
window.addEventListener("resize",()=>{clearTimeout(window._rz);window._rz=setTimeout(()=>{if(R.doc&&!$("#reader").hidden)relayoutKeep()},200)});
function updateLida(){const p=S.pdfs.items.find(x=>x.id===R.id);$("#v-lida").textContent=p&&p.lida?`Lido até a página ${p.lida}${p.paginas?` de ${p.paginas}`:""}.`:"Nenhuma página marcada como lida."}
$("#v-mark").onclick=()=>{const p=S.pdfs.items.find(x=>x.id===R.id);if(!p)return;p.lida=R.page;save("pdfs");updateLida();toast(`Leitura marcada até a página ${R.page}`)};
/* anotações por PDF */
async function loadNotes(id){
  let txt=lsGet("nota-"+id)?.t||"";
  if(db){try{const s=await db.doc("notas/"+id).get();if(s.exists)txt=s.data().t||""}catch(e){}}
  if(R.id===id&&!R.notesDirty)$("#v-notes").value=txt;
}
let noteT=null;
$("#v-notes").addEventListener("input",()=>{R.notesDirty=true;$("#n-status").textContent="Editando…";clearTimeout(noteT);noteT=setTimeout(flushNotes,900)});
async function flushNotes(){
  clearTimeout(noteT);if(!R.id||!R.notesDirty)return;
  const id=R.id,t=$("#v-notes").value;R.notesDirty=false;lsSet("nota-"+id,{t});
  if(db){try{await db.doc("notas/"+id).set({t,em:new Date().toISOString()});$("#n-status").textContent="Salvo"}catch(e){$("#n-status").textContent="Salvo neste navegador"}}
  else $("#n-status").textContent="Salvo neste navegador";
}
$("#v-del").onclick=()=>{$("#v-confirm").innerHTML=`<div class="confirm notice">Remover este PDF e as anotações dele? Não dá para desfazer. <button class="danger" id="vd-yes">Remover</button><button id="vd-no">Cancelar</button></div>`;
  $("#vd-no").onclick=()=>{$("#v-confirm").innerHTML=""};
  $("#vd-yes").onclick=async()=>{const p=S.pdfs.items.find(x=>x.id===R.id);if(!p)return;
    try{if(p.local)await idbDel(p.id);else if(assets&&p.asset)await assets.delete(p.asset)}catch(e){}
    if(db){try{await db.doc("notas/"+p.id).delete()}catch(e){}}
    try{localStorage.removeItem(LS+"capa-"+p.id);localStorage.removeItem(LS+"nota-"+p.id)}catch(e){}
    S.pdfs.items=S.pdfs.items.filter(x=>x.id!==p.id);R.notesDirty=false;await save("pdfs");
    await closeReader();toast("PDF removido")};
};
window.addEventListener("pagehide",flushNotes);

/* ---------- Ajustes ---------- */
function rAjustes(){
  $("#a-inicio").value=S.config.inicio;$("#a-prova").value=S.config.prova;$("#a-foco").value=S.config.foco;$("#a-pausa").value=S.config.pausa;
  rDados();
  rSync();
  $("#a-sync").textContent=cloud?"Seu progresso fica salvo na nuvem e aparece no celular e no computador.":db?"Conectando à nuvem…":"Seu progresso está salvo só neste aparelho. Conecte a nuvem abaixo para usar no celular e no computador.";
}
$("#a-save").onclick=()=>{
  const i=$("#a-inicio").value,p=$("#a-prova").value;if(!i||!p){toast("Preencha as duas datas.");return}
  let d=parse(i);const wd=(d.getDay()+6)%7;if(wd)d=addDays(d,-wd);
  S.config.inicio=iso(d);S.config.prova=p;S.config.foco=Math.max(10,+$("#a-foco").value||50);S.config.pausa=Math.max(1,+$("#a-pausa").value||10);
  save("config");resetTimer();rAjustes();renderCountdown();toast(wd?"Ajustes salvos. O início foi movido para a segunda-feira da mesma semana.":"Ajustes salvos");
};

/* ---------- Backup ---------- */
const clone=o=>JSON.parse(JSON.stringify(o));
function fmtBytes(b){return b>1048576?(b/1048576).toFixed(1).replace(".",",")+" MB":Math.max(1,Math.round(b/1024))+" KB"}
async function rDados(){
  const ub=lsGet("ultimoBackup");
  $("#d-last").textContent=ub?`Último backup: ${fmt(ub.em.slice(0,10))}`:"Nenhum backup feito ainda.";
  let txt=`${S.pdfs.items.length} PDF${S.pdfs.items.length===1?"":"s"} · ${S.simulados.items.length} simulado${S.simulados.items.length===1?"":"s"} · ${Object.keys(S.topicos.m).length} assuntos estudados.`;
  try{if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();txt+=` Espaço usado: ${fmtBytes(e.usage||0)}.`}
      if(navigator.storage&&navigator.storage.persisted){const ok=await navigator.storage.persisted();txt+=ok?" Armazenamento protegido contra limpeza automática.":""}}catch(e){}
  $("#d-info").textContent=txt;
}
function blobToB64(blob){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=()=>rej(r.error);r.readAsDataURL(blob)})}
function b64ToBlob(b64){const bin=atob(b64);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new Blob([u],{type:"application/pdf"})}
async function saveFile(name,blob){
  const a=document.createElement("a");const u=URL.createObjectURL(blob);a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},2000);return true;
}
$("#d-export").onclick=async()=>{
  const b=$("#d-export");b.disabled=true;b.textContent="Preparando…";
  try{
    await flushNotes();
    const out={app:"qg-pmpe",versao:1,criado:new Date().toISOString(),estado:{},notas:{},pdfs:{}};
    for(const k of Object.keys(DEF))out.estado[k]=S[k];
    for(const p of S.pdfs.items){let t=lsGet("nota-"+p.id)?.t;if(db){try{const s=await db.doc("notas/"+p.id).get();if(s.exists)t=s.data().t}catch(e){}}if(t)out.notas[p.id]=t}
    if($("#d-pdfs").checked){for(const p of S.pdfs.items){try{let blob=null;if(p.local)blob=await idbGet(p.id);else if(p.asset&&assets){blob=await assets.baixar(p.asset)}if(blob)out.pdfs[p.id]=await blobToB64(blob)}catch(e){}}}
    const ok=await saveFile(`backup-qg-pmpe-${iso(today())}.json`,new Blob([JSON.stringify(out)],{type:"application/json"}));
    if(ok){lsSet("ultimoBackup",{em:new Date().toISOString()});toast("Backup baixado. Guarde o arquivo em local seguro (Drive, pendrive).");rDados()}
  }catch(e){toast("Não foi possível gerar o backup. Tente de novo.")}
  b.disabled=false;b.textContent="Baixar backup";
};
let pendingImport=null;
$("#d-import").onchange=async e=>{
  const f=e.target.files[0];e.target.value="";if(!f)return;
  let d;try{d=JSON.parse(await f.text())}catch(err){toast("Esse arquivo não é um backup válido do QG.");return}
  if(!d||d.app!=="qg-pmpe"||!d.estado){toast("Esse arquivo não é um backup válido do QG.");return}
  pendingImport=d;
  const np=(d.estado.pdfs?.items||[]).length,nf=Object.keys(d.pdfs||{}).length;
  $("#d-confirm").innerHTML=`<div class="confirm notice">Restaurar o backup de ${fmt(d.criado.slice(0,10))} (${(d.estado.simulados?.items||[]).length} simulados, ${np} PDFs${np&&nf<np?`, ${nf} com arquivo`:""})? Isso substitui o progresso atual. <button class="danger" id="di-yes">Restaurar</button><button id="di-no">Cancelar</button></div>`;
  $("#di-no").onclick=()=>{pendingImport=null;$("#d-confirm").innerHTML=""};
  $("#di-yes").onclick=()=>applyImport();
};
async function applyImport(){
  const d=pendingImport;if(!d)return;pendingImport=null;
  $("#d-confirm").innerHTML=`<div class="notice">Restaurando…</div>`;
  try{
    for(const k of Object.keys(DEF))if(d.estado[k])S[k]=Object.assign(clone(DEF[k]),d.estado[k]);
    for(const p of S.pdfs.items){const b64=d.pdfs&&d.pdfs[p.id];if(!b64)continue;const blob=b64ToBlob(b64);
      let up=null;if(assets){try{up=await assets.upload(blob,{type:"application/pdf"})}catch(e){}}
      if(up){p.asset=up.id;delete p.local}else{await idbPut(p.id,blob);p.local=true;delete p.asset}}
    for(const [id,t] of Object.entries(d.notas||{})){lsSet("nota-"+id,{t});if(db){try{await db.doc("notas/"+id).set({t,em:new Date().toISOString()})}catch(e){}}}
    for(const k of Object.keys(DEF))await save(k);
    $("#d-confirm").innerHTML="";resetTimer();renderAll();toast("Backup restaurado");
  }catch(e){$("#d-confirm").innerHTML="";toast("Não foi possível restaurar o backup.")}
}


/* ---------- Nuvem: senha e status ---------- */
function rSync(){
  const el=$("#sync-status");if(!el)return;
  const st=Nuvem.statusAtual;
  if(!Nuvem.ativo()){el.innerHTML=`<span class="dot" style="--c:var(--ink-3)"></span> Desconectado. O progresso fica só neste aparelho.`;$("#sync-entrar").hidden=false;$("#sync-sair").hidden=true;return}
  el.innerHTML=st==="ok"?`<span class="dot" style="--c:var(--good)"></span> Conectado. Celular e computador veem os mesmos dados.`
    :st==="senha"?`<span class="dot" style="--c:var(--red)"></span> A senha não confere mais. Saia e entre de novo.`
    :st==="offline"?`<span class="dot" style="--c:#d29a1c"></span> Sem conexão. O que você fizer fica no aparelho e sobe quando a internet voltar.`
    :`<span class="dot" style="--c:var(--ink-3)"></span> Conectando…`;
  $("#sync-entrar").hidden=true;$("#sync-sair").hidden=false;
}
async function entrarNuvem(campo,botao,msg){
  const s=campo.value.trim();if(!s){campo.focus();return}
  botao.disabled=true;msg.textContent="Verificando…";
  try{await Nuvem.entrar(s);msg.textContent="Conectado. Carregando seus dados…";location.reload()}
  catch(e){msg.textContent=e&&e.code==="senha"?"Senha incorreta.":"Sem conexão com o servidor. Tente de novo."}
  botao.disabled=false;
}
function pedirSenha(){
  try{if(localStorage.getItem(LS+"nuvem-depois"))return}catch(e){}
  const m=$("#login");m.hidden=false;setTimeout(()=>$("#login-senha").focus(),50);
}
$("#login-ok").onclick=()=>entrarNuvem($("#login-senha"),$("#login-ok"),$("#login-msg"));
$("#login-senha").onkeydown=e=>{if(e.key==="Enter")$("#login-ok").click()};
$("#login-depois").onclick=()=>{try{localStorage.setItem(LS+"nuvem-depois","1")}catch(e){}$("#login").hidden=true};
$("#sync-ok").onclick=()=>entrarNuvem($("#sync-senha"),$("#sync-ok"),$("#sync-msg"));
$("#sync-senha").onkeydown=e=>{if(e.key==="Enter")$("#sync-ok").click()};
$("#sync-sair").onclick=()=>{Nuvem.sair();try{localStorage.setItem(LS+"nuvem-depois","1")}catch(e){}location.reload()};

/* ---------- Início ---------- */
buildSimFields();restoreTimer();route();
/* Sincronização com a nuvem (public/js/nuvem.js) */
Nuvem.fonte=k=>S[k];
Nuvem.pendente=k=>Boolean(deb[k]||saving[k]||queued[k]);
Nuvem.aoMudarStatus=st=>{if(st==="offline")markSaved("offline");else if(st==="ok")markSaved("nuvem");rSync()};
(async()=>{
  try{ if(Nuvem.ativo()){
    db=Nuvem.db();assets=Nuvem.assets();rPdfs&&(!$("#v-pdfs").hidden)&&rPdfs();
    const keys=Object.keys(DEF);let first=0;
    keys.forEach(k=>{
      db.doc("estado/"+k).onSnapshot(snap=>{
        if(snap.metadata.hasPendingWrites)return;
        if(snap.exists){S[k]=Object.assign(JSON.parse(JSON.stringify(DEF[k])),snap.data());S[k]=JSON.parse(JSON.stringify(S[k]));lsSet(k,S[k])}
        else if(!snap.metadata.fromCache){const local=lsGet(k);if(local)save(k)}
        if(!snap.metadata.fromCache&&!cloud){first++;if(first===keys.length)cloud=true}
        renderAll();
      },()=>{});
    });
  } else pedirSenha();
  }catch(e){}
})();
})();
