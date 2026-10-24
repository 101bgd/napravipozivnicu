import {newTextLayer,normalizeDesign} from '../../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-24T01:30:28Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown design: '+id);
 const playful='custom-'+fontIds.baloo2,serif='custom-'+fontIds.cormorant,script='custom-'+fontIds.marckscript;
 const color={first:'#173f3c',eighteen:'#fff0d7',birthday:'#58253a',wedding:'#353b24',baptism:'#381841',baby:'#3a163e'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,family:'DM Sans',color,lineHeight:1.12,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-12',x,y,29,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,21,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','MOJA PRVA VELIKA ŽURKA',55,24,16,{width:60,bold:true}),
 t('names','Ime deteta','Mila',56,34,76,{family:playful,width:62,fitToWidth:true}),
 t('age','Broj godina','1.',40,44,75,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',70,44,27,{family:playful,width:44}),
 t('note','Poruka gostima','Dođi da zajedno oduvamo\nmoju prvu svećicu!',65,54.5,17.5,{width:56}),
 date(65,63,{width:56}),time(71,69,{width:44}),
 t('location','Mesto i adresa proslave','Igraonica Medeni dan\nBeograd',74,75,16.5,{width:44})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','JEDNO VEČE ZA PAMĆENJE',50,9,16.5,{width:84,bold:true}),
 t('names','Ime slavljenice','Sofija',50,21,82,{family:serif,width:86,fitToWidth:true}),
 t('age','Broj godina','18',35,34,94,{family:serif,width:30}),
 t('occasion','Povod','ROĐENDAN',65,34,28,{width:46,bold:true}),
 t('note','Poruka gostima','Moji ljudi, dobra muzika\ni veče koje ćemo pamtiti.',50,46,20,{width:84}),
 date(50,56,{width:84,size:31}),time(50,63,{width:84,size:23}),
 t('location','Mesto i adresa proslave','Restoran Gala\nBeograd',50,67,19,{width:84}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 5. juna.',50,95,14,{width:86})
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','ČEKA TE NAJSLAĐA ŽURKA!',50,5.8,16,{width:84,bold:true}),
 t('names','Ime deteta','Iva',50,14,96,{family:playful,width:84,fitToWidth:true}),
 t('age','Broj godina','4.',35,24.5,75,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',65,24.5,28,{family:playful,width:46}),
 t('note','Poruka gostima','Torta, sladoled i najbolji drugari!',50,33,18,{width:86}),
 date(30,39,{width:50,size:27}),time(77,39,{width:30,size:21}),
 t('location','Mesto i adresa proslave','Igraonica Slatki svet · Beograd',50,44,17,{width:86})
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',66,11,14.5,{width:56}),
 t('bride','Ime mlade','Milica',66,22,64,{family:script,width:50,fitToWidth:true}),
 t('join','Veznik','&',66,30,27,{family:serif,width:20}),
 t('groom','Ime mladoženje','Nikola',66,38,64,{family:script,width:50,fitToWidth:true}),
 t('note','Poruka gostima','Budite deo našeg dana\ni proslavite sa nama venčanje.',66,47,17,{width:56}),
 date(66,56,{width:56,size:30}),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',64,63,16.5,{width:52,bold:true}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',64,69,17,{width:52}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',60,77,16.5,{width:42,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Mediteran\nBeograd',60,83,16.5,{width:42}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',57,91,13.5,{width:40})
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,25,16.5,{width:84}),
 t('names','Ime deteta','Anđela',50,35,78,{family:script,width:84,fitToWidth:true}),
 t('occasion','Povod','KRŠTENJE',50,44,35,{family:serif,width:82}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,52,18,{width:84}),
 date(50,60,{width:84,size:30}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',28,66,16,{width:42,bold:true}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',28,71,15.5,{width:42}),
 t('time','Početak proslave','PROSLAVA · 14:00',72,66,16,{width:42,bold:true}),
 t('location','Mesto i adresa proslave','Restoran Lila\nBeograd',72,71,15.5,{width:42})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO NAM DOŠLA',50,44,16.5,{width:80,bold:true}),
 t('names','Ime bebe','Una',50,54,94,{family:script,width:84,fitToWidth:true}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,64,28,{family:serif,width:86}),
 t('note','Poruka gostima','Naša porodica ima novu radost.\nDođite da je podelimo!',50,72,18.5,{width:84}),
 date(50,80,{width:80,size:30}),time(55,86,{width:70}),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',58,92,17,{width:66})
 ];
 for(const l of layers)Object.assign(l,tuning[id]?.[l.field]||{});
 const used=new Set(layers.map(l=>l.family)),names={baloo2:'Baloo 2',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,a])=>used.has('custom-'+a)).map(([k,a])=>({assetId:a,family:'custom-'+a,name:names[k]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
