import { createHTTPServer } from '@trpc/server/adapters/standalone';
import * as trpc from '@trpc/server';
import { publicProcedure, router } from './trpc';

import db from './db';

const appRouter = router({
  // allListings: () => Listing[];
  allListings: publicProcedure.query(async () => {
    return await db.listing.findMany();
  }),
  usersListings: publicProcedure.query(async () => {
    const res = await db.listing.findMany({
      where: {
        userId: 1
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
    console.log(res[0].image[0].path)
    return res
  })
  // usersListings: (id: string) => Listing[];
  // usersFavourites: (id: string) => Favourite[];
  // listingsRatings: (id: string) => Rating[];
});

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

export type AppRouter = typeof appRouter;
