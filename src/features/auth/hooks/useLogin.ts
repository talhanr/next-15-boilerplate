import { HandleFormSubmit } from "@/@form/types";
import {
  HandleSubmitType,
  LoginFormValues,
  loginSchema,
} from "../validations/login-schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback, useMemo } from "react";
import { loginFormFields } from "../formFields/login-form-fields";
import { loginThunk } from "../redux/loginThunk";
import { useAppDispatch } from "@/lib/redux/hooks";

export function useLogin() {
  const dispatch = useAppDispatch();

  const methods = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin: HandleFormSubmit<HandleSubmitType> = useCallback(
    (data) => {
      console.log("Submitted:", data);
      dispatch(loginThunk(data));
    },
    []
  );

  const formFields = useMemo(() => loginFormFields, []);

  return { handleLogin, methods, formFields };
}
