'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
/**
 * Usually you get an `ICalCategory` object like this:
 *
 * ```javascript
 * import ical from 'ical-generator';
 * const calendar = ical();
 * const event = calendar.createEvent();
 * const category = event.createCategory();
 * ```
 *
 * You can also use the [[`ICalCategory`]] object directly:
 *
 * ```javascript
 * import ical, {ICalCategory} from 'ical-generator';
 * const category = new ICalCategory();
 * event.categories([category]);
 * ```
 */
class ICalCategory {
    /**
     * Constructor of [[`ICalCategory`]].
     * @param data Category Data
     */
    constructor(data) {
        this.data = {
            name: null
        };
        data.name !== undefined && this.name(data.name);
    }
    name(name) {
        if (name === undefined) {
            return this.data.name;
        }
        this.data.name = name || null;
        return this;
    }
    /**
     * Return a shallow copy of the category's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON() {
        return Object.assign({}, this.data);
    }
    /**
     * Return generated category name as a string.
     *
     * ```javascript
     * console.log(category.toString());
     * ```
     */
    toString() {
        // CN / Name
        if (!this.data.name) {
            throw new Error('No value for `name` in ICalCategory given!');
        }
        return (0, tools_1.escape)(this.data.name);
    }
}
exports.default = ICalCategory;
//# sourceMappingURL=category.js.map