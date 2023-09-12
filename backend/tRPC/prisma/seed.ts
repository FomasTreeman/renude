import prisma from "../server/db";

const testUserId = 16

const locations = [
    { lat: 51.509865, lng: -0.118092 }, // london
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

const filenames = [
    "bulksplash-angelabaileyy-jlo7Bf4tUoY.jpg",
    "bulksplash-camorin13-knKm7u_7Ihw.jpg",
    "bulksplash-girlwithredhat-qyy6pmM2Hg8.jpg",
    "bulksplash-khalidboutchich-O0afA6jConQ.jpg",
    "bulksplash-marcusloke-xXJ6utyoSw0.jpg",
    "bulksplash-nimblemade-DRM_6zFkPFw.jpg",
    "bulksplash-omarlopez1-9w20MZ0lsK8.jpg",
    "bulksplash-rues-3fl4czp80eg.jpg",
    "bulksplash-smokthebikini-QRN47la37gw.jpg",
    "bulksplash-waldemarbrandt67w-Db4d6MRIXJc.jpg",
    "bulksplash-anomaly-WWesmHEgXDs.jpg",
    "bulksplash-chernus_tr-iIjResyhhW0.jpg",
    "bulksplash-ihovsky-MgES-cgCNgs.jpg",
    "bulksplash-kimdonkey-veuKI2tN9xU.jpg",
    "bulksplash-mediamodifier-TvL5vIgwiwo.jpg",
    "bulksplash-nimblemade-NS2BZsGxOLE.jpg",
    "bulksplash-pao_note-Q-72wa9-7Dg.jpg",
    "bulksplash-ryanhoffman007-A7f7XRKgUWc.jpg",
    "bulksplash-soniasanmartin-q7q-dMzWnaA.jpg",
    "bulksplash-waldemarbrandt67w-UP9DtTjRYpI.jpg",
    "bulksplash-bannon15-li2MZaE12BE.jpg",
    "bulksplash-cristofer-AqLIkOzWDAk.jpg",
    "bulksplash-kemalalkan-_BDBEP0ePQc.jpg",
    "bulksplash-krsp-0BKZfcamvGg.jpg",
    "bulksplash-mediamodifier-elbKS4DY21g.jpg",
    "bulksplash-northernstatemedia-KPl_OqjMxNY.jpg",
    "bulksplash-pinho-GCAnKZM21_c.jpg",
    "bulksplash-sebastianpoc--JUoxG4sp88.jpg",
    "bulksplash-ugmonk-Lj1S1_KD61k.jpg",
];


async function seedData() {
    // Create Users
    const users = [];
    for (let i = 0; i < 15; i++) {
        const user = await prisma.user.upsert({
            where: { email: `user${i + 1}@example.com` },
            create: {
                email: `user${i + 1}@example.com`,
                lng: locations[i].lng,
                lat: locations[i].lat,
            },
            select: {
                id: true
            },
            update: {}
        });
        users.push(user);
    }

    console.log('Created users')

    let filenameCounter = 0
    let lastListingId = 0
    for (const user of users) {
        // Create Listings
        for (let i = 0; i < 10; i++) {
            await prisma.listing.upsert({
                where: { id: i },
                create: {
                    userId: user.id,
                    price: (i + 1) * 100,
                    description: `Listing ${i + 1} by User ${user.id}`,
                },
                update: {}
            });
        }

        for (const listing of await prisma.listing.findMany({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
            },
        })) {
            // Create Favourites
            await prisma.favourite.create({
                data: {
                    userId: user.id,
                    listingId: listing.id,
                },
            });

            // Create Ratings
            const rxId = Math.floor(Math.random() * users.length);
            const txId = rxId !== 0 ? rxId - 1 : users.length - 1;
            await prisma.rating.create({
                data: {
                    rating: Math.floor(Math.random() * 5) + 1,
                    rxId,
                    txId,
                },
            });

            //Create Images
            for (let j = 0; j < 4; j++) {
                await prisma.image.create({
                    data: {
                        path: filenames[filenameCounter],
                        listingId: listing.id,
                    },
                });
                filenameCounter == filenames.length ? 0 : filenameCounter + 1
            }

            // create Offers
            for (let j = 1; j <= 3; j++) {
                await prisma.offer.create({
                    data: {
                        userId: user.id === 1 ? 2 : 1,
                        listingId: listing.id,
                        price: 90 * j,
                        accepted: j <= 2 ? true : false,
                    },
                });
            }
            lastListingId = listing.id
        }
        // Create purchase
        const userId = user.id === testUserId ? 1 : user.id + 1
        await prisma.purchase.create({
            data: {
                userId,
                listingId: lastListingId,
                paymentId: `payment${lastListingId}`,
            },
        });
        await prisma.listing.update({
            where: {
                id: lastListingId
            },
            data: {
                sold: true
            }
        })

        console.log(`Seed data created for user ${user.id} out of ${users.length} users`);
    }
}


console.log('Seed data created.');

seedData()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
