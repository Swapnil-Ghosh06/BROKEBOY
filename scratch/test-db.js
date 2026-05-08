require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'UNDEFINED');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Success! Connected to MongoDB.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed! Could not connect to MongoDB.');
    console.error('Error details:', err.message);
    if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.log('💡 Hint: Check your MongoDB Atlas Network Access (IP Whitelist).');
    }
    process.exit(1);
  });
