from os import path

import geocoder
from ruamel import yaml

data_folder = path.join(path.dirname(__file__), "../data")
data_file = path.join(data_folder, "universities.yml")

with open(data_file, encoding="utf-8") as points_file:
    universities = yaml.load(points_file, yaml.RoundTripLoader)

for n, university in enumerate(universities):
    location = university.get("location") + ", " + university.get("title")

    if university.get("courses") is None:
        raise Exception("No single courses: " + location)

    if university.get("geo") is not None:
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
        "lat": str(coordinates[0]),
        "lng": str(coordinates[1]),
    }

    print("Will coordinates for \"%s\":\nhttps://www.google.com/maps/search/?api=1&query=%s,%s""" % (
        location, new_geo['lat'], new_geo['lng']
    ))

    university["geo"] = new_geo

with open(data_file, 'w') as points_file:
    yaml.dump(universities, stream=points_file, Dumper=yaml.RoundTripDumper, allow_unicode=True)
