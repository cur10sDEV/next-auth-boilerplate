import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/nextAuth/auth";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      <h1>{JSON.stringify(session)}</h1>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
};
export default SettingsPage;
