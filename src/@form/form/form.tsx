import { FieldValues, FormProvider } from "react-hook-form";
import React from "react";
import { RenderField } from "./render-field";
import { FormProps, HookFieldProps, MemoizeFormProps } from "@/@form/types";

const BaseForm = <T extends FieldValues = FieldValues>({
  formFields,
  onSubmit,
  methods,
  render,
  shouldRenderFormFields = true,
  className,
}: FormProps<T>) => {
  console.log('render');
  
  return (
    <FormProvider {...methods}>
      <form className={className} onSubmit={methods.handleSubmit(onSubmit)}>
        {shouldRenderFormFields &&
          formFields.map((fieldData, index) => (
            <RenderField key={index} {...fieldData} />
          ))}
        {render &&
          render(
            formFields.reduce((acc, fieldData, index): HookFieldProps => {
              const fieldId = fieldData?.field?.props?.id || "";
              acc[fieldId] = <RenderField key={index} {...fieldData} />;
              return acc;
            }, {} as HookFieldProps)
          )}
      </form>
    </FormProvider>
  );
};

const MemoizedBaseForm = React.memo(BaseForm) as typeof BaseForm;

export const MemoizeForm = <T extends FieldValues = FieldValues>({
  formFields,
  onSubmit,
  className,
  methods,
}: MemoizeFormProps<T>) => {
  return (
    <MemoizedBaseForm<T>
      formFields={formFields}
      methods={methods}
      onSubmit={onSubmit}
      className={className}
    />
  );
};

export const Form = React.memo(MemoizeForm) as typeof MemoizeForm;
