import { useCurrentRole } from "@/hooks/useCurrentRole";
import { IChildrenProps } from "@/types/generalTypes";
import { UserRole } from "@prisma/client";
import FormError from "../shared/FormError";

interface IRoleGateProps extends IChildrenProps {
  allowedRole: UserRole;
}
const RoleGate = ({ children, allowedRole }: IRoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You don not have permission to view this content! ✋" />
    );
  }

  return <>{children}</>;
};
export default RoleGate;
