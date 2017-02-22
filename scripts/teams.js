const fs = require('fs');
console.log('processing teams');
const EVENT = '1';
fs.readFile(`../data/events/${EVENT}.json`, 'utf8', (err, content) => {
  const json = JSON.parse(content);
  console.log(Object.keys(json));
  const visitor = json.visitor;
  visitor.hash = visitor.players.reduce((h, n) => {
    h[n.playerid] = n;
    return h;
  }, {});
  const home = json.home;
  home.hash = home.players.reduce((h, n) => {
    h[n.playerid] = n;
    return h;
  }, {});
  const output = {
    home: home,
    visitor: visitor,
  };
  fs.writeFile(`../dist/teams.json`, JSON.stringify(output, null, 2), (e) => {
    if (e) {
      console.log(e);
    } else {
      console.log('-done');
    }
  });
});