const mongoose = require('mongoose');

beforeAll(async () => {
  const MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://root:root@localhost:27017/event_management_test?authSource=admin';
  await mongoose.connect(MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
