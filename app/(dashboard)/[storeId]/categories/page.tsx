import { CategoryClient } from './CategoryClient';
import { db } from '@/lib/prismadb';
import { format } from 'date-fns';
import { CategoryColumn } from '@/(dashboard)/[storeId]/categories/Columns';

type Props = {
  params: { storeId: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Page;
