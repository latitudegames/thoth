import { randomInt } from "@latitudegames/thoth-core/src/superreality/utils";

export class gameObject {
    id = -1;
    coroutines = {};

    constructor(id) {
        this.id = id;
    }

    async onCreate() {
    }

    async onDestroy() {
    }

    async onUpdate() {
        for (let i in this.coroutines) {
            await this.coroutines[i].next();
        }
    }

    async onLateUpdate() {
    }

    startCoroutine(func) {
        let id = randomInt(0, 10000);
        while (this.coroutineExists(id)) {
            id = randomInt(0, 10000);
        }

        this.coroutines[id] = func;
        return id;
    }
    stopCoroutine(id) {
        if (this.coroutineExists(id)) {
            delete this.coroutines[id];
        }
    }
    clearCoroutines() {
        coroutines = {};
    }
    coroutineExists(id) {
        return coroutines[id] !== undefined && coroutines[id] === null;
    }
}

export default gameObject;