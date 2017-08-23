import { ISystem, IFaction, ISystemFaction, IStateTrend } from './records'
import db from './db'

if (!process.env.IS_WEB) {
    let fs = require('fs')
}
const watcher = {
    env: {
        isWeb: process.env.IS_WEB,
        isWindows: /^win/.test(process.platform)
    },
    log: {
        isWatching: false,
        location: `${process.env.USERPROFILE}\\Saved Games\\Frontier Developments\\Elite Dangerous`,
        current: '',
        line: 0,
        latest: () => getLatestLogFile()
    },
    start: () => startWatchingLog(),
    stop: () => stopWatchingLog(),
    on: {
        faction: (f: IFaction) => db.storeFaction(f),
        system: (s: ISystem) => {
            db.storeSystem(s)
            db.updateSystemFactionState(s)
        }
    }
};

export default watcher

let fsw: fs.FSWatcher | undefined;

function startWatchingLog () {
    if (watcher.env.isWindows && !watcher.env.isWeb) {
        readLogEntries(watcher.log.latest());

        fsw = fs.watch(watcher.log.location, (event, filename) => {

            console.log(event, watcher.log.location, filename)
            stopRead = true
            if (watcher.log.current)
                fs.unwatchFile(watcher.log.current)

            readLogEntries(filename)

        });

        watcher.log.isWatching = true
    }
}
let stopRead = false

function stopWatchingLog () {
    if (fsw !== undefined) fsw.close();
    fsw = undefined;
    watcher.log.current = '';
    watcher.log.isWatching = false
}


function readLogEntries (filename: string) {
    stopRead = false
    // make sure we have full path
    filename = getLatestLogFile()

    if (filename.indexOf(watcher.log.location) === -1) {
        filename = `${watcher.log.location}\\${filename}`
    }
    // has log switched
    if (watcher.log.current !== filename) {
        watcher.log.current = filename;
        watcher.log.line = 0
    }

    let data = fs.readFileSync(filename, 'utf-8')
    let events = data.toString().trim().split('\n');
    for (watcher.log.line; watcher.log.line < events.length; watcher.log.line++) {
        toRecord(events[watcher.log.line])
    }
    setTimeout(() => {
        if (!stopRead) {
            readLogEntries(filename)
        }
    }, 500);
}

function toRecord (event: string) {
    let type = event.split(',')[1].split(':')[1].trim();
    if (type === `"Location"` || type === `"FSDJump"`) {
        let record = JSON.parse(event);
        let system = getSystem(record);
        for (let faction of getFactions(record, system)) {
            watcher.on.faction(faction)
        }
        watcher.on.system(system)
    }
}

function getSystem (record: any): ISystem {
    return {
        timestamp: Date.parse(record.timestamp),
        id: sanitize(record.StarSystem),
        name: record.StarSystem,
        allegiance: record.SystemAllegiance,
        economy: record.SystemEconomy_Localised,
        government: record.SystemGovernment_Localised,
        security: record.SystemSecurity_Localised,
        powerplay: record.PowerplayState,
        powers: (record.Powers as Array<string>).join(),
        states: {}
    } as ISystem
}

function getFactions (record: any, system: ISystem): IFaction[] {
    let factions = [];
    for (let f of record.Factions) {

        let faction = {
            id: sanitize(f.Name),
            timestamp: system.timestamp,
            name: f.Name,
            government: f.Government,
            allegiance: f.Allegiance,
            systems: {
                [sanitize(system.name)]: system
            }
        } as IFaction;

        let state = {
            id: faction.id,
            timestamp: system.timestamp,
            name: faction.name,
            faction: faction,
            system: system,
            state: f.FactionState,
            influence: f.Influence,
            controlling: record.SystemFaction === faction.name
        } as ISystemFaction;

        if (f.PendingStates) {
            if (state.pending === undefined) state.pending = {};
            for (let s of f.PendingStates)
                state.pending[s.State] = s.Trend
        }

        if (f.RecoveringStates) {
            if (state.recovering === undefined) state.recovering = {};
            for (let s of f.RecoveringStates)
                state.recovering[s.State] = s.Trend
        }

        if (state.controlling) {
            system.faction = state
        }
        system.states[faction.id] = state;
        factions.push(faction)
    }
    return factions
}

let sanitize = (str: string): string => str.replace(/ /g, '_').replace(/'/g, '');


interface IFileModified {
    name: string,
    modified: number
}

function getLatestLogFile (): string {
    let found: Array<IFileModified> = [];
    let files = fs.readdirSync(watcher.log.location);
    if (files.length === 0) return '';
    files.forEach(file => {
        let info = fs.statSync(`${watcher.log.location}/${file}`);
        if (info.isFile()) {
            found.push({ name: file, modified: info.mtime.getTime() })
        }
    });
    return found.sort((a, b) => b.modified - a.modified)[0].name
}
