import { CheckCircledIcon } from "@radix-ui/react-icons";

interface IFormSuccessProps {
  message?: string;
}

const FormSuccess = ({ message }: IFormSuccessProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="flex gap-2 items-center bg-emerald-500/15 text-emerald-500 p-2 px-4 rounded-md text-sm">
      <CheckCircledIcon className="size-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
