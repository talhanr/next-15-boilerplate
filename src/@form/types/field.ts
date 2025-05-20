import { Field } from "../enums";
import { FormField } from "./form";
import {
  NativeButtonProps,
  NativeDivProps,
  NativeDropDownProps,
  NativeInputProps,
  RequiredNameProps,
  RequireKeys,
} from "./helper";

export interface BaseFieldProps<T extends Field> {
  type: T;
}

export interface LabelProps {
  text: string;
  htmlFor: string;
  className?: string;
}

export interface InputFieldProps extends BaseFieldProps<Field.Input> {
  props: RequireKeys<NativeInputProps, RequiredNameProps>;
}
export interface ButtonFieldProps extends BaseFieldProps<Field.Button> {
  props: NativeButtonProps;
  text: string;
}
export interface DivFieldProps extends BaseFieldProps<Field.Div> {
  props?: NativeDivProps;
  children?: FormField[];
}
export interface DropDownFieldProps extends BaseFieldProps<Field.DropDown> {
  props: RequireKeys<NativeDropDownProps, RequiredNameProps>;
}

export type FieldType = Field.Input | Field.Button | Field.Div | Field.DropDown;
export type FieldProps =
  | InputFieldProps
  | ButtonFieldProps
  | DivFieldProps
  | DropDownFieldProps;
