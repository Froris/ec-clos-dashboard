import { auth, UserButton } from '@clerk/nextjs';
import { MainNav } from '@/components/MainNav';
import { StoreSwitcher } from '@/components/StoreSwitcher';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prismadb';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/signIn');
  }

  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <StoreSwitcher items={stores} />
        <MainNav className='px-6' />
        <div className='ml-auto flex items-center space-x-4'>
          <DarkModeToggle />
          <UserButton afterSignOutUrl='/' />
        </div>
      </div>
    </div>
  );
};
