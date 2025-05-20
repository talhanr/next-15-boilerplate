import { DivFieldProps } from "@/@form/types";
import { RenderField } from "@/@form/form/render-field";

export const DivField = ({ props, children }: DivFieldProps) => {
  return (
    <div {...props}>
      {children?.map((fieldData, index) => (
        <RenderField key={index} {...fieldData} />
      ))}
    </div>
  );
};
