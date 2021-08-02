from os import path

import geocoder
from ruamel import yaml

data_folder = path.join(path.dirname(__file__), "../data")
data_file = path.join(data_folder, "user-groups.yml")

with open(data_file, encoding="utf-8") as points_file:
    sections = yaml.load(points_file, yaml.RoundTripLoader)

for n, section in enumerate(sections):
    for n, user_group in enumerate(section['groups']):
        city = user_group.get("name").replace("Kotlin", "").replace("User", "").replace("Group", "").strip()
        location = city + ", " + user_group.get("country")

        if 'position' in user_group:
            print(location + " (saved previous)")
            continue

        print("Process %s..." % location)

        response = geocoder.google(location)
        coordinates = response.latlng

        if coordinates is None or len(coordinates) == 0:
            raise Exception("Location not found: " + location)

        if response.ok is not True:
            raise Exception("Location not resolved: ", location)

        new_geo = {
            "lat": coordinates[0],
            "lng": coordinates[1],
        }

        print("Will coordinates for \"%s\":\nhttps://www.google.com/maps/search/?api=1&query=%s,%s""" % (
            location, new_geo['lat'], new_geo['lng']
        ))

        user_group['position'] = new_geo

with open(data_file, 'w') as points_file:
    yaml.dump(sections, stream=points_file, Dumper=yaml.RoundTripDumper, allow_unicode=True)
