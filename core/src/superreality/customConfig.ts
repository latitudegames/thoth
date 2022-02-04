// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import { database } from './database'

//The config of the server, which gets the data from the database, it replaces most of .env variables for easier use
export class customConfig {
    static instance: customConfig

    configs: any = {}

    constructor(configs: {}) {
        this.configs = configs
        customConfig.instance = this
    }

    get(key: any) {
        return this.configs[key]?.trim()
    }
    getInt(key: string | number) {
        const value = this.configs[key]
        if (!value || value === undefined || value.length <= 0) {
            return undefined
        }
        return parseInt(value)
    }
    getFloat(key: string | number) {
        const value = this.configs[key].trim()
        if (!value || value === undefined || value.length <= 0) {
            return undefined
        }
        return parseFloat(value)
    }
    getBool(key: string | number) {
        const value = this.configs[key]?.trim()
        if (!value || value === undefined || value.length <= 0) {
            return false
        }
        return value.toLowerCase() === 'true'
    }
    async set(key: string | number, value: string) {
        this.configs[key] = value.trim()
        await database.instance.setConfig(key, value)
    }
    async delete(key: string | number) {
        if (this.configs[key] && this.configs[key] !== undefined) {
            delete this.configs[key]
            await database.instance.deleteConfig(key)
        }
    }

    getAll() {
        return this.configs
    }
    allToArray() {
        const res = []
        for (const key in this.configs) {
            res.push({ key: key, value: this.configs[key] })
        }
        return res
    }
}

export default customConfig
