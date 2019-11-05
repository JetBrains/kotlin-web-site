import codecs
import os
from os import path
import geocoder
import ruamel.yaml
import xmltodict

data_folder = path.join(os.path.dirname(__file__), "../data")

with codecs.open(path.join(data_folder, "events.xml"), encoding='utf-8') as events_file:
    events_file_content = events_file.read()
    events = xmltodict.parse(events_file_content)['events']['event']

with open(path.join(data_folder, "cities.yml")) as cities_file:
    cities_array = ruamel.yaml.load(cities_file, ruamel.yaml.RoundTripLoader)

cities = {}
for city in cities_array:
    cities[city['name']] = city['geo']

for event in events:
    if 'location' not in event:
        print("Location of '" + event['title'] + "' is not specified")
        continue
    location = event['location']
    if location in cities:
        continue
    geocoded_coordinates = geocoder.yandex(location, kind=None).json
    if len(geocoded_coordinates) == 0:
        print("Location not found: ", location)
        exit(-1)
    for city in cities_array:
        coordinates = city['geo']
        if abs(coordinates['lat'] - float(geocoded_coordinates['lat'])) < 0.1 and abs(coordinates['lng'] - float(geocoded_coordinates['lng'])) < 0.1:
            is_same = None
            while is_same is None:
                user_input = input("Are " + location + " and " + city['name'] + " the same place? (y/n)")
                if user_input == "y" or user_input == "yes":
                    is_same = True
                elif user_input == "n" or user_input == "no":
                    is_same = False
                else:
                    print("Please, enter 'y' or 'n'")
            if is_same:
                location_template = u"<location>{0}</location>"
                old_location = location_template.format(event['location'])
                new_location = location_template.format(city['name'])
                events_file_content = events_file_content.replace(old_location, new_location)
                with codecs.open(path.join(data_folder, "events.xml"), 'w', encoding='utf-8') as events_file:
                    events_file.write(events_file_content)
                break
    else:
        print(location + " geocoded location " + \
              "https://www.google.com/maps/@" + geocoded_coordinates['lat'] + "," + geocoded_coordinates['lng'] + ",15z")
        city = {
            'name': location,
            'geo': {
                'lat': float(geocoded_coordinates['lat']),
                'lng': float(geocoded_coordinates['lng']),
            }
        }
        cities[city['name']] = city
        cities_array = [city] + cities_array
        with open(path.join(data_folder, "cities.yml"), 'w') as cities_file:
            ruamel.yaml.dump(cities_array, stream=cities_file, Dumper=ruamel.yaml.RoundTripDumper, allow_unicode=True)
