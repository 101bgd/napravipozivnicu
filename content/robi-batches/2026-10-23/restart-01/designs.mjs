import {newTextLayer,normalizeDesign} from '../../../../src/template-schema.js';
import {buildTemplateTitle} from '../../../../src/template-titles.js';
import metadata from './metadata.json' with {type:'json'};
import ids from './asset-ids.json' with {type:'json'};
import specs from './layout-spec.json' with {type:'json'};
import tuning from './layout-tuning.json' with {type:'json'};
export const batchAssetIds=ids;
export const batchCatalog=metadata.map(m=>({...m,seoTitle:buildTemplateTitle(m),style:'custom',hasPhoto:false,updatedAt:ids.publicationPreparedAt||'2026-10-23T05:16:51Z'}));
export function batchDesign(id,{backgroundId=ids.designs[id]?.background,fontIds=ids.fonts}={}){
 const m=batchCatalog.find(x=>x.id===id);if(!m)throw Error('Unknown Robi design: '+id);
 const families={playful:'custom-'+fontIds.baloo2,serif:'custom-'+fontIds.cormorant,script:'custom-'+fontIds.marckscript};
 const color={first:'#092e39',eighteen:'#fff6e8',birthday:'#fff8e8',wedding:'#fff1cf',baptism:'#fff0d3',baby:'#512611'}[m.category];
 const layers=specs[id].map(([field,label,text,x,y,size,extra={}])=>{
  const family=families[extra.family]||extra.family||'DM Sans';
  return {...newTextLayer(field),id:id+'-'+field,label,text,x,y,size,width:80,color,lineHeight:1.2,align:'center',...extra,family,...(tuning[id]?.[field]||{})};
 });
 const used=new Set(layers.map(l=>l.family));const names={baloo2:'Baloo 2',cormorant:'Cormorant Garamond',marckscript:'Marck Script'};
 const fonts=Object.entries(fontIds).filter(([,assetId])=>used.has('custom-'+assetId)).map(([key,assetId])=>({assetId,family:'custom-'+assetId,name:names[key]}));
 return {...normalizeDesign({...m,backgroundId,thumbnailId:ids.designs[id].thumbnail,fonts,layers}),...m,id,builtinSource:id,style:'custom',hasPhoto:false};
}
export const getBatchDesigns=()=>batchCatalog.map(m=>batchDesign(m.id));
