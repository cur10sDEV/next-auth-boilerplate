"use client";

import { resetSchema } from "@/schemas/authSchema";
import { sendResetEmail } from "@/server/actions/authAction";
import { typeResetSchema } from "@/types/authTypes";
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

const initialState: typeResetSchema = {
  email: "",
};

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState({ error: false, message: "" });
  const [success, setSuccess] = useState({ success: false, message: "" });

  const resetForm = useForm<typeResetSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: initialState,
  });

  const onSubmit = async (values: typeResetSchema) => {
    startTransition(() => {
      sendResetEmail(values).then((data) => {
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
      headerLabel="Forgot your password?"
      buttonLabel="Back to login"
      buttonHref="/auth/login"
    >
      <Form {...resetForm}>
        <form onSubmit={resetForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={resetForm.control}
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
          </div>
          {error.error && <FormError message={error.message} />}
          {success.success && <FormSuccess message={success.message} />}
          <Button disabled={isPending} className="w-full">
            {isPending ? (
              <BeatLoader color="white" size="15px" />
            ) : (
              "Send reset email"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
export default ResetForm;
