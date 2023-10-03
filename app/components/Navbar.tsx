import { auth, UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { MainNav } from '@/components/MainNav';
import { db } from '@/lib/prismadb';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { StoreSwitcher } from '@/components/StoreSwitcher';

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
    <div data-testid='navbar' className='border-b'>
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
