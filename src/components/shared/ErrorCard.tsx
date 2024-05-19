import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import CardWrapper from "./CardWrapper";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      buttonLabel="Back to login"
      buttonHref="/auth/login"
    >
      <div className="flex justify-center items-center text-destructive w-full">
        <ExclamationTriangleIcon className="size-8" />
      </div>
    </CardWrapper>
  );
};
export default ErrorCard;
