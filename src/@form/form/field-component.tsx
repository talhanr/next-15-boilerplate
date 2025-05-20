import { FieldComponents, FieldProps, FieldType } from "../types";
import { ButtonField, DivField, InputField } from "../fields";
import { JSX } from "react";
import { DropDownField } from "../fields/DropDownField/dropdown-field";

const fieldComponents: FieldComponents = {
  Input: InputField,
  Button: ButtonField,
  Div: DivField,
  DropDown: DropDownField,
};
export const FieldComponent = <T extends FieldProps>(
  type: FieldType,
  props: T
): JSX.Element => {
  const Component = fieldComponents[type] as React.FC<Record<string, any>>;
  return <Component {...props} />;
};
