const $=i=>document.getElementById(i),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AVU='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
const T={id:{home:'Beranda',explore:'Jelajahi',notifications:'Notifikasi',messages:'Pesan',grok:'Grok AI (Nexus)',communities:'Komunitas',lists:'Daftar',bookmarks:'Bookmark',profile:'Profil',settings:'Pengaturan',post:'Post',ph:'Apa yang sedang terjadi?!'},
en:{home:'Home',explore:'Explore',notifications:'Notifications',messages:'Messages',grok:'Grok AI (Nexus)',communities:'Communities',lists:'Lists',bookmarks:'Bookmarks',profile:'Profile',settings:'Settings',post:'Post',ph:"What's happening?!"}};
const NAV=[['home','fa-house'],['explore','fa-hashtag'],['notifications','fa-bell'],['messages','fa-envelope'],['grok','fa-wand-magic-sparkles'],['communities','fa-user-group'],['lists','fa-list'],['bookmarks','fa-bookmark'],['profile','fa-user'],['settings','fa-gear']];
const FIL=[['Normal',''],['Hitam putih','grayscale(1)'],['Sepia','sepia(.8)'],['Cerah','saturate(1.6) contrast(1.1)'],['Hangat','sepia(.35) saturate(1.3)'],['Dingin','hue-rotate(20deg) saturate(1.2)']];
const ICON={Komunitas:'fa-user-group',Grup:'fa-users',Saluran:'fa-bullhorn',Daftar:'fa-list'};
const DEF={me:{n:'Lunox User',u:'@lunox_official',bio:'Membangun web bersama X-Lunox. 🚀',av:AVU,ver:0,ban:''},S:{theme:'dark',lang:'id',font:'16',rm:0,priv:0,tfa:0,nLike:1,nFollow:1,nMention:1,pers:1}};
let me={...DEF.me},S={...DEF.S};
try{const d=JSON.parse(localStorage.getItem('xl')||'{}');me={...me,...d.me};S={...S,...d.S}}catch(e){}
const save=()=>{try{localStorage.setItem('xl',JSON.stringify({me:{...me,av:me.av.startsWith('blob')?AVU:me.av},S}))}catch(e){}};

let U=[{n:'Alexandro',u:'@alex_dev',v:1},{n:'Nadia Putri',u:'@nadia.p',v:1,f:1},{n:'Raka Codes',u:'@raka_codes'},{n:'Sinta Art',u:'@sinta_art'}];
let nid=10,P=[
{id:1,u:'@alex_dev',t:'Selamat datang di X-Lunox versi modular! 🚀✨ #XLunox',tm:'2j',l:48,r:5,c:14},
{id:2,u:'@nadia.p',t:'Nexus Sealyn AI sekarang ada di tab Grok. Coba tanya apa saja! #NexusSealynAI',tm:'5j',l:120,r:31,c:9},
{id:3,u:'@raka_codes',t:'Hari ke-30 ngoding tiap pagi. Pelan tapi konsisten. Kamu tim apa? #BuildInPublic',tm:'1h',l:76,r:8,c:4,poll:{o:[{t:'Tim pagi',v:42},{t:'Tim malam',v:31}],my:-1}},
{id:4,u:'@sinta_art',t:'Sketsa baru minggu ini 🎨 #XLunox',tm:'2h',l:33,r:2,c:1}];
let G=[{k:'Komunitas',n:'Pengembang Indonesia',m:1280},{k:'Komunitas',n:'Desain & Seni',m:640},{k:'Grup',n:'Ngobrol Santai',m:58},{k:'Saluran',n:'Berita Teknologi',m:5400},{k:'Daftar',n:'Akun teknologi',m:12}];
let N=[],unread=0,cur='home',fd='fy',Q='',med=null,pollOn=0,qid=0,to=null,ac,ms;

