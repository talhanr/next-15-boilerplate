/**
 * Combines two sets of CSS class names, giving the second set (custom classes)
 * control over overriding or removing default classes.
 *
 * - Default classes are always included unless overridden or explicitly removed.
 * - To explicitly remove a default class, add it to `className` prefixed by "!!"
 *   (e.g., `"!!bg-blue-500"` removes `"bg-blue-500"` from the result).
 * - If a custom class starts with the same base as a default class (before the first "-"),
 *   the default class will be removed (e.g., `"bg-red-500"` overrides `"bg-blue-500"`).
 *
 * @param defaultClasses - Space-separated string of default CSS classes.
 * @param className - Optional space-separated string of custom/override CSS classes.
 * @returns {string} - The resulting space-separated string of combined class names.
 *
 * @example
 * combineClasses("bg-blue-500 text-white", "bg-red-500 font-bold");
 * // Returns: "text-white bg-red-500 font-bold"
 *
 * @example
 * combineClasses("bg-blue-500 text-white", "!!bg-blue-500 font-bold");
 * // Returns: "text-white font-bold"
 *
 * @example
 * combineClasses("rounded px-4 py-2", "px-8 py-4");
 * // Returns: "rounded px-8 py-4"
 *
 * @example
 * combineClasses("border border-gray-300", "!!border font-bold");
 * // Returns: "border-gray-300 font-bold"
 */
export const combineClasses = (
  defaultClasses: string,
  className?: string
): string => {
  if (!className) return defaultClasses;

  const defaultSet = new Set(defaultClasses.split(" "));
  const customSet = new Set(className.split(" "));

  [...customSet].forEach((customClass) => {
    if (customClass.startsWith("!!")) {
      defaultSet.delete(customClass.slice(2));
      customSet.delete(customClass);
    }
  });

  [...defaultSet].forEach((defaultClass) => {
    const baseClass = defaultClass.split("-")[0];
    [...customSet].forEach((customClass) => {
      if (customClass.startsWith(baseClass)) {
        defaultSet.delete(defaultClass);
      }
    });
  });

  return [...defaultSet, ...customSet].join(" ");
};

/**
 * Creates a throttled version of the provided function that only invokes the function
 * at most once every specified interval, regardless of how many times it's called.
 *
 * Throttle is useful for performance optimization in cases like handling scroll,
 * resize, or mouse move events that fire frequently, but should only be processed
 * periodically.
 *
 * @template T - A function type to throttle.
 * @param fn - The function to throttle.
 * @param ms - The number of milliseconds to wait before allowing the next invocation.
 * @returns A new function that throttles calls to `fn` so it only executes at most
 *   once every `ms` milliseconds.
 *
 * @example
 * const handleScroll = throttle(() => {
 *   console.log('Scroll event!');
 * }, 200);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
};

/**
 * Creates a debounced version of the provided function that delays its execution
 * until after a specified wait time has elapsed since the last time it was invoked.
 *
 * Useful for limiting the rate at which a function can fire. Common use cases
 * include handling rapid user events like window resizing, scrolling, or keystrokes.
 *
 * @template T - A function type to debounce.
 * @param fn - The function to debounce.
 * @param ms - The number of milliseconds to delay invocation.
 * @returns A new function that delays calling `fn` until after `ms` milliseconds have
 *   elapsed since the last invocation.
 *
 * @example
 * const handleResize = debounce(() => {
 *   console.log('Window resized!');
 * }, 300);
 *
 * window.addEventListener('resize', handleResize);
 *
 * // In a React input:
 * const debouncedSearch = debounce((query: string) => {
 *   fetchResults(query);
 * }, 500);
 *
 * <input onChange={e => debouncedSearch(e.target.value)} />
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
};

/**
 * Capitalizes the first character of a string and returns the modified string.
 *
 * If the input string is empty, this function will throw an error.
 *
 * @param str - The string to capitalize.
 * @returns {string} The input string with its first character converted to uppercase.
 *
 * @example
 * capitalizeFirst("hello");    // "Hello"
 * capitalizeFirst("world");    // "World"
 * capitalizeFirst("test case"); // "Test case"
 */
