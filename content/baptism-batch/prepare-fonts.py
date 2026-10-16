"""Prepare local WOFF2 fonts from the two Google Fonts source TTF files.

Requires fonttools[woff]. Usage:
  python3 prepare-fonts.py /path/CormorantGaramond.ttf /path/MarckScript.ttf
The SIL OFL licenses in fonts/ must accompany the generated files.
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

output = Path(__file__).resolve().parent / 'fonts'
output.mkdir(exist_ok=True)
characters = (
    set(range(0x20, 0x250)) | set(range(0x300, 0x370)) |
    set(range(0x400, 0x530)) | set(range(0x2000, 0x2070)) |
    {0x20ac, 0x2116, 0x2212}
)
serbian = 'ČĆŠŽĐčćšžđАБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШабвгдђежзијклљмнњопрстћуфхцчџш'
if len(sys.argv) != 3:
    raise SystemExit(__doc__)
for source, weight, filename in zip(sys.argv[1:], [500, 400], ['cormorant-500-sr.woff2', 'rukopis-400-sr.woff2']):
    font = TTFont(source, recalcTimestamp=False)
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': weight}, inplace=True)
    if filename.startswith('rukopis'):
        # Marck Script is a Reserved Font Name. The subset is a modified
        # version, so use our own family/full/PostScript/unique names.
        names = {
            1: 'Napravi Rukopis', 2: 'Regular',
            3: '1.000;NAPR;NapraviRukopis-Regular',
            4: 'Napravi Rukopis Regular', 6: 'NapraviRukopis-Regular',
            16: 'Napravi Rukopis', 17: 'Regular',
            18: 'Napravi Rukopis Regular', 21: 'Napravi Rukopis', 22: 'Regular',
        }
        for record in font['name'].names:
            if record.nameID in names:
                record.string = names[record.nameID].encode(record.getEncoding())
    options = subset.Options()
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=characters)
    sub.subset(font)
    font.flavor = 'woff2'
    destination = output / filename
    font.save(destination)
    saved = TTFont(destination)
    assert all(ord(character) in saved.getBestCmap() for character in serbian)
    print(f'{filename}: {destination.stat().st_size} bytes; Serbian Latin/Cyrillic verified')
