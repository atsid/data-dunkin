const fs = require('fs');
console.log('processing events');
fs.readFile('../data/0021500622.json', 'utf8', (err, content) => {
  const json = JSON.parse(content);
  console.log(Object.keys(json));
  const events = json.events;
  const promises = events.map((event) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(`../data/events/${event.eventId}.json`, JSON.stringify(event, null, 2), (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  });
  Promise.all(promises)
    .then(() => {console.log('complete')})
    .catch((e) => {if (e) {console.log(e);}});
});