const A=u=>u==me.u?{n:me.n,u:me.u,av:me.av,v:me.ver}:U.find(x=>x.u==u)||{n:u,u};
const CK=v=>v?'<i class="fa-solid fa-circle-check text-twitter-blue text-xs"></i>':'';
const AV=a=>a.av?`<img src="${esc(a.av)}" class="w-10 h-10 rounded-full object-cover shrink-0">`:`<div class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-white" style="background:hsl(${[...a.u].reduce((s,c)=>s+c.charCodeAt(0),0)*37%360} 55% 40%)">${esc(a.n[0])}</div>`;
const empty=t=>`<p class="p-8 text-center text-gray-500">${t}</p>`;
const ok=p=>{const a=A(p.u);return !a.bl&&!a.mu};
const vis=p=>ok(p)&&(fd=='fy'||p.u==me.u||A(p.u).f);
const tags=t=>esc(t).replace(/#(\w+)/g,'<a class="text-twitter-blue hover:underline cursor-pointer" onclick="goTag(\'#$1\')">#$1</a>');
const vs=m=>m.s+(m.t1?`#t=${m.t0||0},${m.t1}`:m.t0?`#t=${m.t0}`:'');
function toast(t){const e=$('toast');e.textContent=t;e.classList.remove('hidden');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.add('hidden'),2200)}

const mediaH=(m,c)=>m.k=='iv'?`<div class="relative aspect-video overflow-hidden"><video src="${vs({s:m.v,t0:m.t0,t1:m.t1})}" autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover"></video><img src="${m.s}" class="fade absolute inset-0 w-full h-full object-cover" style="filter:${m.f}"></div>`:m.k=='v'?`<video src="${vs(m)}" controls${c?'':' loop'} class="w-full aspect-video object-cover" style="filter:${m.f}"></video>`:`<img src="${m.s}" class="w-full aspect-video object-cover" style="filter:${m.f}">`;
function pollH(p){const o=p.poll.o,s=o.reduce((a,x)=>a+x.v,0),my=p.poll.my;
 return `<div class="mt-3 space-y-2">${o.map((x,i)=>my<0?`<button onclick="vote(${p.id},${i})" class="pill w-full text-left text-twitter-blue">${esc(x.t)}</button>`:`<div class="relative rounded-lg overflow-hidden bg-gray-200 dark:bg-[#202327] px-3 py-2 text-sm"><div class="absolute inset-y-0 left-0 bg-twitter-blue/40" style="width:${Math.round(x.v/(s||1)*100)}%"></div><span class="relative">${esc(x.t)}${my==i?' ✓':''}</span><b class="relative float-right">${Math.round(x.v/(s||1)*100)}%</b></div>`).join('')}<p class="text-xs text-gray-500">${s} suara</p></div>`}
function pHTML(p){const a=A(p.u),m=p.m,q=p.q&&P.find(x=>x.id==p.q),pop=p.pp?' pop':'';p.pp=0;
 return `<article class="p-4 border-b bd"><div class="flex gap-3">${AV(a)}<div class="flex-1 min-w-0">
 <div class="flex items-center gap-1 flex-wrap"><b>${esc(a.n)}</b>${CK(a.v)}<span class="text-gray-500 text-sm">${esc(a.u)} · ${p.tm}</span>${p.th?`<span class="text-xs text-twitter-blue ml-1">Utas ${p.th}</span>`:''}</div>
 <p class="mt-1 text-sm leading-relaxed whitespace-pre-wrap break-words">${tags(p.t)}</p>
 ${m?`<div class="mt-3 rounded-2xl overflow-hidden border bd">${mediaH(m)}</div>`:''}
 ${p.poll?pollH(p):''}
 ${q?`<div class="mt-3 border bd rounded-2xl p-3 text-sm"><b>${esc(A(q.u).n)}</b> <span class="text-gray-500">${esc(q.u)}</span><p class="mt-1">${tags(q.t)}</p></div>`:''}
 <div class="flex justify-between max-w-md mt-3 text-gray-500 text-sm">
 <button class="flex gap-2 items-center hover:text-twitter-blue" onclick="reply(${p.id})"><i class="fa-regular fa-comment"></i>${p.c}</button>
 <button class="flex gap-2 items-center hover:text-green-500 ${p.rt?'text-green-500':''}" onclick="act(${p.id},'rt')"><i class="fa-solid fa-retweet"></i>${p.r}</button>
 <button class="hover:text-twitter-blue" title="Kutip" onclick="quote(${p.id})"><i class="fa-solid fa-quote-left"></i></button>
 <button class="flex gap-2 items-center hover:text-pink-600 ${p.lk?'text-pink-600':''}" onclick="act(${p.id},'lk')"><i class="${p.lk?'fa-solid':'fa-regular'} fa-heart${pop}"></i>${p.l}</button>
 <button class="hover:text-twitter-blue ${p.bm?'text-twitter-blue':''}" onclick="act(${p.id},'bm')"><i class="${p.bm?'fa-solid':'fa-regular'} fa-bookmark"></i></button></div>
 </div></div></article>`}

