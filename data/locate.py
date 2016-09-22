import re
import os
import csv
import time
from geopy.geocoders import Nominatim

headers = [ 
			"latitude",
			"longitude",
			"article_title", 
			"article_date",
			"article_url",
			"article_description",
			"primary_event",
			"primary_location",
			"primary_event_date",
			"secondary_event",
			"secondary_location",
			"secondary_event_date" 
		]

input_file = csv.DictReader(open("DSIDE_data_oceans_and_coasts_news_articles.csv"))

path_data = 'data.csv'
os.remove(path_data)

data =  csv.writer(open(path_data,'a'))

data.writerow(headers)

def process_data():

	not_found = []

	for row in input_file:
		place = str(row["Estimated Location of Primary Event Described in News Article"]).split(',')[0]
		#print place
		geolocator = Nominatim()
		location = geolocator.geocode(place, timeout=10)
		if location is not None:
			#time.sleep(1)

			_article_title = str(row["News Article Title"])
			_article_date = str(row["News Article Publish Date and/or Time (dd/mm/yy hh:mm)"])
			_article_url = str(row["Source (URL) of News Article"])
			_article_description = str(row["Description of News Article"])
			_primary_event = str(row["Primary Event Described in News Article"])
			_primary_location = str(row["Estimated Location of Primary Event Described in News Article"])
			_primary_event_date = str(row["Estimated Date and/or Time (dd/mm/yy hh:mm) of Occurrence of Primary Event Described in News Article"])
			_secondary_event = str(row["Secondary Event(s) Described in News Article"])
			_secondary_location = str(row["Estimated Location of Secondary Event(s) Described in News Article"])
			_secondary_event_date = str(row["Estimated Date and/or Time (dd/mm/yy hh:mm) of Occurrence of Secondary Event(s) Described in News Article"])
			_latitude = str(location.latitude) 
			_longitude = str(location.longitude)

			data.writerow( [
				_latitude,
				_longitude,				
				_article_title, 
				_article_date,
				_article_url,
				_article_description,
				_primary_event,
				_primary_location,
				_primary_event_date,
				_secondary_event,
				_secondary_location,
				_secondary_event_date
			    ]
			)
			print ((location.latitude, location.longitude))
		else:
			not_found.append(place)

	print not_found

def main():
	process_data()

if __name__ == "__main__":
	main()

