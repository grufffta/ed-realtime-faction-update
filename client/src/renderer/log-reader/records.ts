export interface ISystem extends IRecord {
    [id:string]: any
    id: string,
    name: string,
    faction: ISystemFaction,
    allegiance: string,
    economy: string,
    government: string,
    security: string,
    powerplay: string
    powers: string,
    states: {
        [faction:string]: ISystemFaction
    }
}

export interface IFaction extends IRecord {
    id: string,
    name:string,
    government: string,
    allegiance: string,
    systems: {
        [system:string]: ISystem
    }
}

export interface ISystemFaction extends IRecord {
    id:string,
    name:string,
    faction: IFaction,
    system: ISystem
    state: string,
    influence: number,
    controlling: boolean,
    recovering?: IStateTrend
    pending?: IStateTrend
}

export interface IStateTrend {
    [state: string]: number
}

export interface IRecord {
    timestamp: number
}
