import CardWrapper from "../shared/CardWrapper";

const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      buttonLabel="Don't have an account?"
      buttonHref="/auth/register"
      showSocial
    >
      Login Form
    </CardWrapper>
  );
};
export default LoginForm;
