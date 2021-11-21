export interface ICalCategoryData {
    name?: string | null;
}
export interface ICalCategoryInternalData {
    name: string | null;
}
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
export default class ICalCategory {
    private readonly data;
    /**
     * Constructor of [[`ICalCategory`]].
     * @param data Category Data
     */
    constructor(data: ICalCategoryData);
    /**
     * Get the category name
     * @since 0.3.0
     */
    name(): string | null;
    /**
     * Set the category name
     * @since 0.3.0
     */
    name(name: string | null): this;
    /**
     * Return a shallow copy of the category's options for JSON stringification.
     * Can be used for persistence.
     *
     * @since 0.2.4
     */
    toJSON(): ICalCategoryInternalData;
    /**
     * Return generated category name as a string.
     *
     * ```javascript
     * console.log(category.toString());
     * ```
     */
    toString(): string;
}
