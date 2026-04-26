const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://kaumiashika123_smart:12345@cluster0.143ajuv.mongodb.net/';

async function cleanup() {
  const client = new MongoClient(URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const sourceDb = client.db('smart_campus');
    const targetDb = client.db('smart-campus');

    // 1. Merge users
    console.log('\n👥 Merging users from smart_campus to smart-campus...');
    const usersToMerge = await sourceDb.collection('users').find({}).toArray();
    
    if (usersToMerge.length > 0) {
      console.log(`Found ${usersToMerge.length} users to migrate.`);
      for (const user of usersToMerge) {
        const existing = await targetDb.collection('users').findOne({ email: user.email });
        if (!existing) {
          console.log(`  ➕ Adding user: ${user.email}`);
          await targetDb.collection('users').insertOne(user);
        } else {
          console.log(`  ⏭️  User already exists: ${user.email}`);
        }
      }
    } else {
      console.log('No users found in smart_campus.');
    }

    // 2. Drop the underscore database
    console.log('\n🗑️  Dropping accidental database: smart_campus...');
    await sourceDb.dropDatabase();
    console.log('✅ Database smart_campus dropped successfully!');

    console.log('\n🎉 Cleanup complete! Everything is now in smart-campus.');

  } catch (err) {
    console.error('❌ Cleanup failed:', err.message);
  } finally {
    await client.close();
    console.log('🔌 Connection closed.');
  }
}

cleanup();
