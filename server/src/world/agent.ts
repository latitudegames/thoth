import gameObject from "./gameObject";

export class agent extends gameObject {
    name = '';

    constructor(id, name, clients) {
        super(id);
        this.name = name;
        console.log('initing agent');

        for (let i = 0; i < clients.length; i++) {
            console.log('client: ' + clients[i].client);
            console.log('settings: ' + clients[i].settings);
            if (clients[i].enabled) {
            }
        }
    }
}

export default agent;