function act(id,k){const p=P.find(x=>x.id==id);
 if(k=='lk'){p.lk=!p.lk;p.l+=p.lk?1:-1;p.pp=p.lk}
 else if(k=='rt'){p.rt=!p.rt;p.r+=p.rt?1:-1;if(p.rt)toast('Di-repost')}
 else{p.bm=!p.bm;toast(p.bm?'Disimpan ke Bookmark':'Dihapus dari Bookmark')}
 renderAll()}
function vote(id,i){const p=P.find(x=>x.id==id);if(p.poll.my>=0)return;p.poll.my=i;p.poll.o[i].v++;renderAll()}
function reply(id){const t=prompt('Balas post ini:');if(t&&t.trim()){P.find(x=>x.id==id).c++;toast('Balasan terkirim');renderAll()}}
function quote(id){qid=id;drawQ();switchTab('home');$('tw').focus()}
function drawQ(){const q=P.find(x=>x.id==qid);$('qbox').innerHTML=q?`<div class="border bd rounded-2xl p-3 text-sm mb-3 relative"><b>${esc(A(q.u).n)}</b> <span class="text-gray-500">${esc(q.u)}</span><p>${tags(q.t)}</p><button onclick="qid=0;drawQ()" class="absolute top-2 right-2 text-gray-500"><i class="fa-solid fa-xmark"></i></button></div>`:''}

