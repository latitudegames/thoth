import { randomInt } from "@latitudegames/thoth-core/src/superreality/utils";
import time from "./time";
import world from "./world";

export class worldManager {
    static instance;
    static defaultWorld = null;
    static deltaTime = -1;

    worlds = {};

    constructor(worldCount, fps) {
        worldManager.instance = this;
        worldManager.deltaTime = 1.0 / fps;

        new time();

        if (worldCount < 1) {
            worldCount = 1;
        }

        for (let i = 0; i < worldCount; i++) {
            this.worlds[i] = new world(i);
            this.worlds[i].onCreate();

            if (i === 0) {
                worldManager.defaultWorld = this.worlds[i];
            }
        }

        setInterval(async () => {
            for (let i in this.worlds) {
                await this.worlds[i].onUpdate();
            }
            for (let i in this.worlds) {
                await this.worlds[i].onLateUpdate();
            }
        }, 1000 / fps);
    }

    getWorld(id) {
        return worlds[id];
    }

    addWorld(id) {
        while (this.worldExists(id)) {
            id = randomInt(0, 10000);
        }

        this.worlds[id] = new world(id);
        this.worlds[id].onCreate();
        return this.worlds[id];
    }

    async removeWorld(id) {
        if (this.worldExists(id)) {
            await worlds[id].onDestroy();
            delete worlds[id];
        }
    }

    worldExists(id) {
        return this.worlds[id] !== undefined && this.worlds[id] !== null;
    }
}

export default worldManager;