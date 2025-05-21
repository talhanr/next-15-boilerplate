import { TFunction } from "i18next";
import { MultipleReferenceValidatorProps, ValidatorType } from "./types";
import * as yup from "yup";
import { formatStrings, getValidationMethod } from "./utils";

/**
 * Creates a Yup validation schema for a required, non-nullable value of the specified type,
 * using i18n translation for error messages.
 *
 * - The schema is non-nullable and required.
 * - Uses the provided `translate` function for custom validation messages.
 *
 * @template T - The value type for validation.
 * @param translate - The translation function (from i18n, e.g., i18next).
 * @param type - The type of value to validate ("string", "number", "array", "email", "date", "boolean").
 * @returns {yup.Schema<T>} A Yup schema that enforces the value to be present, non-nullable, and type-checked.
 *
 * @example
 * const schema = requiredValidator(t, "string");
 * schema.validateSync(""); // Throws with "This field is required."
 * schema.validateSync(123); // Throws with "Invalid format."
 */
export const requiredValidator = <T>(
  translate: TFunction,
  type: ValidatorType
): yup.Schema<T> => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .nonNullable()
    .required(translate("validationMessages.required"))
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule that checks if a value is required (non-null, non-empty)
 * and sets a custom error message using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @returns {Yup.TestOptions<T>} - A Yup validation rule with required and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   name: requiredNullValue(translate, 'string'),
 * });
 */
export const requiredNullValue = <T>(
  translate: TFunction,
  type: ValidatorType
): any => {
  const validatorType = getValidationMethod<T>(type);

  return validatorType
    .test(
      "non-empty",
      translate("validationMessages.required"),
      function (value) {
        const isValueNull =
          value === undefined || value === null || value === "";
        if (isValueNull) {
          return this.createError({
            path: this.path,
            message: translate("validationMessages.required"),
          });
        }
        return true;
      }
    )
    .nullable()
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule for a required field, using the provided translation function
 * to localize the type error message.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @returns {Yup.Schema<T>} - A Yup validation schema with a required type error.
 *
 * @example
 * const schema = Yup.object({
 *   email: complexRequiredValidator(translate, 'string'),
 * });
 */
export const complexRequiredValidator = <T>(
  translate: TFunction,
  type: ValidatorType
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.typeError(translate("validationMessages.required"));
};

/**
 * Creates a Yup validation rule that marks a field as required based on multiple reference field conditions.
 * The error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of conditions specifying when the field is required.
 *        Each condition must specify a field name and the expected value to trigger the requirement.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces conditional required validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   dependentField: requiredWithReferenceValidator(translate, 'string', [
 *     { fieldName: 'status', expectedValue: 'active' },
 *     { fieldName: 'role', expectedValue: 'admin' },
 *   ]),
 * });
 */
export const requiredWithReferenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "required-with-reference",
      translate(`validationMessages.required`),
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
              message: translate(`validationMessages.required`),
            });
          }
        }
        return true;
      }
    )
    .nullable()
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule to check if a field's value meets a minimum length requirement,
 * with localized error messages using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum length required for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the minimum length.
 *
 * @example
 * const schema = Yup.object({
 *   username: minValidator(translate, 'string', 6),
 * });
 */
export const minValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  minLength: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min",
      translate("validationMessages.string.min", { minLength }),
      (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        return String(value).length >= minLength;
      }
    )
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule to check if a field's value does not exceed a maximum length,
 * with localized error messages using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} maxLength - The maximum allowed length for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the maximum length.
 *
 * @example
 * const schema = Yup.object({
 *   username: maxValidator(translate, 'string', 20),
 * });
 */
export const maxValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  maxLength: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "max",
      translate("validationMessages.string.max", { maxLength }),
      (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        return String(value).length <= maxLength;
      }
    )
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule to check if a field's value length falls within a minimum and maximum range,
 * with localized error messages using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum allowed length for the field value.
 * @param {number} maxLength - The maximum allowed length for the field value.
 * @returns {Yup.Schema<T>} - A Yup validation schema that enforces the min-max length.
 *
 * @example
 * const schema = Yup.object({
 *   password: minMaxValidator(translate, 'string', 8, 20),
 * });
 */
export const minMaxValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  minLength: number,
  maxLength: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "max",
      translate("validationMessages.string.minMax", { minLength, maxLength }),
      (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        const validatorLength = String(value).length;
        return validatorLength >= minLength && validatorLength <= maxLength;
      }
    )
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule that checks if a field's value meets a minimum length,
 * matches a referenced field, and is required—using the provided translation function
 * for all error messages.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {number} minLength - The minimum length required for the field value.
 * @param {string} ref - The name of the referenced field to match.
 * @returns {Yup.Schema<T>} - A Yup validation schema with min length, reference match, required, and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   password: yup.string().required(),
 *   confirmPassword: minWithReferenceValidator(translate, 'string', 8, 'password'),
 * });
 */
export const minWithReferenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  minLength: number,
  ref: string
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min",
      translate("validationMessages.string.min", { minLength }),
      (value) => {
        if (value === undefined || value === null) {
          return false;
        }
        return String(value).length >= minLength;
      }
    )
    .oneOf([yup.ref(ref)], translate("validationMessages.mixed.oneOf"))
    .required(translate("validationMessages.required"))
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule to ensure a field's value matches the value of a referenced field.
 * All error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string, number).
 * @param {string} ref - The name of the referenced field to match.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing reference match, required, and type error checks.
 *
 * @example
 * const schema = Yup.object({
 *   password: yup.string().required(),
 *   confirmPassword: referenceValidator(translate, 'string', 'password'),
 * });
 */
