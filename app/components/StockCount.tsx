import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

type Props = {
  data: number;
};

export function StockCount({ data }: Props) {
  return (
    <Card data-testid='stock-count'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Products In Stock</CardTitle>
        <Package className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{data}</div>
      </CardContent>
    </Card>
  );
}
