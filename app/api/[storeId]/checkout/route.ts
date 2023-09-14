import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { db } from '@/lib/prismadb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  // IMPORTANT! It's not advisable to accept product information objects from the client (except for the products IDs).
  // It's better to retrieve all product information based on their IDs from the database. This way, we
  // prevent potential user manipulation on the client side.
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // We create specialized objects that contain information about the price, quantity, and currency in
  // the required Stripe format. Alternatively, you can create products in the Stripe admin and retrieve
  // all this information using product IDs.
  //
  // Using Stripe: https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout#create-product-prices-upfront
  // Manually: https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items-price_data
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await db.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  // Creating a checkout session. Here, the user will see what's displayed on the Stripe payment page.
  // Additionally, we send back a link to this session in the response, which the user can use to access the payment page.
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
