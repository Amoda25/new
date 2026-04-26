const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://kaumiashika123_smart:12345@cluster0.143ajuv.mongodb.net/';

async function migrate() {
  const client = new MongoClient(URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB cluster0');

    // List all databases
    const adminDb = client.db().admin();
    const dbList = await adminDb.listDatabases();
    
    console.log('\n📋 All databases in cluster0:');
    dbList.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024).toFixed(1)} KB)`);
    });

    // Find the two smart-campus databases
    const smartCampusDbs = dbList.databases
      .filter(db => db.name.toLowerCase().includes('smart') || db.name.toLowerCase().includes('campus'))
      .map(db => db.name);

    console.log('\n🎯 Smart-campus related databases found:', smartCampusDbs);

    if (smartCampusDbs.length < 2) {
      console.log('⚠️  Less than 2 smart-campus databases found. Nothing to merge.');
      return;
    }

    // Find which one has bookings (the MAIN one)
    let mainDbName = null;
    let duplicateDbName = null;

    for (const dbName of smartCampusDbs) {
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log(`\n📁 ${dbName} collections:`, collectionNames);
      
      if (collectionNames.includes('bookings')) {
        mainDbName = dbName;
      } else {
        duplicateDbName = dbName;
      }
    }

    if (!mainDbName || !duplicateDbName) {
      console.log('⚠️  Could not identify main and duplicate databases.');
      console.log('Main (has bookings):', mainDbName);
      console.log('Duplicate:', duplicateDbName);
      return;
    }

    console.log(`\n✅ MAIN database: ${mainDbName}`);
    console.log(`🗑️  DUPLICATE database: ${duplicateDbName}`);

    const mainDb = client.db(mainDbName);
    const duplicateDb = client.db(duplicateDbName);

    // Get collections in each
    const mainCollections = (await mainDb.listCollections().toArray()).map(c => c.name);
    const duplicateCollections = (await duplicateDb.listCollections().toArray()).map(c => c.name);

    // Find collections ONLY in duplicate (not in main)
    const uniqueToDuplicate = duplicateCollections.filter(c => !mainCollections.includes(c));
    const commonCollections = duplicateCollections.filter(c => mainCollections.includes(c));

    console.log('\n📤 Collections ONLY in duplicate (will be COPIED to main):', uniqueToDuplicate);
    console.log('⚠️  Collections in BOTH (will be SKIPPED to avoid overwrite):', commonCollections);

    // Copy unique collections from duplicate to main
    for (const collName of uniqueToDuplicate) {
      console.log(`\n📦 Copying collection: ${collName}...`);
      const docs = await duplicateDb.collection(collName).find({}).toArray();
      
      if (docs.length === 0) {
        console.log(`  ⏭️  Empty collection, skipping.`);
        continue;
      }

      await mainDb.collection(collName).insertMany(docs);
      console.log(`  ✅ Copied ${docs.length} documents to ${mainDbName}.${collName}`);
    }

    // Drop the duplicate database
    console.log(`\n🗑️  Dropping duplicate database: ${duplicateDbName}...`);
    await duplicateDb.dropDatabase();
    console.log(`✅ Database '${duplicateDbName}' dropped successfully!`);

    console.log('\n🎉 Migration complete!');
    console.log(`✅ Your main database '${mainDbName}' now has all the data.`);

  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err);
  } finally {
    await client.close();
    console.log('🔌 Connection closed.');
  }
}

migrate();
