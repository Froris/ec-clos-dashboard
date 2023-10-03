import { BillboardClient } from './BillboardClient';
import { db } from '@/lib/prismadb';
import { BillboardColumn } from '@/(dashboard)/[storeId]/billboards/Columns';
import { format } from 'date-fns';

type Props = {
  params: {
    storeId: string;
  };
};

const Page: React.FC<Props> = async ({ params }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default Page;
