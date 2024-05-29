badge_names = [
    "ROOKIE", "CHALLENGER", "APPENTICE", "VETERAN", "EXPERT", "LEGEND",
    "CHAMPION", "SUPREME", "GOD", "ULTIMATE", "MAESTRO", "GRANDMASTER"
]

badge_metadata = []
for badge in badge_names:
    for level in range(1, 4):  # Assuming three levels per badge type
        badge_id = f"{badge}_{level}"
        badge_metadata.append({
            "name": badge_id.split("_")[0].capitalize() + " " + str(level),
            "description": "Pixelmon Adventure Badge",
            "image": f"https://store.ewtd-ipfs.net/pixelmon-badges/{badge_id}.png",
            "external_link": "",
            "animation_url": "",
            "youtube_url": "",
            "attributes": {
                "traits": [
                    {
                        "trait_type": "level",
                        "value": str(level)
                    }
                ]
            }
        })

import json
# print(json.dumps(badge_metadata, indent=4))

#save to jsons/<badge_id>.json
for badge in badge_metadata:
    badge_id = badge["name"].replace(" ", "_").upper()
    with open(f"jsons/{badge_id}.json", "w") as f:
        json.dump(badge, f, indent=4)
        
# Path: json_generator.py