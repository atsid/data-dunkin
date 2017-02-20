const fs = require('fs');
console.log('processing ball');
const EVENT = '1';
fs.readFile(`../data/events/${EVENT}.json`, 'utf8', (err, content) => {
  const json = JSON.parse(content);
  console.log(Object.keys(json));
  const moments = json.moments;
  const ballMoments = moments.map((moment) => {
    // moments is an array of arrays
    // first 5 entries are data about the moment
    // 6th entry is array of individual "object" data, with the first entry being the ball
    return {
      ts: moment[1],
      gr: moment[2],
      sc: moment[3],
      x: moment[5][0][2],
      y: moment[5][0][3],
      r: moment[5][0][4],
    }
  });
  fs.writeFile(`../data/ball/${EVENT}.json`, JSON.stringify(ballMoments, null, 2), (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log('-done');
    }
  });
});