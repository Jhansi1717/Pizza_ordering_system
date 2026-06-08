import urllib.request
import json

def fetch_category_images(category, limit=50):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{category}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req).read()
    data = json.loads(response)
    
    titles = [item['title'] for item in data['query']['categorymembers']]
    
    images = []
    for title in titles:
        title_encoded = urllib.parse.quote(title)
        img_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={title_encoded}&prop=imageinfo&iiprop=url&format=json"
        req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        res2 = urllib.request.urlopen(req2).read()
        d2 = json.loads(res2)
        pages = d2['query']['pages']
        for page_id in pages:
            if 'imageinfo' in pages[page_id]:
                url = pages[page_id]['imageinfo'][0]['url']
                if not url.lower().endswith(('.svg', '.pdf', '.ogv')):
                    images.append(url)
    return images

pizza_images = fetch_category_images("Pizzas")
print("Found", len(pizza_images))
with open('pizza_images.json', 'w') as f:
    json.dump(pizza_images, f)
