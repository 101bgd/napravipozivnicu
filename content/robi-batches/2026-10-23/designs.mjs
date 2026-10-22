import {newTextLayer, normalizeDesign} from '../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};

export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||null}));
export const ageGroupCenters={first:50,eighteen:39,birthday:50};
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(x=>x.id===id);if(!m)throw Error('Unknown Robi draft: '+id);
 const playful='custom-'+fontIds.baloo2,serif='custom-'+fontIds.cormorant,script='custom-'+fontIds.marckscript;
 const color={first:'#122c3c',eighteen:'#effbff',birthday:'#081d39',wedding:'#fff2d5',baptism:'#102a59',baby:'#053b44'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,family:'DM Sans',color,lineHeight:1.2,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-12',x,y,26,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,18,extra);
 const rsvp=(x,y,extra={})=>t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',x,y,13.5,extra);
 let layers;
 if(m.category==='first')layers=[
  t('title','Uvodni tekst','MOJA PRVA VELIKA FIESTA',50,10,14,{width:82}),
  t('names','Ime deteta','Luka',50,23,62,{family:playful}),
  t('age','Broj godina','1.',34,36,68,{family:playful,width:30}),
  t('occasion','Povod','ROĐENDAN',65,36,25,{family:playful,width:50}),
  t('note','Poruka gostima','Torta, igra i drugari —\nslavimo zajedno!',50,47,17.5),
  date(50,57),time(71,68,{width:44}),
  t('location','Mesto i adresa proslave','Igraonica Tukan\nBeograd',71,78,16,{width:44}),
  rsvp(71,91,{width:44})
 ];
 if(m.category==='eighteen')layers=[
  t('title','Uvodni tekst','VEČE KOJE PAMTIMO',39,12,14,{width:61}),
  t('names','Ime slavljenika','Viktor',39,25,66,{family:serif,width:62}),
  t('age','Broj godina','18',22,40,88,{family:serif,width:34}),
  t('occasion','Povod','ROĐENDAN',51,40,22,{width:44}),
  t('note','Poruka gostima','Tvoj dolazak daje ritam\nmojoj velikoj večeri.',39,54,17,{width:62}),
  date(44,65,{width:67}),time(65,75,{width:55}),
  t('location','Mesto i adresa proslave','Restoran Ritam\nBeograd',65,83.5,16,{width:55}),
  rsvp(65,94,{width:55,size:13})
 ];
 if(m.category==='birthday')layers=[
  t('title','Uvodni tekst','POLEĆEMO U ŠARENU AVANTURU!',50,9,14,{family:playful,width:84}),
  t('names','Ime deteta','Vuk',50,21,64,{family:playful,width:82}),
  t('age','Broj godina','4.',34,34,70,{family:playful,width:30}),
  t('occasion','Povod','ROĐENDAN',64,34,25,{family:playful,width:50}),
  t('note','Poruka gostima','Mali zmaj zove drugare\nna tortu, igru i smeh!',50,45,17.5),
  date(50,55),time(50,62),
  t('location','Mesto i adresa proslave','Igraonica Zmajić\nBeograd',29,74,16,{width:45}),
  rsvp(29,90,{width:45,size:14})
 ];
 if(m.category==='wedding')layers=[
  t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',66,19,13.5,{width:54}),
  t('bride','Ime mlade','Jovana',60,32,62,{family:script,width:68}),
  t('join','Veznik','&',60,40,28,{family:serif,width:24}),
  t('groom','Ime mladoženje','Nikola',60,48,62,{family:script,width:68}),
  t('note','Poruka gostima','Budite deo naše ljubavne priče\ni proslavite sa nama.',54,58,17,{width:81}),
  date(51,67,{size:28}),
  t('ceremony_time','Vreme obreda','OBRED · 14:00',26,76,14,{width:39}),
  t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',26,84,15,{width:39}),
  t('time','Početak svadbene proslave','PROSLAVA · 17:00',65,76,14,{width:39}),
  t('location','Mesto i adresa proslave','Restoran Bugenvilija\nBeograd',65,84,15,{width:39}),
  rsvp(47,94,{text:'Potvrdite dolazak do 5. juna.',width:82,size:13})
 ];
 if(m.category==='baptism')layers=[
  t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,25.5,13,{width:61}),
  t('names','Ime deteta','Đorđe',50,35,61,{family:script,width:60}),
  t('occasion','Povod','KRŠTENJE',50,44,30,{family:serif,width:60}),
  t('note','Poruka gostima','Podelite sa nama dan\npun vere, ljubavi i radosti.',50,53,16.5,{width:61}),
  date(50,62,{width:60}),
  t('ceremony_time','Početak obreda','OBRED · 12:00',50,69,15.5,{width:60}),
  t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',50,75,15,{width:60}),
  t('time','Početak proslave','PROSLAVA · 14:00',50,82,15.5,{width:60}),
  t('location','Mesto i adresa proslave','Restoran Plavi dvor\nBeograd',50,88,15,{width:60}),
  rsvp(50,95,{width:60,size:12.5})
 ];
 if(m.category==='baby')layers=[
  t('title','Uvodni tekst','NAŠA PORODICA JE BOGATIJA',50,38,14,{width:76}),
  t('names','Ime bebe','Ognjen',50,49,69,{family:script,width:78}),
  t('occasion','Povod','PROSLAVA ROĐENJA',50,59,27,{family:serif,width:78}),
  t('note','Poruka gostima','Stigao je naš mali zagrljaj.\nDođite da podelimo radost!',50,68,17,{width:78}),
  date(50,77,{width:76}),time(50,83,{width:76}),
  t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',50,89,15.5,{width:76}),
  rsvp(50,94,{text:'Potvrdite dolazak do 5. juna.',width:78,size:12.5})
 ];
 for(const layer of layers)Object.assign(layer,tuning[id]?.[layer.field]||{});
 const used=new Set(layers.map(l=>l.family));
 const fontNames={baloo2:'Baloo 2',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,assetId])=>used.has('custom-'+assetId)).map(([key,assetId])=>({assetId,family:'custom-'+assetId,name:fontNames[key]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
