"use client";

import { newPasswordSchema } from "@/schemas/authSchema";
import { newPassword } from "@/server/actions/authAction";
import { typeNewPassword } from "@/types/authTypes";
import { zodResolver } from "@hookform/resolvers/zod";
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

const initialState: typeNewPassword = {
  password: "",
  confirmPassword: "",
};

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });

  const newPasswordForm = useForm<typeNewPassword>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: initialState,
  });

  const onSubmit = async (values: typeNewPassword) => {
    startTransition(() => {
      if (!token) {
        setError({ error: true, message: "Invalid reset link!" });
        setSuccess({ success: false, message: "" });
        return;
      }

      newPassword(values, token).then((data) => {
        if (!data?.success) {
          setSuccess({ success: false, message: "" });
          setError({
            error: true,
            message: data?.message || "Password updation failed!",
          });
        } else {
          setSuccess({
            success: true,
            message: data?.message || "Password updated!",
          });
          setError({ error: false, message: "" });
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter new Password"
      buttonLabel="Back to login"
      buttonHref="/auth/login"
    >
      <Form {...newPasswordForm}>
        <form
          onSubmit={newPasswordForm.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={newPasswordForm.control}
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
              control={newPasswordForm.control}
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
            {isPending ? (
              <BeatLoader color="white" size="15px" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default NewPasswordForm;
