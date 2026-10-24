from pathlib import Path
import json, subprocess, hashlib
from PIL import Image
from fontTools.ttLib import TTFont
import numpy as np
from scipy.fft import dctn

root = Path.cwd()
batch = root / 'content/robi-batches/2026-10-24/extra-01'
font_checks = []
for font in json.loads((batch / 'used-fonts.json').read_text()):
    file = root / font['path']
    face = TTFont(file)
    missing = [c for c in 'ČĆŠŽĐčćšžđ' if ord(c) not in face.getBestCmap()]
    face.close()
    assert not missing, (font['name'], missing)
    font_checks.append({'font': font['name'], 'path': font['path'], 'serbianGlyphs': 'passed', 'missing': missing})
(batch / 'font-checks.json').write_text(json.dumps({
    'fonts': font_checks,
    'licenses': ['public/assets/pozivnice/deciji-rodjendani/OFL-baloo2.txt', 'public/assets/pozivnice/krstenje/OFL-cormorant.txt', 'public/assets/pozivnice/krstenje/OFL-marckscript.txt'],
    'baseFont': 'Existing licensed DM Sans package, latin and latin-ext loaded together.'
}, indent=2) + '\n')

def phash(file):
    pixels = np.array(Image.open(file).convert('L').resize((32, 32)), dtype=float)
    values = dctn(pixels, type=2, norm='ortho')[:8, :8].flatten()[1:]
    return values > np.median(values)

history = [p for p in (root / 'public/assets/pozivnice').rglob('*') if p.suffix.lower() in ('.png', '.webp', '.jpg') and ('pozadina' in p.name or 'background' in p.name) and '/robi/2026-10-24/extra-01/' not in str(p)]
history += list(Path('/workspace/work/robi-cancelled-trial-20261021/content/robi-batches/calibration/backgrounds').glob('*.webp'))
old = [(str(p.relative_to(root)) if p.is_relative_to(root) else str(p), phash(p)) for p in history]
new = {p.stem: phash(p) for p in (batch / 'backgrounds').glob('*.webp')}
comparisons = []
for design_id, value in new.items():
    nearest = sorted([{'file': p, 'distance63': int(np.count_nonzero(value != other))} for p, other in old], key=lambda d: d['distance63'])
    assert nearest[0]['distance63'] > 0
    comparisons.append({'id': design_id, 'historyCount': len(old), 'nearest': nearest[:3], 'exactDuplicate': False})
pairs = [{'a': a, 'b': b, 'distance63': int(np.count_nonzero(new[a] != new[b]))} for i, a in enumerate(new) for b in list(new)[i + 1:]]
assert all(p['distance63'] > 0 for p in pairs)
(batch / 'similarity-checks.json').write_text(json.dumps({'designs': comparisons, 'pairwise': pairs, 'visualReview': 'New focal subjects, layouts and palettes reviewed against catalog motifs and retained rejection history; perceptual hash is supplementary, not aesthetic approval.'}, indent=2) + '\n')

(batch / 'pdf-renders').mkdir(exist_ok=True)
pdf_checks = []
for file in sorted((batch / 'examples').glob('*.pdf')):
    info = subprocess.run(['pdfinfo', str(file)], capture_output=True, text=True, check=True).stdout
    assert '360 x 504 pts' in info, info
    out = batch / 'pdf-renders' / file.stem
    subprocess.run(['pdftoppm', '-scale-to-x', '500', '-scale-to-y', '700', '-singlefile', '-png', str(file), str(out)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    with Image.open(str(out) + '.png') as image:
        assert image.size == (500, 700)
        image.verify()
    pdf_checks.append({'file': str(file.relative_to(batch)), 'opened': 'passed', 'sizePoints': [360, 504], 'rasterized': 'passed'})
(batch / 'pdf-open-checks.json').write_text(json.dumps({'status': 'passed', 'pdfFiles': pdf_checks}, indent=2) + '\n')

png_checks = []
for file in sorted((batch / 'examples').glob('*.png')):
    with Image.open(file) as image:
        size, dpi = image.size, image.info.get('dpi')
        assert size == (1500, 2100)
        assert dpi and all(abs(d - 300) < .02 for d in dpi), (file, dpi)
        image.verify()
    png_checks.append({'file': str(file.relative_to(batch)), 'size': size, 'dpi': dpi, 'pngIntegrity': 'passed'})
(batch / 'png-print-checks.json').write_text(json.dumps({'status': 'passed', 'pngFiles': png_checks}, indent=2) + '\n')

print(json.dumps({'fonts': len(font_checks), 'historyImages': len(history), 'distinctNewPairs': len(pairs), 'pdfsOpenedAndRasterized': len(pdf_checks), 'pngsOpenedWith300dpi': len(png_checks)}))
