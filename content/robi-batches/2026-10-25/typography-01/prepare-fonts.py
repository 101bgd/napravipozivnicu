"""Combine licensed Fontsource Latin/Latin-ext subsets into reusable local faces.

No glyph outlines are edited. The Bree Serif derivative is renamed as its OFL
reserves the original family name. Upstream licenses accompany every face.
"""
import hashlib
import json
import uuid
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.merge import Merger

directory = Path(__file__).resolve().parent
root = directory.parents[3]
target = root / 'public/assets/pozivnice/fonts/typography-20261025'
target.mkdir(parents=True, exist_ok=True)
rows = []
for slug, weight, key, family in [
    ('fraunces', 600, 'fraunces600', 'Fraunces'),
    ('fraunces', 400, 'fraunces400', 'Fraunces'),
    ('outfit', 400, 'outfit400', 'Outfit'),
    ('outfit', 600, 'outfit600', 'Outfit'),
    ('bree-serif', 400, 'bajka', 'Napravi Bajka'),
]:
    sources = [directory / 'font-sources' / slug / f'{slug}-{sub}-{weight}-normal.woff2' for sub in ['latin', 'latin-ext']]
    unpacked = []
    for source in sources:
        font = TTFont(source, recalcTimestamp=False)
        font.flavor = None
        path = source.with_suffix('.ttf')
        font.save(path)
        unpacked.append(str(path))
    font = Merger().merge(unpacked)
    if slug == 'bree-serif':
        replacements = {1: family, 2: 'Regular', 3: '1.000;NAPR;NapraviBajka-Regular', 4: family, 6: 'NapraviBajka-Regular', 16: family, 17: 'Regular', 18: family, 21: family, 22: 'Regular'}
        for record in font['name'].names:
            if record.nameID in replacements:
                record.string = replacements[record.nameID].encode(record.getEncoding())
    font.flavor = 'woff2'
    temporary = target / f'{key}.woff2'
    font.save(temporary)
    data = temporary.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    destination = target / f'{key}-sr-{digest[:12]}.woff2'
    temporary.rename(destination)
    actual = TTFont(destination)
    cmap = actual.getBestCmap()
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ČĆŠŽĐčćšžđ&.,:!?–'
    missing = [c for c in chars if ord(c) not in cmap]
    assert not missing, (key, missing)
    license_path = target / f'OFL-{slug}.txt'
    license_path.write_bytes((directory / 'font-sources' / slug / 'LICENSE').read_bytes())
    asset_id = str(uuid.uuid5(uuid.NAMESPACE_URL, f'https://napravipozivnicu.com/fonts/typography-20261025/{key}'))
    rows.append({'key': key, 'assetId': asset_id, 'name': family + (' SemiBold' if weight == 600 else ''), 'weight': weight, 'url': '/' + str(destination.relative_to(root / 'public')), 'path': str(destination.relative_to(root)), 'bytes': len(data), 'sha256': digest, 'serbianLatin': 'passed', 'glyphCount': len(cmap), 'license': str(license_path.relative_to(root)), 'originalFamily': slug, 'combinedSubsets': ['latin', 'latin-ext'], 'renamedForReservedFontName': slug == 'bree-serif'})
(directory / 'font-manifest.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(rows, ensure_ascii=False))
