import { useLogin } from "../../hooks/useLogin";
import { Form } from "@/@form";

export function LoginForm() {
  const { handleLogin, methods, formFields } = useLogin();

  return (
    <Form formFields={formFields} onSubmit={handleLogin} methods={methods} />
  );
}
