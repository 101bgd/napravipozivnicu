import {newTextLayer,normalizeDesign} from '../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-26T23:20:00Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown design: '+id);
 const serif='custom-'+fontIds.cormorant,calligraphy='custom-'+fontIds.greatvibes;
 const soft='custom-'+fontIds.fraunces600,gentle='custom-'+fontIds.fraunces400,sans='custom-'+fontIds.outfit400,storybook='custom-'+fontIds.bajka;
 const color={first:'#ffffff',eighteen:'#fff2db',birthday:'#fff8df',wedding:'#fff1db',baptism:'#fff4df',baby:'#553424'}[m.category];
 const formal=['eighteen','wedding','baptism','baby'].includes(m.category);
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:84,family:formal?serif:sans,color,lineHeight:1.16,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-19',x,y,29,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,23,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','PRVA GODINA, NAJLEPŠA MELODIJA',50,7,15,{letterSpacing:1}),
 t('names','Ime deteta','Vukan',50,19,87,{family:soft,fitToWidth:true}),
 t('age','Broj godina','1.',35,31,83,{family:soft,width:30}),
 t('occasion','Povod','rođendan',65,31,32,{family:soft,width:46}),
 t('note','Poruka gostima','Dođi da zajedno odsviramo\nprve rođendanske želje!',50,39,22),
 date(50,47,{family:soft,size:29}),time(50,53.5,{size:24}),
 t('location','Mesto i adresa proslave','Igraonica Melodija\nBeograd',50,59.5,21)
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','VEČE U MOM\nRITMU',73,13,21,{width:44,letterSpacing:1.7,lineHeight:1.3}),
 t('names','Ime slavljenika','Mihailo',73,31,69,{family:'Libre Caslon Display',width:44,fitToWidth:true}),
 t('age','Broj godina','18',35,59,88,{family:'Libre Caslon Display',width:30}),
 t('occasion','Povod','ROĐENDAN',65,59,27,{width:46,letterSpacing:1}),
 t('note','Poruka gostima','Moji ljudi i dobar ritam.\nVidimo se na proslavi!',50,67,23),
 date(50,74,{size:31}),time(50,81,{size:25}),
 t('location','Mesto i adresa proslave','Restoran Zlatni ton\nBeograd',50,88,21),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 12. juna.',50,94,17)
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','SPREMI SE ZA ROĐENDANSKU AVANTURU!',50,7,14,{letterSpacing:.8}),
 t('names','Ime deteta','Relja',50,18,98,{family:storybook,fitToWidth:true}),
 t('age','Broj godina','6.',35,30,83,{family:storybook,width:30}),
 t('occasion','Povod','rođendan',65,30,32,{family:storybook,width:46}),
 t('note','Poruka gostima','Čekaju te igra, torta i avantura!',50,37.5,22),
 date(29,43.5,{family:storybook,width:48,size:26}),time(78,43.5,{width:30,size:23}),
 t('location','Mesto i adresa proslave','Igraonica Mali kamp\nBeograd',50,49,21)
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','POZIVAMO VAS NA VENČANJE',50,6.5,18,{letterSpacing:1.5}),
 t('bride','Ime mlade','Milica',50,15,79,{family:calligraphy,fitToWidth:true}),
 t('join','Veznik','&',50,23,28,{width:20}),
 t('groom','Ime mladoženje','Lazar',50,31,79,{family:calligraphy,fitToWidth:true}),
 t('note','Poruka gostima','Budite deo naše priče\ni proslavite sa nama.',50,39.5,23),
 date(79,48,{size:27,width:34}),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',80,57,17,{width:32,letterSpacing:.4}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',80,64,19,{width:32}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',80,75,17,{width:32,letterSpacing:.4}),
 t('location','Mesto i adresa proslave','Restoran Magnolija\nBeograd',80,83,19,{width:32}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 12. juna.',80,94,16,{width:32})
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,7,18,{letterSpacing:1.5}),
 t('names','Ime deteta','Pavle',50,16,87,{family:'Libre Caslon Display',fitToWidth:true}),
 t('occasion','Povod','KRŠTENJE',50,26,34,{letterSpacing:4}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,33,23),
 date(50,40,{size:30}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',26,46,18,{width:44,letterSpacing:.6}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',26,51,20,{width:44}),
 t('time','Početak proslave','PROSLAVA · 14:00',74,46,18,{width:44,letterSpacing:.6}),
 t('location','Mesto i adresa proslave','Restoran Perunika\nBeograd',74,51,20,{width:44})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO DOŠAO,\nMALI NAŠ',74,23,24,{width:40,letterSpacing:1.6,lineHeight:1.4}),
 t('names','Ime bebe','Ognjen',50,56,86,{family:gentle,fitToWidth:true}),
 t('occasion','Povod','PROSLAVA ROĐENJA',50,66,26,{letterSpacing:1.3}),
 t('note','Poruka gostima','Naša porodica ima novu radost.\nDođite da je podelimo!',50,73,23),
 date(50,81,{size:29}),time(50,88,{size:25}),
 t('location','Mesto i adresa proslave','Restoran Porodični kutak\nBeograd',50,94,19)
 ];
 for(const layer of layers)Object.assign(layer,tuning[id]?.[layer.field]||{});
 const used=new Set(layers.map(l=>l.family)),names={cormorant:'Cormorant Garamond',greatvibes:'Great Vibes',fraunces600:'Fraunces SemiBold',fraunces400:'Fraunces',outfit400:'Outfit',bajka:'Napravi Bajka'};
 const fonts=Object.entries(fontIds).filter(([,a])=>used.has('custom-'+a)).map(([k,a])=>({assetId:a,family:'custom-'+a,name:names[k]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
