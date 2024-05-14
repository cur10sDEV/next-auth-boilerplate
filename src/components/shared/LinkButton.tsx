import Link from "next/link";
import { Button } from "../ui/button";

interface ILinkButtonProps {
  label: string;
  href: string;
}

const LinkButton = ({ label, href }: ILinkButtonProps) => {
  return (
    <Button
      className="font-normal text-sm w-full"
      variant="link"
      size="sm"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
export default LinkButton;
