import * as yup from "yup";
import { MultipleReferenceValidatorProps, ValidatorType } from "./types";
import { getValidationMethod } from "./utils";

/**
 * Creates a Yup validation schema for a required, non-nullable value of the specified type,
 * using default (hard-coded) English error messages.
 *
 * - The schema is non-nullable and required.
 * - Uses default messages for "required" and "type error".
 *
 * @template T - The value type for validation.
 * @param type - The type of value to validate ("string", "number", "array", "email", "date", "boolean").
 * @returns {yup.Schema<T>} A Yup schema that enforces the value to be present, non-nullable, and type-checked.
 *
 * @example
 * const schema = requiredValidator("string");
 * schema.validateSync(""); // Throws with "This field is required."
 * schema.validateSync(123); // Throws with "Invalid format."
 */
export const requiredValidator = <T>(type: ValidatorType): yup.Schema<T> => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .nonNullable()
    .required("This field is required.")
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule that checks if a value is required (non-null, non-empty)
 * and sets a fixed custom error message in English.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @returns {Yup.TestOptions<T>} - A Yup validation rule with required and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   name: requiredNullValue('string'),
 * });
 */
export const requiredNullValue = <T>(type: ValidatorType): any => {
  const validatorType = getValidationMethod<T>(type);

  return validatorType
    .test("non-empty", "This field is required.", function (value) {
      const isValueNull = value === undefined || value === null || value === "";
      if (isValueNull) {
        return this.createError({
          path: this.path,
          message: "This field is required.",
        });
      }
      return true;
    })
    .nullable()
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule for a required field, using a fixed English error message.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @returns {Yup.Schema<T>} - A Yup validation schema with a required type error.
 *
 * @example
 * const schema = Yup.object({
 *   email: complexRequiredValidator('string'),
 * });
 */
export const complexRequiredValidator = <T>(type: ValidatorType): any => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.typeError("This field is required.");
};

/**
 * Creates a Yup validation rule that marks a field as required based on multiple reference field conditions.
 * Uses fixed English error messages instead of translations.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of conditions specifying when the field is required.
 *        Each condition must specify a field name and the expected value to trigger the requirement.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces conditional required validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   dependentField: requiredWithReferenceValidator('string', [
 *     { fieldName: 'status', expectedValue: 'active' },
 *     { fieldName: 'role', expectedValue: 'admin' },
 *   ]),
 * });
 */
export const requiredWithReferenceValidator = <T>(
  type: ValidatorType,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "required-with-reference",
      "This field is required.",
      function (value) {
        const isFieldRequired = conditions.every((condition) => {
          const fieldValue = this.parent[condition.fieldName];
          return fieldValue === condition.expectedValue;
        });

        if (isFieldRequired) {
          const isValueProvided =
            value !== undefined && value !== null && value !== "";
          if (!isValueProvided) {
            return this.createError({
              path: this.path,
              message: "This field is required.",
            });
          }
        }
        return true;
      }
    )
    .nullable()
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule to check if a field's value meets a minimum length requirement,
 * with fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum length required for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the minimum length.
 *
 * @example
 * const schema = Yup.object({
 *   username: minValidator('string', 6),
 * });
 */
export const minValidator = <T>(type: ValidatorType, minLength: number) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test("min", `Minimum length is ${minLength} characters.`, (value) => {
      if (value === undefined || value === null) {
        return false;
      }
      return String(value).length >= minLength;
    })
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule to check if a field's value does not exceed a maximum length,
 * using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} maxLength - The maximum allowed length for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the maximum length.
 *
 * @example
 * const schema = Yup.object({
 *   username: maxValidator('string', 20),
 * });
 */
export const maxValidator = <T>(type: ValidatorType, maxLength: number) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test("max", `Maximum length is ${maxLength} characters.`, (value) => {
      if (value === undefined || value === null) {
        return false;
      }
      return String(value).length <= maxLength;
    })
    .typeError("Invalid format.");
};
/**
 * Creates a Yup validation rule to check if a field's value length falls within a minimum and maximum range,
 * using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum allowed length for the field value.
 * @param {number} maxLength - The maximum allowed length for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the min-max length.
 *
 * @example
 * const schema = Yup.object({
 *   password: minMaxValidator('string', 8, 20),
 * });
 */
