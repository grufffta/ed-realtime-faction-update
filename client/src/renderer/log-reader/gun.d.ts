declare module 'gun' {
    /**
     * Ack callback argument for put/set
     */
    interface GunAck {
        err: Error,
        ok: string
    }

    /**
     * Ack callback argument for get
     */
    interface GunGetAck {
        pub: any,
        get: string
    }

    /**
     * Gun v0.8 API Definition
     */
    export interface GunInterface {
        /**
         * constructor
         */
        Gun(): GunInterface

        /**
         * constructor
         */
        (): GunInterface

        /**
         * constructor passing single peer to sync with
         */
        (url: string): GunInterface

        /**
         * constructor passing multiple peers to sync with
         */
        (peers: string[]): GunInterface

        /**
         * constructor passing options object to Gun
         */
        (options: any): GunInterface

        /**
         * configure options in Gun instance
         */
        opt (options: any): GunInterface

        /**
         * move back through chain context
         * param - amount: number of levels to move back or -1 for root
         */
        back(amount?: number): GunInterface,

        /**
         * get node at the specified key
         * key: node key
         * callback: ack
         */
        get(key: string, callback?: (this: GunInterface, ack: GunGetAck) => void): GunInterface

        /**
         * when chained with val, gets all values without subscribing for updates
         */
        map(): GunInterface
        
        /**
         * map for each item in contenxt
         * callback:
         *    value: node
         *    key  : node key
         * return undefined to filter out
         */
        map(callback: (this: GunInterface, value: any, key: string) => void): GunInterface        
        /**
         * map for each item in contenxt
         * callback:
         *    value: node
         *    key  : node key
         * return undefined to filter out
         */
        map<T>(callback: (this: GunInterface, value: T, key: string) => void): GunInterface

                /**
         * check to see if node exists on peers
         * callback: node probably does not exist
         *     key : missing node key
         */
        not(callback: (this: GunInterface, key: string) => void): GunInterface

        /**
         * navigate the context to a path
         * key: node key to navigate to
         */
        path(key: string): GunInterface

        /**
         * put data at the chain context node
         * data: data to add
         * callback: ack
         */
        put(data: any, callback?: (this: GunInterface, ack: GunAck) => void): GunInterface

        /**
         * add unique item to ordered list, see put
         */
        set(data: any, callback?: (this: GunInterface, ack: GunAck) => void): GunInterface

        /**
         * Subscribe to updates and changes on a node or property in realtime.
         * callback: data as it is when subscribed and subsequent changes
         * change: only stream changed properties
         */
        on(callback: (this: GunInterface, data: any, key: string) => void, change?: boolean): GunInterface
        /**
         * Subscribe to updates and changes on a node or property in realtime.
         * callback: data as it is when subscribed and subsequent changes
         * change: only stream changed properties
         */
        on<T>(callback: (this: GunInterface, data: T, key: string) => void, change?: boolean): GunInterface
        
        /**
         * Subscribe to updates and changes on a node or property in realtime.
         * callback: data as it is when subscribed and subsequent changes
         * options: { change: only stream changed properties }
         */
        on(callback: (this: GunInterface, data: any, key: string) => void, options?: { change: boolean }): GunInterface
        /**
         * Subscribe to updates and changes on a node or property in realtime.
         * callback: data as it is when subscribed and subsequent changes
         * options: { change: only stream changed properties }
         */
        on<T>(callback: (this: GunInterface, data: T, key: string) => void, options?: { change: boolean }): GunInterface

        /**
         * Get the current data in context without subscribing for udaptes.
         * Performed synchronously
         */
        val(): any,
        /**
         * Get the current data in context without subscribing for udaptes.
         * Performed synchronously
         */
        val<T>(): T,        
    
        /**
         * Get the current data in context without subscribing to updates.
         */
        val(callback: (this: GunInterface, data: any, key: string) => void, options?: { wait: number }): GunInterface
          /**
         * Get the current data in context without subscribing to updates.
         */
        val<T>(callback: (this: GunInterface, data: T, key?: string) => void, options?: { wait: number }): GunInterface
    }

    export function Gun ():GunInterface
}




