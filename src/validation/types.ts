export type ValidatorType =
  | "string"
  | "number"
  | "email"
  | "array"
  | "date"
  | "boolean";

export interface MultipleReferenceValidatorProps {
  fieldName: string;
  expectedValue: string | boolean;
}
