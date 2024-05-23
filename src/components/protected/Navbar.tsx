"use client";

import { usePathname } from "next/navigation";
import UserButton from "../auth/UserButton";
import NavButton from "./NavButton";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm w-[600px]">
      <div className="flex gap-x-2">
        <NavButton label="Settings" link="/settings" pathname={pathname} />
        <NavButton label="Server" link="/server" pathname={pathname} />
        <NavButton label="Client" link="/client" pathname={pathname} />
        <NavButton label="Admin" link="/admin" pathname={pathname} />
      </div>
      <UserButton />
    </nav>
  );
};
export default Navbar;
