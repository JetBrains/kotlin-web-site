from os import path
from ruamel import yaml
import geocoder

data_folder = path.join(path.dirname(__file__), "../data")
data_file = path.join(data_folder, "universities.yml")

with open(data_file, encoding="utf-8") as points_file:
    universities = yaml.load(points_file, yaml.RoundTripLoader)

for n, university in enumerate(universities):
    location = university.get("location")+ ", " + university.get("title")
    coordinates = geocoder.yandex(location, kind=None).json

    if coordinates is None or len(coordinates) == 0:
        text = "Location not found: " + location
        if university.get("geo") is not None:
            print(text + " (saved previous)")
            continue
        else:
            raise Exception(text)

    if coordinates["ok"] is not True:
        raise Exception("Location not resolved: ", location)

    new_geo = {
        "lat": coordinates.get("lat"),
        "lng": coordinates.get("lng")
    }

    if university.get("geo") is None:
        university['geo'] = new_geo

    if university['geo'] != new_geo:
        is_same = None
        while is_same is None:
            input_text = "Will coordinates for \"" + location + """\" update? (y/n)
    https://www.google.com/maps/search/?api=1&query=""" + new_geo['lat'] + "," + new_geo['lng'] + """
    https://www.google.com/maps/search/?api=1&query=""" + university['geo']['lat'] + "," + university['geo']['lng']
            user_input = input(input_text)

            if user_input == "y" or user_input == "yes":
                is_same = True
            elif user_input == "n" or user_input == "no":
                is_same = False
            else:
                print("Please, enter \"y\" or \"n\"")

            if is_same:
                university['geo'] = new_geo

with open(data_file, 'w') as points_file:
    yaml.dump(universities, stream=points_file, Dumper=yaml.RoundTripDumper, allow_unicode=True)
