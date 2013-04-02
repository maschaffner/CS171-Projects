import csv,json
 
from itertools import izip
f = open( './Proj2_Boston_Sold.csv', 'r' )

reader = csv.reader( f )
keys = ( "Price","Sq ft" )
out = []
for property in reader:
    property = iter( property )
    data = {}
    for key in keys:
	    data[ key ] = property.next()
    out = [dict(zip(keys,property)) for property in reader ]
print json.dumps(out)