export const capitalizeFirst = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1);
};

/**
 * Checks if an object has no enumerable properties of its own.
 *
 * This function uses a `for...in` loop and returns `true` if the object has
 * no enumerable properties, or `false` if it has at least one property.
 *
 * @param obj - The object to check for emptiness.
 * @returns {boolean} `true` if the object is empty (has no enumerable properties), otherwise `false`.
 *
 * @example
 * isEmpty({});           // true
 * isEmpty({ a: 1 });     // false
 * isEmpty([]);           // true (arrays with no elements)
 * isEmpty([1, 2, 3]);    // false
 *
 * Note: This checks **all enumerable properties**, including inherited ones.
 * To check only own properties, add a `hasOwnProperty` check in the loop.
 */
export const isEmptyObject = (obj: any): boolean => {
  for (const _ in obj) return false;
  return true;
};

/**
 * Converts an object's keys, values, or entries to an array with strong TypeScript typing.
 *
 * @template T - The type of the object to convert.
 * @param obj - The object whose keys, values, or entries will be extracted.
 * @param method - The array conversion method: `"keys"`, `"values"`, or `"entries"`.
 *   - `"keys"` returns an array of the object's keys (`string[]`).
 *   - `"values"` returns an array of the object's values (`T[keyof T][]`).
 *   - `"entries"` returns an array of [key, value] pairs (`[string, T[keyof T]][]`).
 *
 * @returns
 * - If `"keys"`: `string[]`
 * - If `"values"`: `T[keyof T][]`
 * - If `"entries"`: `[string, T[keyof T]][]`
 *
 * @example
 * const user = { name: "Talha", age: 28 };
 * ToArray(user, "keys");    // ["name", "age"]
 * ToArray(user, "values");  // ["Talha", 28]
 * ToArray(user, "entries"); // [["name", "Talha"], ["age", 28]]
 *
 * This function is a type-safe wrapper around Object.keys, Object.values, and Object.entries.
 */
export function ToArray<T extends Record<string, any>>(
  obj: T,
  method: "keys"
): Array<string>;
export function ToArray<T extends Record<string, any>>(
  obj: T,
  method: "entries"
): Array<[string, T[keyof T]]>;
export function ToArray<T extends Record<string, any>>(
  obj: T,
  method: "values"
): Array<T[keyof T]>;
export function ToArray<T extends Record<string, any>>(
  obj: T,
  method: "keys" | "entries" | "values"
): Array<string> | Array<[string, T[keyof T]]> | Array<T[keyof T]> {
  return Object[method](obj) as
    | Array<string>
    | Array<[string, T[keyof T]]>
    | Array<T[keyof T]>;
}

/**
 * Attempts to intelligently parse a string into the most likely JavaScript primitive value.
 *
 * Handles "null", "undefined", "true", "false" as their actual JS types.
 * Converts numeric strings to numbers.
 * Parses valid JSON strings (objects or arrays).
 * Returns the original string if it cannot be converted.
 *
 * @param value - The string to parse.
 * @returns {any} The parsed value as null, undefined, boolean, number, object, array, or string.
 *
 * @example
 * smartParse("true");        // true (boolean)
 * smartParse("123.4");       // 123.4 (number)
 * smartParse("null");        // null
 * smartParse('{"a":1}');     // { a: 1 }
 * smartParse("[1,2,3]");     // [1, 2, 3]
 * smartParse("hello");       // "hello" (string)
 */
const smartParse = (): any => {
  const valueMap: Record<string, any> = {
    null: null,
    undefined: undefined,
    true: true,
    false: false,
  };

  return (value: string): any => {
    if (typeof value === "string" && value.toLowerCase() in valueMap) {
      return valueMap[value.toLowerCase()];
    }

    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      return numberValue;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };
};
export const createSmartParser = smartParse();

