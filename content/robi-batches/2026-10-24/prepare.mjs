import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'vite';
import {curatedAssetUrl} from '../../../src/curated-assets.js';
import {chromium} from 'playwright';
import {jsPDF} from 'jspdf';
import {getBatchDesigns} from './designs.mjs';
import {pngWithPrintDensity} from '../../../src/png-density.js';
const batchDesigns=getBatchDesigns();

const directory=fileURLToPath(new URL('./',import.meta.url)),root=path.resolve(directory,'../../..');
const bundleResult=await build({root,configFile:false,logLevel:'error',build:{write:false,minify:false,lib:{entry:path.join(directory,'renderer-entry.mjs'),name:'RobiRenderer',formats:['iife']}}});
const bundle=(Array.isArray(bundleResult)?bundleResult[0]:bundleResult).output.find(o=>o.type==='chunk').code;
async function inlineFontCss(relative){
 const file=path.join(root,'node_modules',relative),css=await fs.readFile(file,'utf8');
 const pattern=/url\(([^)]+)\)/g;let out='',last=0,match;
 while((match=pattern.exec(css))){const url=match[1].replace(/["']/g,'');const bytes=await fs.readFile(path.resolve(path.dirname(file),url));out+=css.slice(last,match.index)+'url(data:font/woff2;base64,'+bytes.toString('base64')+')';last=pattern.lastIndex;}
 return out+css.slice(last);
}
const fontCss=(await Promise.all(['@fontsource/dm-sans/latin-400.css','@fontsource/dm-sans/latin-ext-400.css','@fontsource/dm-sans/latin-700.css','@fontsource/dm-sans/latin-ext-700.css','@fontsource/libre-caslon-display/latin-400.css','@fontsource/libre-caslon-display/latin-ext-400.css'].map(inlineFontCss))).join('\n');
let browser;
const reports=[],tuningOutputs={};
try{

  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
  const page=await browser.newPage();
  await page.setContent('<!doctype html><html><body></body></html>');
  await page.addStyleTag({content:fontCss});
  await page.addScriptTag({content:bundle});
  for(const design of batchDesigns){
    const fontData=await Promise.all(design.fonts.map(async font=>({...font,data:(await fs.readFile(path.join(root,'public',curatedAssetUrl(font.assetId)))).toString('base64')})));
    const sourceDataUrl='data:image/png;base64,'+(await fs.readFile(path.join(directory,'sources',design.id+'.png'))).toString('base64');
    const result=await page.evaluate(async ({design,fontData,sourceDataUrl})=>{
      const {renderDesign,designData}=window.__robiRenderer;
      for(const font of fontData){const face=new FontFace(font.family,'url(data:font/woff2;base64,'+font.data+')');await face.load();document.fonts.add(face);}
      await Promise.all(design.layers.map(layer=>document.fonts.load(`${layer.bold?'700':'400'} ${layer.size}px "${layer.family}"`,layer.text)));
      const age=design.layers.find(l=>l.field==='age'),occasion=design.layers.find(l=>l.field==='occasion');
      const appliedTuning={};
      if(age&&occasion){
        const c=document.createElement('canvas').getContext('2d');
        const measure=l=>{c.font=`${l.italic?'italic ':''}${l.bold?'700':'400'} ${l.size}px "${l.family}"`;return c.measureText(l.text).width+Math.max(0,l.text.length-1)*l.letterSpacing;};
        const aw=measure(age),ow=measure(occasion),gap=8,cx=(design.layers.find(l=>l.field==='names')?.x||50)*5,left=cx-(aw+gap+ow)/2,right=left+aw;
        age.align='right';age.x=(right-age.width/100*500/2)/5;
        occasion.x=(right+gap+ow/2)/5;
        appliedTuning.age={x:age.x,align:'right'};appliedTuning.occasion={x:occasion.x};
      }
      const source=new Image();source.src=sourceDataUrl;await source.decode();
      const crop=design.id==='lanetovo-prvo-slavlje'?{x:10,y:450,width:800,height:1120}:null;
      if(!crop&&source.naturalWidth*7!==source.naturalHeight*5)throw Error('Pogrešan odnos stranica: '+design.id);
      const bg=document.createElement('canvas');bg.width=1500;bg.height=2100;crop?bg.getContext('2d').drawImage(source,crop.x,crop.y,crop.width,crop.height,0,0,1500,2100):bg.getContext('2d').drawImage(source,0,0,1500,2100);
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
      if('names'in stress)stress.names='Aleksandra';
      if('bride'in stress)stress.bride='Aleksandra';
      if('groom'in stress)stress.groom='Konstantin';
      stress.location='Restoran Svečana sala\nKneza Miloša 12, Beograd';
      if('ceremony_location'in stress)stress.ceremony_location='Crkva Svetog Save\nKrušedolska 2, Beograd';
      stress.rsvp='Potvrdite dolazak\nnajkasnije do 5. juna.';
      if(design.category==='birthday')stress.age='10.';
      const stressPng=renderDesign(document.createElement('canvas'),design,stress,null,1500,assets).toDataURL('image/png');
      return {appliedTuning,background,backgroundPng,thumbnail,png,jpeg,stressPng,report:{sourceWidth:source.naturalWidth,sourceHeight:source.naturalHeight,backgroundWidth:1500,backgroundHeight:2100,exportWidth:1500,exportHeight:2100,cropped:!!crop,cropRect:crop,upscaled:source.naturalWidth!==1500,defaultCheck:check(data),longTextCheck:check(stress),fontsLoaded:design.fonts.map(font=>({family:font.family,loaded:document.fonts.check(`16px "${font.family}"`)}))}};
    },{design,fontData,sourceDataUrl});
    tuningOutputs[design.id]=result.appliedTuning;for(const layer of design.layers)Object.assign(layer,result.appliedTuning[layer.field]||{});
    const decode=value=>{const bytes=Buffer.from(value.split(',')[1],'base64');return value.startsWith('data:image/png')?Buffer.from(pngWithPrintDensity(bytes)):bytes;};
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
  await fs.writeFile(path.join(directory,'layout-tuning.json'),JSON.stringify(tuningOutputs,null,2)+'\n');
  await fs.writeFile(path.join(directory,'report.json'),JSON.stringify(reports,null,2)+'\n');
  await fs.writeFile(path.join(directory,'designs.json'),JSON.stringify(batchDesigns,null,2)+'\n');
}finally{await browser?.close();}


