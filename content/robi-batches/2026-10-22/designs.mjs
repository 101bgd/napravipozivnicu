import { newTextLayer, normalizeDesign } from '../../../src/template-schema.js';
import { buildTemplateTitle } from '../../../src/template-titles.js';
export const metadata={
 id:'paunova-elegancija',name:'Paunova elegancija',category:'wedding',
 motif:'sa paunovim perjem',slug:'pozivnica-za-vencanje-paunovo-perje',
 description:'Pozivnica za venčanje sa paunovim perjem u tirkiznim i zlatnim nijansama. Uredi imena, obred i proslavu i pripremi PNG ili PDF za štampu.',
 imageAlt:'Pozivnica za venčanje sa tirkiznim paunovim perjem i zlatnim grančicama na toploj svetloj podlozi, sa krupnim imenima u sredini',
 details:'Paunovo perje u donjim uglovima i mali gornji ukras ostavljaju prostor za krupna centrirana imena. Posebno se menjaju imena mladenaca, datum, detalji obreda i svadbene proslave. Topla svetla podloga i tamna tirkizna slova čuvaju čitljivost.',
 bg:'#faf3df'
};
metadata.seoTitle=buildTemplateTitle(metadata);
export const backgroundId='a562a15a-6e5c-56bc-a001-2a0847ca3135';
export function getBatchDesigns(){
 const t=(field,label,text,y,size,extra={})=>({...newTextLayer(field),id:'paunova-'+field,label,text,x:50,y,width:80,size,color:'#164b4e',family:'DM Sans',lineHeight:1.25,align:'center',...extra});
 const layers=[
  t('title','Uvodni tekst','SA LJUBAVLJU VAS POZIVAMO',10.5,13.5,{width:72,letterSpacing:.4}),
  t('bride','Ime mlade','Milica',20.5,54,{family:'Libre Caslon Display',width:80}),
  t('join','Veznik','&',28.5,26,{family:'Libre Caslon Display',color:'#85702d',width:30}),
  t('groom','Ime mladoženje','Stefan',36,54,{family:'Libre Caslon Display',width:80}),
  t('note','Poruka gostima','Da zajedno proslavimo\nnaše venčanje.',45,15.5,{width:78}),
  t('date','Datum venčanja','2027-06-12',53,23,{family:'Libre Caslon Display',width:76}),
  t('ceremony_time','Vreme obreda','VENČANJE · 14:00',59.5,13.6,{x:28,width:40}),
  t('time','Početak proslave','PROSLAVA · 17:00',59.5,13.6,{x:72,width:40}),
  t('ceremony_location','Mesto i adresa obreda','Hram Svetog Save\nBeograd',65,13.2,{x:28,width:40}),
  t('location','Mesto i adresa proslave','Restoran Paun\nBeograd',65,13.2,{x:72,width:40}),
  t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',72,12.8,{width:68}),
 ];
 return [{...normalizeDesign({...metadata,backgroundId,fonts:[],layers}),...metadata,style:'custom',hasPhoto:false}];
}
export const batchCatalog=[{...metadata,style:'custom',hasPhoto:false,updatedAt:'2026-10-22T00:00:00+09:00'}];

