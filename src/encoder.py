import json

import datetime


class DateAwareEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, datetime.date):
            return obj.strftime("%Y-%B-%d")

        return json.JSONEncoder.default(self, obj)
