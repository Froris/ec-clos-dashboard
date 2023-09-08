import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prismadb';
import { Navbar } from '@/components/Navbar';

type Props = {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
};

const Layout = async ({ children, params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/signIn');
  }

  const store = await db.store.findUnique({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
