export class time {
    static instance;

    start;
    now;

    constructor() {
        time.instance = this;

        this.start = new Date();
    }

    //time since the start of the being in ms
    time() {
        this.now = new Date();
        return (this.now - this.start)/1000;
    }
}

export default time;