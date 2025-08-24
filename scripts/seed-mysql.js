require('dotenv').config({ path: '../.env', override: true });
const typeorm = require('typeorm');
const bcrypt = require('bcrypt');
const { User } = require('../dist/users/entities/user.entity');
const { Client } = require('../dist/clients/entities/client.entity');
const { Vendor } = require('../dist/vendors/entities/vendor.entity');
const { Project } = require('../dist/projects/entities/project.entity');
const { ROLES } = require('../dist/libs/types/user.type');

async function seedMysql() {
  const dataSource = new typeorm.DataSource({
    type: 'mariadb',
    host: 'serverless-northeurope.sysp0000.db3.skysql.com',
    port: 4153,
    username: 'dbpbf33325877',
    password: 's35-Pqhc54Ocf210EkTJLQg',
    database: 'expander_db',
    entities: [User, Client, Vendor, Project],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);
  const clientRepository = dataSource.getRepository(Client);
  const vendorRepository = dataSource.getRepository(Vendor);
  const projectRepository = dataSource.getRepository(Project);

  // Create admin user
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@expander.com' },
  });
  if (!existingAdmin) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);
    const admin = userRepository.create({
      email: 'admin@expander.com',
      hashPassword: hashedPassword,
      role: ROLES.ADMIN,
      companyName: 'Expander Admin',
    });
    await userRepository.save(admin);
  } else {
    console.log('Admin user already exists, skipping creation.');
  }

  console.log('MySQL seeding complete!');
  await dataSource.destroy();
}

seedMysql().catch((error) => {
  console.error('Error seeding MySQL:', error);
  process.exit(1);
});
