"use client";

import { authErrors } from "@/constants/errors";
import { loginSchema } from "@/schemas/authSchema";
import { loginUser } from "@/server/actions/authAction";
import { typeLoginSchema } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const initialState: typeLoginSchema = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const searchParams = useSearchParams();
  const urlErrorCode = searchParams.get("error");
  const urlError = (urlErrorCode && authErrors[urlErrorCode]) || "";

  const loginForm = useForm<typeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialState,
  });

  const onSubmit = async (values: typeLoginSchema) => {
    startTransition(() => {
      loginUser(values).then((data) => {
        if (!data?.success) {
          setSuccess({ success: false, message: "" });
          setError({
            error: true,
            message: data?.message || "Login failed!",
          });
        } else {
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
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
      headerLabel="Welcome Back!"
      buttonLabel="Don't have an account?"
      buttonHref="/auth/register"
      showSocial
    >
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={loginForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two factor (2FA) Code</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="123456"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                      <Button
                        size="sm"
                        variant="link"
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {(error.error || urlError) && (
            <FormError message={error.message || urlError} />
          )}
          {success.success && <FormSuccess message={success.message} />}
          <Button disabled={isPending} className="w-full">
            {isPending ? (
              <BeatLoader color="white" size="15px" />
            ) : showTwoFactor ? (
              "Confirm"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default LoginForm;
