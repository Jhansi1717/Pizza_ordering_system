import urllib.request
import time

urls = {
    "chicken_dominator.png": "1565299507177-b0ac66763828", # Meat/Sausage
    "non_veg_extravaganza.png": "1601925260368-ae2f83cf8b7f", # Meatzaa
    "italian_pepperoni.png": "1628840042765-356cda07504e", # Pepperoni
    "four_cheese_supreme.png": "1513104890138-7c749659a591", # Cheese/Veg
    "bbq_chicken_classic.png": "1565299624946-b28f40a0ae38", # BBQ
    "double_cheese_margherita.png": "1574071318508-1cdbab80d002", # Margherita
    "spicy_chicken.png": "1544982503932-8151408800b4", # Meat/Keema
    "mushroom_feast.png": "1534308983496-4fabb1a015ee", # Veg Dark
    "peppy_paneer.png": "1585238332004-92dcb77a4469", # Paneer
    "veg_extravaganza.png": "1590947132387-155cc02f3212", # Mexican Veg
    "chicken_golden_delight.png": "1555072956-7758afb20e8f", # Chicken Dominator
    "non_veg_supreme.png": "1559248740-410a563f45f9", # Extravaganza
    "chicken_fiesta.png": "1515516969-d4008cc6241a" # Chicken
}

# Since Unsplash API is very rate limited without a key, we just fetch the source URL directly
for name, id in urls.items():
    try:
        print(f"Downloading {name}...")
        # using source unsplash is deprecated, but direct photo URLs still work.
        # Wait, the photo URLs for images.unsplash.com/photo-ID don't return the image directly if they are protected, 
        # but they usually work if we provide the right parameters.
        req = urllib.request.Request(f"https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=400&q=80", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(f"src/assets/images/{name}", 'wb') as out_file:
            out_file.write(response.read())
        time.sleep(0.5)
    except Exception as e:
        print(f"Error for {name}: {e}")
