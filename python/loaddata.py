#!/usr/bin/python

import argparse
import json, csv
import math

parser = argparse.ArgumentParser(description='load an NBA game to a JSON object')
parser.add_argument('--infile', help='file representing an NBA game', required=True, type=argparse.FileType('r'))
parser.add_argument('--csvfile', help='file representing a csv file for conversion', required=True, type=argparse.FileType('w'))
parser.add_argument('--jsonfile', help='file representing a slightly marked up json file', required=True, type=argparse.FileType('w'))
parser.add_argument('--processalldata', help='Will drop half of the moments if true', required=False, type=bool, default=False)

args = parser.parse_args()
infile = args.infile
csvfile = args.csvfile
jsonfile = args.jsonfile
processAll = args.processalldata


jsonobj = json.load(infile)
events = jsonobj['events']
gsw = events[0]['visitor']
cavs = events[0]['home']
moments = events[0]['moments']

def distanceToBall(ballx, bally, playerx, playery):
	xdiff = ballx - playerx
	ydiff = bally - playery
	return math.sqrt(xdiff* xdiff + ydiff*ydiff)
	

writer = csv.writer(csvfile)
header = ['period', 'gameTime', 'shotTime', 'teamId', 'playerId', 'x', 'y', 'radius', 'hasBall', 'ballDist']
writer.writerow(header)
print 'Total events: %d' % len(events)
sumofMoments = 0
for event in events:
	# skip every other moment to filter data
	if not processAll:
		event['moments'] = event['moments'][1::2]
	for index, mo in enumerate(event['moments']):
		sumofMoments += 1
		#print mo
		if len(mo) != 6:
			print 'skipping moments of len %d' % len(mo)
			continue
		row = [mo[0], mo[2], mo[3]]
		if len(mo[5]) != 11:
			#print 'wrong number of players: %d' % len(mo[5])
			continue
		ballx, bally = mo[5][0][2:4]
		ballDist = []
		minDist, minIndex, minPID = 99999, -1, -1
		for idx, x in enumerate(mo[5][1:]):
			dist = distanceToBall(ballx, bally, x[2], x[3])
			if dist < minDist:
				minDist, minIndex, minPID = dist, idx, x[1] 
			ballDist.append(dist)
		mo[4] = minPID
		#print minDist, minIndex, len(ballDist)
		for idx, x in enumerate(mo[5]):
			newrow = row + x
			hasBall = False
			if minIndex == idx-1:
				hasBall = True
			if idx == 0:
				newrow.append(False)
				newrow.append(0.0)
			else:
				newrow.append(hasBall)
				newrow.append(ballDist[idx -1])
				#newrow.append(minDist)
				#newrow.append(minPID)
			writer.writerow(newrow)

json.dump(jsonobj, jsonfile)

##########33333
#Moment description
#The 1st item in moments[0] is the period or quarter that this moment occurred in.
#I don't know what the 2nd item represents. Let me know if you are able to figure it out.
#The 3rd item is the time left in the game clock.
#The 4th item is the time left on th shot clock.
#I don't know what the 5th item represents.


print 'Total Moments processed: %d' % sumofMoments
