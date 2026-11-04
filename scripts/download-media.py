import concurrent.futures, urllib.request
from pathlib import Path
p=Path(__file__).resolve().parent.parent/'public/media'
p.mkdir(parents=True,exist_ok=True)
photos={'desert':'1509316785289-025f5b846b35','sneaker':'1542291026-7eec264c27ff','portrait':'1524504388940-b1c1722653e1','skincare':'1608571423902-eed4a5ad8108','coffee':'1495474472287-4d71bcdd2085','architecture':'1486406146926-c627a92ad1ab','ocean':'1518837695005-2083093ee35b','landscape':'1470071459604-3b5ec3a7fe05','night':'1519608487953-e999c86e7455','fashion':'1483985988355-763728e1935b'}
def get(item):
 name,id=item
 url=f'https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w={2200 if name=="desert" else 1000}&q=85'
 with urllib.request.urlopen(url,timeout=45) as r: data=r.read()
 (p/f'{name}.jpg').write_bytes(data)
 return name,len(data)
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
 for result in ex.map(get,photos.items()):print(*result)
