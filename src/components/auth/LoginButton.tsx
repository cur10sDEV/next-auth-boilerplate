"use client";

import { useRouter } from "next/navigation";

interface ILoginButtonProps {
  children: React.ReactNode;
  mode?: "redirect" | "modal";
  asChild?: boolean;
}

const LoginButton = ({ children, mode, asChild }: ILoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return null;
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};
export default LoginButton;
