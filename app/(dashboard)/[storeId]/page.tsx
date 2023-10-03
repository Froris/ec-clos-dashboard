import { Separator } from '@/components/ui/separator';
import { getTotalRevenue } from '@/actions/getTotalRevenue';
import { getGraphRevenue } from '@/actions/getGraphRevenue';
import { getSalesCount } from '@/actions/getSalesCount';
import { getStockCount } from '@/actions/getStockCount';
import { Heading } from '@/components/Heading';
import { TotalRevenue } from '@/components/TotalRevenue';
import { SalesCount } from '@/components/SalesCount';
import { StockCount } from '@/components/StockCount';
import { OverviewChart } from '@/components/OverviewChart';

type Props = {
  params: {
    storeId: string;
  };
};

const DashboardPage: React.FC<Props> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <Heading title='Dashboard' description='Overview of your store' />
        <Separator />
        <div className='grid gap-4 grid-cols-3'>
          <TotalRevenue data={totalRevenue} />
          <SalesCount data={salesCount} />
          <StockCount data={stockCount} />
        </div>
        <OverviewChart data={graphRevenue} />
      </div>
    </div>
  );
};

export default DashboardPage;
