'use client';
import { Heading } from '@/components/Heading';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { columns, SizeColumn } from '@/(dashboard)/[storeId]/sizes/Columns';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/DataTable';
import { ApiList } from '@/components/ApiList';

type Props = {
  data: SizeColumn[];
};

export const SizeClient: React.FC<Props> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${data.length})`}
          description='Manage sizes for your store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <PlusIcon className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='name' />
      <Heading title='API' description='API calls for Sizes' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  );
};
