const Gun = require('gun/gun');
require('gun/lib/not');
require('gun/lib/path');
require('gun/lib/open');
const gun = Gun(['http://peer.1.apily.co.uk:3272/gun', 'http://peer.2.apily.co.uk:3272/gun']);
let systems = {};
export default {
    gun: gun,
    systems: systems,
    watch: {
        systems(callback) {
            gun.get('systems').map().on(function (data, key) {
                //if (!systems[key] || !data.timestamp || systems[key].timestamp < data.timestamp) {
                systems[key] = Object.assign({}, systems[key], data);
                let ref = this;
                for (var prop in data) {
                    if (prop === '_')
                        continue;
                    let val = data[prop];
                    if (val instanceof Object && val['#'] !== undefined) {
                        ref.get(prop).map().val((v, k) => {
                            if (k === undefined || k === '#' || v === undefined)
                                return;
                            v.system = data;
                            this.back(-1).get(v.faction['#']).val(f => {
                                v.faction = Object.assign({}, v.faction, f);
                                if (v.controlling) {
                                    systems[key].faction = v.faction;
                                }
                            });
                            systems[key][prop] = Object.assign({}, systems[key][prop], { [k]: v });
                            if (v.pending && v.pending['#']) {
                                this.back(-1).get(v.pending['#']).map().val((pending, pk) => v.pending[pk] = pending);
                            }
                            if (v.recovering && v.recovering['#']) {
                                this.back(-1).get(v.recovering['#']).map().val((recovering, rk) => v.recovering[rk] = recovering);
                            }
                        });
                    }
                }
                callback(systems[key], key);
                //     }
            }, true);
        }
    },
    storeFaction(faction) {
        let record = Object.assign({}, faction);
        delete record.systems;
        this.gun.get(`faction.${faction.id}`)
            .not(function (key) {
            console.log('faction not found', faction.id);
            let ref = this.put(record);
            this.back(-1).get('factions').set(ref);
        })
            .val(function (data, key) {
            if (!data)
                return;
            if (data.timestamp <= record.timestamp) {
                console.log('faction data stale', faction.id);
                this.put(record);
            }
        });
    },
    storeSystem(system) {
        let record = Object.assign({}, system);
        delete record.faction;
        delete record.states;
        this.gun.get(`system.${system.id}`)
            .not(function (key) {
            console.log('system not found', system.id);
            let ref = this.put(record);
            this.back(-1).get('systems').set(ref);
        })
            .val(function (data, key) {
            if (!data)
                return;
            if (data.timestamp <= record.timestamp) {
                console.log('system data stale', system.id);
                this.put(record);
            }
        });
    },
    updateSystemFactionState(system) {
        for (let id of Object.keys(system.states)) {
            this.gun.get(`faction.${id}`).val(data => {
                this.updateFactionState(system.states[id], data);
            });
        }
        this.gun.get(`system.${system.id}`).path('states').map().val((data, key) => {
            if (data && key && key !== '#' && !data.faction['#'].replace('faction.', '')) {
                console.log('state removed (retreat)', key, data);
                //this.gun.get(`system.${system.id}`).path('states').get(key).put(null)
                this.gun.get('states').get(`faction.${key}.system.${system.id}`).put(null);
            }
        });
    },
    updateFactionState(state, faction) {
        this.gun.get(`system.${state.system.id}`).val(function (system) {
            let systemRef = this;
            state.faction = faction;
            state.system = system;
            this.back(-1).get(`state.${system.id}.${faction.id}`)
                .not(function (key) {
                console.log('system state not found', state);
                let ref = this.put(state);
                this.back(-1).get('states').set(ref);
                systemRef.path('states').set(ref);
            })
                .val(function (data) {
                if (!data)
                    return;
                if (data.timestamp <= state.timestamp) {
                    console.log('system state data stale', state);
                    this.get('pending').put(null);
                    this.get('recovering').put(null);
                    let ref = this.put(state);
                }
            });
        });
    }
};
//# sourceMappingURL=db.js.map