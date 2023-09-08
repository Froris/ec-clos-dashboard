import { db } from '@/lib/prismadb';
import BillboardForm from './BillboardForm';

type Props = {
  params: { billboardId: string };
};
const Page: React.FC<Props> = async ({ params }) => {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default Page;
