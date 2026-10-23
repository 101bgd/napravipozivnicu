import {newTextLayer,normalizeDesign} from '../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-23T15:38:00Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown Robi design: '+id);
 const playful='custom-'+fontIds.baloo2,serif='custom-'+fontIds.cormorant,script='custom-'+fontIds.marckscript;
 const color={first:'#123a2b',eighteen:'#fff1d3',birthday:'#143728',wedding:'#fff1dc',baptism:'#071a12',baby:'#06131f'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,family:'DM Sans',color,lineHeight:1.16,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-12',x,y,29,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,21,extra);
 const rsvp=(x,y,extra={})=>t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',x,y,15,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','JEDNA SVEĆICA, MNOGO RADOSTI',50,8,17,{width:75,bold:true}),
 t('names','Ime deteta','Luka',50,19,74,{family:playful,width:80}),
 t('age','Broj godina','1.',35,32,81,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',65,32,29,{family:playful,width:45}),
 t('note','Poruka gostima','Dođi da zajedno oduvamo\nmoju prvu svećicu!',50,42,18.5,{width:77}),
 date(50,51,{width:78}),
 time(25,58,{width:36,size:19}),
 t('location','Mesto i adresa proslave','Igraonica Šumska priča\nBeograd',70,58,16,{width:44}),
 rsvp(81,69,{width:32,size:13.5,color:'#06170d'})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','JEDNO VEČE ZA PAMĆENJE',50,8,17,{width:82,bold:true}),
 t('names','Ime slavljenika','Stefan',50,18,72,{family:serif,width:84}),
 t('age','Broj godina','18',35,30,88,{family:serif,width:30}),
 t('occasion','Povod','ROĐENDAN',65,30,27,{width:46,bold:true}),
 t('note','Poruka gostima','Dobra muzika i moje društvo.\nSlavimo punoletstvo!',50,40,18.5,{width:84}),
 date(31,47,{width:54}),
 time(75,47,{width:30,size:20}),
 t('location','Mesto i adresa proslave','Restoran Zlatna nota\nBeograd',50,54.5,18,{width:84}),
 rsvp(50,94,{width:86,text:'Potvrdite dolazak do 5. juna.',size:14})
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','ČEKA TE ŠARENA PUSTOLOVINA!',50,8,17,{width:82,bold:true}),
 t('names','Ime deteta','Vuk',50,18,75,{family:playful,width:84}),
 t('age','Broj godina','4.',35,30,73,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',65,30,27,{family:playful,width:46}),
 t('note','Poruka gostima','Čekaju te torta, igra i drugari!',50,39,18,{width:83}),
 date(31,45,{width:54,size:26}),
 time(76,45,{width:28,size:20}),
 t('location','Mesto i adresa proslave','Igraonica Šareni svet\nBeograd',50,51,17,{width:84})
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,12,16.5,{width:82}),
 t('bride','Ime mlade','Milica',50,23,65,{family:script,width:84}),
 t('join','Veznik','&',50,30.5,26,{family:serif,width:20}),
 t('groom','Ime mladoženje','Nikola',50,38,65,{family:script,width:84}),
 t('note','Poruka gostima','Budite deo našeg dana\ni proslavite sa nama venčanje.',50,46,17.5,{width:84}),
 date(50,54),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',28,74,16,{width:42,bold:true}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',28,81,16,{width:42}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',72,74,16,{width:42,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Rubin\nBeograd',72,81,16,{width:42}),
 rsvp(50,94,{width:86,text:'Potvrdite dolazak do 5. juna.',size:14})
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,25,16.5,{width:82}),
 t('names','Ime deteta','Pavle',50,35,68,{family:script,width:84}),
 t('occasion','Povod','KRŠTENJE',50,44,34,{family:serif,width:82}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,52,18,{width:82}),
 date(45,61,{width:72}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',30,69,17,{width:48,bold:true}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',30,75,16.5,{width:48}),
 t('time','Početak proslave','PROSLAVA · 14:00',30,82,17,{width:48,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Klas\nBeograd',30,87.5,16.5,{width:48}),
 rsvp(30,94,{width:48,size:13.5})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO NAM DOŠAO',50,10,18,{width:82,bold:true}),
 t('names','Ime bebe','Đorđe',50,23,78,{family:script,width:84}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,34,29,{family:serif,width:86}),
 t('note','Poruka gostima','Naša porodica ima novu radost.\nDođite da je podelimo!',50,42,18.5,{width:84}),
 date(30,54,{width:48}),
 time(28,62,{width:44}),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',28,70,18,{width:44})
 ];
 for(const l of layers)Object.assign(l,tuning[id]?.[l.field]||{});
 const used=new Set(layers.map(l=>l.family)),names={baloo2:'Baloo 2',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,a])=>used.has('custom-'+a)).map(([k,a])=>({assetId:a,family:'custom-'+a,name:names[k]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
