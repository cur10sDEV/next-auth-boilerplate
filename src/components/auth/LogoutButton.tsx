import { logoutUser } from "@/server/actions/authAction";
import { IChildrenProps } from "@/types/generalTypes";

const LogoutButton = ({ children }: IChildrenProps) => {
  const onClick = async () => {
    await logoutUser();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
export default LogoutButton;
