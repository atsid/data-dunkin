const fs = require('fs');
console.log('loading');
const EVENT = '1';
fs.readFile(`../data/events/${EVENT}.json`, 'utf8', (err, content) => {
  const json = JSON.parse(content);
  console.log(Object.keys(json));
  const moments = json.moments;
  const playerMoments = moments.map((moment) => {
    // moments is an array of arrays
    // first 5 entries are data about the moment
    // 6th entry is array of individual "object" data, with the first entry being the ball
    // and the rest being each player on the court
    // console.log(moments);
    const players = moment[5].slice(1).map((player) => {
      return {
        id: `${player[0]}-${player[1]}`,
        tid: player[0],
        pid: player[1],
        x: player[2],
        y: player[3],
      };
    });
    return {
      ts: moment[1],
      gr: moment[2],
      sc: moment[3],
      players: players,
    }
  });
  fs.writeFile(`../data/players/${EVENT}.json`, JSON.stringify(playerMoments, null, 2), (e) => {
    console.log(e);
  });
});