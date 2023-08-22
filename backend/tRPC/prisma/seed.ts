import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const locations = [
    { lat: 51.509865, lng: -0.118092 }, // lngdon
    { lat: 51.752022, lng: -1.257677 }, // Oxford
    { lat: 51.454514, lng: -2.587910 }, // Bristol
    { lat: 51.454818, lng: -0.973234 }, // Reading
    { lat: 51.385368, lng: -2.359007 }, // Bath
    { lat: 53.408371, lng: -2.991573 }, // Liverpool
    { lat: 53.483959, lng: -2.244644 }, // Manchester
    { lat: 53.800755, lng: -1.549077 }, // Leeds
    { lat: 53.959056, lng: -1.081536 }, // York
    { lat: 52.486243, lng: -1.890401 }, // Birmingham
    { lat: 51.454513, lng: -0.974124 }, // Reading
    { lat: 51.521739, lng: -0.084579 }, // Stratford-upon-Avon
    { lat: 52.404818, lng: -4.081516 }, // Aberystwyth
    { lat: 52.629730, lng: -1.131592 }, // Leicester
    { lat: 53.959125, lng: -1.081536 }, // York
];


async function createListing(userId: number, price: number, description: string): Promise<void> {
    await prisma.listing.create({
        data: {
            userId: userId,
            price: price,
            description: description,
        },
    });
}

async function seedData() {
    // Create Users
    const users = [];
    for (let i = 0; i < 15; i++) {
        const user = await prisma.user.create({
            data: {
                email: `user${i + 1}@example.com`,
                lng: locations[i].lng,
                lat: locations[i].lat,
            },
            select: {
                id: true
            }
        });
        users.push(user);
    }

    console.log('Created users')

    // Create Listings, Favorites, and Ratings for each user
    for (const user of users) {
        for (let i = 0; i < 10; i++) {
            await createListing(user.id, (i + 1) * 1000, `Listing ${i + 1} by User ${user.id}`);
        }

        for (const listing of await prisma.listing.findMany({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
            },
        })) {
            // Create Favorites
            await prisma.favourite.create({
                data: {
                    userId: user.id,
                    listingId: listing.id,
                },
            });

            const rxId = Math.floor(Math.random() * users.length);
            const txId = rxId !== 0 ? rxId - 1 : users.length - 1;
            // Create Ratings
            await prisma.rating.create({
                data: {
                    rating: Math.floor(Math.random() * 5) + 1,
                    rxId,
                    txId,
                },
            });
        }
        console.log(`Seed data created for user ${user.id} out of ${users.length} users`);

    }

    console.log('Seed data created.');
}

seedData()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
