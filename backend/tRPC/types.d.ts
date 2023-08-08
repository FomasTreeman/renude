type User = {};

type Listing = {
  images: string[]; // paths, prisma should join and fetch all paths using image_id
  price: number;
  description: string;
  sold: boolean;
  user_id: number;
};

type Favourite = {
  user_id: number;
  listing_id: number;
};

type Rating = {
  user_id: number;
  rating: number;
};

