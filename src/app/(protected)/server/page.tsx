import UserInfo from "@/components/shared/UserInfo";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();

  return <UserInfo user={user} label="Server Component Example" />;
};
export default ServerPage;
