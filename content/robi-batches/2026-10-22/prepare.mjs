import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {jsPDF} from 'jspdf';
import {getBatchDesigns} from './designs.mjs';
const batchDesigns=getBatchDesigns();

const directory=fileURLToPath(new URL('./',import.meta.url)),root=path.resolve(directory,'../../..');
const server=await createServer({root,configFile:false,server:{host:'127.0.0.1',port:0,fs:{allow:[root,await fs.realpath(path.join(root,'node_modules'))]}},logLevel:'error'});
let browser;
const reports=[];
try{
  await server.listen();
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage();
  await page.route('**/__robi',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__robi`);
  for(const design of batchDesigns){
    const result=await page.evaluate(async design=>{
      await Promise.all([import('/node_modules/@fontsource/dm-sans/latin-400.css'),import('/node_modules/@fontsource/dm-sans/latin-ext-400.css'),import('/node_modules/@fontsource/dm-sans/latin-700.css'),import('/node_modules/@fontsource/dm-sans/latin-ext-700.css'),import('/node_modules/@fontsource/libre-caslon-display/latin-400.css'),import('/node_modules/@fontsource/libre-caslon-display/latin-ext-400.css')]);
      const {renderDesign,designData,loadDesignFont}=await import('/src/design-renderer.js');
      await Promise.all(design.fonts.map(font=>loadDesignFont(font)));
      await Promise.all(design.layers.map(layer=>document.fonts.load(`${layer.bold?'700':'400'} ${layer.size}px "${layer.family}"`,layer.text)));
      const source=new Image();source.src=`/content/robi-batches/2026-10-22/sources/${design.id}.png`;await source.decode();
      if(source.naturalWidth*7!==source.naturalHeight*5)throw Error('Pogrešan odnos stranica: '+design.id);
      const bg=document.createElement('canvas');bg.width=1500;bg.height=2100;bg.getContext('2d').drawImage(source,0,0,1500,2100);
      const background=bg.toDataURL('image/webp',.90),backgroundPng=bg.toDataURL('image/png');
      const image=new Image();image.src=background;await image.decode();
      const data=designData(design),assets={background:image};
      const full=renderDesign(document.createElement('canvas'),design,data,null,1500,assets);
      const png=full.toDataURL('image/png'),jpeg=full.toDataURL('image/jpeg',.94);
      const thumbnail=renderDesign(document.createElement('canvas'),design,data,null,500,assets).toDataURL('image/webp',.88);
      const backgroundSample=document.createElement('canvas');backgroundSample.width=500;backgroundSample.height=700;backgroundSample.getContext('2d').drawImage(image,0,0,500,700);
      const pixels=backgroundSample.getContext('2d').getImageData(0,0,500,700).data;
      const lum=rgb=>rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
      function check(values){
        const boxes=[];
        for(const layer of design.layers){
          const canvas=renderDesign(document.createElement('canvas'),{...design,bg:'#ff00ff',layers:[layer]}, {...values,bg:'#ff00ff'},null,500,{},{});
          const mask=canvas.getContext('2d').getImageData(0,0,500,700).data;
          let left=500,right=0,top=700,bottom=0;
          const contrasts=[],ink=lum(layer.color.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)));
          for(let y=0;y<700;y++)for(let x=0;x<500;x++){
            const i=(y*500+x)*4;
            if(Math.abs(mask[i]-255)+mask[i+1]+Math.abs(mask[i+2]-255)>90){
              left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);
              const light=lum([pixels[i],pixels[i+1],pixels[i+2]]);contrasts.push((Math.max(ink,light)+.05)/(Math.min(ink,light)+.05));
            }
          }
          contrasts.sort((a,b)=>a-b);
          const threshold=layer.size>=24?3:4.5;
          boxes.push({field:layer.field,left,right,top,bottom,minimumContrast:contrasts.length?Number(contrasts[0].toFixed(2)):null,p05Contrast:contrasts.length?Number(contrasts[Math.floor(contrasts.length*.05)].toFixed(2)):null,threshold,marginPass:left>=20&&right<=480&&top>=20&&bottom<=680,contrastPass:contrasts.length>0&&contrasts[Math.floor(contrasts.length*.05)]>=threshold});
        }
        const overlaps=[];
        for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>2)overlaps.push([a.field,b.field]);}
        return {boxes,overlaps,passed:boxes.every(b=>b.marginPass&&b.contrastPass)&&!overlaps.length};
      }
      const stress={...data};
      if('names'in stress)stress.names='Aleksandar';
      if('bride'in stress)stress.bride='Aleksandra';
      if('groom'in stress)stress.groom='Konstantin';
      stress.location='Restoran Svečana sala\nKneza Miloša 12, Beograd';
      if('ceremony_location'in stress)stress.ceremony_location='Crkva Svetog Save\nKrušedolska 2, Beograd';
      stress.rsvp='Potvrdite dolazak\nnajkasnije do 5. juna.';
      const stressPng=renderDesign(document.createElement('canvas'),design,stress,null,1500,assets).toDataURL('image/png');
      return {background,backgroundPng,thumbnail,png,jpeg,stressPng,report:{sourceWidth:source.naturalWidth,sourceHeight:source.naturalHeight,backgroundWidth:1500,backgroundHeight:2100,exportWidth:1500,exportHeight:2100,cropped:false,upscaled:source.naturalWidth!==1500,defaultCheck:check(data),longTextCheck:check(stress),fontsLoaded:design.fonts.map(font=>({family:font.family,loaded:document.fonts.check(`16px "${font.family}"`)}))}};
    },design);
    const decode=value=>Buffer.from(value.split(',')[1],'base64');
    const outputs={
      [`backgrounds/${design.id}.webp`]:decode(result.background),[`backgrounds/${design.id}.png`]:decode(result.backgroundPng),
      [`previews/${design.id}.webp`]:decode(result.thumbnail),[`examples/${design.id}.png`]:decode(result.png),
      [`examples/${design.id}-long-text.png`]:decode(result.stressPng),
    };
    const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:[127,177.8],compress:true});
    pdf.addImage(result.jpeg,'JPEG',0,0,127,177.8);outputs[`examples/${design.id}.pdf`]=Buffer.from(pdf.output('arraybuffer'));
    for(const [file,bytes]of Object.entries(outputs))await fs.writeFile(path.join(directory,file),bytes);
    const original=await fs.readFile(path.join(directory,`sources/${design.id}.png`));
    const report={id:design.id,category:design.category,name:design.name,...result.report,sourceSha256:createHash('sha256').update(original).digest('hex'),sourceBytes:original.length,files:Object.fromEntries(Object.entries(outputs).map(([file,bytes])=>[file,{bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}]))};
    reports.push(report);console.log(JSON.stringify({id:design.id,defaultPass:report.defaultCheck.passed,longTextPass:report.longTextCheck.passed,overlaps:report.longTextCheck.overlaps,failed:report.longTextCheck.boxes.filter(b=>!b.marginPass||!b.contrastPass).map(b=>({field:b.field,margin:b.marginPass,contrast:b.p05Contrast,threshold:b.threshold})),backgroundBytes:outputs[`backgrounds/${design.id}.webp`].length}));
  }
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(reports,null,2)+'\n');
  await fs.writeFile(path.join(directory,'designs.json'),JSON.stringify(batchDesigns,null,2)+'\n');
}finally{await browser?.close();await server.close();}

