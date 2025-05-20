import { FieldErrors, FieldValues } from "react-hook-form";
import { getError } from "../utils";

export const Error = ({
  errors,
  name,
}: {
  errors: FieldErrors<FieldValues>;
  name: string;
}) => {
  const error = getError(errors, name)?.message;
  return (
    error && <span className="text-red-500 text-sm mt-1 block">{error}</span>
  );
};