/**
 * Sanitizes and transforms query/filter parameter objects by removing empty values,
 * handling type conversions, and supporting nested structures.
 *
 * Main features:
 * - Removes properties with empty strings, null, or undefined values.
 * - Optionally converts string values to boolean, number, null, array, or object (using `transformStringIntoValues`).
 * - Recursively sanitizes nested objects and arrays.
 * - Allows merging the sanitized result with an existing query object (`currentQuery`).
 * - Removes keys listed in `keysToDelete`.
 * - Excludes specific keys from removal via `keysExcludeFromFilter`.
 *
 * @param params - The configuration object.
 * @param params.query - The query/filter object to sanitize.
 * @param params.currentQuery - The existing query object to merge with (default: `{}`).
 * @param params.enableStringConversion - Whether to convert string values to primitives/types (default: `false`).
 * @param params.keysToDelete - Keys to explicitly remove from the result (default: `[]`).
 * @param params.keysExcludeFromFilter - Keys to always keep, even if empty/null (default: `[QueryEnums.page]`).
 * @returns {Record<string, any>} The sanitized, cleaned, and optionally type-converted query object.
 *
 * @example
 * // Removes empty/null values and trims strings:
 * sanitizeParams({
 *   query: { q: "", active: "true", count: "10", nested: { foo: "" } },
 *   enableStringConversion: true
 * });
 * // Returns: { active: true, count: 10 }
 *
 * @example
 * // Removes specified keys:
 * sanitizeParams({
 *   query: { page: 1, search: "abc", temp: "toDelete" },
 *   keysToDelete: ["temp"]
 * });
 * // Returns: { page: 1, search: "abc" }
 */

export const sanitizeParams = ({
  query,
  enableStringConversion = false,
  currentQuery = {},
  keysToDelete = [],
  keysExcludeFromFilter = ["page"],
}: {
  query: Record<string, any>;
  currentQuery?: Record<string, any>;
  enableStringConversion?: boolean;
  keysToDelete?: string[];
  keysExcludeFromFilter?: string[];
}): Record<string, any> => {
  const sanitizedQuery = { ...currentQuery };

  const hasKeysToDelete = keysToDelete.length > 0;

  Object.keys(query).forEach((key) => {
    let value = query[key];

    if (typeof value === "string" && value.trim() === "") {
      delete sanitizedQuery[key];
      return;
    }
    if (value == null) {
      delete sanitizedQuery[key];
    } else {
      if (enableStringConversion && typeof value === "string") {
        value = createSmartParser(value);
      }

      if (Array.isArray(value)) {
        sanitizedQuery[key] = value.map((item) =>
          typeof item === "object"
            ? sanitizeParams({
                query: item,
                keysToDelete,
                keysExcludeFromFilter,
                enableStringConversion,
              })
            : item
        );
      } else if (typeof value === "object") {
        const nestedObj = sanitizeParams({
          query: value,
          currentQuery: sanitizedQuery[key],
          enableStringConversion,
          keysToDelete,
          keysExcludeFromFilter,
        });
        if (Object.keys(nestedObj).length > 0) {
          sanitizedQuery[key] = nestedObj;
        }
      } else {
        if (hasKeysToDelete && keysToDelete.includes(key)) {
          delete sanitizedQuery[key];
        } else {
          sanitizedQuery[key] =
            typeof value === "string" ? value.trim() : value;
        }
      }
    }
  });

  return sanitizedQuery;
};

/**
 * Converts an array of strings or numbers to a comma-separated string.
 *
 * @param array - The array to convert.
 * @returns {string} The array elements joined as a comma-separated string.
 *
 * @example
 * arrayToString(["a", "b", "c"]); // "a,b,c"
 * arrayToString([1, 2, 3]);       // "1,2,3"
 */
export const arrayToString = (array: string[] | number[]): string =>
  array.toString();

/**
 * Splits a string into an array using a specified separator.
 *
 * If the input string is empty or falsy, returns an empty array.
 *
 * @param string - The string to split.
 * @param separator - The delimiter to split the string (default is ",").
 * @returns {string[]} The resulting array of substrings.
 *
 * @example
 * stringToArray("a,b,c");           // ["a", "b", "c"]
 * stringToArray("1-2-3", "-");      // ["1", "2", "3"]
 * stringToArray("");                // []
 */
export const stringToArray = (string: string, separator = ","): string[] => {
  if (!string) return [];
  return string.split(separator);
};

