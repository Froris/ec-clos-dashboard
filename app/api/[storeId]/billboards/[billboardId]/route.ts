import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/prismadb';
import { v2 as cloudinary } from 'cloudinary';
import { BillboardFormData } from '@/api/[storeId]/billboards/route';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      billboardId: string;
    };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
    }

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
        isActive: true,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
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
      return new NextResponse('Image URL is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const billboard = await db.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        isMain,
        isActive,
        imageUrl,
        cloudinaryImageId,
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
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      billboardId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 });
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

    const billboard = await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
      select: {
        cloudinaryImageId: true,
      },
    });

    let allImagesDeleted = false;

    const result = await cloudinary.api.delete_resources([
      billboard.cloudinaryImageId,
    ]);

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
          'The billboard and associated images have been successfully removed!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
