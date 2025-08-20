// Insert initial research document collection and sample doc
db = db.getSiblingDB('expander_mongo');

if (!db.research_docs.findOne()) {
  db.research_docs.insertOne({
    title: 'Sample Market Report',
    content: 'This is a seeded market insight.',
    tags: ['sample', 'seed'],
    projectId: null,
    createdAt: new Date(),
  });
}
