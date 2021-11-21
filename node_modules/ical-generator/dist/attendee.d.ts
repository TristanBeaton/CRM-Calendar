import ICalEvent from './event';
export interface ICalAttendeeData {
    name?: string | null;
    email?: string | null;
    mailto?: string | null;
    status?: ICalAttendeeStatus | null;
    role?: ICalAttendeeRole;
    rsvp?: boolean | null;
    type?: ICalAttendeeType | null;
    delegatedTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatedFrom?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesTo?: ICalAttendee | ICalAttendeeData | string | null;
    delegatesFrom?: ICalAttendee | ICalAttendeeData | string | null;
    x?: {
        key: string;
        value: string;
    }[] | [string, string][] | Record<string, string>;
}
export interface ICalAttendeeJSONData {
    name: string | null;
    email: string | null;
    mailto: string | null;
    status: ICalAttendeeStatus | null;
    role: ICalAttendeeRole;
    rsvp: boolean | null;
    type: ICalAttendeeType | null;
    delegatedTo: string | null;
    delegatedFrom: string | null;
    x: {
        key: string;
        value: string;
    }[];
}
export declare enum ICalAttendeeRole {
    CHAIR = "CHAIR",
    REQ = "REQ-PARTICIPANT",
    OPT = "OPT-PARTICIPANT",
    NON = "NON-PARTICIPANT"
}
export declare enum ICalAttendeeStatus {
    ACCEPTED = "ACCEPTED",
    TENTATIVE = "TENTATIVE",
    DECLINED = "DECLINED",
    DELEGATED = "DELEGATED",
    NEEDSACTION = "NEEDS-ACTION"
}
export declare enum ICalAttendeeType {
    INDIVIDUAL = "INDIVIDUAL",
    GROUP = "GROUP",
    RESOURCE = "RESOURCE",
    ROOM = "ROOM",
    UNKNOWN = "UNKNOWN"
}
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
export default class ICalAttendee {
    private readonly data;
    private readonly event;
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is
     * required to query the calendar's timezone when required.
     *
     * @param data Attendee Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data: ICalAttendeeData, event: ICalEvent);
    /**
     * Get the attendee's name
     * @since 0.2.0
     */
    name(): string | null;
    /**
     * Set the attendee's name
     * @since 0.2.0
     */
    name(name: string | null): this;
    /**
     * Get the attendee's email address
     * @since 0.2.0
     */
    email(): string | null;
    /**
     * Set the attendee's email address
     * @since 0.2.0
     */
    email(email: string | null): this;
    /**
     * Get the attendee's email address
     * @since 1.3.0
     */
    mailto(): string | null;
    /**
     * Set the attendee's email address
     * @since 1.3.0
     */
    mailto(mailto: string | null): this;
    /**
     * Get attendee's role
     * @since 0.2.0
     */
    role(): ICalAttendeeRole;
    /**
     * Set the attendee's role, defaults to `REQ` / `REQ-PARTICIPANT`.
     * Checkout [[`ICalAttendeeRole`]] for available roles.
     *
     * @since 0.2.0
     */
    role(role: ICalAttendeeRole): this;
    /**
     * Get attendee's RSVP expectation
     * @since 0.2.1
     */
    rsvp(): boolean | null;
    /**
     * Set the attendee's RSVP expectation
     * @since 0.2.1
     */
    rsvp(rsvp: boolean | null): this;
    /**
     * Get attendee's status
     * @since 0.2.0
     */
    status(): ICalAttendeeStatus | null;
    /**
     * Set the attendee's status. See [[`ICalAttendeeStatus`]]
     * for available status options.
     *
     * @since 0.2.0
     */
    status(status: ICalAttendeeStatus | null): this;
    /**
     * Get attendee's type (a.k.a. CUTYPE)
     * @since 0.2.3
     */
    type(): ICalAttendeeType;
    /**
     * Set attendee's type (a.k.a. CUTYPE).
     * See [[`ICalAttendeeType`]] for available status options.
     *
     * @since 0.2.3
     */
    type(type: ICalAttendeeType | null): this;
    /**
     * Get the attendee's delegated-to value.
     * @since 0.2.0
     */
    delegatedTo(): ICalAttendee | null;
    /**
     * Set the attendee's delegated-to field.
     *
     * Creates a new Attendee if the passed object is not already a
     * [[`ICalAttendee`]] object. Will set the `delegatedTo` and
     * `delegatedFrom` attributes.
     *
     * Will also set the `status` to `DELEGATED`, if attribute is set.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const attendee = cal.createAttendee();
     *
     * attendee.delegatesTo({email: 'foo@bar.com', name: 'Foo'});
     ```
     *
     * @since 0.2.0
     */
    delegatedTo(delegatedTo: ICalAttendee | ICalAttendeeData | string | null): this;
    /**
     * Get the attendee's delegated-from field
     * @since 0.2.0
     */
    delegatedFrom(): ICalAttendee | null;
    /**
     * Set the attendee's delegated-from field
     *
     * Creates a new Attendee if the passed object is not already a
     * [[`ICalAttendee`]] object. Will set the `delegatedTo` and
     * `delegatedFrom` attributes.
     *
     * @param delegatedFrom
     */
    delegatedFrom(delegatedFrom: ICalAttendee | ICalAttendeeData | string | null): this;
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
    delegatesTo(options: ICalAttendee | ICalAttendeeData | string): ICalAttendee;
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
    delegatesFrom(options: ICalAttendee | ICalAttendeeData | string): ICalAttendee;
    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. status),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * attendee.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * attendee.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * attendee.x({
     *     "X-MY-CUSTOM-ATTR": "1337!"
     * });
     * ```
     *
     * @since 1.9.0
     */
    x(keyOrArray: {
        key: string;
        value: string;
    }[] | [string, string][] | Record<string, string>): this;
    /**
     * Set a X-* attribute. Woun't filter double attributes,
     * which are also added by another method (e.g. status),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * attendee.x("X-MY-CUSTOM-ATTR", "1337!");
     * ```
     *
     * @since 1.9.0
     */
    x(keyOrArray: string, value: string): this;
    /**
     * Get all custom X-* attributes.
     * @since 1.9.0
     */
    x(): {
        key: string;
        value: string;
    }[];
    /**
     * Return a shallow copy of the attendee's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON(): ICalAttendeeJSONData;
    /**
     * Return generated attendee as a string.
     *
     * ```javascript
     * console.log(attendee.toString()); // → ATTENDEE;ROLE=…
     * ```
     */
    toString(): string;
}
