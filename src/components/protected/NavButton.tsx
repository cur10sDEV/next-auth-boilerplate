import Link from "next/link";
import { Button } from "../ui/button";

interface INavButtonProps {
  pathname: string;
  link: string;
  label: string;
}

const NavButton = ({ pathname, link, label }: INavButtonProps) => {
  return (
    <Button asChild variant={pathname === link ? "default" : "outline"}>
      <Link href={link}>{label}</Link>
    </Button>
  );
};
export default NavButton;
