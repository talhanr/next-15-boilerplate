import { Field, FormField } from "@/@form";

export const loginFormFields: FormField[] = [
  {
    label: { htmlFor: "firstName", text: "First Name" },
    field: {
      type: Field.Input,
      props: {
        id: "firstName",
        name: "firstName",
        className: "text",
      },
    },
  },
  {
    label: { htmlFor: "lastName", text: "Last Name" },
    field: {
      type: Field.Input,
      props: {
        id: "lastName",
        name: "lastName",
        className: "text",
      },
    },
  },
  {
    field: {
      type: Field.DropDown,
      props: {
        name: "cities",
      },
    },
  },
];
