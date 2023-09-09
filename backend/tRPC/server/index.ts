const stripe = require("stripe")("sk_test_51NoOjBHiRPX37kVcixgRmFIu9C9FDyHZxInfNdzgTq8vgHUbFR5YLPLbfBTrv7jNAoQnsLMZfoVpbcPhx4txicC900252HXgYl");
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';

import db from './db';

async function getUserIdByEmail(email: string) {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true
    }
  });

  if (!user) {
    // Handle the case where the user with the specified email does not exist
    throw new Error(`User with email ${email} not found.`);
  }

  return user.id;
}

const appRouter = router({
  //*  ------ USER ---------

  createUser: publicProcedure.input(
    z.object({
      email: z.string()
    })
  ).mutation(async ({ input }) => {
    await db.user.create({
      data: {
        email: input.email,
        lng: 0, //temp needs migration to reflect schema changes
        lat: 0, //temp needs migration to reflect schema changes
      }
    })
  }),
  //*  ------ LISTINGS ---------

  allListings: publicProcedure.query(async () => {
    return await db.listing.findMany({
      include: {
        image: {
          select: {
            path: true
          }
        }
      }
    });
  }),
  usersListings: publicProcedure.input(z.string()).query(async ({ input }) => {
    const res = await db.listing.findMany({
      where: {
        user: {
          email: input
        }
      },
      include: {
        image: {
          select: {
            path: true
          }
        }
      }
    }
    )
    return res
  }),
  uploadListing: publicProcedure.input(
    z.object({
      email: z.string(),
      price: z.number(),
      images: z.array(z.string()),
      description: z.string().optional(),
    })
  )
    .mutation(async ({ input }) => {
      try {
        await db.listing.create({
          data: {
            user: {
              connect: {
                id: await getUserIdByEmail(input.email) // not optimal :/ could use context but does similar thing by looks of it?
              }
            },
            price: input.price,
            description: input?.description,
            image: {
              create: input.images.map((filename) => ({ path: filename })),
            },
          },
        })
        return 'Success'
      } catch (e) {
        console.error(e)
      }
    }),
  updateListing: publicProcedure
    .input(z.object(
      {
        id: z.number(),
        description: z.string().optional(),
        price: z.number().optional(),
        sold: z.boolean().optional(),
      }
    ))
    .mutation(async ({ input }) => {
      try {
        await db.listing.update({
          where: {
            id: input.id
          },
          data: { // undefined does nothing to the field
            description: input?.description,
            price: input?.price,
            sold: input?.sold,
          }
        })
        return 'Successfully deleted listing'
      } catch (e) {
        console.error(e)
      }
    }),
  deleteListing: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      await db.listing.delete({
        where: {
          id: input
        }
      })
      return 'Successfully deleted listing'
    } catch (e) {
      console.error(e)
    }
  }),
  //*  ------ IMAGE ---------

  deleteImageFromListing: publicProcedure.input(z.number()).mutation(async ({ input }) => {
    try {
      await db.image.delete({
        where: {
          id: input
        }
      })
      return 'Successfully deleted image'
    } catch (e) {
      console.error(e)
    }
  }),
  //*  ------ OFFER ---------

  allOffers: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const userId = await getUserIdByEmail(input)
      return await db.offer.findMany({
        where: {
          userId
        },
        include: {
          listing: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }
      )
    } catch (e) {
      console.error(e)
    }
  }),
  createOffer: publicProcedure.input(
    z.object({
      email: z.string(),
      listingId: z.number(),
      offer: z.number()
    })
  ).mutation(async ({ input }) => {
    try {
      await db.offer.create({
        data: {
          userId: await getUserIdByEmail(input.email),
          listingId: input.listingId,
          price: input.offer,
        }
      })
    } catch (e) {
      console.error(e)
    }
  }),
  acceptOffer: publicProcedure.input(
    z.object({
      offerId: z.number(),
      accepted: z.boolean()
    })
  ).mutation(async ({ input }) => {
    try {
      await db.offer.update({
        where: {
          id: input.offerId,
        },
        data: {
          accepted: input.accepted
        }
      })
      return console.log(input.accepted)
    } catch (e) {
      console.error(e)
    }
  }),
  //*  ------ ORDER ---------

  createIntent: publicProcedure
    .input(z.number())
    .output(
      z.object({
        secret: z.string(),
      })
    ).query(async ({ input }) => {
      const intent = await stripe.paymentIntents.create({
        amount: input,
        currency: 'gbp'
      });
      return { secret: intent.client_secret }
    }),
  createOrder: publicProcedure.input(
    z.object({
      email: z.string(),
      listingId: z.number(),
    })
  ).mutation(async ({ input }) => {
    try {
      await db.order.create({
        data: {
          userId: await getUserIdByEmail(input.email),
          listingId: input.listingId,
        }
      })
    } catch (e) {
      console.error(e)
    }
  })
});



const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

export type AppRouter = typeof appRouter;

