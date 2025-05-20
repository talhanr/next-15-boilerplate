import { formEventEmitter } from "../../../utils/event-emitter";
import { useCallback, useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface Options {
  label: string;
  value: string;
}

export const DropDownFieldItems = ({
  field,
}: {
  field: ControllerRenderProps<FieldValues, string>;
}) => {
  const [data, setData] = useState({
    label: "",
    value: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Options[]>([
    { label: "item 1", value: "item1" },
    { label: "item 1", value: "item1" },
  ]);

  const handleItemSelect = useCallback((item: Options) => {
    setData(item);
    field.onChange(item.value);
  }, []);

  const handleDropDownToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const unsubscribe = formEventEmitter.on(
      field.name,
      (options: Options[]) => {
        console.log("am here", options);
        setOptions(options);
      }
    );

    return unsubscribe;
  }, [field.name]);
  
  console.log("field", field);
  

  return (
    <div className="">
      <button type="button" onClick={handleDropDownToggle}>
        <label>{data.label || "Select City"}</label>
      </button>
      {isOpen && (
        <ul className="">
          {options.map((item, idx) => (
            <li key={idx} onClick={() => handleItemSelect(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
