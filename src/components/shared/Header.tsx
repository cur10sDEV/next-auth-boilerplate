import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
interface IHeaderProps {
  label: string;
  heading: string;
}

const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

const Header = ({ heading, label }: IHeaderProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-y-4 w-full">
      <h1 className={cn("text-3xl font-semibold", poppins.className)}>
        {heading}
      </h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
