// Tes tanpa dependensi: file statis, sintaks app.js, dan DM real-time lewat SSE.
const assert=require('assert'),http=require('http'),fs=require('fs'),path=require('path'),vm=require('vm');
const server=require('../server');
const get=(port,p)=>new Promise((ok,no)=>http.get({port,path:p},r=>{r.resume();r.on('end',()=>ok(r.statusCode))}).on('error',no));
const sse=(port,id,name)=>new Promise(ok=>{let buf='';const r=http.get({port,path:`/events?id=${id}&name=${name}`},res=>{res.setEncoding('utf8');res.on('data',c=>buf+=c);ok({raw:()=>buf,close:()=>r.destroy()})})});
const post=(port,body)=>new Promise(ok=>{const q=http.request({port,path:'/send',method:'POST',headers:{'Content-Type':'application/json'}},r=>{r.resume();r.on('end',()=>ok(r.statusCode))});q.end(JSON.stringify(body))});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
server.listen(0,async()=>{const port=server.address().port;
  try{
    for(const f of ['/','/style.css','/app.js'])assert.strictEqual(await get(port,f),200,f);
    assert.strictEqual(await get(port,'/%2e%2e/server.js'),404);
    new vm.Script(fs.readFileSync(path.join(__dirname,'../public/app.js'),'utf8'));
    const a=await sse(port,'aaa','Ani'),b=await sse(port,'bbb','Budi');await wait(150);
    assert(b.raw().includes('"id":"aaa"'),'daftar online harus berisi Ani');
    assert.strictEqual(await post(port,{from:'aaa',to:'bbb',text:'halo'}),200);await wait(150);
    assert(b.raw().includes('"text":"halo"'),'pesan harus sampai ke Budi');
    assert.strictEqual(await post(port,{from:'aaa',to:'zzz',text:'x'}),404);
    a.close();b.close();console.log('OK: semua tes smoke lulus');server.close(()=>process.exit(0));
  }catch(e){console.error('GAGAL:',e.message);process.exit(1)}
});
