import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/prismadb';

export async function POST(req: Request) {
  // Преобразовываем в текст или в buffer для того, чтобы
  // верификация (webhooks.constructEvent) приняла объект event.
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  // Проверка на то, что ивент сгенерирован stripe.
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook event verification: ${error.message}`, {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  // Обновляем созданные в checkout ордер, добавляя адресс и статус оплаты
  // В include возвращаем список обновлённых (оплаченых) товаров
  if (event.type === 'checkout.session.completed') {
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || '',
      },
      include: {
        orderItems: true,
      },
    });

    // Забираем айдишники товаров, с помощью которых ниже проставим isArchived
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await db.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
