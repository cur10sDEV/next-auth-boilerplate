import { ExtendedUser } from "@/types/next-auth";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

interface IUserInfoProps {
  user?: ExtendedUser;
  label: string;
}

const UserInfo = ({ user, label }: IUserInfoProps) => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-lg font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate text-sm p-1 px-2 rounded-md font-mono bg-slate-100 max-w-[200px]">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate text-sm p-1 px-2 rounded-md font-mono bg-slate-100 max-w-[200px]">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate text-sm p-1 px-2 rounded-md font-mono bg-slate-100 max-w-[200px]">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate text-sm p-1 px-2 rounded-md font-mono bg-slate-100 max-w-[200px]">
            {user?.role}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserInfo;
