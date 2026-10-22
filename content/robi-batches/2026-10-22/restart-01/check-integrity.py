from pathlib import Path
import json,hashlib
from PIL import Image
from fontTools.ttLib import TTFont
import numpy as np
from scipy.fft import dctn
root=Path.cwd(); folder=root/'content/robi-batches/2026-10-22/restart-01'
meta=json.loads((folder/'metadata.json').read_text())
def phash(p):
 a=np.array(Image.open(p).convert('L').resize((32,32)),dtype=float)
 d=dctn(a,type=2,norm='ortho')[:8,:8].flatten()[1:]
 return d>np.median(d)
history=[p for p in (root/'public/assets/pozivnice').rglob('*') if p.suffix.lower() in ('.png','.webp','.jpg') and ('pozadina' in p.name or 'background' in p.name) and '/robi/2026-10-22/' not in str(p)]
history+=list(Path('/workspace/work/robi-cancelled-trial-20261021/content/robi-batches/calibration/backgrounds').glob('*.webp'))
abandoned=root/'content/robi-batches/2026-10-22/sources/paunova-elegancija.png'
if abandoned.exists():history.append(abandoned)
old=[(str(p),phash(p)) for p in history]
new={m['id']:phash(folder/'sources'/(m['id']+'.png')) for m in meta}
results=[]
for m in meta:
 nearest=sorted([{'file':p,'distance63':int(np.count_nonzero(new[m['id']]!=h))} for p,h in old],key=lambda x:x['distance63'])
 assert nearest[0]['distance63']>0
 results.append({'id':m['id'],'motif':m['motif'],'historyCount':len(old),'nearest':nearest[:3],'duplicate':False})
pairs=[{'a':a,'b':b,'distance63':int(np.count_nonzero(new[a]!=new[b]))} for i,a in enumerate(new) for b in list(new)[i+1:]]
assert all(p['distance63']>0 for p in pairs)
(folder/'similarity-checks.json').write_text(json.dumps({'designs':results,'newPairwise':pairs,'visualReview':'Six separate original backgrounds and distinct motifs/compositions visually reviewed; source images not taken from catalog or cancelled drafts. Hash distance alone is not aesthetic approval.'},ensure_ascii=False,indent=2)+'\n')
font_paths=list((root/'node_modules/@fontsource/dm-sans/files').glob('*-400-normal.woff2'))
for font in json.loads((folder/'used-fonts.json').read_text()):
 font_paths.append(root/font['path'])
checks=[]
for p in font_paths:
 f=TTFont(p);cmap=f.getBestCmap();missing=[c for c in 'ČĆŠŽĐčćšžđ' if ord(c) not in cmap];f.close()
 checks.append({'path':str(p.relative_to(root)),'missing':missing})
# DM Sans web subsets are complementary; custom shipped fonts must have all glyphs.
for c in checks:
 if c['path'].startswith('public/'):assert not c['missing'],c
(folder/'font-checks.json').write_text(json.dumps({'fonts':checks,'licenses':'Existing SIL OFL 1.1 fonts reused; licenses remain in existing font collections/packages.','source':'Actual WOFF2 cmap read; DM Sans latin and latin-ext used together.'},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'newDesigns':len(meta),'history':len(history),'minimumNewPairDistance':min(p['distance63'] for p in pairs),'customFontChecks':len([c for c in checks if c['path'].startswith('public/')])}))

