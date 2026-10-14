import { createServer } from 'node:http';
import { createLocalRuntime } from './local-runtime.mjs';
const port=Number(process.env.ADMIN_PREVIEW_PORT||5180),local=await createLocalRuntime({persist:process.env.ADMIN_PREVIEW_PERSIST!=='false'}),jwt=await local.token();
const server=createServer(async(req,res)=>{
  try{
    const host=req.headers.host||'',hostname=host.split(':')[0];
    if(!['localhost','127.0.0.1'].includes(hostname)){res.writeHead(403);res.end('Local preview is available only on localhost.');return;}
    const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(','):value);
    headers.set('Cf-Access-Jwt-Assertion',jwt);
    const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);
    const response=await local.runtime.dispatchFetch(`http://${host}${req.url}`,{method:req.method,headers,body:['GET','HEAD'].includes(req.method)?undefined:body});
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
  }catch(error){console.error(error);res.writeHead(500);res.end('Local preview failed.');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local admin preview: http://127.0.0.1:${port}/admin/sabloni/\nLocal test identity only. Cloudflare Access is required in production.`));
async function close(){server.close();await local.runtime.dispose();process.exit(0);}process.on('SIGTERM',close);process.on('SIGINT',close);
