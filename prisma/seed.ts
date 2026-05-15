import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const org = await prisma.organization.create({
    data: {
      name: 'Seed Organization',
    },
  });
  console.log(`Created Organization: ${org.name}`);

  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@seed.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      orgId: org.id,
    },
  });
  console.log(`Created Admin User: ${admin.email}`);

  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@seed.com',
      passwordHash,
      firstName: 'Accountant',
      lastName: 'User',
      role: 'ACCOUNTANT',
      orgId: org.id,
    },
  });
  console.log(`Created Accountant User: ${accountant.email}`);

  const tx1 = await prisma.transaction.create({
    data: {
      orgId: org.id,
      userId: admin.id,
      type: 'INCOME',
      amount: 5000.00,
      category: 'Initial Funding',
      description: 'Seed money',
    },
  });
  console.log(`Created Income Transaction: ${tx1.amount}`);

  const tx2 = await prisma.transaction.create({
    data: {
      orgId: org.id,
      userId: accountant.id,
      type: 'EXPENSE',
      amount: 150.50,
      category: 'Office Supplies',
      description: 'Pens and paper',
    },
  });
  console.log(`Created Expense Transaction: ${tx2.amount}`);

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
