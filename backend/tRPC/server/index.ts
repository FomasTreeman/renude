require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_PUBLISHABLE_KEY);
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
      where: {
        sold: false
      },
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
  //*  ------ PURCHASES ---------

  createIntent: publicProcedure
    .input(z.number())
    .output(
      z.object({
        secret: z.string(),
        id: z.string(),
      })
    ).query(async ({ input }) => {
      const intent = await stripe.paymentIntents.create({
        amount: input,
        currency: 'gbp'
      });
      return { secret: intent.client_secret, id: intent.id }
    }),
  createPurchase: publicProcedure.input(
    z.object({
      email: z.string(),
      listingId: z.number(),
      paymentId: z.string(),
    })
  ).mutation(async ({ input }) => {
    try {
      const promises = []
      promises.push(db.purchase.create({
        data: {
          userId: await getUserIdByEmail(input.email),
          listingId: input.listingId,
          paymentId: input.paymentId,
        }
      }))
      promises.push(db.listing.update({
        where: {
          id: input.listingId
        },
        data: {
          sold: true,
        }
      }))
      await Promise.all(promises)
    } catch (e) {
      console.error(e)
    }
  }),
  allSold: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      return await db.purchase.findMany({
        where: {
          listing: {
            user: {
              email: input
            }
          }
        },
        include: {
          listing: {
            include: {
              image: true
            }
          },
        }
      })
    } catch (e) {
      console.error(e)
    }
  }),
  allPurchases: publicProcedure.input(z.string()).query(async ({ input }) => {
    try {
      return await db.purchase.findMany({
        where: {
          user: {
            email: input
          }
        },
        include: {
          listing: {
            include: {
              image: true
            }
          },
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

const PORT = process.env.PORT

server.listen(PORT !== undefined ? parseInt(PORT) : 3000);

export type AppRouter = typeof appRouter;

