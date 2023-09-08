import { ProductsClient } from './ProductsClient';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import { ProductColumn } from '@/(dashboard)/[storeId]/products/Columns';
import { db } from '@/lib/prismadb';

type Props = {
  params: { storeId: string };
};

const Page: React.FC<Props> = async ({ params }) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default Page;
