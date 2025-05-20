import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { DropDownFieldProps } from "@/@form/types";
import { combineClasses } from "@/@form/utils";
import { Error } from "../../form/error";
import { DropDownFieldItems } from "./DropDownFieldItems/dropdown-field-items";

export const DropDownField = React.memo(({ props }: DropDownFieldProps) => {
  const { control } = useFormContext();

  const dropdownClasses = combineClasses("", props?.className);

  return (
    <Controller
      name={props.name}
      control={control}
      render={({ field, formState: { errors } }) => {
        return (
          <div className={dropdownClasses}>
            <DropDownFieldItems field={field} />
            <Error errors={errors} name={props?.name} />
          </div>
        );
      }}
    />
  );
});
