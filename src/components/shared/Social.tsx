"use client";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const oAuthSignIn = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center gap-x-2 w-full">
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => oAuthSignIn("google")}
      >
        <FcGoogle className="size-6" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => oAuthSignIn("github")}
      >
        <FaGithub className="size-6" />
      </Button>
    </div>
  );
};
export default Social;
