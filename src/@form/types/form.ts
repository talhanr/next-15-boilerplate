import { FieldValues, SubmitHandler, UseFormReturn } from "react-hook-form";
import { AnyObjectSchema, InferType, ISchema } from "yup";
import { Field } from "../enums";
import React, { JSX } from "react";
import {
  ButtonFieldProps,
  DivFieldProps,
  DropDownFieldProps,
  FieldProps,
  InputFieldProps,
  LabelProps,
} from "./field";

export interface FormField {
  containerClass?: string;
  label?: LabelProps | null;
  field: FieldProps;
}
export interface FieldComponents {
  [Field.Input]: React.FC<InputFieldProps>;
  [Field.Button]: React.FC<ButtonFieldProps>;
  [Field.Div]: React.FC<DivFieldProps>;
  [Field.DropDown]: React.FC<DropDownFieldProps>;
}

export interface HookFieldProps {
  [key: string]: JSX.Element;
}

export interface FormProps<T extends FieldValues> {
  formFields: FormField[];
  methods: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  shouldRenderFormFields?: boolean;
  render?: (props: HookFieldProps) => React.ReactNode;
  className?: string;
}

export type MemoizeFormProps<T extends FieldValues = FieldValues> = {
  formFields: FormField[];
  methods: UseFormReturn<T, any, T>;
  onSubmit: SubmitHandler<T>;
  className?: string;
};

export interface HandleFormSubmit<T extends ISchema<any, any, any>> {
  (data: InferType<T>): void;
}

export type DynamicFormMethods<T extends AnyObjectSchema | undefined> =
  T extends AnyObjectSchema
    ? UseFormReturn<InferType<T>>
    : UseFormReturn<FieldValues>;
