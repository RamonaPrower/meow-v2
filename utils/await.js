// need a singleton that allows commands to be paused whilst the bot is waiting for a follow up
// all it does is store the users snowflake, it's released once the message collector is done

class awaitHandler {
    constructor() {
        if (!awaitHandler.instance) {
            this._awaiting = new Set();
            awaitHandler.instance = this;
        }
        return awaitHandler.instance;
    }
    get(id) {
        return this._awaiting.has(id);
    }
    set(id) {
        this._awaiting.add(id);
        // safety mechanism, make sure nothing stays in here for over 15 seconds (just in case)
        setTimeout(() => {
            this._awaiting.delete(id);
        }, 15000);
    }
    delete(id) {
        this._awaiting.delete(id);
    }
}
const awaitHandlerInstance = new awaitHandler();
Object.freeze(awaitHandlerInstance);
module.exports = awaitHandlerInstance;