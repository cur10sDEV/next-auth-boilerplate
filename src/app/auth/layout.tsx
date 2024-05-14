const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient">
      {children}
    </div>
  );
};
export default AuthLayout;
