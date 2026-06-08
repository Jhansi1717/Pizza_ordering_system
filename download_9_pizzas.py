import urllib.request
import time

urls = {
    "peppy_paneer.png": "1513104890138-7c749659a591",
    "veg_extravaganza.png": "1534308983496-4fabb1a015ee",
    "chicken_golden_delight.png": "1565299624946-b28f40a0ae38",
    "non_veg_supreme.png": "1574071318508-1cdbab80d002",
    "four_cheese_supreme.png": "1628840042765-356cda07504e",
    "bbq_chicken_classic.png": "1590947132387-155cc02f3212",
    "chicken_dominator.png": "1604382354936-07c5d9983bd3",
    "non_veg_extravaganza.png": "1571407970349-bc81e7e96d47",
    "italian_pepperoni.png": "1585238332004-92dcb77a4469"
}

for name, id in urls.items():
    try:
        print(f"Downloading {name} from Unsplash ID {id}...")
        req = urllib.request.Request(f"https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=400&q=80", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(f"src/assets/images/{name}", 'wb') as out_file:
            out_file.write(response.read())
        time.sleep(1) # Prevent rate limiting
    except Exception as e:
        print(f"Error for {name}: {e}")
