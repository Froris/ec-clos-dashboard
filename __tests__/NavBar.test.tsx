import { fireEvent, render, screen } from '@testing-library/react';
import { MainNav } from '@/components/MainNav';
import React from 'react';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { createMockRouter } from '../lib/utils';
import { NextRouter } from 'next/router';
import { Navbar } from '../app/components/Navbar';

jest.mock('../lib/prismadb', () => ({
  db: {
    store: {
      findMany: jest.fn().mockReturnValue([
        {
          id: 'test-store-123',
          name: `Test Store - 1231444`,
          userId: '1231444',
          billboards: [
            {
              id: 'billboard-id-1',
              storeId: 'test-store-123',
              label: `Billboard 1 - 1231444`,
              isMain: true,
              isActive: true,
              imageUrl: 'https://example.com/image1.jpg',
              cloudinaryImageId: 'example-img-1',
            },
            {
              id: 'billboard-id-2',
              storeId: 'test-store-123',
              label: `Billboard 2 - 1231444`,
              isMain: false,
              isActive: true,
              imageUrl: 'https://example.com/image2.jpg',
              cloudinaryImageId: 'example-img-2',
            },
          ],
          categories: [
            {
              id: 'mock-category-id',
              storeId: 'test-store-123',
              billboardId: 'billboard-id-2',
              name: 'Shoes',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          products: [
            {
              id: 'mock-product-id-1',
              name: 'Brown shoes',
              price: 19.99,
              isFeatured: true,
              isArchived: false,
              storeId: 'test-store-123',
              categoryId: 'mock-category-id',
              sizeId: 'mock-size-id-1',
              colorId: 'mock-color-id-1',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          sizes: [
            {
              id: 'mock-color-id-1',
              storeId: 'test-store-123',
              name: 'Brown',
              value: '#964B00',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          colors: [
            {
              id: 'mock-size-id-1',
              storeId: 'test-store-123',
              name: 'Medium',
              value: 'M',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ]),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({ storeId: 'test-store-123' }),
  usePathname: jest.fn().mockReturnValue('/test-store-123'),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@clerk/nextjs', () => ({
  UserButton: jest
    .fn()
    .mockReturnValue(<button data-testid='user-profile-button'></button>),
  auth: jest.fn(() => ({ userId: '123' })),
}));

describe('[NAVBAR] Rendering', () => {
  it('Should render <Navbar />', async () => {
    const Result = await Navbar();
    render(Result);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('Should render <Navbar /> controls', async () => {
    const Result = await Navbar();
    render(Result);

    expect(screen.getByTestId('nav-controls')).toBeInTheDocument();
    expect(screen.getByTestId('user-profile-button')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle theme' }));
  });
});

describe('[MAIN NAV] Rendering', () => {
  it('Should render <MainNav />', () => {
    render(<MainNav />);

    expect(screen.getByTestId('main-nav')).toBeInTheDocument();
  });

  it('Should render <MainNav /> links', () => {
    render(<MainNav />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
  });
});

describe('[MAIN NAV] Behavior', () => {
  it('Should redirect to "Products" category after clicking on the <Link />', async () => {
    const router = createMockRouter({});

    render(
      <RouterContext.Provider value={createMockRouter(router) as NextRouter}>
        <MainNav />
      </RouterContext.Provider>
    );

    const linkBtn = screen.getByRole('link', { name: 'Products' });
    fireEvent.click(linkBtn);

    expect(router.push).toBeCalledTimes(1);
    expect(router.push).toBeCalledWith(
      '/test-store-123/products',
      '/test-store-123/products',
      { locale: undefined, scroll: true, shallow: undefined }
    );
  });
});
