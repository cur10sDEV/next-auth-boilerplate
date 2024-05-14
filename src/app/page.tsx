import LoginButton from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

export default function HomePage() {
  return (
    <main className="h-screen flex items-center justify-center bg-gradient">
      <div className="flex flex-col gap-8 text-center text-white">
        <h1 className={cn("text-7xl drop-shadow-md", poppins.className)}>
          🔐 Auth
        </h1>
        <p className="text-2xl">A simple authentication service</p>
        <div>
          <LoginButton>
            <Button variant="secondary" size="xl">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
