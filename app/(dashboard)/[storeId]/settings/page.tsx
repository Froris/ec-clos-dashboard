import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prismadb';
import SettingsForm from '@/(dashboard)/[storeId]/settings/SettingsForm';

type Props = {
  params: {
    storeId: string;
  };
};

const Page: React.FC<Props> = async ({ params }) => {
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
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default Page;
