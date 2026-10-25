import {newTextLayer,normalizeDesign} from '../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-24T23:03:50Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown design: '+id);
 const playful='custom-'+fontIds.baloo2,serif='custom-'+fontIds.cormorant,script='custom-'+fontIds.marckscript;
 const color={first:'#163d2b',eighteen:'#fff1dc',birthday:'#163b64',wedding:'#fff2dc',baptism:'#153550',baby:'#fff1dc'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,family:'DM Sans',color,lineHeight:1.12,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-12',x,y,29,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,21,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','PRVA SVEĆICA, VELIKA RADOST',60,10,16.5,{width:66,bold:true}),
 t('names','Ime deteta','Ognjen',54,21,84,{family:playful,width:82,fitToWidth:true}),
 t('age','Broj godina','1.',38,32,84,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',67,32,29,{family:playful,width:46}),
 t('note','Poruka gostima','Dođi da zajedno proslavimo\nmoj prvi rođendan!',51,43,19,{width:84}),
 date(65,55,{width:58,size:30}),time(68,64,{width:50}),
 t('location','Mesto i adresa proslave','Igraonica Šareni vetrić\nBeograd',69,73,17,{width:50})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','VREME JE ZA SLEDEĆI NIVO',50,9,17,{width:84,bold:true}),
 t('names','Ime slavljenika','Nikola',50,21,84,{family:serif,width:86,fitToWidth:true}),
 t('age','Broj godina','18',35,34,94,{family:serif,width:30}),
 t('occasion','Povod','ROĐENDAN',65,34,28,{width:46,bold:true}),
 t('note','Poruka gostima','Moji ljudi, dobra muzika\ni veče koje ćemo pamtiti.',50,46,20,{width:84}),
 date(50,56,{width:84,size:31}),time(50,62,{width:84,size:23}),
 t('location','Mesto i adresa proslave','Restoran Nova igra\nBeograd',50,68,19,{width:84}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 5. juna.',50,95,14,{width:86})
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','ČEKA TE KRALJEVSKA ŽURKA!',50,5.8,16.5,{width:86,bold:true}),
 t('names','Ime deteta','Vukan',50,14.5,96,{family:playful,width:84,fitToWidth:true}),
 t('age','Broj godina','5.',35,26.5,84,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',65,26.5,28,{family:playful,width:46}),
 t('note','Poruka gostima','Torta, igra i najbolji drugari!',50,35,19,{width:86}),
 date(30,41,{width:50,size:27}),time(77,41,{width:30,size:21}),
 t('location','Mesto i adresa proslave','Igraonica Šareni zamak · Beograd',50,46,17,{width:86})
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','POZIVAMO VAS\nNA VENČANJE',73,11,16,{width:40}),
 t('bride','Ime mlade','Nina',70,22,70,{family:script,width:46,fitToWidth:true}),
 t('join','Veznik','&',70,31,27,{family:serif,width:20}),
 t('groom','Ime mladoženje','Miloš',70,40,70,{family:script,width:46,fitToWidth:true}),
 t('note','Poruka gostima','Budite deo našeg dana\ni proslavite sa nama venčanje.',62,49,18,{width:68}),
 date(54,59,{width:80,size:31}),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',27,67,17,{width:44,bold:true}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',27,74,17,{width:44}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',73,67,17,{width:44,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Vinograd\nBeograd',73,74,17,{width:44}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 5. juna.',41,91,14,{width:60})
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,22,16.5,{width:84}),
 t('names','Ime deteta','Pavle',50,33,82,{family:script,width:84,fitToWidth:true}),
 t('occasion','Povod','KRŠTENJE',50,43,37,{family:serif,width:82}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,51,18,{width:84}),
 date(50,59,{width:84,size:30}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',28,65.5,16.5,{width:42,bold:true}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',28,71,16.5,{width:42}),
 t('time','Početak proslave','PROSLAVA · 14:00',72,65.5,16.5,{width:42,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Zvonce\nBeograd',72,71,16.5,{width:42})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO NAM DOŠAO',50,47,17,{width:82,bold:true}),
 t('names','Ime bebe','Mihajlo',50,56,94,{family:script,width:84,fitToWidth:true}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,65.5,28,{family:serif,width:86}),
 t('note','Poruka gostima','Naša porodica ima novu radost.\nDođite da je podelimo!',52,73.5,18.5,{width:84}),
 date(60,81.5,{width:70,size:30}),time(63,87.5,{width:64}),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',66,93,17,{width:58})
 ];
 for(const l of layers)Object.assign(l,tuning[id]?.[l.field]||{});
 const used=new Set(layers.map(l=>l.family)),names={baloo2:'Baloo 2',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,a])=>used.has('custom-'+a)).map(([k,a])=>({assetId:a,family:'custom-'+a,name:names[k]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
