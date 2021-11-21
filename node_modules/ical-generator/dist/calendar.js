'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalCalendarMethod = void 0;
const tools_1 = require("./tools");
const event_1 = __importDefault(require("./event"));
const fs_1 = require("fs");
const fs_2 = require("fs");
var ICalCalendarMethod;
(function (ICalCalendarMethod) {
    ICalCalendarMethod["PUBLISH"] = "PUBLISH";
    ICalCalendarMethod["REQUEST"] = "REQUEST";
    ICalCalendarMethod["REPLY"] = "REPLY";
    ICalCalendarMethod["ADD"] = "ADD";
    ICalCalendarMethod["CANCEL"] = "CANCEL";
    ICalCalendarMethod["REFRESH"] = "REFRESH";
    ICalCalendarMethod["COUNTER"] = "COUNTER";
    ICalCalendarMethod["DECLINECOUNTER"] = "DECLINECOUNTER";
})(ICalCalendarMethod = exports.ICalCalendarMethod || (exports.ICalCalendarMethod = {}));
/**
 * Usually you get an `ICalCalendar` object like this:
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * ```
 *
 * But you can also use the constructor directly like this:
 * ```javascript
 * import {ICalCalendar} from 'ical-generator';
 * const calendar = new ICalCalendar();
 * ```
 */
