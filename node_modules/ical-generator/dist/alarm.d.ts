import ICalEvent from './event';
import { ICalDateTimeValue } from './types';
export declare enum ICalAlarmType {
    display = "display",
    audio = "audio"
}
export declare type ICalAlarmTypeValue = keyof ICalAlarmType;
export interface ICalAttachment {
    uri: string;
    mime: string | null;
}
export interface ICalAlarmData {
    type?: ICalAlarmType | null;
    trigger?: number | ICalDateTimeValue | null;
    triggerBefore?: number | ICalDateTimeValue | null;
    triggerAfter?: number | ICalDateTimeValue | null;
    repeat?: number | null;
    interval?: number | null;
    attach?: string | ICalAttachment | null;
    description?: string | null;
    x?: {
        key: string;
        value: string;
    }[] | [string, string][] | Record<string, string>;
}
export interface ICalAlarmJSONData {
    type: ICalAlarmType | null;
    trigger: string | number | null;
    repeat: number | null;
    interval: number | null;
    attach: ICalAttachment | null;
    description: string | null;
    x: {
        key: string;
        value: string;
    }[];
}
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
export default class ICalAlarm {
    private readonly data;
    private readonly event;
    /**
     * Constructor of [[`ICalAttendee`]]. The event reference is required
     * to query the calendar's timezone and summary when required.
     *
     * @param data Alarm Data
     * @param calendar Reference to ICalEvent object
     */
    constructor(data: ICalAlarmData, event: ICalEvent);
    /**
     * Get the alarm type
     * @since 0.2.1
     */
    type(type: ICalAlarmType | null): this;
    /**
     * Set the alarm type. See [[`ICalAlarmType`]]
     * for available status options.
     * @since 0.2.1
     */
    type(): ICalAlarmType | null;
    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered after the event started.
     *
     * @since 0.2.1
     */
    trigger(): number | ICalDateTimeValue | null;
    /**
     * Use this method to set the alarm time.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes before event starts
     * alarm.trigger(new Date()); // -> now
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     */
    trigger(trigger: number | ICalDateTimeValue | Date | null): this;
    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered before the event started.
     *
     * @since 0.2.1
     */
    triggerAfter(): number | ICalDateTimeValue | null;
    /**
     * Use this method to set the alarm time. Unlike `trigger`, this time
     * the alarm takes place after the event has started.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes after event starts
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     */
    triggerAfter(trigger: number | ICalDateTimeValue | null): this;
    /**
     * Get the trigger time for the alarm. Can either
     * be a date and time value ([[`ICalDateTimeValue`]]) or
     * a number, which will represent the seconds between
     * alarm and event start. The number is negative, if the
     * alarm is triggered after the event started.
     *
     * @since 0.2.1
     * @alias trigger
     */
    triggerBefore(trigger: number | ICalDateTimeValue | null): this;
    /**
     * Use this method to set the alarm time.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     * const alarm = cal.createAlarm();
     *
     * alarm.trigger(600); // -> 10 minutes before event starts
     * alarm.trigger(new Date()); // -> now
     * ```
     *
     * You can use any supported date object, see
     * [readme](https://github.com/sebbo2002/ical-generator#-date-time--timezones)
     * for details about supported values and timezone handling.
     *
     * @since 0.2.1
     * @alias trigger
     */
    triggerBefore(): number | ICalDateTimeValue | null;
    /**
     * Get Alarm Repetitions
     * @since 0.2.1
     */
    repeat(): number | null;
    /**
     * Set Alarm Repetitions. Use this to repeat the alarm.
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * // repeat the alarm 4 times every 5 minutes…
     * cal.createAlarm({
     *     repeat: 4,
     *     interval: 300
     * });
     * ```
     *
     * @since 0.2.1
     */
    repeat(repeat: number | null): this;
    /**
     * Get Repeat Interval
     * @since 0.2.1
     */
    interval(interval: number | null): this;
    /**
     * Set Repeat Interval
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * // repeat the alarm 4 times every 5 minutes…
     * cal.createAlarm({
     *     repeat: 4,
     *     interval: 300
     * });
     * ```
     *
     * @since 0.2.1
     */
    interval(): number | null;
    /**
     * Get Attachment
     * @since 0.2.1
     */
    attach(): {
        uri: string;
        mime: string | null;
    } | null;
    /**
     * Set Alarm attachment. Used to set the alarm sound
     * if alarm type is audio. Defaults to "Basso".
     *
     * ```javascript
     * const cal = ical();
     * const event = cal.createEvent();
     *
     * event.createAlarm({
     *     attach: 'https://example.com/notification.aud'
     * });
     *
     * // OR
     *
     * event.createAlarm({
     *     attach: {
     *         uri: 'https://example.com/notification.aud',
     *         mime: 'audio/basic'
     *     }
     * });
     * ```
     *
     * @since 0.2.1
     */
    attach(attachment: {
        uri: string;
        mime?: string | null;
    } | string | null): this;
    /**
     * Get the alarm description. Used to set the alarm message
     * if alarm type is display. Defaults to the event's summary.
     *
     * @since 0.2.1
     */
    description(): string | null;
    /**
     * Set the alarm description. Used to set the alarm message
     * if alarm type is display. Defaults to the event's summary.
     *
     * @since 0.2.1
     */
    description(description: string | null): this;
    /**
     * Set X-* attributes. Woun't filter double attributes,
     * which are also added by another method (e.g. type),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * alarm.x([
     *     {
     *         key: "X-MY-CUSTOM-ATTR",
     *         value: "1337!"
     *     }
     * ]);
     *
     * alarm.x([
     *     ["X-MY-CUSTOM-ATTR", "1337!"]
     * ]);
     *
     * alarm.x({
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
     * which are also added by another method (e.g. type),
     * so these attributes may be inserted twice.
     *
     * ```javascript
     * alarm.x("X-MY-CUSTOM-ATTR", "1337!");
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
     * Return a shallow copy of the alarm's options for JSON stringification.
     * Third party objects like moment.js values are stringified as well. Can
     * be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON(): ICalAlarmJSONData;
    /**
     * Return generated event as a string.
     *
     * ```javascript
     * const alarm = event.createAlarm();
     * console.log(alarm.toString()); // → BEGIN:VALARM…
     * ```
     */
    toString(): string;
}
