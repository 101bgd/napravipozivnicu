import {newTextLayer,normalizeDesign} from '../../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-27T08:10:00Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown design: '+id);
 const studio='custom-'+fontIds.studio,linear='custom-'+fontIds.linear,gala='custom-'+fontIds.gala,sonata='custom-'+fontIds.sonata,book='custom-'+fontIds.knjiga,bookItalic='custom-'+fontIds.knjigaItalic;
 const color={first:'#533225',eighteen:'#fff4df',birthday:'#fff7df',wedding:'#283c48',baptism:'#16334c',baby:'#193b57'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:84,family:['wedding','baptism'].includes(m.category)?book:linear,color,lineHeight:1.18,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-19',x,y,27,{family:book,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,22,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','MALA GODINA, VELIKA RADOST',50,7.5,15,{family:book,letterSpacing:1.3}),
 t('names','Ime deteta','Luka',50,57,82,{family:studio,fitToWidth:true}),
 t('age','Broj godina','1.',35,69,76,{family:studio,width:30}),
 t('occasion','Povod','rođendan',65,69,28,{family:book,width:46}),
 t('note','Poruka gostima','Prva torta i najlepše društvo — dođi!',50,77,18.5,{family:book}),
 date(29,84,{width:48,size:25}),time(77,84,{width:32,size:22}),
 t('location','Mesto i adresa proslave','Igraonica Šumski piknik\nBeograd',50,92,19,{family:book})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','POČINJE MOJE NOVO POGLAVLJE',43,8,14.5,{width:70,letterSpacing:1.1}),
 t('names','Ime slavljenika','NIKOLA',43,18,82,{family:gala,width:70,fitToWidth:true}),
 t('age','Broj godina','18',30,35.5,125,{family:gala,width:40}),
 t('occasion','Povod','ROĐENDAN',60,35.5,23,{width:40,letterSpacing:1.5}),
 t('note','Poruka gostima','Za veče koje se pamti\ntreba mi tvoje društvo.',43,47,19,{width:64}),
 date(29,54,{family:gala,size:26,width:42}),time(64,54,{width:24,size:21}),
 t('location','Mesto i adresa proslave','Restoran Kobalt\nBeograd',43,61,19,{width:64}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 12. juna.',43,68,14.5,{width:64})
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','VREME JE ZA ROĐENDANSKU AVANTURU!',50,7,13.5,{letterSpacing:.6}),
 t('names','Ime deteta','VIKTOR',35,18,80,{family:studio,width:55,fitToWidth:true}),
 t('age','Broj godina','6.',25,28,70,{family:studio,width:26}),
 t('occasion','Povod','rođendan',50,28,26,{family:studio,width:40}),
 date(79,14,{family:studio,width:32,size:22}),time(79,21,{width:32,size:21}),
 t('location','Mesto i adresa proslave','Igraonica Džungla\nBeograd',79,29,17,{width:32}),
 t('note','Poruka gostima','Drugari, igra i torta\nčekaju te!',79,40,18,{width:32})
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','POZIVAMO VAS NA VENČANJE',50,6.5,14.5,{letterSpacing:1.2}),
 t('bride','Ime mlade','TEODORA',50,44,76,{family:sonata,fitToWidth:true}),
 t('join','Veznik','i',50,52.5,20,{family:bookItalic,width:20}),
 t('groom','Ime mladoženje','ALEKSANDAR',50,60,76,{family:sonata,fitToWidth:true}),
 date(50,70,{size:27}),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',27,77,16.5,{width:44,letterSpacing:.4}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',27,85,18,{width:44}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',73,77,16.5,{width:44,letterSpacing:.4}),
 t('location','Mesto i adresa proslave','Restoran Anemona\nBeograd',73,85,18,{width:44}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 12. juna.',50,94,14.5)
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','DAN VERE, LJUBAVI\nI RADOSTI',28,24,18,{width:40,letterSpacing:.7,lineHeight:1.35}),
 t('names','Ime deteta','JAKOV',50,53,88,{family:gala,fitToWidth:true}),
 t('occasion','Povod','KRŠTENJE',50,63,27,{letterSpacing:3}),
 t('note','Poruka gostima','Budite uz nas na ovom\nposebnom porodičnom danu.',50,70,19),
 date(50,78,{family:gala,size:28}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',26,85,17,{width:44}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',26,92,18,{width:44}),
 t('time','Početak proslave','PROSLAVA · 14:00',74,85,17,{width:44}),
 t('location','Mesto i adresa proslave','Restoran Porodični dom\nBeograd',74,92,18,{width:44})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','NAŠ NAJNEŽNIJI NOVI POČETAK',50,6.5,14,{letterSpacing:1.1}),
 t('names','Ime bebe','Danilo',50,61,83,{family:bookItalic,fitToWidth:true}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,72,21,{letterSpacing:1.8}),
 t('note','Poruka gostima','Stigla je naša najveća mala radost.\nProslavite je sa nama!',50,79,18,{family:book}),
 date(28,87,{width:46,size:24}),time(78,87,{width:30,size:22}),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',50,94,17.5)
 ];
 for(const layer of layers)Object.assign(layer,tuning[id]?.[layer.field]||{});
 const used=new Set(layers.map(l=>l.family));
 const names={studio:'Napravi Studio',linear:'Napravi Linear',gala:'Napravi Gala',sonata:'Napravi Sonata',knjiga:'Napravi Knjiga',knjigaItalic:'Napravi Knjiga Italic'};
 const fonts=Object.entries(fontIds).filter(([,assetId])=>used.has('custom-'+assetId)).map(([key,assetId])=>({assetId,family:'custom-'+assetId,name:names[key]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
