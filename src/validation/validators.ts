import { TFunction } from "i18next";
import * as yup from "yup";
import { ValidatorType } from "./types";
import { formatStrings, getValidationMethod } from "./utils";

interface MultipleReferenceValidatorProps {
  fieldName: string;
  expectedValue: string | boolean;
}

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
// export const requiredValidator = <T>(
//   translate: TFunction,
//   type: ValidatorType
// ): yup.Schema<T> => {
//   const validatorType = getValidationMethod<T>(type);
//   return validatorType
//     .nonNullable()
//     .required(translate("validationMessages.required"))
//     .typeError(translate("validationMessages.invalid_format"));
// };

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
export const requiredValidator = <T>(
  type: ValidatorType
): yup.Schema<T> => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType
    .nonNullable()
    .required("This field is required.")
    .typeError("Invalid format.");
};


export const requiredNullValue = <T>(
  translate: TFunction,
  type: ValidatorType
) => {
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

export const complexRequiredValidator = <T>(
  translate: TFunction,
  type: ValidatorType
) => {
  const validatorType = getValidationMethod<T>(type);
  return validatorType.typeError(translate("validationMessages.required"));
};

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
