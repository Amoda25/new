const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://kaumiashika123_smart:12345@cluster0.143ajuv.mongodb.net/smart-campus';

async function mergeCollections() {
    const client = new MongoClient(URI);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        const db = client.db();

        const userProfilesColl = db.collection('user_profiles');
        const usersColl = db.collection('users');

        // 1. Fetch all profiles
        const profiles = await userProfilesColl.find({}).toArray();
        
        if (profiles.length === 0) {
            console.log('⚠️ No profiles found in user_profiles. Dropping collection if it exists...');
            try {
                await userProfilesColl.drop();
                console.log('✅ Collection user_profiles dropped.');
            } catch (e) {
                console.log('✅ Collection user_profiles already gone.');
            }
            return;
        }

        console.log(`🔍 Found ${profiles.length} profiles to merge...`);

        // 2. Merge into users
        let mergedCount = 0;
        for (const profile of profiles) {
            const userId = profile._id;
            const { _id, ...profileData } = profile;

            const result = await usersColl.updateOne(
                { _id: userId },
                { $set: profileData }
            );

            if (result.matchedCount > 0) {
                mergedCount++;
                console.log(`✅ Merged profile for User ID: ${userId}`);
            }
        }

        console.log(`\n🎉 Merged ${mergedCount} profiles.`);
        console.log('🗑️ Dropping collection user_profiles...');
        await userProfilesColl.drop();
        console.log('✅ Collection user_profiles dropped successfully!');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.close();
    }
}

mergeCollections();
