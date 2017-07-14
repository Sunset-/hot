function EventEmitter() {
    this.events = {};
}
EventEmitter.prototype = {
    emit(eventName) {
        var cbs = this.events[eventName];
        if (cbs && cbs.length) {
            var args = [].slice.call(arguments, 1);
            cbs.forEach(cb => {
                cb.apply(this, args);
            })
        }
    },
    on(eventName, cb) {
        (this.events[eventName] || (this.events[eventName] = [])).push(cb);
    }
}

EventEmitter.prototype.constructor = EventEmitter;

module.exports = EventEmitter;