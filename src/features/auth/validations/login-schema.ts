import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string().min(6, "Min 6 chars").required("Password required"),
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;
export type HandleSubmitType = typeof loginSchema;