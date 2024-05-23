"use client";
import UserInfo from "@/components/shared/UserInfo";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo user={user} label="Client Component Example" />;
};
export default ClientPage;
