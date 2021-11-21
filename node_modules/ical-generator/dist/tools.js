'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDurationString = exports.toJSON = exports.isRRule = exports.isMomentDuration = exports.isLuxonDate = exports.isDayjs = exports.isMomentTZ = exports.isMoment = exports.toDate = exports.checkDate = exports.checkEnum = exports.checkNameAndMail = exports.generateCustomAttributes = exports.addOrGetCustomAttributes = exports.foldLines = exports.escape = exports.formatDateTZ = exports.formatDate = void 0;
/**
 * Converts a valid date/time object supported by this library to a string.
 */
function formatDate(timezone, d, dateonly, floating) {
    if (timezone === null || timezone === void 0 ? void 0 : timezone.startsWith('/')) {
        timezone = timezone.substr(1);
    }
    if (typeof d === 'string' || d instanceof Date) {
        const m = new Date(d);
        // (!dateonly && !floating) || !timezone => utc
        let s = m.getUTCFullYear() +
            String(m.getUTCMonth() + 1).padStart(2, '0') +
            m.getUTCDate().toString().padStart(2, '0');
        // (dateonly || floating) && timezone => tz
        if (timezone) {
            s = m.getFullYear() +
                String(m.getMonth() + 1).padStart(2, '0') +
                m.getDate().toString().padStart(2, '0');
        }
        if (dateonly) {
            return s;
        }
        if (timezone) {
            s += 'T' + m.getHours().toString().padStart(2, '0') +
                m.getMinutes().toString().padStart(2, '0') +
                m.getSeconds().toString().padStart(2, '0');
            return s;
        }
        s += 'T' + m.getUTCHours().toString().padStart(2, '0') +
            m.getUTCMinutes().toString().padStart(2, '0') +
            m.getUTCSeconds().toString().padStart(2, '0') +
            (floating ? '' : 'Z');
        return s;
    }
    else if (isMoment(d)) {
        // @see https://momentjs.com/timezone/docs/#/using-timezones/parsing-in-zone/
        const m = timezone ? (isMomentTZ(d) && !d.tz() ? d.clone().tz(timezone) : d) : (floating ? d : d.utc());
        return m.format('YYYYMMDD') + (!dateonly ? ('T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
    else if (isLuxonDate(d)) {
        const m = timezone ? d.setZone(timezone) : (floating ? d : d.setZone('utc'));
        return m.toFormat('yyyyLLdd') + (!dateonly ? ('T' + m.toFormat('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
    else {
        // @see https://day.js.org/docs/en/plugin/utc
        let m = d;
        if (timezone) {
            // @see https://day.js.org/docs/en/plugin/timezone
            // @ts-ignore
            m = typeof d.tz === 'function' ? d.tz(timezone) : d;
        }
        else if (floating) {
            // m = d;
        }
        // @ts-ignore
        else if (typeof d.utc === 'function') {
            // @ts-ignore
            m = d.utc();
        }
        else {
            throw new Error('Unable to convert dayjs object to UTC value: UTC plugin is not available!');
        }
        return m.format('YYYYMMDD') + (!dateonly ? ('T' + m.format('HHmmss') + (floating || timezone ? '' : 'Z')) : '');
    }
}
exports.formatDate = formatDate;
/**
 * Converts a valid date/time object supported by this library to a string.
 * For information about this format, see RFC 5545, section 3.3.5
 * https://tools.ietf.org/html/rfc5545#section-3.3.5
 */
function formatDateTZ(timezone, property, date, eventData) {
    let tzParam = '';
    let floating = (eventData === null || eventData === void 0 ? void 0 : eventData.floating) || false;
    if (eventData === null || eventData === void 0 ? void 0 : eventData.timezone) {
        tzParam = ';TZID=' + eventData.timezone;
        // This isn't a 'floating' event because it has a timezone;
        // but we use it to omit the 'Z' UTC specifier in formatDate()
        floating = true;
    }
    return property + tzParam + ':' + formatDate(timezone, date, false, floating);
}
exports.formatDateTZ = formatDateTZ;
/**
 * Escapes special characters in the given string
 */
function escape(str) {
    return String(str).replace(/[\\;,"]/g, function (match) {
        return '\\' + match;
    }).replace(/(?:\r\n|\r|\n)/g, '\\n');
}
exports.escape = escape;
/**
 * Trim line length of given string
 */
function foldLines(input) {
    return input.split('\r\n').map(function (line) {
        let result = '';
        let c = 0;
        for (let i = 0; i < line.length; i++) {
            let ch = line.charAt(i);
            // surrogate pair, see https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs
            if (ch >= '\ud800' && ch <= '\udbff') {
                ch += line.charAt(++i);
            }
            const charsize = Buffer.from(ch).length;
            c += charsize;
            if (c > 74) {
                result += '\r\n ';
                c = charsize;
            }
            result += ch;
        }
        return result;
    }).join('\r\n');
}
exports.foldLines = foldLines;
function addOrGetCustomAttributes(data, keyOrArray, value) {
    if (Array.isArray(keyOrArray)) {
        data.x = keyOrArray.map((o) => {
            if (Array.isArray(o)) {
                return o;
            }
            if (typeof o.key !== 'string' || typeof o.value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (o.key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }
            return [o.key, o.value];
        });
    }
    else if (typeof keyOrArray === 'object') {
        data.x = Object.entries(keyOrArray).map(([key, value]) => {
            if (typeof key !== 'string' || typeof value !== 'string') {
                throw new Error('Either key or value is not a string!');
            }
            if (key.substr(0, 2) !== 'X-') {
                throw new Error('Key has to start with `X-`!');
            }
            return [key, value];
        });
    }
    else if (typeof keyOrArray === 'string' && typeof value === 'string') {
        if (keyOrArray.substr(0, 2) !== 'X-') {
            throw new Error('Key has to start with `X-`!');
        }
        data.x.push([keyOrArray, value]);
    }
    else {
        return data.x.map(a => ({
            key: a[0],
            value: a[1]
        }));
    }
}
exports.addOrGetCustomAttributes = addOrGetCustomAttributes;
function generateCustomAttributes(data) {
    const str = data.x
        .map(([key, value]) => key.toUpperCase() + ':' + escape(value))
        .join('\r\n');
    return str.length ? str + '\r\n' : '';
}
exports.generateCustomAttributes = generateCustomAttributes;
/**
 * Check the given string or ICalOrganizer. Parses
 * the string for name and email address if possible.
 *
 * @param attribute Attribute name for error messages
 * @param value Value to parse name/email from
 */
function checkNameAndMail(attribute, value) {
    let result = null;
    if (typeof value === 'string') {
        const match = value.match(/^(.+) ?<([^>]+)>$/);
        if (match) {
            result = {
                name: match[1].trim(),
                email: match[2].trim()
            };
        }
        else if (value.includes('@')) {
            result = {
                name: value.trim(),
                email: value.trim()
            };
        }
    }
    else if (typeof value === 'object') {
        result = {
            name: value.name,
            email: value.email,
            mailto: value.mailto
        };
    }
    if (!result && typeof value === 'string') {
        throw new Error('`' + attribute + '` isn\'t formated correctly. See https://sebbo2002.github.io/ical-generator/develop/' +
            'reference/interfaces/icalorganizer.html');
    }
    else if (!result) {
        throw new Error('`' + attribute + '` needs to be a valid formed string or an object. See https://sebbo2002.github.io/' +
            'ical-generator/develop/reference/interfaces/icalorganizer.html');
    }
    if (!result.name) {
        throw new Error('`' + attribute + '.name` is empty!');
    }
    return result;
}
exports.checkNameAndMail = checkNameAndMail;
/**
 * Checks if the given string `value` is a
 * valid one for the type `type`
 */
function checkEnum(type, value) {
    const allowedValues = Object.values(type);
    const valueStr = String(value).toUpperCase();
    if (!valueStr || !allowedValues.includes(valueStr)) {
        throw new Error(`Input must be one of the following: ${allowedValues.join(', ')}`);
    }
    return valueStr;
}
exports.checkEnum = checkEnum;
/**
 * Checks if the given input is a valid date and
 * returns the internal representation (= moment object)
 */
function checkDate(value, attribute) {
    // Date & String
    if ((value instanceof Date && isNaN(value.getTime())) ||
        (typeof value === 'string' && isNaN(new Date(value).getTime()))) {
        throw new Error(`\`${attribute}\` has to be a valid date!`);
    }
    if (value instanceof Date || typeof value === 'string') {
        return value;
    }
    // Luxon
    if (isLuxonDate(value) && value.isValid === true) {
        return value;
    }
    // Moment / Moment Timezone
    if ((isMoment(value) || isDayjs(value)) && value.isValid()) {
        return value;
    }
    throw new Error(`\`${attribute}\` has to be a valid date!`);
}
exports.checkDate = checkDate;
function toDate(value) {
    if (typeof value === 'string' || value instanceof Date) {
        return new Date(value);
    }
    // @ts-ignore
    if (isLuxonDate(value)) {
        return value.toJSDate();
    }
    return value.toDate();
}
exports.toDate = toDate;
function isMoment(value) {
    // @ts-ignore
    return value != null && value._isAMomentObject != null;
}
exports.isMoment = isMoment;
function isMomentTZ(value) {
    return isMoment(value) && typeof value.tz === 'function';
}
exports.isMomentTZ = isMomentTZ;
function isDayjs(value) {
    return typeof value === 'object' &&
        value !== null &&
        !(value instanceof Date) &&
        !isMoment(value) &&
        !isLuxonDate(value);
}
exports.isDayjs = isDayjs;
function isLuxonDate(value) {
    return typeof value === 'object' && value !== null && typeof value.toJSDate === 'function';
}
exports.isLuxonDate = isLuxonDate;
function isMomentDuration(value) {
    // @ts-ignore
    return value !== null && typeof value === 'object' && typeof value.asSeconds === 'function';
}
exports.isMomentDuration = isMomentDuration;
function isRRule(value) {
    // @ts-ignore
    return value !== null && typeof value === 'object' && typeof value.between === 'function' && typeof value.toString === 'function';
}
exports.isRRule = isRRule;
function toJSON(value) {
    if (!value) {
        return value;
    }
    if (typeof value === 'string') {
        return value;
    }
    return value.toJSON();
}
exports.toJSON = toJSON;
function toDurationString(seconds) {
    let string = '';
    // < 0
    if (seconds < 0) {
        string = '-';
        seconds *= -1;
    }
    string += 'P';
    // DAYS
    if (seconds >= 86400) {
        string += Math.floor(seconds / 86400) + 'D';
        seconds %= 86400;
    }
    if (!seconds && string.length > 1) {
        return string;
    }
    string += 'T';
    // HOURS
    if (seconds >= 3600) {
        string += Math.floor(seconds / 3600) + 'H';
        seconds %= 3600;
    }
    // MINUTES
    if (seconds >= 60) {
        string += Math.floor(seconds / 60) + 'M';
        seconds %= 60;
    }
    // SECONDS
    if (seconds > 0) {
        string += seconds + 'S';
    }
    else if (string.length <= 2) {
        string += '0S';
    }
    return string;
}
exports.toDurationString = toDurationString;
//# sourceMappingURL=tools.js.map