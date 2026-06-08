import urllib.request
import json
import urllib.parse
import os

queries = {
    "chicken_dominator.png": "chicken pizza",
    "non_veg_extravaganza.png": "pizza supreme meat",
    "italian_pepperoni.png": "pepperoni pizza",
    "four_cheese_supreme.png": "quattro formaggi pizza",
    "bbq_chicken_classic.png": "barbecue chicken pizza"
}

def download_wiki_image(query, filename):
    try:
        search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
        req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
        data = json.loads(urllib.request.urlopen(req).read())
        
        if not data['query']['search']:
            print(f"No results for {query}, trying generic...")
            search_url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=pizza&srnamespace=6&format=json"
            req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
            data = json.loads(urllib.request.urlopen(req).read())
            
        for result in data['query']['search']:
            title = result['title']
            if not title.lower().endswith(('.svg', '.pdf', '.ogv', '.webm')):
                img_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json"
                req2 = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
                d2 = json.loads(urllib.request.urlopen(req2).read())
                
                pages = d2['query']['pages']
                for page_id in pages:
                    if 'imageinfo' in pages[page_id]:
                        info = pages[page_id]['imageinfo'][0]
                        url = info.get('thumburl', info['url'])
                        print(f"Downloading {url} to {filename}")
                        req3 = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req3) as response, open(f"src/assets/images/{filename}", 'wb') as out_file:
                            out_file.write(response.read())
                        return
    except Exception as e:
        print(f"Error for {query}: {e}")

for fname, q in queries.items():
    download_wiki_image(q, fname)
