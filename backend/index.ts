import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { publicProcedure, router } from './trpc';
import db from './db';

const appRouter = router({
  // allListings: () => Listing[];
  allListings: publicProcedure.query(async () => {
    return await db.listing.findMany();
  }),
  // usersListings: (id: string) => Listing[];
  // usersFavourites: (id: string) => Favourite[];
  // listingsRatings: (id: string) => Rating[];
});

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

export type AppRouter = typeof appRouter;
