'use client';

import { columns, OrderColumn } from '@/(dashboard)/[storeId]/orders/Columns';
import { Heading } from '@/components/Heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/DataTable';

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description='Manage orders for your store'
      />
      <Separator />
      <DataTable searchKey='products' columns={columns} data={data} />
    </>
  );
};