function setFeed(f){fd=f;[['fy','tfy'],['fo','tfo']].forEach(([k,i])=>$(i).className='tab hv'+(f==k?' on':''));renderFeed()}
function renderFeed(){$('feed').innerHTML=P.filter(vis).map(pHTML).join('')||empty('Belum ada post.')}
function trends(){const c={};P.forEach(p=>(p.t.match(/#\w+/g)||[]).forEach(h=>c[h]=(c[h]||0)+1));return Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,6)}
const trendH=()=>trends().map(([k,n])=>`<div class="py-2 px-2 hv cursor-pointer rounded-lg" onclick="goTag('${k}')"><p class="text-xs text-gray-500">Trending</p><p class="font-bold">${k}</p><p class="text-xs text-gray-500">${n} post</p></div>`).join('')||'<p class="text-sm text-gray-500">Belum ada tren.</p>';
function renderTrend(){$('trend').innerHTML=trendH()}
function goTag(t){Q=t;switchTab('explore');$('q').value=t;renderExplore()}
function renderExplore(){const q=Q.toLowerCase();$('exp').innerHTML=q?P.filter(p=>ok(p)&&(p.t+' '+A(p.u).n+' '+p.u).toLowerCase().includes(q)).map(pHTML).join('')||empty('Tidak ada hasil untuk "'+esc(Q)+'"'):'<h2 class="font-bold text-xl mb-2">Tren untuk Anda</h2>'+trendH()}
function renderWho(){$('who').innerHTML=U.filter(u=>!u.bl).map(u=>`<div class="flex items-center gap-2 py-2">${AV(u)}<div class="flex-1 min-w-0 leading-tight"><p class="font-bold text-sm truncate">${esc(u.n)} ${CK(u.v)}</p><p class="text-xs text-gray-500">${u.u}</p></div><button onclick="follow('${u.u}')" class="pill ${u.f?'':'bg-black text-white dark:bg-white dark:text-black'}">${u.f?'Mengikuti':'Ikuti'}</button></div>`).join('')}
function follow(u){const x=U.find(y=>y.u==u);x.f=!x.f;toast(x.f?'Mengikuti '+u:'Berhenti mengikuti '+u);renderAll()}
function renderBM(){$('bml').innerHTML=P.filter(p=>p.bm).map(pHTML).join('')||empty('Belum ada bookmark. Ketuk ikon bookmark pada post.')}
function renderProfile(){$('pn').innerHTML=esc(me.n)+' '+CK(me.ver)+(S.priv?' <i class="fa-solid fa-lock text-sm text-gray-500"></i>':'');$('pu').textContent=me.u;$('pb').textContent=me.bio;$('pc').textContent=U.filter(u=>u.f).length+' Mengikuti';$('pp').innerHTML=P.filter(p=>p.u==me.u).map(pHTML).join('')||empty('Belum ada post.')}

/* Composer */
function pickMedia(e){const fs=[...e.target.files],im=fs.find(f=>f.type.startsWith('image')),vd=fs.find(f=>f.type.startsWith('video'));if(!im&&!vd)return;const u=f=>URL.createObjectURL(f);med=im&&vd?{k:'iv',s:u(im),v:u(vd),f:''}:{k:im?'i':'v',s:u(im||vd),f:''};e.target.value='';$('flt').value='';drawMedia()}
function drawMedia(){const b=$('mprev'),t=$('mtools');b.classList.toggle('hidden',!med);t.classList.toggle('hidden',!med);t.classList.toggle('flex',!!med);if(!med)return;
 b.innerHTML=mediaH(med,1)+'<button onclick="med=null;drawMedia()" class="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 z-10"><i class="fa-solid fa-xmark"></i></button>';
 $('trim').classList.toggle('hidden',med.k=='i')}
function addThread(){const t=document.createElement('textarea');t.rows=2;t.placeholder='Lanjutkan utas…';t.className='thr w-full bg-transparent resize-none outline-none border-t bd pt-2 mt-2';$('thr').appendChild(t)}
function togglePoll(){pollOn=!pollOn;const b=$('pollbox');b.classList.toggle('hidden',!pollOn);if(pollOn)b.innerHTML=[1,2].map(i=>`<input class="po in rounded-lg w-full text-sm" placeholder="Pilihan ${i}">`).join('')+'<button onclick="addOpt()" class="text-twitter-blue text-sm">+ Tambah pilihan</button>'}
function addOpt(){const o=document.querySelectorAll('.po');if(o.length<4)o[o.length-1].insertAdjacentHTML('afterend',`<input class="po in rounded-lg w-full text-sm mt-2" placeholder="Pilihan ${o.length+1}">`)}
function submitTweet(){
 const items=[$('tw'),...document.querySelectorAll('.thr')].map(e=>e.value.trim()).filter(Boolean);let poll=null;
 if(pollOn){const o=[...document.querySelectorAll('.po')].map(i=>i.value.trim()).filter(Boolean);if(o.length<2)return toast('Polling butuh minimal 2 pilihan');poll={o:o.map(t=>({t,v:0})),my:-1}}
 if(!items.length&&!med&&!poll)return toast('Tulis sesuatu dulu');if(!items.length)items.push('');
 const n=items.length;
 items.forEach((t,i)=>{const p={id:++nid,u:me.u,t,tm:'baru',l:0,r:0,c:0};if(n>1)p.th=`${i+1}/${n}`;if(!i){if(med)p.m={...med};if(poll)p.poll=poll;if(qid)p.q=qid}P.splice(i,0,p)});
 $('tw').value='';$('cnt').textContent='';$('thr').innerHTML='';pollOn=0;$('pollbox').classList.add('hidden');med=null;qid=0;drawMedia();drawQ();
 setTimeout(()=>notify('lk',U[1].n+' menyukai post kamu'),2500);setTimeout(()=>notify('fl',U[2].n+' mulai mengikuti kamu'),5000);
 renderAll()}

/* Notifikasi */
function badge(){const b=$('nb');b.textContent=unread;b.classList.toggle('hidden',!unread)}
function notify(t,x){if(t=='lk'&&!S.nLike||t=='fl'&&!S.nFollow||t=='mn'&&!S.nMention)return;N.unshift(x);unread++;badge();if(cur=='notifications')renderN()}
function renderN(){unread=0;badge();$('nl').innerHTML=N.map(x=>`<div class="p-4 border-b bd text-sm"><i class="fa-solid fa-bell text-twitter-blue mr-2"></i>${esc(x)}</div>`).join('')||empty('Belum ada notifikasi.')}

/* Pesan: real-time lewat Server-Sent Events (server.js); akun demo membalas otomatis */
const cid=Math.random().toString(36).slice(2,8),chats={};let online=[];
function contacts(){$('online').innerHTML=[...online,...U].map(u=>({id:u.id||u.u,n:u.n,v:u.v})).map(u=>`<div data-id="${esc(u.id)}" data-n="${esc(u.n)}" onclick="openChat(this.dataset.id,this.dataset.n)" class="p-3 flex items-center gap-3 hv cursor-pointer">${AV({n:u.n,u:u.id})}<div class="min-w-0"><p class="font-bold text-sm truncate">${esc(u.n)} ${CK(u.v)}</p><p class="text-xs text-gray-500">${u.id[0]=='@'?esc(u.id):'online'}</p></div></div>`).join('')}
function bubble(c,k){const d=document.createElement('div'),x=document.createElement('div');d.className='flex '+(k=='s'?'justify-end':'justify-start');x.className='max-w-xs px-4 py-2.5 rounded-2xl text-sm '+(k=='s'?'bg-twitter-blue text-white rounded-br-none':'bg-gray-200 dark:bg-[#202327] rounded-bl-none');x.textContent=c;d.appendChild(x);$('cb').appendChild(d);$('cb').scrollTop=1e9}
function openChat(id,n){to=id;$('to').textContent='· '+n;$('cb').innerHTML='';(chats[id]||[]).forEach(m=>bubble(m.t,m.k))}
function rcv(from,t,name){(chats[from]=chats[from]||[]).push({t,k:'r'});if(to==from&&cur=='messages')bubble(t,'r');else notify('mn','Pesan baru dari '+(name||from))}
function sendChat(){const i=$('ci'),t=i.value.trim(),dst=to;if(!t)return;if(!dst)return toast('Pilih kontak dulu');(chats[dst]=chats[dst]||[]).push({t,k:'s'});bubble(t,'s');i.value='';
 if(dst[0]=='@')setTimeout(()=>rcv(dst,'Halo! Ini balasan otomatis dari akun demo.'),800);
 else fetch('/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({from:cid,to:dst,text:t})}).then(r=>{if(!r.ok)toast('Pesan tidak terkirim')}).catch(()=>toast('Server tidak terhubung'))}
if(window.EventSource){const es=new EventSource('/events?id='+cid+'&name='+encodeURIComponent(me.n));es.addEventListener('users',e=>{online=JSON.parse(e.data).filter(u=>u.id!=cid);contacts()});es.addEventListener('msg',e=>{const d=JSON.parse(e.data);rcv(d.from,d.text,d.name)})}

/* Komunitas, grup, saluran, daftar */
function renderG(tab){const L=tab=='lists';
 $('g-'+tab).innerHTML=`<div class="p-4 border-b bd flex gap-2"><input id="gn-${tab}" placeholder="Nama ${L?'daftar':'baru'}" class="in rounded-full flex-1 text-sm">${L?'':'<select id="gk" class="in rounded-full text-sm"><option>Komunitas</option><option>Grup</option><option>Saluran</option></select>'}<button onclick="mkG('${tab}')" class="pri text-sm">Buat</button></div>`+
 G.map((g,i)=>[g,i]).filter(([g])=>(g.k=='Daftar')==L).map(([g,i])=>`<div class="p-4 border-b bd flex items-center gap-3"><div class="w-12 h-12 rounded-xl bg-twitter-blue/20 text-twitter-blue flex items-center justify-center"><i class="fa-solid ${ICON[g.k]}"></i></div><div class="flex-1 min-w-0"><p class="font-bold truncate">${esc(g.n)}</p><p class="text-xs text-gray-500">${g.k} · ${g.m} ${L?'akun':'anggota'}</p></div><button onclick="joinG(${i})" class="pill ${g.j?'':'bg-black text-white dark:bg-white dark:text-black'}">${g.j?(L?'Disimpan':'Bergabung'):(L?'Ikuti':'Gabung')}</button></div>`).join('')}
function mkG(tab){const n=$('gn-'+tab).value.trim();if(!n)return toast('Isi nama dulu');G.unshift({k:tab=='lists'?'Daftar':$('gk').value,n,m:1,j:1});toast('Berhasil dibuat');renderG(tab)}
function joinG(i){const g=G[i];g.j=!g.j;g.m+=g.j?1:-1;renderG(cur)}

/* Pengaturan */
const tg=(k,l)=>`<label class="flex justify-between items-center"><span>${l}</span><input type="checkbox" ${S[k]?'checked':''} onchange="S.${k}=+this.checked;apply()" class="w-5 h-5 accent-[#1d9bf0]"></label>`;
const sl=(k,l,o)=>`<label class="flex justify-between items-center"><span>${l}</span><select onchange="S.${k}=this.value;apply()" class="in rounded">${o.map(([v,n])=>`<option value="${v}" ${S[k]==v?'selected':''}>${n}</option>`).join('')}</select></label>`;
const sec=(t,b)=>`<details class="border-b bd"><summary class="p-4 cursor-pointer hv font-semibold">${t}</summary><div class="p-4 pt-0 space-y-3 text-sm">${b}</div></details>`;
const bt=(l,f,c='')=>`<button onclick="${f}" class="pill ${c}">${l}</button> `;
function renderSet(){$('sett').innerHTML=
 sec('Akun & password',bt('Edit profil','openEdit()')+'<input id="pw0" type="password" placeholder="Password lama" class="in rounded-lg w-full"><input id="pw1" type="password" placeholder="Password baru (min. 8 karakter)" class="in rounded-lg w-full">'+bt('Ubah password','chPw()'))+
 sec('Privasi & keamanan',tg('priv','Akun privat')+tg('tfa','Verifikasi dua langkah'))+
 sec('Notifikasi',tg('nLike','Suka')+tg('nFollow','Pengikut baru')+tg('nMention','Sebutan'))+
 sec('Aksesibilitas & tampilan',sl('font','Ukuran teks',[[14,'Kecil'],[16,'Normal'],[18,'Besar'],[20,'Sangat besar']])+tg('rm','Kurangi animasi'))+
 sec('Tema gelap / terang',sl('theme','Tema',[['dark','Gelap'],['light','Terang']]))+
 sec('Bahasa',sl('lang','Bahasa',[['id','Indonesia'],['en','English']]))+
 sec('Muted & Blocked',U.map((u,i)=>`<div class="flex items-center gap-2"><span class="flex-1 min-w-0 truncate">${esc(u.n)} <span class="text-gray-500">${u.u}</span></span>${bt(u.mu?'Unmute':'Mute',`flg(${i},'mu')`)}${bt(u.bl?'Buka blokir':'Blokir',`flg(${i},'bl')`)}</div>`).join(''))+
 sec('Data & personalisasi',tg('pers','Personalisasi saran akun')+bt('Unduh data saya','dl()'))+
 sec('Subscription / Premium',`<p>Status: <b>${me.ver?'Premium aktif':'Gratis'}</b></p>`+bt(me.ver?'Batalkan langganan':'Berlangganan','togglePremium()'))+
 sec('Nonaktifkan / hapus akun',bt('Nonaktifkan sementara',"toast('Akun dinonaktifkan (demo, perlu endpoint server)')")+bt('Hapus akun permanen','delAcc()','text-red-500'))}
function rs(){const o=[...$('sett').children].map(d=>d.open);renderSet();[...$('sett').children].forEach((d,i)=>d.open=o[i])}
function flg(i,k){U[i][k]=!U[i][k];rs();renderAll()}
function chPw(){const a=$('pw0').value,b=$('pw1').value;if(!a)return toast('Isi password lama');if(b.length<8)return toast('Password baru minimal 8 karakter');if(a==b)return toast('Password baru harus berbeda');$('pw0').value=$('pw1').value='';toast('Password valid. Hubungkan ke endpoint server untuk menyimpan')}
function dl(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({me,S,posts:P.filter(p=>p.u==me.u)},null,2)],{type:'application/json'}));a.download='data-x-lunox.json';a.click()}
function togglePremium(){me.ver=me.ver?0:1;save();applyMe();toast(me.ver?'Centang biru aktif':'Langganan dibatalkan');renderAll();if(cur=='settings')rs()}
function delAcc(){if(!confirm('Hapus akun permanen? Data lokal akan dihapus.'))return;try{localStorage.removeItem('xl')}catch(e){}P=P.filter(p=>p.u!=me.u);me={...DEF.me};S={...DEF.S};apply();applyMe();switchTab('home');renderAll();toast('Akun dihapus (demo)')}

/* Profil */
function openEdit(){$('en').value=me.n;$('eu').value=me.u;$('eb').value=me.bio;$('ev').value=me.ban;$('edit').classList.replace('hidden','flex')}
function closeEdit(){$('edit').classList.replace('flex','hidden')}
function saveProfile(){const u=$('eu').value.trim().replace(/[^\w.@]/g,''),old=me.u;me.n=$('en').value.trim()||me.n;if(u){me.u=u[0]=='@'?u:'@'+u;P.forEach(p=>{if(p.u==old)p.u=me.u})}me.bio=$('eb').value.trim();me.ban=$('ev').value.trim();const f=$('ea').files[0];if(f)me.av=URL.createObjectURL(f);save();applyMe();closeEdit();renderAll()}
function applyMe(){document.querySelectorAll('.me-av').forEach(i=>i.src=me.av);$('sbn').innerHTML=esc(me.n)+' '+CK(me.ver);$('sbu').textContent=me.u;$('prem').textContent=me.ver?'Batalkan':'Berlangganan';if(me.ban)$('banner').src=me.ban}
function apply(){const d=document.documentElement;d.classList.toggle('dark',S.theme=='dark');d.style.fontSize=S.font+'px';d.classList.toggle('rm',!!S.rm);d.lang=S.lang;
 document.querySelectorAll('[data-t]').forEach(e=>e.textContent=T[S.lang][e.dataset.t]);$('tw').placeholder=T[S.lang].ph;$('whobox').classList.toggle('hidden',!S.pers);save();if(cur=='profile')renderProfile()}

/* Spaces */
function sfx(k){ac=ac||new(window.AudioContext||window.webkitAudioContext)();const t=ac.currentTime,g=ac.createGain();g.connect(ac.destination);
 if(k=='clap'){const b=ac.createBuffer(1,ac.sampleRate*.4,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3);const s=ac.createBufferSource();s.buffer=b;s.connect(g);g.gain.value=.6;s.start()}
 else{const o=ac.createOscillator();o.type=k=='ding'?'sine':'triangle';o.frequency.setValueAtTime(k=='ding'?1320:140,t);if(k=='drum')o.frequency.exponentialRampToValueAtTime(45,t+.25);o.connect(g);g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+(k=='ding'?1:.3));o.start();o.stop(t+1)}}
async function toggleMic(){if(ms){ms.getTracks().forEach(t=>t.stop());ms=null}else{try{ms=await navigator.mediaDevices.getUserMedia({audio:true})}catch(e){return toast('Izin mikrofon ditolak')}}$('sps').textContent=ms?'Mic aktif. Audio antar-pengguna butuh server WebRTC':'Mic mati';$('micb').textContent=ms?'Matikan mic':'Nyalakan mic'}
function openSpace(){$('space').classList.replace('hidden','flex')}
function closeSpace(){if(ms)toggleMic();$('space').classList.replace('flex','hidden')}

/* Navigasi & init */
const R={explore:renderExplore,notifications:renderN,communities:()=>renderG('communities'),lists:()=>renderG('lists'),bookmarks:renderBM,profile:renderProfile,settings:renderSet};
function switchTab(t){cur=t;document.querySelectorAll('.view').forEach(e=>e.classList.add('hidden'));$('v-'+t).classList.remove('hidden');document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('font-bold',b.dataset.tab==t));R[t]&&R[t]();scrollTo(0,0)}
function renderAll(){renderFeed();renderTrend();renderWho();if(cur!='home'&&cur!='settings'&&R[cur])R[cur]()}
$('nav').innerHTML=NAV.map(([k,i])=>`<button data-tab="${k}" onclick="switchTab('${k}')" class="hv flex items-center gap-4 p-3 rounded-full text-xl w-full relative ${k=='grok'?'text-twitter-blue':''}"><i class="fa-solid ${i} text-2xl w-8"></i><span class="hidden xl:inline" data-t="${k}"></span>${k=='notifications'?'<span id="nb" class="hidden absolute top-2 left-6 bg-twitter-blue text-xs text-white rounded-full px-1.5">0</span>':''}</button>`).join('');
$('flt').innerHTML=FIL.map(([n,v])=>`<option value="${v}">${n}</option>`).join('');
$('tw').oninput=()=>$('cnt').textContent=$('tw').value.length||'';
contacts();apply();applyMe();setFeed('fy');renderAll();badge();switchTab('home');
