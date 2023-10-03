export const mockStoreObject = {
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
};
