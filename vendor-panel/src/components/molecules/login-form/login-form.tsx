import { Button, Input } from "@medusajs/ui";
import { useForm } from "react-hook-form";

import { useSignInWithEmailPass } from "../../../hooks/api/auth";

const LoginForm = () => {
  const form = useForm();
  const { mutateAsync } = useSignInWithEmailPass();

  const onSubmit = async (data: any) => {
    await mutateAsync(data);
  };

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <div className="flex flex-col gap-y-4">
            <Input
              {...form.register("email")}
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <Button className="mt-8 w-full">Login</Button>
        </form>
      </div>
    </div>
  );
};

export { LoginForm };
