"use client";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logoutUser } from "@/server/actions/authAction";

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = async () => {
    await logoutUser();
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <Button type="submit" onClick={onClick} variant="ghost">
        Sign out
      </Button>
    </div>
  );
};
export default SettingsPage;
