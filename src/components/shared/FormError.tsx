import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface IFormErrorProps {
  message?: string;
}

const FormError = ({ message }: IFormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="flex gap-2 items-center bg-destructive/15 text-destructive p-2 px-4 rounded-md text-sm">
      <ExclamationTriangleIcon className="size-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
