"use client";

import { loginSchema } from "@/schemas/authSchema";
import { loginUser } from "@/server/actions/authAction";
import { typeLoginSchema } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import CardWrapper from "../shared/CardWrapper";
import FormError from "../shared/FormError";
import FormSuccess from "../shared/FormSuccess";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const initialState: typeLoginSchema = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });

  const loginForm = useForm<typeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialState,
  });

  const onSubmit = async (values: typeLoginSchema) => {
    startTransition(() => {
      loginUser(values).then((data) => {
        if (data.error) {
          return setError({ error: data.error, message: data.message });
        }
        return setSuccess({ success: data.success, message: data.message });
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      buttonLabel="Don't have an account?"
      buttonHref="/auth/register"
      showSocial
    >
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="johndoe@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error.error && <FormError message={error.message} />}
          {success.success && <FormSuccess message={success.message} />}
          <Button disabled={isPending} className="w-full">
            {isPending ? "..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default LoginForm;
