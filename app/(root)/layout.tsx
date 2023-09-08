import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prismadb';

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/signIn');
  }

  const store = await db.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <div>{children}</div>;
};

export default Layout;
