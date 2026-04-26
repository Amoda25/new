const { MongoClient } = require('mongodb');
const URI = 'mongodb+srv://kaumiashika123_smart:12345@cluster0.143ajuv.mongodb.net/';

async function checkBookings() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db('smart-campus');
    const bookings = await db.collection('bookings').find({}).toArray();
    console.log(`📋 Total bookings: ${bookings.length}`);
    bookings.forEach(b => {
      console.log(`- ID: ${b._id} | ResourceId: ${b.resourceId} (${typeof b.resourceId}) | Status: ${b.status} | Time: ${b.startTime} to ${b.endTime}`);
    });
  } finally {
    await client.close();
  }
}
checkBookings();
