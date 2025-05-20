import { ButtonFieldProps } from "@/@form/types";

export const ButtonField = ({ props, text }: ButtonFieldProps) => {
  return <button {...props}>{text}</button>;
};
