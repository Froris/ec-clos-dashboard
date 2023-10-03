import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import { GraphData } from '@/actions/getGraphRevenue';

type Props = {
  data: GraphData[];
};

export function OverviewChart({ data }: Props) {
  return (
    <Card data-testid='overview-chart' className='col-span-4'>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className='pl-2'>
        <Overview data={data} />
      </CardContent>
    </Card>
  );
}
