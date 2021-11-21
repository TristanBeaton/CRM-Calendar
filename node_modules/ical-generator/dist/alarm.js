'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalAlarmType = void 0;
const tools_1 = require("./tools");
var ICalAlarmType;
(function (ICalAlarmType) {
    ICalAlarmType["display"] = "display";
    ICalAlarmType["audio"] = "audio";
})(ICalAlarmType = exports.ICalAlarmType || (exports.ICalAlarmType = {}));
/**
 * Usually you get an `ICalAlarm` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const alarm = event.createAlarm();
 * ```
 *
 * You can also use the [[`ICalAlarm`]] object directly:
 *
 * ```javascript
 * import ical, {ICalAlarm} from 'ical-generator';
 * const alarm = new ICalAlarm();
 * event.alarms([alarm]);
 * ```
 */
class ICalAlarm {
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is required
     * to query the calendar's timezone and summary when required.
     *
     * @param data Alarm Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data, event) {
        this.data = {
            type: null,
            trigger: null,
            repeat: null,
            interval: null,
            attach: null,
            description: null,
            x: []
        };
        this.event = event;
        if (!event) {
            throw new Error('`event` option required!');
        }
        data.type !== undefined && this.type(data.type);
        data.trigger !== undefined && this.trigger(data.trigger);
        data.triggerBefore !== undefined && this.triggerBefore(data.triggerBefore);
        data.triggerAfter !== undefined && this.triggerAfter(data.triggerAfter);
        data.repeat !== undefined && this.repeat(data.repeat);
        data.interval !== undefined && this.interval(data.interval);
        data.attach !== undefined && this.attach(data.attach);
        data.description !== undefined && this.description(data.description);
        data.x !== undefined && this.x(data.x);
    }
    type(type) {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }
        if (!Object.keys(ICalAlarmType).includes(type)) {
            throw new Error('`type` is not correct, must be either `display` or `audio`!');
        }
        this.data.type = type;
        return this;
    }
    trigger(trigger) {
        // Getter
        if (trigger === undefined && typeof this.data.trigger === 'number') {
            return -1 * this.data.trigger;
        }
        if (trigger === undefined && this.data.trigger) {
            return this.data.trigger;
        }
        if (trigger === undefined) {
            return null;
        }
        // Setter
        if (!trigger) {
            this.data.trigger = null;
        }
        else if (typeof trigger === 'number' && isFinite(trigger)) {
            this.data.trigger = -1 * trigger;
        }
        else if (typeof trigger === 'number') {
            throw new Error('`trigger` is not correct, must be a finite number or a supported date!');
        }
        else {
            this.data.trigger = (0, tools_1.checkDate)(trigger, 'trigger');
        }
        return this;
    }
    triggerAfter(trigger) {
        if (trigger === undefined) {
            return this.data.trigger;
        }
        return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
    }
    triggerBefore(trigger) {
        if (trigger === undefined) {
            return this.trigger();
        }
        return this.trigger(trigger);
    }
    repeat(repeat) {
        if (repeat === undefined) {
            return this.data.repeat;
        }
        if (!repeat) {
            this.data.repeat = null;
            return this;
        }
        if (typeof repeat !== 'number' || !isFinite(repeat)) {
            throw new Error('`repeat` is not correct, must be numeric!');
        }
        this.data.repeat = repeat;
        return this;
    }
    interval(interval) {
        if (interval === undefined) {
            return this.data.interval || null;
        }
        if (!interval) {
            this.data.interval = null;
            return this;
        }
        if (typeof interval !== 'number' || !isFinite(interval)) {
            throw new Error('`interval` is not correct, must be numeric!');
        }
        this.data.interval = interval;
        return this;
    }
    attach(attachment) {
        if (attachment === undefined) {
            return this.data.attach;
        }
        if (!attachment) {
            this.data.attach = null;
            return this;
        }
        let _attach = null;
        if (typeof attachment === 'string') {
            _attach = {
                uri: attachment,
                mime: null
            };
        }
        else if (typeof attachment === 'object') {
            _attach = {
                uri: attachment.uri,
                mime: attachment.mime || null
            };
        }
        else {
            throw new Error('`attachment` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
                'ical-generator/develop/reference/classes/icalalarm.html#attach');
        }
        if (!_attach.uri) {
            throw new Error('`attach.uri` is empty!');
        }
        this.data.attach = {
            uri: _attach.uri,
            mime: _attach.mime
        };
        return this;
    }
    description(description) {
        if (description === undefined) {
            return this.data.description;
        }
        if (!description) {
            this.data.description = null;
            return this;
        }
        this.data.description = description;
        return this;
    }
    x(keyOrArray, value) {
        if (keyOrArray === undefined) {
            return (0, tools_1.addOrGetCustomAttributes)(this.data);
        }
        if (typeof keyOrArray === 'string' && typeof value === 'string') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray, value);
        }
        else if (typeof keyOrArray === 'object') {
            (0, tools_1.addOrGetCustomAttributes)(this.data, keyOrArray);
        }
        else {
            throw new Error('Either key or value is not a string!');
        }
        return this;
    }
    /**
     * Return a shallow copy of the alarm's options for JSON stringification.
     * Third party objects like moment.js values are stringified as well. Can
     * be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        const trigger = this.trigger();
        return Object.assign({}, this.data, {
            trigger: typeof trigger === 'number' ? trigger : (0, tools_1.toJSON)(trigger),
            x: this.x()
        });
    }
    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const alarm = event.createAlarm();
     * console.log(alarm.toString()); // → BEGIN:VALARM…
     * ```
     */
    toString() {
        let g = 'BEGIN:VALARM\r\n';
        if (!this.data.type) {
            throw new Error('No value for `type` in ICalAlarm given!');
        }
        if (!this.data.trigger) {
            throw new Error('No value for `trigger` in ICalAlarm given!');
        }
        // ACTION
        g += 'ACTION:' + this.data.type.toUpperCase() + '\r\n';
        if (typeof this.data.trigger === 'number' && this.data.trigger > 0) {
            g += 'TRIGGER;RELATED=END:' + (0, tools_1.toDurationString)(this.data.trigger) + '\r\n';
        }
        else if (typeof this.data.trigger === 'number') {
            g += 'TRIGGER:' + (0, tools_1.toDurationString)(this.data.trigger) + '\r\n';
        }
        else {
            g += 'TRIGGER;VALUE=DATE-TIME:' + (0, tools_1.formatDate)(this.event.timezone(), this.data.trigger) + '\r\n';
        }
        // REPEAT
        if (this.data.repeat && !this.data.interval) {
            throw new Error('No value for `interval` in ICalAlarm given, but required for `repeat`!');
        }
        if (this.data.repeat) {
            g += 'REPEAT:' + this.data.repeat + '\r\n';
        }
        // INTERVAL
        if (this.data.interval && !this.data.repeat) {
            throw new Error('No value for `repeat` in ICalAlarm given, but required for `interval`!');
        }
        if (this.data.interval) {
            g += 'DURATION:' + (0, tools_1.toDurationString)(this.data.interval) + '\r\n';
        }
        // ATTACH
        if (this.data.type === 'audio' && this.data.attach && this.data.attach.mime) {
            g += 'ATTACH;FMTTYPE=' + this.data.attach.mime + ':' + this.data.attach.uri + '\r\n';
        }
        else if (this.data.type === 'audio' && this.data.attach) {
            g += 'ATTACH;VALUE=URI:' + this.data.attach.uri + '\r\n';
        }
        else if (this.data.type === 'audio') {
            g += 'ATTACH;VALUE=URI:Basso\r\n';
        }
        // DESCRIPTION
        if (this.data.type === 'display' && this.data.description) {
            g += 'DESCRIPTION:' + (0, tools_1.escape)(this.data.description) + '\r\n';
        }
        else if (this.data.type === 'display') {
            g += 'DESCRIPTION:' + (0, tools_1.escape)(this.event.summary()) + '\r\n';
        }
        // CUSTOM X ATTRIBUTES
        g += (0, tools_1.generateCustomAttributes)(this.data);
        g += 'END:VALARM\r\n';
        return g;
    }
}
exports.default = ICalAlarm;
//# sourceMappingURL=alarm.js.map