from pathlib import Path
import json, hashlib, uuid, shutil
from fontTools.merge import Merger
from fontTools.ttLib import TTFont

batch = Path(__file__).resolve().parent
root = batch.parents[3]
destination = root / 'public/assets/pozivnice/fonts/premium-20261027'
destination.mkdir(parents=True, exist_ok=True)
faces = [('bricolage-grotesque',600,'normal','studio','Napravi Studio'),
         ('sora',400,'normal','linear','Napravi Linear'),
         ('bodoni-moda',500,'normal','gala','Napravi Gala'),
         ('bodoni-moda',500,'italic','sonata','Napravi Sonata'),
         ('lora',400,'normal','knjiga','Napravi Knjiga'),
         ('lora',400,'italic','knjigaItalic','Napravi Knjiga Italic')]
output=[]
for package, weight, style, key, alias in faces:
    inputs=[batch/'fonts'/package/f'{package}-{subset}-{weight}-{style}.woff2' for subset in ['latin','latin-ext']]
    inputs=[p for p in inputs if p.exists()]
    font=Merger().merge([str(p) for p in inputs]) if len(inputs)>1 else TTFont(inputs[0])
    missing=[c for c in 'ČĆŠŽĐčćšžđ' if ord(c) not in font.getBestCmap()]
    assert not missing,(package,missing)
    postscript=alias.replace(' ','')
    names={1:alias,2:'Regular',3:postscript+'-20261027',4:alias,6:postscript,16:alias,17:'Regular',25:postscript}
    for record in list(font['name'].names):
        if record.nameID in names:
            font['name'].setName(names[record.nameID],record.nameID,record.platformID,record.platEncID,record.langID)
    font.flavor='woff2'
    temporary=destination/(key+'.woff2')
    font.save(temporary);font.close()
    raw=temporary.read_bytes();sha=hashlib.sha256(raw).hexdigest()
    path=destination/(key+'-sr-'+sha[:12]+'.woff2');temporary.replace(path)
    asset_id=str(uuid.uuid5(uuid.NAMESPACE_URL,'https://napravipozivnicu.com/robi/premium-20261027/font/'+key))
    output.append({'key':key,'name':alias,'origin':package,'weight':weight,'style':style,'assetId':asset_id,'family':'custom-'+asset_id,'path':str(path.relative_to(root)),'bytes':len(raw),'sha256':sha,'serbianGlyphs':'passed'})
    shutil.copy2(batch/'fonts'/package/'OFL.txt',destination/('OFL-'+package+'.txt'))
(destination/'MODIFICATIONS.txt').write_text('Fontsource5.3.0 OFL sources; provenance stored with batch. Latin and Latin-ext subsets merged for Serbian. WOFF2 export with unchanged glyph outlines. Family, full and PostScript names renamed to the Napravi aliases to respect any Reserved Font Names. Original licenses retained.\n')
for name in ['font-assets.json','used-fonts.json']:
    (batch/name).write_text(json.dumps(output,indent=2)+'\n')
print(json.dumps(output))
