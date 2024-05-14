"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

const Social = () => {
  return (
    <div className="flex items-center gap-x-2 w-full">
      <Button variant="outline" size="lg" className="w-full" onClick={() => {}}>
        <FcGoogle className="size-6" />
      </Button>
      <Button variant="outline" size="lg" className="w-full" onClick={() => {}}>
        <FaGithub className="size-6" />
      </Button>
    </div>
  );
};
export default Social;
