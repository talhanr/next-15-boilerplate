import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputFieldProps } from "@/@form/types";
import { combineClasses } from "@/@form/utils";
import { Error } from "../../form/error";

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ props }, ref) => {
    const { control } = useFormContext();

    const inputClasses = combineClasses(
      "border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none w-full p-2.5",
      props.className
    );

    return (
      <Controller
        name={props.name}
        control={control}
        defaultValue={props.defaultValue ?? ""}
        render={({ field, formState: { errors } }) => {
          return (
            <div>
              <input {...field} {...props} ref={ref} className={inputClasses} />
              <Error errors={errors} name={props?.name} />
            </div>
          );
        }}
      />
    );
  }
);
