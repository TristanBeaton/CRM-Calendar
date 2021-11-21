'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ICalAttendeeType = exports.ICalAttendeeStatus = exports.ICalAttendeeRole = void 0;
const tools_1 = require("./tools");
var ICalAttendeeRole;
(function (ICalAttendeeRole) {
    ICalAttendeeRole["CHAIR"] = "CHAIR";
    ICalAttendeeRole["REQ"] = "REQ-PARTICIPANT";
    ICalAttendeeRole["OPT"] = "OPT-PARTICIPANT";
    ICalAttendeeRole["NON"] = "NON-PARTICIPANT";
})(ICalAttendeeRole = exports.ICalAttendeeRole || (exports.ICalAttendeeRole = {}));
var ICalAttendeeStatus;
(function (ICalAttendeeStatus) {
    ICalAttendeeStatus["ACCEPTED"] = "ACCEPTED";
    ICalAttendeeStatus["TENTATIVE"] = "TENTATIVE";
    ICalAttendeeStatus["DECLINED"] = "DECLINED";
    ICalAttendeeStatus["DELEGATED"] = "DELEGATED";
    ICalAttendeeStatus["NEEDSACTION"] = "NEEDS-ACTION";
})(ICalAttendeeStatus = exports.ICalAttendeeStatus || (exports.ICalAttendeeStatus = {}));
// ref: https://tools.ietf.org/html/rfc2445#section-4.2.3
var ICalAttendeeType;
(function (ICalAttendeeType) {
    ICalAttendeeType["INDIVIDUAL"] = "INDIVIDUAL";
    ICalAttendeeType["GROUP"] = "GROUP";
    ICalAttendeeType["RESOURCE"] = "RESOURCE";
    ICalAttendeeType["ROOM"] = "ROOM";
    ICalAttendeeType["UNKNOWN"] = "UNKNOWN";
})(ICalAttendeeType = exports.ICalAttendeeType || (exports.ICalAttendeeType = {}));
/**
 * Usually you get an `ICalAttendee` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const attendee = event.createAttendee();
 * ```
 *
 * You can also use the [[`ICalAttendee`]] object directly:
 *
 * ```javascript
 * import ical, {ICalAttendee} from 'ical-generator';
 * const attendee = new ICalAttendee();
 * event.attendees([attendee]);
 * ```
 */
