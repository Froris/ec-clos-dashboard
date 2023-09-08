type Props = {
  children: React.ReactNode;
};
const AuthLayout = ({ children }: Props) => {
  return (
    <div className='flex h-full justify-center items-center'>{children}</div>
  );
};

export default AuthLayout;
