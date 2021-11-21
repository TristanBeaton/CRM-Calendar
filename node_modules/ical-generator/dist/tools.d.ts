import type { Moment, Duration } from 'moment';
import type { Moment as MomentTZ } from 'moment-timezone';
import type { Dayjs } from 'dayjs';
import type { DateTime as LuxonDateTime } from 'luxon';
import type { RRule } from 'rrule';
import { ICalDateTimeValue, ICalOrganizer } from './types';
/**
 * Converts a valid date/time object supported by this library to a string.
 */
export declare function formatDate(timezone: string | null, d: ICalDateTimeValue, dateonly?: boolean, floating?: boolean): string;
/**
 * Converts a valid date/time object supported by this library to a string.
 * For information about this format, see RFC 5545, section 3.3.5
 * https://tools.ietf.org/html/rfc5545#section-3.3.5
 */
export declare function formatDateTZ(timezone: string | null, property: string, date: ICalDateTimeValue | Date | string, eventData?: {
    floating?: boolean | null;
    timezone?: string | null;
}): string;
/**
 * Escapes special characters in the given string
 */
export declare function escape(str: string | unknown): string;
/**
 * Trim line length of given string
 */
export declare function foldLines(input: string): string;
export declare function addOrGetCustomAttributes(data: {
    x: [string, string][];
}, keyOrArray: ({
    key: string;
    value: string;
})[] | [string, string][] | Record<string, string>): void;
export declare function addOrGetCustomAttributes(data: {
    x: [string, string][];
}, keyOrArray: string, value: string): void;
export declare function addOrGetCustomAttributes(data: {
    x: [string, string][];
}): ({
    key: string;
    value: string;
})[];
export declare function generateCustomAttributes(data: {
    x: [string, string][];
}): string;
/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
export declare function checkNameAndMail(attribute: string, value: string | ICalOrganizer): ICalOrganizer;
/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
export declare function checkEnum(type: Record<string, string>, value: unknown): unknown;
/**
 * Checks if the given input is a valid date and
 * returns the internal representation (= moment object)
 */
export declare function checkDate(value: ICalDateTimeValue, attribute: string): ICalDateTimeValue;
export declare function toDate(value: ICalDateTimeValue): Date;
export declare function isMoment(value: ICalDateTimeValue): value is Moment;
export declare function isMomentTZ(value: ICalDateTimeValue): value is MomentTZ;
export declare function isDayjs(value: ICalDateTimeValue): value is Dayjs;
export declare function isLuxonDate(value: ICalDateTimeValue): value is LuxonDateTime;
export declare function isMomentDuration(value: unknown): value is Duration;
export declare function isRRule(value: unknown): value is RRule;
export declare function toJSON(value: ICalDateTimeValue | null | undefined): string | null | undefined;
export declare function toDurationString(seconds: number): string;
