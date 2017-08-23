import watcher from './watcher';
import db from './db';
const msg = 'Elite Dangerous Log Watcher v0.1';
console.log(msg);
db.watch.systems(function (data, key) {
    console.log(data);
});
db.gun.get('factions').map().val(val => console.log('faction: ' + val.name));
watcher.start();
//# sourceMappingURL=app.js.map