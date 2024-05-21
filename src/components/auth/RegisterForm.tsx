"use client";

import { registerSchema } from "@/schemas/authSchema";
import { registerUser } from "@/server/actions/authAction";
import { typeRegisterSchema } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
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

const initialState: typeRegisterSchema = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });

  const loginForm = useForm<typeRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: initialState,
  });

  const onSubmit = async (values: typeRegisterSchema) => {
    startTransition(() => {
      registerUser(values).then((data) => {
        if (!data?.success) {
          setSuccess({ success: false, message: "" });
          setError({
            error: true,
            message: data?.message || "Login failed!",
          });
        } else {
          setSuccess({
            success: true,
            message: data?.message || "Login Successfull!",
          });
          setError({ error: false, message: "" });
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an Account"
      buttonLabel="Already have an account?"
      buttonHref="/auth/login"
      showSocial
    >
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={loginForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="John Doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={loginForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
            {isPending ? <BeatLoader color="white" size="15" /> : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default RegisterForm;
