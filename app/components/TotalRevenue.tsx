import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { formatter } from '../../lib/utils';

type Props = {
  data: number;
};

export function TotalRevenue({ data }: Props) {
  return (
    <Card data-testid='total-revenue'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
        <DollarSign className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{formatter.format(data)}</div>
      </CardContent>
    </Card>
  );
}
