import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Heading } from '@/components/Heading';
import { TotalRevenue } from '@/components/TotalRevenue';
import { SalesCount } from '@/components/SalesCount';
import { StockCount } from '@/components/StockCount';

describe('[OVERVIEW PAGE] Rendering', () => {
  it('should render <Heading /> with correct title and description', async () => {
    render(<Heading title='Dashboard' description='Test Dashboard' />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Test Dashboard')).toBeInTheDocument();
  });

  it('should render <TotalRevenue /> with correct data', () => {
    render(<TotalRevenue data={310} />);

    expect(screen.getByTestId('total-revenue')).toBeInTheDocument();
    expect(screen.getByText('$310.00')).toBeInTheDocument();
  });

  it('should render <SalesCount /> with correct data', () => {
    render(<SalesCount data={10} />);

    expect(screen.getByTestId('sales-count')).toBeInTheDocument();
    expect(screen.getByText('+10')).toBeInTheDocument();
  });

  it('should render <StockCount /> with correct data', () => {
    render(<StockCount data={2} />);

    expect(screen.getByTestId('stock-count')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
