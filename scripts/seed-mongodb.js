require('dotenv').config({ path: '../.env', override: true });
const mongoose = require('mongoose');
const { DocumentSchema } = require('../dist/documents/schemas/document.schema');

async function seedMongodb() {
  await mongoose.connect(process.env.MONGO_URI);

  const DocumentModel = mongoose.model('Document', DocumentSchema);
  await DocumentModel.create([
    {
      projectId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      title: 'Market Research Report',
      content: 'This is a market research report.',
      tags: ['market', 'research'],
    },
    {
      projectId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      title: 'Legal Analysis',
      content: 'This is a legal analysis.',
      tags: ['legal', 'analysis'],
    },
  ]);

  console.log('MongoDB seeding complete!');
  await mongoose.disconnect();
}

seedMongodb().catch((error) => {
  console.error('Error seeding MongoDB:', error);
  process.exit(1);
});
