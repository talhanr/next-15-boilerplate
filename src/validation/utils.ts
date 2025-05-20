import yup from "yup";
import { ValidatorType } from "./types";
import { TFunction } from "i18next";

/**
 * Returns a Yup validation schema based on the provided `ValidatorType`.
 *
 * This utility function maps a simple type string to its corresponding Yup schema,
 * allowing for easy dynamic validation schema generation.
 *
 * Supported types:
 * - "string"  → Yup string schema
 * - "number"  → Yup number schema
 * - "array"   → Yup array schema
 * - "email"   → Yup string schema with email validation
 * - "date"    → Yup date schema
 * - "boolean" → Yup boolean schema
 *
 * @template T - The expected type for the schema.
 * @param type - The validation type (one of: "string", "number", "array", "email", "date", "boolean").
 * @returns {yup.Schema<T>} The corresponding Yup validation schema.
 * @throws {Error} If the type is not supported.
 *
 * @example
 * const stringSchema = getValidationMethod<string>("string");
 * stringSchema.validateSync("test"); // "test"
 *
 * const numberSchema = getValidationMethod<number>("number");
 * numberSchema.validateSync(42); // 42
 *
 * const emailSchema = getValidationMethod<string>("email");
 * emailSchema.validateSync("user@email.com"); // "user@email.com"
 *
 * // Throws error:
 * getValidationMethod("unknown");
 */
export const getValidationMethod = <T>(type: ValidatorType): yup.Schema<T> => {
  switch (type) {
    case "string":
      return yup.string() as unknown as yup.Schema<T>;
    case "number":
      return yup.number() as unknown as yup.Schema<T>;
    case "array":
      return yup.array() as unknown as yup.Schema<T>;
    case "email":
      return yup.string().email() as unknown as yup.Schema<T>;
    case "date":
      return yup.date() as unknown as yup.Schema<T>;
    case "boolean":
      return yup.boolean() as unknown as yup.Schema<T>;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

/**
 * Formats a string by replacing numbered placeholders with translated values.
 *
 * For each value in `replaceValues`, the function finds `{index}` in the string and
 * replaces it with the translation for `form_fields.{value}` (using the `translate` function),
 * falling back to the value itself if no translation is found.
 *
 * @param str - The string containing numbered placeholders like "{0}", "{1}", etc.
 * @param replaceValues - An array of values to insert into the placeholders. Each value will be translated.
 * @returns {string} The formatted string with placeholders replaced by translated values.
 *
 * @example
 * // Assuming translate("form_fields.username") => "Username"
 * formatStrings("Please enter your {0}.", ["username"]);
 * // Returns: "Please enter your Username."
 */
export function formatStrings(str: string, replaceValues: string[]): string {
  let formattedString = str;
  for (const [index, value] of replaceValues.entries()) {
    formattedString = formattedString.replace(
      `{${index}}`,
      //   translate(`form_fields.${value}`, { defaultValue: value })
      ""
    );
  }
  return formattedString;
}

/**
 * Sets validation errors for form fields with translated messages.
 *
 * For each error entry, if the value is falsy, clears the error for that field.
 * Otherwise, sets the error message by translating the main error type and
 * formatting it with any extra values provided after a colon (`:`).
 *
 * @param setError - The function to set form field errors (e.g., from React Hook Form).
 * @param errors - An object mapping field keys to error strings (e.g., "required", "minLength:3").
 * @param translate - The translation function (typically from i18n).
 *
 * @example
 * // Example errors: { username: "required", password: "minLength:8" }
 * setErrors(setError, errors, t);
 *
 * // For "minLength:8", will call:
 * // formatStrings(translate("validationMessages.minLength"), ["8"])
 */
export function setErrors(
  setError: Function,
  errors: object,
  translate: TFunction
): void {
  if (!errors) return;
  for (const [key, value] of Object.entries(errors)) {
    if (key && !value) setError(key, { message: null });
    else
      setError(key, {
        message: formatStrings(
          translate(`validationMessages.${value?.split(":")[0]}`),
          value?.split(":").slice(1)
        ),
      });
  }
}

/**
 * Translates an error key into a localized error message using the provided translation function.
 *
 * If no error key is given (i.e., `error` is `null` or empty), an empty string is returned.
 * Otherwise, the error key is passed to the translation function, prefixed with
 * "validationMessages." to map to your i18n validation messages.
 *
 * @param error - The error key as a string, or `null` if no error.
 * @param translate - The translation function (typically from an i18n library like i18next).
 * @returns {string} The translated error message, or an empty string if no error key is given.
 *
 * @example
 * setErrorMessage("required", t)
 * // If t("validationMessages.required") => "This field is required."
 * // Returns: "This field is required."
 *
 * setErrorMessage(null, t)
 * // Returns: ""
 */
export function setErrorMessage(
  error: string | null,
  translate: TFunction
): string {
  if (!error) return "";
  return translate(`validationMessages.${error}`);
}
