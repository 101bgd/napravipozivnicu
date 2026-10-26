import {newTextLayer,normalizeDesign} from '../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-25T23:18:23Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(m=>m.id===id);if(!m)throw Error('Unknown design: '+id);
 const serif='custom-'+fontIds.cormorant,calligraphy='custom-'+fontIds.greatvibes;
 const soft='custom-'+fontIds.fraunces600,gentle='custom-'+fontIds.fraunces400,sans='custom-'+fontIds.outfit400,storybook='custom-'+fontIds.bajka;
 const color={first:'#57322d',eighteen:'#fff1d9',birthday:'#fff8df',wedding:'#fff1db',baptism:'#702b43',baby:'#603e32'}[m.category];
 const formal=['eighteen','wedding','baptism','baby'].includes(m.category);
 const t=(field,label,text,x,y,size,extra={})=>({...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:84,family:formal?serif:sans,color,lineHeight:1.16,align:'center',...extra});
 const date=(x,y,extra={})=>t('date','Datum proslave','2027-06-19',x,y,29,{family:serif,...extra});
 const time=(x,y,extra={})=>t('time','Početak proslave','17:00',x,y,23,extra);
 let layers;
 if(m.category==='first')layers=[
 t('title','Uvodni tekst','PRVA SVEĆICA, NAJSLAĐA RADOST',50,9,15.5,{letterSpacing:1.1}),
 t('names','Ime deteta','Iskra',50,20.5,86,{family:soft,fitToWidth:true}),
 t('age','Broj godina','1.',35,33,82,{family:soft,width:30}),
 t('occasion','Povod','rođendan',65,33,31,{family:soft,width:46}),
 t('note','Poruka gostima','Dođi da zajedno proslavimo\nmoj prvi rođendan!',50,43,20),
 date(78,54,{family:soft,width:40,size:25}),time(80,63,{width:34,size:22}),
 t('location','Mesto i adresa proslave','Igraonica Jagodica\nBeograd',80,73,18,{width:34})
 ];
 if(m.category==='eighteen')layers=[
 t('title','Uvodni tekst','VEČE ZA VELIKE ŽELJE',29,12,17,{width:48,letterSpacing:1.2}),
 t('names','Ime slavljenice','Anđela',27,29,94,{family:calligraphy,width:44,fitToWidth:true}),
 t('age','Broj godina','18',35,48.5,92,{family:serif,width:30}),
 t('occasion','Povod','ROĐENDAN',65,48.5,27,{width:46,letterSpacing:1}),
 t('note','Poruka gostima','Moji ljudi, muzika i veče\nkoje ćemo pamtiti.',50,59,23),
 date(50,69,{size:31}),time(50,77,{size:25}),
 t('location','Mesto i adresa proslave','Restoran Rubin\nBeograd',50,85,22),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 12. juna.',50,94,18)
 ];
 if(m.category==='birthday')layers=[
 t('title','Uvodni tekst','ZARONI U ROĐENDANSKU AVANTURU!',50,7,14.5,{letterSpacing:.8}),
 t('names','Ime deteta','Una',50,17,100,{family:storybook,fitToWidth:true}),
 t('age','Broj godina','5.',35,27.5,79,{family:storybook,width:30}),
 t('occasion','Povod','rođendan',65,27.5,32,{family:storybook,width:46}),
 t('note','Poruka gostima','Čekaju te igra, torta i drugari!',50,35,19),
 date(31,42,{family:storybook,width:52,size:23.5}),time(78,42,{width:30,size:21}),
 t('location','Mesto i adresa proslave','Igraonica Mehurići · Beograd',50,47.5,17)
 ];
 if(m.category==='wedding')layers=[
 t('title','Uvodni tekst','POZIVAMO VAS\nNA VENČANJE',71.5,9.5,18,{width:49,letterSpacing:1.5,lineHeight:1.25}),
 t('bride','Ime mlade','Teodora',71.5,22,76,{family:calligraphy,width:49,fitToWidth:true}),
 t('join','Veznik','&',71.5,30,28,{family:serif,width:20}),
 t('groom','Ime mladoženje','Aleksandar',71.5,39,76,{family:calligraphy,width:49,fitToWidth:true}),
 t('note','Poruka gostima','Budite deo naše priče\ni proslavite sa nama.',50,50,23),
 date(50,60,{size:31}),
 t('ceremony_time','Početak obreda','VENČANJE · 14:00',27,68,19,{width:44,letterSpacing:.6}),
 t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',27,76,21,{width:44}),
 t('time','Početak svadbene proslave','PROSLAVA · 17:00',73,68,19,{width:44,letterSpacing:.6}),
 t('location','Mesto i adresa proslave','Restoran Jasmin\nBeograd',73,76,21,{width:44}),
 t('rsvp','Potvrda dolaska','Potvrdite dolazak do 12. juna.',50,92,18)
 ];
 if(m.category==='baptism')layers=[
 t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',50,8,18,{letterSpacing:1.5}),
 t('names','Ime deteta','Maša',50,20,88,{family:'Libre Caslon Display',fitToWidth:true}),
 t('occasion','Povod','KRŠTENJE',50,31,34,{letterSpacing:4}),
 t('note','Poruka gostima','Budite uz nas na danu\npunom vere, ljubavi i radosti.',50,38.5,23),
 date(50,45.5,{size:30}),
 t('ceremony_time','Početak obreda','OBRED · 12:00',25,52,18,{width:42,letterSpacing:.6}),
 t('ceremony_location','Naziv i adresa crkve','Crkva Svetog Marka\nBeograd',25,59,20,{width:42}),
 t('time','Početak proslave','PROSLAVA · 14:00',75,52,18,{width:42,letterSpacing:.6}),
 t('location','Mesto i adresa proslave','Restoran Biser\nBeograd',75,59,20,{width:42})
 ];
 if(m.category==='baby')layers=[
 t('title','Uvodni tekst','DOBRO DOŠLA,\nMALA RADOSTI',26,23,19,{width:42,letterSpacing:1.2,lineHeight:1.4}),
 t('names','Ime bebe','Helena',50,57,86,{family:gentle,fitToWidth:true}),
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