export const minMaxValidator = <T>(
  type: ValidatorType,
  minLength: number,
  maxLength: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "max",
      `Length must be between ${minLength} and ${maxLength} characters.`,
      (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        const validatorLength = String(value).length;
        return validatorLength >= minLength && validatorLength <= maxLength;
      }
    )
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule that checks if a field's value meets a minimum length,
 * matches a referenced field, and is required—using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum length required for the field value.
 * @param {string} ref - The name of the referenced field to match.
 * @returns {Yup.Schema<T>} - A Yup validation schema with min length, reference match, required, and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   password: yup.string().required(),
 *   confirmPassword: minWithReferenceValidator('string', 8, 'password'),
 * });
 */
export const minWithReferenceValidator = <T>(
  type: ValidatorType,
  minLength: number,
  ref: string
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test("min", `Minimum length is ${minLength} characters.`, (value) => {
      if (value === undefined || value === null) {
        return false;
      }
      return String(value).length >= minLength;
    })
    .oneOf([yup.ref(ref)], "Values must match.")
    .required("This field is required.")
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule to ensure a field's value matches the value of a referenced field,
 * using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {string} ref - The name of the referenced field to match.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing reference match, required, and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   password: yup.string().required(),
 *   confirmPassword: referenceValidator('string', 'password'),
 * });
 */
export const referenceValidator = <T>(type: ValidatorType, ref: string) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .oneOf([yup.ref(ref)], "Values must match.")
    .required("This field is required.")
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule to ensure a boolean field's value is `true`,
 * using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., boolean).
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing that the value must be true and handling type errors.
 *
 * @example
 * const schema = Yup.object({
 *   agreeToTerms: booleanValidator('boolean'),
 * });
 */
export const booleanValidator = <T>(type: ValidatorType) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test("is-true", "This field must be checked.", (value) => value === true)
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule that checks if a numeric value is within a given min/max range
 * when all referenced field conditions are met, using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {number} minValue - The minimum allowed numeric value.
 * @param {number} maxValue - The maximum allowed numeric value.
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of field/value conditions to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional min/max validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   age: minMaxValueNumberWithReferenceValidator(
 *     'number',
 *     18,
 *     65,
 *     [{ fieldName: 'status', expectedValue: 'employed' }]
 *   ),
 * });
 */
export const minMaxValueNumberWithReferenceValidator = <T>(
  type: ValidatorType,
  minValue: number,
  maxValue: number,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min-value-with-reference",
      `Value must be between ${minValue} and ${maxValue}.`,
      function (value) {
        const shouldValidation = conditions.every((condition) => {
          const fieldValue = this.parent[condition.fieldName];
          return fieldValue === condition.expectedValue;
        });

        if (shouldValidation) {
          const numValue = Number(value);
          return numValue >= minValue && numValue <= maxValue;
        }
        return true;
      }
    )
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule that checks if a numeric value is greater than or equal to a minimum value,
 * but only when all referenced field conditions are met, using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {number} minValue - The minimum allowed numeric value.
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of field/value conditions to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional min value validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   age: minValueNumberWithReferenceValidator(
 *     'number',
 *     18,
 *     [{ fieldName: 'isStudent', expectedValue: false }]
 *   ),
 * });
 */
export const minValueNumberWithReferenceValidator = <T>(
  type: ValidatorType,
  minValue: number,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min-value-with-reference",
      `Value must be at least ${minValue}.`,
      function (value) {
        const shouldValidation = conditions.every((condition) => {
          const fieldValue = this.parent[condition.fieldName];
          return fieldValue === condition.expectedValue;
        });

        if (shouldValidation) {
          const numValue = Number(value);
          return numValue >= minValue;
        }
        return true;
      }
    )
    .typeError("Invalid format.");
};

