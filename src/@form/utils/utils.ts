import { ErrorType } from "../types/helper";

export const combineClasses = (
  defaultClasses: string,
  className?: string
): string => {
  if (!className) return defaultClasses;

  const defaultSet = new Set(defaultClasses.split(" "));
  const customSet = new Set(className.split(" "));

  [...customSet].forEach((customClass) => {
    if (customClass.startsWith("!!")) {
      defaultSet.delete(customClass.slice(2));
      customSet.delete(customClass);
    }
  });

  [...defaultSet].forEach((defaultClass) => {
    const baseClass = defaultClass.split("-")[0];
    [...customSet].forEach((customClass) => {
      if (customClass.startsWith(baseClass)) {
        defaultSet.delete(defaultClass);
      }
    });
  });

  return [...defaultSet, ...customSet].join(" ");
};

export const isEmpty = (obj: any) => {
  for (const _ in obj) return false;
  return true;
};

export const getError = (errors: any, name: string): ErrorType | undefined => {
  if (isEmpty(errors)) return;
  if (!name.includes(".")) return errors?.[name];

  const errorKeys = name.split(".");
  if (!(errorKeys[0] in errors)) {
    return;
  }
  let result: any = errors[errorKeys[0]];
  errorKeys.shift();
  for (const key of errorKeys) {
    result = result?.[key];
  }
  return result;
};
