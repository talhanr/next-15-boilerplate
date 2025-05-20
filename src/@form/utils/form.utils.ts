import { FieldComponent } from "@/@form/form/field-component";
import { Field } from "@/@form/enums";
import { FieldType, FormField } from "@/@form/types";

function isFieldType(type: any): type is FieldType {
  return [Field.Input, Field.Button, Field.Div, Field.DropDown].includes(type);
}
export const renderField = (fieldData: FormField) => {
  if (!fieldData?.field || !isFieldType(fieldData?.field?.type)) {
    return null;
  }

  return FieldComponent(fieldData?.field?.type, fieldData?.field);
};
