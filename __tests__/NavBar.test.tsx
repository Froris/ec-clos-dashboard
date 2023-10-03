import { render, screen } from '@testing-library/react';
import { MainNav } from '@/components/MainNav';
import { Navbar } from '../app/components/Navbar';

jest.mock('../lib/prismadb', () => ({
  db: {
    store: {
      findMany: jest.fn().mockReturnValue([
        {
          name: `Test Store - 1231444`,
          userId: 1231444,
          billboards: {
            create: [
              {
                label: `Billboard 1 - 1231444`,
                isMain: true,
                image: {
                  create: [
                    {
                      url: 'https://example.com/image1.jpg',
                    },
                    {
                      url: 'https://example.com/image2.jpg',
                    },
                  ],
                },
              },
              {
                label: `Billboard 2 - 1231444`,
                isMain: false,
                image: {
                  create: [
                    {
                      url: 'https://example.com/image3.jpg',
                    },
                  ],
                },
              },
            ],
          },
          categories: {
            create: [
              {
                name: `Category 1 - 1231444`,
              },
              {
                name: `Category 2 - 1231444`,
              },
            ],
          },
          products: {
            create: [
              {
                name: `Product 1 - 1231444`,
                price: 19.99,
                isFeatured: true,
                size: {
                  create: {
                    name: 'Medium',
                    value: 'M',
                  },
                },
                color: {
                  create: {
                    name: 'Red',
                    value: '#FF0000',
                  },
                },
                images: {
                  create: [
                    {
                      url: 'https://example.com/product1.jpg',
                    },
                  ],
                },
              },
              {
                name: `Product 2 - 1231444`,
                price: 29.99,
                isFeatured: false,
                size: {
                  create: {
                    name: 'Large',
                    value: 'L',
                  },
                },
                color: {
                  create: {
                    name: 'Blue',
                    value: '#0000FF',
                  },
                },
                images: {
                  create: [
                    {
                      url: 'https://example.com/product2.jpg',
                    },
                  ],
                },
              },
            ],
          },
          sizes: {
            create: [
              {
                name: 'Small',
                value: 'S',
              },
              {
                name: 'Extra Large',
                value: 'XL',
              },
            ],
          },
          colors: {
            create: [
              {
                name: 'Green',
                value: '#00FF00',
              },
            ],
          },
        },
      ]),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue('123'),
  usePathname: jest.fn().mockReturnValue('/some-route'),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@clerk/nextjs', () => ({
  UserButton: jest.fn().mockReturnValue(<button></button>),
  auth: jest.fn(() => ({ userId: '123' })),
}));

describe('[NAVBAR] Rendering', () => {
  it('Should render <Navbar />', async () => {
    const Result = await Navbar();
    render(Result);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});

describe('[MAIN NAV] Rendering', () => {
  it('Should render <MainNav />', () => {
    render(<MainNav />);

    expect(screen.getByTestId('main-nav')).toBeInTheDocument();
  });
});