export const referenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  ref: string
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .oneOf([yup.ref(ref)], translate("validationMessages.mixed.oneOf"))
    .required(translate("validationMessages.required"))
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule to ensure a boolean field's value is `true`.
 * All error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., boolean).
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing that the value must be true and handling type errors.
 *
 * @example
 * const schema = Yup.object({
 *   agreeToTerms: booleanValidator(translate, 'boolean'),
 * });
 */
export const booleanValidator = <T>(
  translate: TFunction,
  type: ValidatorType
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "is-true",
      translate("validationMessages.required"),
      (value) => value === true
    )
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule that checks if a numeric value is within a given min/max range
 * when all referenced field conditions are met. All error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {number} minValue - The minimum allowed numeric value.
 * @param {number} maxValue - The maximum allowed numeric value.
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of field/value conditions to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional min/max validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   age: minMaxValueNumberWithReferenceValidator(
 *     translate,
 *     'number',
 *     18,
 *     65,
 *     [{ fieldName: 'status', expectedValue: 'employed' }]
 *   ),
 * });
 */
export const minMaxValueNumberWithReferenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  minValue: number,
  maxValue: number,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min-value-with-reference",
      translate(`validationMessages.number.minMaxValue`, {
        minValue,
        maxValue,
      }),
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
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule that checks if a numeric value is greater than or equal to a minimum value,
 * but only when all referenced field conditions are met. All error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {number} minValue - The minimum allowed numeric value.
 * @param {MultipleReferenceValidatorProps[]} conditions - An array of field/value conditions to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional min value validation with type checks.
 *
 * @example
 * const schema = Yup.object({
 *   age: minValueNumberWithReferenceValidator(
 *     translate,
 *     'number',
 *     18,
 *     [{ fieldName: 'isStudent', expectedValue: false }]
 *   ),
 * });
 */
export const minValueNumberWithReferenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  minValue: number,
  conditions: MultipleReferenceValidatorProps[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .test(
      "min-value-with-reference",
      translate(`validationMessages.number.minValue`, {
        minValue,
      }),
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
    .typeError(translate("validationMessages.invalid_format"));
};

/**
 * Creates a Yup validation rule that checks if a field's value is greater than the value of a referenced field,
 * only when all provided field conditions are met. Error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., number).
 * @param {string} ref - The name of the referenced field whose value must be less than the current value.
 * @param {{ fieldName: string; expectedValue: string | boolean }[]} conditions - Array of field/value pairs to trigger the validator.
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing conditional greater-than comparison.
 *
 * @example
 * const schema = Yup.object({
 *   minAge: yup.number().required(),
 *   maxAge: greaterThenValueWithReferenceValidator(
 *     translate,
 *     'number',
 *     'minAge',
 *     [{ fieldName: 'isActive', expectedValue: true }]
 *   ),
 * });
 */
export const greaterThenValueWithReferenceValidator = <T>(
  translate: TFunction,
  type: ValidatorType,
  ref: string,
  conditions: { fieldName: string; expectedValue: string | boolean }[]
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.test(
    "is-greater-than-ref",
    translate("validationMessages.value.greaterThen", { ref }),
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
 * and does not exceed a specified maximum, only when all provided field conditions are met.
 * All error messages are localized using the provided translation function.
 *
 * @template T - The numeric type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
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
 *     translate,
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
  translate: TFunction,
  type: ValidatorType,
  ref: string,
  conditions: { fieldName: string; expectedValue: string | boolean }[],
  maxLimit: number
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.test(
    "is-greater-than-ref",
    translate("validationMessages.value.greaterThen", { ref }),
    function (value) {
      const shouldValidate = conditions.every((condition) => {
        const fieldValue = this.parent[condition.fieldName];
        return fieldValue === condition.expectedValue;
      });

      if (shouldValidate) {
        const refValue = this.parent[ref];

        if (value <= refValue) {
          return this.createError({
            message: translate("validationMessages.value.greaterThen", { ref }),
          });
        }

        if (maxLimit && value > maxLimit) {
          return this.createError({
            message: translate("validationMessages.number.maxValue", {
              maxValue: maxLimit,
            }),
          });
        }
      }

      return true;
    }
  );
};

/**
 * Creates a Yup validation rule to ensure a field is a required date in the "YYYY-MM-DD" format,
 * and is a valid date. All error messages are localized using the provided translation function.
 *
 * @template T - The type for the validation method.
 * @param {TFunction} translate - The translation function to localize error messages.
 * @param {ValidatorType} type - The type of validator to use (e.g., string).
 * @returns {Yup.Schema<T>} - A Yup validation schema enforcing required, format, and validity checks for dates.
 *
 * @example
 * const schema = Yup.object({
 *   birthDate: requiredDateValidator(translate, 'string'),
 * });
 */
export const requiredDateValidator = <T>(
  translate: TFunction,
  type: ValidatorType
) => {
  const invalidFormatValidationMessage = formatStrings(
    translate(`validationMessages.invalid_date_format`),
    ["YYYY-MM-DD"]
  );
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
