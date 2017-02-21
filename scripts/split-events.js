const fs = require('fs');
console.log('processing events');
fs.readFile('../data/half.json', 'utf8', (err, content) => {
  const json = JSON.parse(content);
  console.log(Object.keys(json));
  const events = json.events;
  // while reducing, hash at 1/10/sec granularity to remove "dups"
  const quarters = events.reduce((a, n) => {
    n.moments.forEach((moment) => {
      //drop the resolution to 12 fps to reduce dups
      const key = Math.round(moment[1] / 83) * 83;
      if (!a.hash[key]) {
        a[moment[0]].push(moment);
        a.hash[key] = true;
      }
    });
    return a;
  }, {
    hash: {},
    1: [],
    2: [],
    3: [],
    4: [],
  });
  quarters[1].sort((a, b) => {
    return a[1] - b[1];
  });
  quarters[2].sort((a, b) => {
    return a[1] - b[1];
  });
  quarters[3].sort((a, b) => {
    return a[1] - b[1];
  });
  quarters[4].sort((a, b) => {
    return a[1] - b[1];
  });
  const ePromises = events.map((event) => {
    return new Promise((res, rej) => {
      fs.writeFile(`../data/events/${event.eventId}.json`, JSON.stringify(event, null, 2), (err) => {
        if (err) {
          rej(err);
        }
        res();
      });
    });
  });
  const qPromises = Object.keys(quarters).map((quarter) => {
    console.log(`${quarter}: ${quarters[quarter].length} readings`)
    return new Promise((res, rej) => {
      fs.writeFile(`../data/events/q${quarter}.json`, JSON.stringify(quarters[quarter]), (err) => {
        if (err) {
          rej(err);
        }
        res();
      });
    });
  });
  const all = [ePromises, qPromises];
  Promise.all(all)
    .then(() => console.log('done splitting!'))
    .catch(e => console.log(e));
});
