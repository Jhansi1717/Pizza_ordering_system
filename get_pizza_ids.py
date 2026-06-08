import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://unsplash.com/s/photos/pizza', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, context=ctx).read().decode('utf-8')
    matches = re.findall(r'photo-\d{13}-[a-f0-9]{12}', html)
    unique_ids = list(set(matches))
    for i in unique_ids[:20]:
        print(i)
except Exception as e:
    print("Error:", e)
