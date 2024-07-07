from flask import Flask, request
from datetime import date, timedelta, datetime
from requests import get
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/get-weather-data", methods=['POST'])
@cross_origin(supports_credentials=True)
def get_weather_data():
    data = request.get_json()
    requested_year = data['year']
    current_year = date.today().year
    if requested_year == None:
        requested_year = current_year
    end_date = ""
    # If the requested year is this year, end_date is today
    if current_year == requested_year:
        end_date = date.today()
    # If not, use whole year
    else:
        end_date = date(int(requested_year), 12, 31)
    today = date.today()
    # start_date is beginning of requested_year
    start_date = date(int(requested_year), 1, 1)

    # Make array with space for full year
    weather_data = [None] * 365
    
    # Connect to NCEI API for 2022
    site = "https://www.ncei.noaa.gov/access"
    endpoint = "/services/data/v1?dataset=global-summary-of-the-day&stations=72254413958&" \
               "startDate={}&endDate={}&dataTypes=MAX,MIN,PRCP&format=json".format(start_date, end_date)

    response = get("{}{}".format(site, endpoint))
    response = response.json()

    for i in range(len(response)):
        weather_data[i] = response[i]
    
    print(weather_data)
    # Intialize list for calculating max rain
    rain_list = []
    
    # Add each rain value to list
    for day in weather_data:
        if day != None:
            rain_list.append(day['PRCP'])
    # Sort list with max rain at top and take value  
    rain_list.sort(reverse=True)
    max_rain = rain_list[0].strip()

    return {'days': weather_data, 'maxRain': max_rain}