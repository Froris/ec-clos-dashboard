import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/prismadb';
import { v2 as cloudinary } from 'cloudinary';
import { Billboard } from '@prisma/client';

export type BillboardFormData = Billboard & { imagesToRemove: string[] };

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  const isMain = !!searchParams.get('isMain') || false;

  try {
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
        isMain,
        isActive: true,
      },
    });

    return NextResponse.json(billboards);
  } catch (err) {
    console.log('[BILLBOARDS_GET]', err);
  }

  return new NextResponse('Internal error', { status: 500 });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      label,
      imageUrl,
      cloudinaryImageId,
      isMain,
      isActive,
      imagesToRemove,
    }: BillboardFormData = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!imageUrl || (imageUrl && !cloudinaryImageId)) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const billboard = await db.billboard.create({
      data: {
        label,
        isMain,
        isActive,
        imageUrl,
        cloudinaryImageId,
        storeId: params.storeId,
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

    return NextResponse.json(billboard);
  } catch (err) {
    console.log('[BILLBOARDS_POST]', err);
  }

  return new NextResponse('Internal error', { status: 500 });
}
