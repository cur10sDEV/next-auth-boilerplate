"use client";

import { verifyUserEmail } from "@/server/actions/authAction";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import CardWrapper from "../shared/CardWrapper";
import FormError from "../shared/FormError";
import FormSuccess from "../shared/FormSuccess";

const initialState = { success: false, message: "" };

const VerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [success, setSuccess] = useState(initialState);
  const [error, setError] = useState(initialState);

  const onSubmit = useCallback(async () => {
    if (success.success || error.success) return;

    if (!token) {
      setError({
        success: true,
        message: "Invalid verification link!",
      });
      setSuccess(initialState);
      return;
    }

    const data = await verifyUserEmail(token);

    if (!data.success) {
      setError({
        success: true,
        message: data.message || "Email Verification failed!",
      });
      setSuccess(initialState);
      return;
    }

    setSuccess({ success: true, message: data.message || "Email Verified" });
    setError(initialState);
  }, [token, success.success, error.success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your email"
      buttonLabel="Back to login"
      buttonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!error.success && !success.success && <BeatLoader />}
        {error.success && <FormError message={error.message} />}
        {success.success && <FormSuccess message={success.message} />}
      </div>
    </CardWrapper>
  );
};
export default VerificationForm;
