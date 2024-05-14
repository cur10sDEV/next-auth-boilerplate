import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Header from "./Header";
import LinkButton from "./LinkButton";
import Social from "./Social";

interface ICardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  buttonLabel: string;
  buttonHref: string;
  showSocial?: boolean;
}

const CardWrapper = ({
  children,
  buttonHref,
  buttonLabel,
  headerLabel,
  showSocial,
}: ICardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header heading="🔐 Auth" label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <LinkButton label={buttonLabel} href={buttonHref} />
      </CardFooter>
    </Card>
  );
};
export default CardWrapper;
