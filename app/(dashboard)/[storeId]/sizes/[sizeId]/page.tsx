import { db } from '@/lib/prismadb';
import SizeForm from './SizeForm';

type Props = {
  params: { sizeId: string };
};
const Page: React.FC<Props> = async ({ params }) => {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default Page;
