import yup from "yup";
import { ValidatorType } from "./types";


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
