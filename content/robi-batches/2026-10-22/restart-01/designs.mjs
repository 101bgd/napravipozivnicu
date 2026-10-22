import {newTextLayer,normalizeDesign} from '../../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-22T04:02:49Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown Robi design: '+id);
 const playful='custom-'+fontIds.baloo2,serif='custom-'+fontIds.cormorant,script='custom-'+fontIds.marckscript;
 const color={first:'#38543f',eighteen:'#3e2232',birthday:'#185655',wedding:'#603d53',baptism:'#60424b',baby:'#6d4547'}[m.category];
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,family:'DM Sans',color,lineHeight:1.25,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-12',x,y,23,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,17,extra);
 const rsvp=(x,y,extra={})=>t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',x,y,12.8,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','JEDNA SVEĆICA, MNOGO RADOSTI',54,15,13.5,{width:70}),
 t('names','Ime deteta','Nika',50,29,60,{family:playful}),
 t('age','Broj godina','1.',35,42,68,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',65,42,24,{family:playful,width:48}),
 t('note','Poruka gostima','Dođi na tortu, igru\ni naše prvo veliko slavlje!',50,53,15.5),
 date(47,63),
 time(27,72,{width:40}),
 t('location','Mesto i adresa proslave','Igraonica Jagodica\nBeograd',27,80,14,{width:40}),
 rsvp(27,90,{width:40})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','MOJE VEČE. MOJA PRAVILA.',35,13,13,{width:50}),
 t('names','Ime slavljenice','Teodora',35,26,58,{family:serif,width:52}),
 t('age','Broj godina','18',20,40,83,{family:serif,width:30}),
 t('occasion','Povod','ROĐENDAN',48,40,20,{width:40}),
 t('note','Poruka gostima','Moja noć, moje društvo.\nSlavimo zajedno!',35,54,14.5,{width:49}),
 date(34,64,{width:49}),
 time(32,71,{width:42}),
 t('location','Mesto i adresa proslave','Restoran Kraljica\nBeograd',31,79,14,{width:44}),
 rsvp(30,91,{width:44})
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','BOJE, TORTA I DRUGARI!',50,10,13,{width:63}),
 t('names','Ime deteta','Tara',50,21,60,{family:playful,width:80}),
 t('age','Broj godina','3.',35,34,64,{family:playful,width:30}),
 t('occasion','Povod','ROĐENDAN',64,34,24,{family:playful,width:48}),
 t('note','Poruka gostima','Četkice su spremne,\nčeka nas šarena žurka!',50,44,15.2,{width:78}),
 date(50,52),
 time(50,57.5),
 t('location','Mesto i adresa proslave','Igraonica Paleta\nBeograd',50,62.5,14.2,{width:75}),
 rsvp(50,95.5,{text:'Potvrdite dolazak do 5. juna.',size:10.5,width:80})
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',60,16,13.5,{width:61}),
 t('bride','Ime mlade','Jovana',52,28,58,{family:script,width:80}),
 t('join','Veznik','&',52,36.5,27,{family:serif,width:25}),
 t('groom','Ime mladoženje','Nikola',52,44,58,{family:script,width:80}),
 t('note','Poruka gostima','Da zajedno proslavimo\nnaše venčanje.',50,53.5,15.5,{width:78}),
 date(48,62),
 t('ceremony_time','Vreme obreda','VENČANJE · 14:00',34,70,14,{width:52}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',34,76,14,{width:52}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',34,82.5,14,{width:52}),
 t('location','Mesto i adresa proslave','Restoran Ahat\nBeograd',34,88.5,14,{width:52}),
 rsvp(34,95,{width:52,size:11.5})
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,28,13.5,{width:78}),
 t('names','Ime deteta','Anđela',50,38,59,{family:script,width:80}),
 t('occasion','Povod','KRŠTENJE',50,47,27,{family:serif,width:80}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,54,14.8,{width:78}),
 date(50,62),
 t('ceremony_time','Početak obreda','OBRED · 12:00',50,68,14.5),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',50,74,14.2,{width:70}),
 t('time','Početak proslave','PROSLAVA · 14:00',50,81,14.5),
 t('location','Mesto i adresa proslave','Restoran Badem\nBeograd',50,87,14.2,{width:68}),
 rsvp(50,94.5,{width:60,size:11.5})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO NAM DOŠLA',50,8,14,{width:75}),
 t('names','Ime bebe','Maša',50,47,68,{family:script,width:82}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,57,25,{family:serif,width:82}),
 t('note','Poruka gostima','Naša porodica ima novu radost.\nDođite da je podelimo!',50,66,15.5,{width:82}),
 date(50,76),
 time(50,82),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',50,89,14.5,{width:78}),
 rsvp(50,95,{width:72,size:11.5})
 ];
 for(const l of layers)Object.assign(l,tuning[id]?.[l.field]||{});
 const used=new Set(layers.map(l=>l.family));
 const names={baloo2:'Baloo 2',dynapuff:'DynaPuff',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,a])=>used.has('custom-'+a)).map(([k,a])=>({assetId:a,family:'custom-'+a,name:names[k]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));

