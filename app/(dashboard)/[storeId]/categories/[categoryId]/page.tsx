import { db } from '@/lib/prismadb';
import CategoryForm from './CategoryForm';

type Props = {
  params: { categoryId: string; storeId: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default Page;
