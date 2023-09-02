import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';

import db from './db';

const appRouter = router({
  // allListings: () => Listing[];
  allListings: publicProcedure.query(async () => {
    return await db.listing.findMany();
  }),
  usersListings: publicProcedure.input(String).query(async (opts) => {
    console.log(opts.input)
    const res = await db.listing.findMany({
      where: {
        user: {
          id: 1
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
