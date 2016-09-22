import csv

# Read in raw data from csv
rawData = csv.reader(open('data.csv', 'rb'), dialect='excel')

# the template. where data from the csv will be formatted to geojson
template = \
    ''' \
    { "type" : "Feature",
        "id" : "%s",
            "geometry" : {
                "type" : "Point",
                "coordinates" : [ %s, %s ]},
        "properties" : { 
            "article_title" : "%s",
            "article_date" : "%s",
            "article_url" : "%s",
            "article_description" : "%s",
            "primary_event" : "%s",
            "primary_loc" : "%s",
            "primary_event_date" : "%s",
            "secondary_event" : "%s",
            "secondary_loc" : "%s",
            "secondary_event_date" : "%s"
            }
        },
    '''

# the head of the geojson file
output = \
    ''' \
{ "type" : "FeatureCollection",
    "features" : [
    '''

# loop through the csv by row skipping the first
iter = 0
for row in rawData:
    iter += 1
    if iter >= 2:
        output += template % ( str(iter-1), row[1], row[0], row[2], row[3], row[4], row[5], row[6],
            row[7], row[8], row[9], row[10], row[11] )
        
# the tail of the geojson file
output += \
    ''' \
    ]
  }
    '''
    
# opens an geoJSON file to write the output to
outFileHandle = open("output.geojson", "w")
outFileHandle.write(output)
outFileHandle.close()