/**
 * Creates a Yup validation rule that checks if a field's value is greater than the value of a referenced field,
 * only when all provided field conditions are met, using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {string} ref - The name of the referenced field whose value must be less than the current value.
 * @param {{ fieldName: string; expectedValue: string | boolean }[]} conditions - Array of field/value pairs to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional greater-than comparison.
 *
 * @example
 * const schema = Yup.object({
 *   minAge: yup.number().required(),
 *   maxAge: greaterThenValueWithReferenceValidator(
 *     'number',
 *     'minAge',
 *     [{ fieldName: 'isActive', expectedValue: true }]
 *   ),
 * });
 */
export const greaterThenValueWithReferenceValidator = <T>(
  type: ValidatorType,
  ref: string,
  conditions: { fieldName: string; expectedValue: string | boolean }[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.test(
    "is-greater-than-ref",
    `Value must be greater than the value of "${ref}".`,
    function (value) {
      const shouldValidate = conditions.every((condition) => {
        const fieldValue = this.parent[condition.fieldName];
        return fieldValue === condition.expectedValue;
      });

      if (shouldValidate) {
        const refValue = this.parent[ref];
        return value > refValue;
      }

      return true;
    }
  );
};

/**
 * Creates a Yup validation rule to ensure a field's numeric value is greater than a referenced field value
 * and does not exceed a specified maximum, only when all provided field conditions are met,
 * using fixed English error messages.
 *
 * @template T - The numeric type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {string} ref - The name of the referenced field whose value must be less than the current value.
 * @param {{ fieldName: string; expectedValue: string | boolean }[]} conditions - Array of field/value pairs to trigger the validator.
 * @param {number} maxLimit - The maximum allowed value for the field.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional greater-than and max value checks.
 *
 * @example
 * const schema = Yup.object({
 *   minAmount: yup.number().required(),
 *   maxAmount: maxLimitAndgreaterThenValueWithReferenceValidator(
 *     'number',
 *     'minAmount',
 *     [{ fieldName: 'isActive', expectedValue: true }],
 *     1000
 *   ),
 * });
 */
export const maxLimitAndgreaterThenValueWithReferenceValidator = <
  T extends number
>(
  type: ValidatorType,
  ref: string,
  conditions: { fieldName: string; expectedValue: string | boolean }[],
  maxLimit: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.test(
    "is-greater-than-ref",
    `Value must be greater than the value of "${ref}".`,
    function (value) {
      const shouldValidate = conditions.every((condition) => {
        const fieldValue = this.parent[condition.fieldName];
        return fieldValue === condition.expectedValue;
      });

      if (shouldValidate) {
        const refValue = this.parent[ref];

        if (value <= refValue) {
          return this.createError({
            message: `Value must be greater than the value of "${ref}".`,
          });
        }

        if (maxLimit && value > maxLimit) {
          return this.createError({
            message: `Value must not exceed ${maxLimit}.`,
          });
        }
      }

      return true;
    }
  );
};

/**
 * Creates a Yup validation rule to ensure a field is a required date in the "YYYY-MM-DD" format,
 * and is a valid date, using fixed English error messages.
 *
 * @template T - The type for the validation method.
 * @param {ValidatorType} type - The type of validator to use (e.g., string).
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing required, format, and validity checks for dates.
 *
 * @example
 * const schema = Yup.object({
 *   birthDate: requiredDateValidator('string'),
 * });
 */
export const requiredDateValidator = <T>(type: ValidatorType) => {
  const invalidFormatValidationMessage = "Date must be in YYYY-MM-DD format.";
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .nonNullable()
    .matches(
      "^(?<year>[\\d]{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[1-2][0-9]|3[0-1])$",
      invalidFormatValidationMessage
    )
    .test("valid-date", invalidFormatValidationMessage, (value: string) => {
      if (!value) return false;
      const date = new Date(value);
      const isValidDate = !isNaN(date.getTime());
      return isValidDate && value === date.toISOString().split("T")[0];
      // max(today, `Date cannot be greater than today (${today})`);
    })
    .typeError(invalidFormatValidationMessage);
};
