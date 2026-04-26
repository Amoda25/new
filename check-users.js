const { MongoClient } = require('mongodb');
const URI = 'mongodb+srv://kaumiashika123_smart:12345@cluster0.143ajuv.mongodb.net/smart-campus';

async function checkAll() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db('smart-campus');
    
    // Check users
    const users = await db.collection('users').find({}).toArray();
    console.log(`\n👥 Users (${users.length} total):`);
    users.forEach(u => console.log(`  ${u.email} | role: ${u.role} | password: ${u.password ? 'SET' : 'NOT SET'}`));

    // Check user_profiles
    const profiles = await db.collection('user_profiles').find({}).toArray();
    console.log(`\n📋 User Profiles (${profiles.length} total):`);
    profiles.forEach(p => console.log(`  userId: ${p.userId || p._id} | email: ${p.email || 'N/A'}`));

    // Check neha specifically
    const neha = users.find(u => u.email === 'neha@gmail.com');
    if (neha) {
      console.log('\n✅ neha@gmail.com found:', JSON.stringify(neha, null, 2));
    }
    
  } finally {
    await client.close();
  }
}
checkAll();