class ICalAttendee {
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Attendee Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data, event) {
        this.data = {
            name: null,
            email: null,
            mailto: null,
            status: null,
            role: ICalAttendeeRole.REQ,
            rsvp: null,
            type: null,
            delegatedTo: null,
            delegatedFrom: null,
            x: []
        };
        this.event = event;
        if (!this.event) {
            throw new Error('`event` option required!');
        }
        data.name !== undefined && this.name(data.name);
        data.email !== undefined && this.email(data.email);
        data.mailto !== undefined && this.mailto(data.mailto);
        data.status !== undefined && this.status(data.status);
        data.role !== undefined && this.role(data.role);
        data.rsvp !== undefined && this.rsvp(data.rsvp);
        data.type !== undefined && this.type(data.type);
        data.delegatedTo !== undefined && this.delegatedTo(data.delegatedTo);
        data.delegatedFrom !== undefined && this.delegatedFrom(data.delegatedFrom);
        data.delegatesTo && this.delegatesTo(data.delegatesTo);
        data.delegatesFrom && this.delegatesFrom(data.delegatesFrom);
        data.x !== undefined && this.x(data.x);
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name || null;
        return this;
    }
    email(email) {
        if (!email) {
            return this.data.email;
        }
        this.data.email = email;
        return this;
    }
    mailto(mailto) {
        if (mailto === undefined) {
            return this.data.mailto;
        }
        this.data.mailto = mailto || null;
        return this;
    }
    role(role) {
        if (role === undefined) {
            return this.data.role;
        }
        this.data.role = (0, tools_1.checkEnum)(ICalAttendeeRole, role);
        return this;
    }
    rsvp(rsvp) {
        if (rsvp === undefined) {
            return this.data.rsvp;
        }
        if (rsvp === null) {
            this.data.rsvp = null;
            return this;
        }
        this.data.rsvp = Boolean(rsvp);
        return this;
    }
    status(status) {
        if (status === undefined) {
            return this.data.status;
        }
        if (!status) {
            this.data.status = null;
            return this;
        }
        this.data.status = (0, tools_1.checkEnum)(ICalAttendeeStatus, status);
        return this;
    }
    type(type) {
        if (type === undefined) {
            return this.data.type;
        }
        if (!type) {
            this.data.type = null;
            return this;
        }
        this.data.type = (0, tools_1.checkEnum)(ICalAttendeeType, type);
        return this;
    }
    delegatedTo(delegatedTo) {
        if (delegatedTo === undefined) {
            return this.data.delegatedTo;
        }
        if (!delegatedTo) {
            this.data.delegatedTo = null;
            if (this.data.status === ICalAttendeeStatus.DELEGATED) {
                this.data.status = null;
            }
            return this;
        }
        if (typeof delegatedTo === 'string') {
            this.data.delegatedTo = new ICalAttendee((0, tools_1.checkNameAndMail)('delegatedTo', delegatedTo), this.event);
        }
        else if (delegatedTo instanceof ICalAttendee) {
            this.data.delegatedTo = delegatedTo;
        }
        else {
            this.data.delegatedTo = new ICalAttendee(delegatedTo, this.event);
        }
        this.data.status = ICalAttendeeStatus.DELEGATED;
        return this;
    }
    delegatedFrom(delegatedFrom) {
        if (delegatedFrom === undefined) {
            return this.data.delegatedFrom;
        }
        if (!delegatedFrom) {
            this.data.delegatedFrom = null;
        }
        else if (typeof delegatedFrom === 'string') {
            this.data.delegatedFrom = new ICalAttendee((0, tools_1.checkNameAndMail)('delegatedFrom', delegatedFrom), this.event);
        }
        else if (delegatedFrom instanceof ICalAttendee) {
            this.data.delegatedFrom = delegatedFrom;
        }
        else {
            this.data.delegatedFrom = new ICalAttendee(delegatedFrom, this.event);
        }
        return this;
    }
    /**
     * Create a new attendee this attendee delegates to and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an [[`ICalAttendee`]].
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesTo(options) {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedTo(a);
        a.delegatedFrom(this);
        return a;
    }
    /**
     * Create a new attendee this attendee delegates from and returns
     * this new attendee. Creates a new attendee if the passed object
     * is not already an [[`ICalAttendee`]].
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesFrom({email: 'foo@bar.com', name: 'Foo'});
     * ```
     *
     * @since 0.2.0
     */
    delegatesFrom(options) {
        const a = options instanceof ICalAttendee ? options : this.event.createAttendee(options);
        this.delegatedFrom(a);
        a.delegatedTo(this);
        return a;
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
     * Return a shallow copy of the attendee's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        var _a, _b;
        return Object.assign({}, this.data, {
            delegatedTo: ((_a = this.data.delegatedTo) === null || _a === void 0 ? void 0 : _a.email()) || null,
            delegatedFrom: ((_b = this.data.delegatedFrom) === null || _b === void 0 ? void 0 : _b.email()) || null,
            x: this.x()
        });
    }
    /**
     * Return generated attendee as a string.
     *
     * ```javascript
     * console.log(attendee.toString()); // → ATTENDEE;ROLE=…
     * ```
     */
    toString() {
        let g = 'ATTENDEE';
        if (!this.data.email) {
            throw new Error('No value for `email` in ICalAttendee given!');
        }
        // ROLE
        g += ';ROLE=' + this.data.role;
        // TYPE
        if (this.data.type) {
            g += ';CUTYPE=' + this.data.type;
        }
        // PARTSTAT
        if (this.data.status) {
            g += ';PARTSTAT=' + this.data.status;
        }
        // RSVP
        if (this.data.rsvp) {
            g += ';RSVP=' + this.data.rsvp.toString().toUpperCase();
        }
        // DELEGATED-TO
        if (this.data.delegatedTo) {
            g += ';DELEGATED-TO="' + this.data.delegatedTo.email() + '"';
        }
        // DELEGATED-FROM
        if (this.data.delegatedFrom) {
            g += ';DELEGATED-FROM="' + this.data.delegatedFrom.email() + '"';
        }
        // CN / Name
        if (this.data.name) {
            g += ';CN="' + (0, tools_1.escape)(this.data.name) + '"';
        }
        // EMAIL
        if (this.data.email && this.data.mailto) {
            g += ';EMAIL=' + (0, tools_1.escape)(this.data.email);
        }
        // CUSTOM X ATTRIBUTES
        if (this.data.x.length) {
            g += ';' + this.data.x
                .map(([key, value]) => key.toUpperCase() + '=' + (0, tools_1.escape)(value))
                .join(';');
        }
        g += ':MAILTO:' + (0, tools_1.escape)(this.data.mailto || this.data.email) + '\r\n';
        return g;
    }
}
exports.default = ICalAttendee;
//# sourceMappingURL=attendee.js.map