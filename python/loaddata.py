#!/usr/bin/python

import argparse
import json, csv
import math

parser = argparse.ArgumentParser(description='load an NBA game to a JSON object')
parser.add_argument('--infile', help='file representing an NBA game', required=True, type=argparse.FileType('r'))
parser.add_argument('--ofile', help='file representing a csv file for conversion', required=True, type=argparse.FileType('w'))

args = parser.parse_args()
infile = args.infile
ofile = args.ofile


jsonobj = json.load(infile)

for key in jsonobj.keys():
	print key


#print jsonobj['gamedate']
#print jsonobj['gameid']
events = jsonobj['events']


#print len(events)
for x in events[0].keys():
	print x

gsw = events[0]['visitor']
cavs = events[0]['home']


#print gsw
#print events[0]['eventId']
#print events[0]

moments = events[0]['moments']
print len(moments)

print moments[0]

def distanceToBall(ballx, bally, playerx, playery):
	xdiff = ballx - playerx
	ydiff = bally - playery
	return math.sqrt(xdiff* xdiff + ydiff*ydiff)
	

writer = csv.writer(ofile)
header = ['period', 'gameTime', 'shotTime', 'teamId', 'playerId', 'x', 'y', 'radius', 'hasBall', 'ballDist']
writer.writerow(header)
for event in events:
	for mo in event['moments']:
		#print mo
		if len(mo) != 6:
			print 'skipping moments of len %d' % len(mo)
			continue
		row = [mo[0], mo[2], mo[3]]
		if len(mo[5]) != 11:
			print 'wrong number of players: %d' % len(mo[5])
			continue
		ballx, bally = mo[5][0][2:4]
		ballDist = []
		minDist, minIndex, minPID = 99999, -1, -1
		for idx, x in enumerate(mo[5][1:]):
			dist = distanceToBall(ballx, bally, x[2], x[3])
			if dist < minDist:
				minDist = dist
				minIndex = idx
				minPID = x[1]
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

#json.dump(jsonobj, ofile)

##########33333
#Moment description
#The 1st item in moments[0] is the period or quarter that this moment occurred in.
#I don't know what the 2nd item represents. Let me know if you are able to figure it out.
#The 3rd item is the time left in the game clock.
#The 4th item is the time left on th shot clock.
#I don't know what the 5th item represents.



