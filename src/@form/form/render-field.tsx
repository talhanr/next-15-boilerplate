import { FormField } from "../types";
import { combineClasses } from "../utils/utils";
import { renderField } from "../utils";

export const RenderField = ({ field, containerClass, label }: FormField) => {
  const containerClasses = combineClasses("", containerClass);
  const labelClasses = combineClasses("", label?.className);

  return (
    <div className={`${containerClasses}`}>
      {label && (
        <label htmlFor={label.htmlFor} className={`${labelClasses}`}>
          {label?.text}
        </label>
      )}
      {renderField({ field, containerClass, label })}
    </div>
  );
};
