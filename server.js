// X-Lunox: server tanpa dependensi (hanya modul bawaan Node). Jalankan: node server.js
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000,DIR=path.join(__dirname,'public');
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.ico':'image/x-icon'};
const clients=new Map();
const push=(res,ev,data)=>res.write(`event: ${ev}\ndata: ${JSON.stringify(data)}\n\n`);
const roster=()=>{const l=[...clients].map(([id,c])=>({id,n:c.name}));clients.forEach(c=>push(c.res,'users',l))};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/events'){
    const id=(u.searchParams.get('id')||'').replace(/[^\w-]/g,'').slice(0,16),name=(u.searchParams.get('name')||'Pengguna').slice(0,40);
    if(!id){res.writeHead(400);return res.end()}
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});res.write(': ok\n\n');
    clients.set(id,{res,name});roster();
    const ka=setInterval(()=>res.write(': ping\n\n'),25000);
    req.on('close',()=>{clearInterval(ka);clients.delete(id);roster()});return;
  }
  if(u.pathname==='/send'&&req.method==='POST'){
    let b='';req.on('data',c=>{b+=c;if(b.length>1e5)req.destroy()});
    req.on('end',()=>{try{const m=JSON.parse(b),to=clients.get(m.to),from=clients.get(m.from);
      if(!to||!from||typeof m.text!=='string'||!m.text.trim()){res.writeHead(404);return res.end('{"ok":false}')}
      push(to.res,'msg',{from:m.from,name:from.name,text:m.text.slice(0,2000)});
      res.writeHead(200,{'Content-Type':'application/json'});res.end('{"ok":true}');
    }catch(e){res.writeHead(400);res.end('{"ok":false}')}});return;
  }
  let p;try{p=decodeURIComponent(u.pathname)}catch(e){res.writeHead(400);return res.end()}
  const f=path.normalize(path.join(DIR,p==='/'?'index.html':p));
  if(!f.startsWith(DIR+path.sep)){res.writeHead(403);return res.end()}
  fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end('Not found')}
    res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});res.end(d)});
});
if(require.main===module)server.listen(PORT,()=>console.log('X-Lunox berjalan di http://localhost:'+PORT));
module.exports=server;
