import { newTextLayer, normalizeDesign } from '../../src/template-schema.js';
import { buildTemplateTitle } from '../../src/template-titles.js';
import metadata from './metadata.json' with { type: 'json' };
import ids from './asset-ids.json' with { type: 'json' };

export function firstBirthdayExtraDesign(id, { backgroundId = ids.designs[id]?.background, fontIds = ids.fonts } = {}) {
  const source = metadata.find(item => item.id === id);
  if (!source) throw Error('Nepoznata pozivnica za prvi rođendan.');
  const { source: sourceNumber, ...item } = source;
  const round=`custom-${fontIds.round}`,puff=`custom-${fontIds.puff}`,hand=`custom-${fontIds.hand}`,serif=`custom-${fontIds.serif}`;
  const t=(field,label,text,x,y,size,options={})=>({
    ...newTextLayer(field),id:`${id}-${field}`,field,label,text,x,y,size,
    family:round,width:76,color:'#15516c',lineHeight:1.3,...options,
  });
  const layers=id==='prva-morska-plovidba'?[
    t('title','Uvodni tekst','MALA POSADA, VELIKA PROSLAVA!',45,10.5,11.5,{family:'DM Sans',letterSpacing:1.1,width:82,fitToWidth:true}),
    t('names','Ime deteta','Luka',45,23,61,{width:79,rotation:-3,fitToWidth:true,color:'#124d70'}),
    t('age','Broj godina','1.',27,37,90,{family:puff,width:28,color:'#9a5a1d',fitToWidth:true,lineHeight:1}),
    t('occasion','Povod','rođendan',64,38,31,{width:50,fitToWidth:true}),
    t('note','Poruka gostima','Jedna svećica, mnogo osmeha.\nZaplovimo u prvu avanturu!',37,47,16.5,{width:64,lineHeight:1.35}),
    t('date','Datum proslave','2027-06-12',27,55.5,20,{width:42,fitToWidth:true}),
    t('time','Početak proslave','17:00',61,55.5,24,{width:27,fitToWidth:true}),
    t('location','Mesto i adresa proslave','Igraonica Mala luka\nBeograd',28,63,16,{width:48,lineHeight:1.3}),
    t('rsvp','Potvrda dolaska','Javite da li dolazite\ndo 5. juna.',27,70,12.5,{width:48,lineHeight:1.25,color:'#12465f'}),
  ]:[
    t('title','Uvodni tekst','MOJA PRVA ROĐENDANSKA BAJKA',52,12,10.8,{family:'DM Sans',width:78,letterSpacing:1.1,color:'#6b304e',fitToWidth:true}),
    t('names','Ime deteta','Mila',52,25,67,{family:hand,width:77,color:'#8c3158',fitToWidth:true}),
    t('age','Broj godina','1.',43,38.5,92,{family:round,width:32,color:'#963a60',fitToWidth:true,lineHeight:1}),
    t('occasion','Povod','rođendan',69,40,27,{family:serif,width:43,color:'#79314f',fitToWidth:true}),
    t('note','Poruka gostima','Dođi da zajedno ugasimo\nmoju prvu svećicu.',59,52.5,17.5,{family:serif,width:66,color:'#67334c',lineHeight:1.35}),
    t('date','Datum proslave','2027-06-12',75,63.5,20,{family:serif,width:42,color:'#643047',fitToWidth:true}),
    t('time','Početak proslave','16:00',75,69.5,22,{width:38,color:'#8c3158',fitToWidth:true}),
    t('location','Mesto i adresa proslave','Igraonica Labudić\nNovi Sad',74,76,17,{family:serif,width:44,color:'#643047',lineHeight:1.25}),
    t('rsvp','Potvrda dolaska','Potvrdite dolazak\ndo 5. juna.',75,91,13,{family:serif,width:43,color:'#643047',lineHeight:1.3}),
  ];
  const names={round:'Baloo 2 — razigrani obli',puff:'DynaPuff — veseli',hand:'Napravi Rukopis — Marck Script',serif:'Cormorant Garamond — nežni serif'};
  const used=new Set(layers.map(layer=>layer.family));
  const fonts=Object.entries(fontIds).filter(([,assetId])=>used.has(`custom-${assetId}`)).map(([key,assetId])=>({assetId,family:`custom-${assetId}`,name:names[key]}));
  return {...normalizeDesign({...item,seoTitle:buildTemplateTitle(item),backgroundId,fonts,layers}),id,builtinSource:id,style:'custom',hasPhoto:false};
}
