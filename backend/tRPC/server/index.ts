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
  usersListings: publicProcedure.input(z.number()).query(async ({ input }) => {
    const res = await db.listing.findMany({
      where: {
        user: {
          // email: opts.input 
          id: input
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
  })
});



const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

export type AppRouter = typeof appRouter;
