import Navbar from "@/components/protected/Navbar";
import { IChildrenProps } from "@/types/generalTypes";
import { SessionProvider } from "next-auth/react";

const ProtectedLayout = ({ children }: IChildrenProps) => {
  return (
    <SessionProvider>
      <div className="flex flex-col justify-center items-center gap-y-10 h-full w-full">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
