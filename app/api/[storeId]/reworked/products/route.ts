import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/prismadb';
import path from 'path';
import { writeFile } from 'fs';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const data = await req.formData();
    const images = data.getAll('images') as File[];
    const { name, price, categoryId, colorId, sizeId, isFeatured, isArchived } =
      Object.fromEntries(data.entries()) as { [key: string]: any };

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    // Working with images --------------------------------------------------------------
    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    const imagesUrl: Array<{
      url: string;
    }> = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const pathToSave = path.resolve(
          process.cwd(),
          `public/products`,
          image.name
        );

        return new Promise<{ url: string }>((resolve, reject) => {
          writeFile(pathToSave, buffer, (err) => {
            if (err) {
              console.error(
                `[REWORKED PRODUCTS_POST] IMG SAVE: ERROR - ${err}`
              );
              reject(err);
            } else {
              console.log('[REWORKED PRODUCTS_POST] IMG SAVE: SUCCESS');
              resolve({ url: pathToSave });
            }
          });
        });
      })
    );
    // ----------------------------------------------------------------------------------

    // TODO rework by replacing it with a helper validation function

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const product = await db.product.create({
      data: {
        name,
        price: parseFloat(price).toFixed(2),
        isFeatured: isFeatured === 'true',
        isArchived: isArchived === 'true',
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...imagesUrl],
          },
        },
      },
    });

    return NextResponse.json('Product created!');
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
