// Tes browser (opsional): butuh paket "playwright". Jalankan: node test/e2e.js
const {chromium}=require('playwright'),server=require('../server');
const ok=(c,m)=>{if(!c)throw new Error(m)};
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
server.listen(0,async()=>{const url='http://localhost:'+server.address().port,br=await chromium.launch(),errs=[];let step='';
try{
  const open=async()=>{const c=await br.newContext(),p=await c.newPage();p.on('pageerror',e=>errs.push(step+': '+e.message));p.on('console',m=>m.type()=='error'&&!/Failed to load resource|ERR_/.test(m.text())&&errs.push(m.text()));p.on('dialog',d=>d.accept('Balasan uji'));await p.goto(url,{waitUntil:'domcontentloaded'});return p};
  const p=await open(),ev=(f,a)=>p.evaluate(f,a),feed=()=>ev(()=>$('feed').textContent);
  step='dark default';ok(await ev(()=>document.documentElement.classList.contains('dark')),'dark harus default');
  step='post';await ev(()=>{$('tw').value='Halo dunia #Uji';submitTweet()});ok((await feed()).includes('Halo dunia'),'post tidak tampil');
  step='thread';await ev(()=>{$('tw').value='Utas satu';addThread();document.querySelector('.thr').value='Utas dua';submitTweet()});ok((await feed()).includes('Utas 2/2'),'thread');
  step='like/repost/bookmark';await ev(()=>{act(1,'lk');act(1,'rt');act(1,'bm')});ok(await ev(()=>P[P.findIndex(x=>x.id==1)].l==49&&P.find(x=>x.id==1).r==6&&P.find(x=>x.id==1).bm),'aksi');
  step='quote';await ev(()=>{quote(1);$('tw').value='Kutipan uji';submitTweet()});ok((await feed()).includes('Alexandro'),'quote');
  step='poll';await ev(()=>{togglePoll();const o=document.querySelectorAll('.po');o[0].value='A';o[1].value='B';$('tw').value='Pilih';submitTweet()});await ev(()=>vote(P[0].id,0));ok((await feed()).includes('100%'),'poll');
  step='reply';await ev(()=>reply(1));ok(await ev(()=>P.find(x=>x.id==1).c==15),'reply');
  step='explore';await ev(()=>goTag('#Uji'));ok((await ev(()=>$('exp').textContent)).includes('Halo dunia'),'hashtag');
  step='follow';await ev(()=>{follow('@alex_dev');setFeed('fo')});ok((await feed()).includes('Selamat datang'),'following');await ev(()=>setFeed('fy'));
  step='bookmark';await ev(()=>switchTab('bookmarks'));ok((await ev(()=>$('bml').textContent)).includes('Selamat datang'),'bookmark');
  step='grup';for(const [t,k] of [['communities','Grup Uji'],['lists','Daftar Uji']]){await ev(([t,k])=>{switchTab(t);$('gn-'+t).value=k;mkG(t)},[t,k]);ok((await ev(t=>$('g-'+t).textContent,t)).includes(k),'buat '+t)}
  step='media';await p.setInputFiles('#v-home input[type=file]',{name:'a.png',mimeType:'image/png',buffer:png});await ev(()=>{switchTab('home');const f=$('flt');f.value='grayscale(1)';f.dispatchEvent(new Event('change'));$('tw').value='Foto';submitTweet()});ok(await ev(()=>/grayscale/.test($('feed').innerHTML)),'filter foto');
  step='foto+video';await p.setInputFiles('#v-home input[type=file]',[{name:'a.png',mimeType:'image/png',buffer:png},{name:'b.webm',mimeType:'video/webm',buffer:Buffer.from('x')}]);await ev(()=>{$('tw').value='Transisi';submitTweet()});ok(await ev(()=>/class="fade/.test($('feed').innerHTML)),'transisi foto ke video');
  step='settings';await ev(()=>{switchTab('settings');S.theme='light';apply()});ok(await ev(()=>!document.documentElement.classList.contains('dark')),'light');await ev(()=>{S.theme='dark';S.lang='en';apply()});ok(await ev(()=>document.querySelector('[data-t=home]').textContent=='Home'&&document.documentElement.classList.contains('dark')),'bahasa/dark');await ev(()=>{S.lang='id';apply()});
  step='mute/block/premium';await ev(()=>{flg(0,'mu');flg(1,'bl')});ok(!(await feed()).includes('@alex_dev · 2j'),'mute');await ev(()=>{flg(0,'mu');flg(1,'bl');togglePremium()});ok(await ev(()=>me.ver==1&&$('sbn').innerHTML.includes('circle-check')),'premium');
  step='password';await ev(()=>{$('pw0').value='lama123';$('pw1').value='baru12345';chPw()});ok(await ev(()=>$('toast').textContent.includes('valid')),'password');
  step='notifikasi';await new Promise(r=>setTimeout(r,2800));ok(await ev(()=>unread>0),'notifikasi masuk');
  step='profil';await ev(()=>{openEdit();$('en').value='Nama Baru';$('eu').value='nama_baru';saveProfile();switchTab('profile')});ok((await ev(()=>$('pn').textContent)).includes('Nama Baru'),'profil');
  step='spaces';await ev(()=>{openSpace();sfx('clap');sfx('ding');sfx('drum');closeSpace()});
  step='dm demo';await ev(()=>{switchTab('messages');openChat('@alex_dev','Alexandro');$('ci').value='hai';sendChat()});await new Promise(r=>setTimeout(r,1100));ok((await ev(()=>$('cb').textContent)).includes('balasan otomatis'),'dm demo');
  step='dm realtime';const q=await open();await Promise.all([p,q].map(x=>x.waitForFunction(()=>online.length>=1)));
  await ev(()=>{openChat(online[0].id,'x');$('ci').value='dari A';sendChat()});await q.waitForFunction(()=>Object.values(chats).flat().some(m=>m.t=='dari A'));
  step='persist';await p.reload({waitUntil:'domcontentloaded'});ok(await ev(()=>me.n=='Nama Baru'),'persist profil');
  step='hapus akun';await ev(()=>delAcc());ok(await ev(()=>me.n=='Lunox User'),'hapus akun');
  ok(!errs.length,'error JS: '+errs.join(' | '));console.log('OK: tes browser lulus (tanpa error JS)');
}catch(e){console.error('GAGAL di langkah "'+step+'":',e.message);process.exitCode=1}finally{await br.close();server.close();setTimeout(()=>process.exit(process.exitCode||0),200)}});