class ICalCalendar {
    /**
     * You can pass options to setup your calendar or use setters to do this.
     *
     * ```javascript
     *  * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     *
     * const cal = ical({name: 'my first iCal'});
     *
     * // is the same as
     *
     * const cal = ical().name('my first iCal');
     *
     * // is the same as
     *
     * const cal = ical();
     * cal.name('sebbo.net');
     * ```
     *
     * @param data Calendar data
     */
    constructor(data = {}) {
        this.data = {
            prodId: '//sebbo.net//ical-generator//EN',
            method: null,
            name: null,
            description: null,
            timezone: null,
            source: null,
            url: null,
            scale: null,
            ttl: null,
            events: [],
            x: []
        };
        data.prodId !== undefined && this.prodId(data.prodId);
        data.method !== undefined && this.method(data.method);
        data.name !== undefined && this.name(data.name);
        data.description !== undefined && this.description(data.description);
        data.timezone !== undefined && this.timezone(data.timezone);
        data.source !== undefined && this.source(data.source);
        data.url !== undefined && this.url(data.url);
        data.scale !== undefined && this.scale(data.scale);
        data.ttl !== undefined && this.ttl(data.ttl);
        data.events !== undefined && this.events(data.events);
        data.x !== undefined && this.x(data.x);
    }
    prodId(prodId) {
        if (!prodId) {
            return this.data.prodId;
        }
        const prodIdRegEx = /^\/\/(.+)\/\/(.+)\/\/([A-Z]{1,4})$/;
        if (typeof prodId === 'string' && prodIdRegEx.test(prodId)) {
            this.data.prodId = prodId;
            return this;
        }
        if (typeof prodId === 'string') {
            throw new Error('`prodId` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/reference/' +
                'classes/icalcalendar.html#prodid');
        }
        if (typeof prodId !== 'object') {
            throw new Error('`prodid` needs to be a valid formed string or an object!');
        }
        if (!prodId.company) {
            throw new Error('`prodid.company` is a mandatory item!');
        }
        if (!prodId.product) {
            throw new Error('`prodid.product` is a mandatory item!');
        }
        const language = (prodId.language || 'EN').toUpperCase();
        this.data.prodId = '//' + prodId.company + '//' + prodId.product + '//' + language;
        return this;
    }
    method(method) {
        if (method === undefined) {
            return this.data.method;
        }
        if (!method) {
            this.data.method = null;
            return this;
        }
        this.data.method = (0, tools_1.checkEnum)(ICalCalendarMethod, method);
        return this;
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name ? String(name) : null;
        return this;
    }
    description(description) {
        if (description === undefined) {
            return this.data.description;
        }
        this.data.description = description ? String(description) : null;
        return this;
    }
    timezone(timezone) {
        var _a;
        if (timezone === undefined) {
            return ((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.name) || null;
        }
        if (typeof timezone === 'string') {
            this.data.timezone = { name: timezone };
        }
        else if (timezone === null) {
            this.data.timezone = null;
        }
        else {
            this.data.timezone = timezone;
        }
        return this;
    }
    source(source) {
        if (source === undefined) {
            return this.data.source;
        }
        this.data.source = source || null;
        return this;
    }
    url(url) {
        if (url === undefined) {
            return this.data.url;
        }
        this.data.url = url || null;
        return this;
    }
    scale(scale) {
        if (scale === undefined) {
            return this.data.scale;
        }
        if (scale === null) {
            this.data.scale = null;
        }
        else {
            this.data.scale = scale.toUpperCase();
        }
        return this;
    }
    ttl(ttl) {
        if (ttl === undefined) {
            return this.data.ttl;
        }
        if ((0, tools_1.isMomentDuration)(ttl)) {
            this.data.ttl = ttl.asSeconds();
        }
        else if (ttl && ttl > 0) {
            this.data.ttl = ttl;
        }
        else {
            this.data.ttl = null;
        }
        return this;
    }
    /**
     * Creates a new [[`ICalEvent`]] and returns it. Use options to prefill the event's attributes.
     * Calling this method without options will create an empty event.
     *
     * ```javascript
     * import ical from 'ical-generator';
     *
     * // or use require:
     * // const ical = require('ical-generator');
     *
     * const cal = ical();
     * const event = cal.createEvent({summary: 'My Event'});
     *
     * // overwrite event summary
     * event.summary('Your Event');
     * ```
     *
     * @since 0.2.0
     */
    createEvent(data) {
        const event = data instanceof event_1.default ? data : new event_1.default(data, this);
        this.data.events.push(event);
        return event;
    }
    events(events) {
        if (!events) {
            return this.data.events;
        }
        events.forEach((e) => this.createEvent(e));
        return this;
    }
    /**
     * Remove all events from the calendar without
     * touching any other data like name or prodId.
     *
     * @since 2.0.0-develop.1
     */
    clear() {
        this.data.events = [];
        return this;
    }
    save(path, cb) {
        if (cb) {
            (0, fs_1.writeFile)(path, this.toString(), cb);
            return this;
        }
        return fs_2.promises.writeFile(path, this.toString());
    }
    /**
     * Save Calendar to disk synchronously using
     * [fs.writeFileSync](http://nodejs.org/api/fs.html#fs_fs_writefilesync_filename_data_options).
     * Only works in node.js environments.
     *
     * ```javascript
     * calendar.saveSync('./calendar.ical');
     * ```
     */
    saveSync(path) {
        (0, fs_1.writeFileSync)(path, this.toString());
        return this;
    }
    /**
     * Send calendar to the user when using HTTP using the passed `ServerResponse` object.
     * Use second parameter `filename` to change the filename, which defaults to `'calendar.ics'`.
     *
     * @param response HTTP Response object which is used to send the calendar
     * @param [filename = 'calendar.ics'] Filename of the calendar file
     */
    serve(response, filename = 'calendar.ics') {
        response.writeHead(200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="${filename}"`
        });
        response.end(this.toString());
        return this;
    }
    /**
     * Generates a blob to use for downloads or to generate a download URL.
     * Only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this method is currently untested. Sorry Dave…
     *
     * @since 1.9.0
     */
    toBlob() {
        return new Blob([this.toString()], { type: 'text/calendar' });
    }
    /**
     * Returns a URL to download the ical file. Uses the Blob object internally,
     * so it's only supported in browsers supporting the Blob API.
     *
     * Unfortunately, because node.js has no Blob implementation (they have Buffer
     * instead), this can't be tested right now. Sorry Dave…
     *
     * @since 1.9.0
     */
    toURL() {
        return URL.createObjectURL(this.toBlob());
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
     * Return a shallow copy of the calendar's options for JSON stringification.
     * Third party objects like moment.js values or RRule objects are stringified
     * as well. Can be used for persistence.
     *
     * ```javascript
     * const cal = ical();
     * const json = JSON.stringify(cal);
     *
     * // later: restore calendar data
     * cal = ical(JSON.parse(json));
     * ```
     *
     * @since 0.2.4
     */
    toJSON() {
        return Object.assign({}, this.data, {
            timezone: this.timezone(),
            events: this.data.events.map(event => event.toJSON()),
            x: this.x()
        });
    }
    /**
     * Get the number of events added to your calendar
     */
    length() {
        return this.data.events.length;
    }
    /**
     * Return generated calendar as a string.
     *
     * ```javascript
     * const cal = ical();
     * console.log(cal.toString()); // → BEGIN:VCALENDAR…
     * ```
     */
    toString() {
        var _a, _b;
        let g = '';
        // VCALENDAR and VERSION
        g = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\n';
        // PRODID
        g += 'PRODID:-' + this.data.prodId + '\r\n';
        // URL
        if (this.data.url) {
            g += 'URL:' + this.data.url + '\r\n';
        }
        // SOURCE
        if (this.data.source) {
            g += 'SOURCE;VALUE=URI:' + this.data.source + '\r\n';
        }
        // CALSCALE
        if (this.data.scale) {
            g += 'CALSCALE:' + this.data.scale + '\r\n';
        }
        // METHOD
        if (this.data.method) {
            g += 'METHOD:' + this.data.method + '\r\n';
        }
        // NAME
        if (this.data.name) {
            g += 'NAME:' + this.data.name + '\r\n';
            g += 'X-WR-CALNAME:' + this.data.name + '\r\n';
        }
        // Description
        if (this.data.description) {
            g += 'X-WR-CALDESC:' + this.data.description + '\r\n';
        }
        // Timezone
        if ((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.generator) {
            const timezones = [...new Set([
                    this.timezone(),
                    ...this.data.events.map(event => event.timezone())
                ])].filter(tz => tz !== null && !tz.startsWith('/'));
            timezones.forEach(tz => {
                var _a;
                if (!((_a = this.data.timezone) === null || _a === void 0 ? void 0 : _a.generator)) {
                    return;
                }
                const s = this.data.timezone.generator(tz);
                if (!s) {
                    return;
                }
                g += s.replace(/\r\n/g, '\n')
                    .replace(/\n/g, '\r\n')
                    .trim() + '\r\n';
            });
        }
        if ((_b = this.data.timezone) === null || _b === void 0 ? void 0 : _b.name) {
            g += 'TIMEZONE-ID:' + this.data.timezone.name + '\r\n';
            g += 'X-WR-TIMEZONE:' + this.data.timezone.name + '\r\n';
        }
        // TTL
        if (this.data.ttl) {
            g += 'REFRESH-INTERVAL;VALUE=DURATION:' + (0, tools_1.toDurationString)(this.data.ttl) + '\r\n';
            g += 'X-PUBLISHED-TTL:' + (0, tools_1.toDurationString)(this.data.ttl) + '\r\n';
        }
        // Events
        this.data.events.forEach(event => g += event.toString());
        // CUSTOM X ATTRIBUTES
        g += (0, tools_1.generateCustomAttributes)(this.data);
        g += 'END:VCALENDAR';
        return (0, tools_1.foldLines)(g);
    }
}
exports.default = ICalCalendar;
//# sourceMappingURL=calendar.js.map