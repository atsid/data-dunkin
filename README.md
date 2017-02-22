# data-dunkin

This was the ATS Hack Day 2017 project done by [@bryantower](https://github.com/bryantower) and [@natoverse](https://github.com/natoverse). *The code quality reflects that it was Hack Day!*

The NBA collects high-resolution (25 fps) player and ball tracking data using top-down cameras. The player data includes their (x,y) position on the court, and the ball data adds a "radius" field indicating the relative size of the ball as it appears to the cameras (functioning as an indirect measure of height). The NBA is no longer publishing an API with this data, but we downloaded an archived game from [@sealneaward/nba-movement-data](https://github.com/sealneaward/nba-movement-data/). The game analyzed here from 01/18/2016 between the Cleveland Caviliers and the Gold State Wariors.  The play by play can be found on [ESPN](http://www.espn.com/nba/playbyplay?gameId=400828509).

Our goal was to visually plot the motions of the objects on the court to reveal patterns. We also planned to include a number of statistics based on ball/player and player/player interactions, such as ball dominance, etc. For Hack Day, we were able to calculate the nearest player to the ball for each frame, providing an indication of possession (though it is important to note this was a simple spatial join to identify "nearest", and did not include any additional dimensions such as trajectory or height, which would be far more accurate).

The data has some duplication and other issues, so far we've only done some light de-duping to try and keep it manageable. A much more robust pre-processing pipeline is necessary.

![Screenshot](https://d1zjcuqflbd5k.cloudfront.net/files/acc_532312/Noeb?response-content-disposition=inline;%20filename=Screen%20Shot%202017-02-21%20at%2010.24.56%20AM.png&Expires=1487702086&Signature=HeGK3ZFhDUyEG2CVL8g3eS026~6MHsBZlMQ6ImdSsS49LsR587A8Q8xVN512bm32Nhg5NVNG4VG7qiqVHI3sPjf0M6nFalBWP1WYLg5Xe9qoVInAsa5TDdSU-xL42So~zW0GFLgJXQUbB8tVdt7a5P1uSLl2M4lU6P17XDtaNAM_&Key-Pair-Id=APKAJTEIOJM3LSMN33SA)

## What Does It Do?

The browser app shows a top-down view of the basketball court, with team rosters displayed along the top. It will run an animation that shows the game in progress, using colored circles to show the position of each player and the ball. Some other elements are included, such as the ability to turn ghosting of the object tracks on and off, and a rudimentary speed control. The ball will display an outer ring indicating it's "size", this makes it obvious when shots are taken. The player with the ball will be highlighted with a red ring, and will receive a partial red border on their headshot.

## What Did We Use?

We used Tableau to get our understanding of the data, and Python to do processing and cleanup. For the client, we used D3 to render the graphics, with Bootstrap and jQuery to keep it reasonably neat.

## Getting Started

We used both Python and JavaScript (Node.js) scripts to pre-process the data. It's quite large, so we collated the data by play ("event") and by quarter. You should be able to process any game from the archive, though we used [this one](https://github.com/sealneaward/nba-movement-data/blob/master/data/01.18.2016.GSW.at.CLE.7z) specifically, which means we only downloaded player headshots for the Cavs and Warriors :). There are a couple of hard-coded things in there that will need to be changed too (e.g., filenames).

* Install Node.js and Python
* Drop your unzipped data file (should be *.json) into a new "data" directory in the project root (will be .gitignored)
* Run the Python enrichment on the original file to subsample and do the spatial join. By default it drops half of the moments to make it quicker for deployment and debugging.  You can tell it to use all of the data by adding the command line arguments `--processall True` The CSV file is in a format that is easy to plot.  The JSON file is enriched with the player that pocesses the ball.
  * `cd python`
  * `python loaddata.py  --infile ../data/file.json  --csvfile ../data/filename.csv --jsonfile ../data/filename.json`
  
* Run a series of node scripts to split out the large file, collate into quarters, and summarize the ball and player data for loading into the browser:
  * `cd scripts`
  * `node split-events.js`
  * `node players-q.js`
  * `node ball-q.js`
  * `node teams.js`
* `npm install` to get node and bower deps 
* `npm start` to run the app
* go to localhost:8000 to see it run
