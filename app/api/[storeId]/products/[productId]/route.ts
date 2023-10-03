import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/prismadb';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      images,
      imagesToRemove,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
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

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map(
                (image: { url: string; public_id: string }) => image
              ),
            ],
          },
        },
      },
    });

    let allImagesDeleted = false;

    if (imagesToRemove.length > 0) {
      const result = await cloudinary.api.delete_resources(imagesToRemove);

      for (const imageName in result.deleted) {
        if (
          result.deleted.hasOwnProperty(imageName) &&
          result.deleted[imageName] !== 'deleted'
        ) {
          allImagesDeleted = false;
          break;
        }
      }
    }

    if (imagesToRemove.length > 0 && !allImagesDeleted) {
      return NextResponse.json(
        {
          type: 'warning',
          message:
            'Some pictures you previously uploaded were not deleted from the Cloudinary.\n' +
            'Manual deletion of images from Cloudinary is required!',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
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

    const product = await db.product.delete({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });

    const publicIds: string[] = product.images.map(
      (image) => image.cloudinaryImageId
    );

    let allImagesDeleted = false;

    const result = await cloudinary.api.delete_resources(publicIds);

    for (const imageName in result.deleted) {
      if (
        result.deleted.hasOwnProperty(imageName) &&
        result.deleted[imageName] !== 'deleted'
      ) {
        allImagesDeleted = false;
        break;
      }
    }

    if (!allImagesDeleted) {
      return NextResponse.json(
        {
          type: 'warning',
          message:
            'Some pictures you previously uploaded were not deleted from the Cloudinary.\n' +
            'Manual deletion of images from Cloudinary is required!',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        type: 'success',
        message:
          'The product and associated images have been successfully removed!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
